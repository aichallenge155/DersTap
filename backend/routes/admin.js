const express = require('express');
const prisma = require('../lib/prisma');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin paneli statistikaları
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTeachers = await prisma.teacher.count();
    const totalStudents = await prisma.user.count({ where: { role: 'student' } });
    const totalParents = await prisma.user.count({ where: { role: 'parent' } });
    const pendingReviews = await prisma.review.count({ where: { isApproved: false } });
    const totalReviews = await prisma.review.count();

    res.json({
      totalUsers,
      totalTeachers,
      totalStudents,
      totalParents,
      pendingReviews,
      totalReviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Bütün istifadəçiləri al
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    let where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { surname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        isActive: true,
        isOnline: true,
        lastSeen: true,
        profileViews: true,
        createdAt: true,
        updatedAt: true
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// İstifadəçini aktiv/deaktiv et
router.put('/users/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        isActive: true,
        isOnline: true,
        lastSeen: true,
        profileViews: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ message: 'İstifadəçi statusu yeniləndi', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Bütün müəllimləri al (admin üçün)
router.get('/teachers', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, verified } = req.query;
    
    let where = {};
    if (verified !== undefined) where.isVerified = verified === 'true';

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            city: true,
            phone: true,
            isActive: true
          }
        }
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.teacher.count({ where });

    res.json({
      teachers,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Müəllimi təsdiq et/rədd et
router.put('/teachers/:id/verify', auth, adminAuth, async (req, res) => {
  try {
    const { isVerified } = req.body;
    const teacher = await prisma.teacher.update({
      where: { id: req.params.id },
      data: { isVerified },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        }
      }
    });

    res.json({ message: 'Müəllim statusu yeniləndi', teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Gözləyən rəyləri al
router.get('/reviews/pending', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        },
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true
              }
            }
          }
        }
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.review.count({ where: { isApproved: false } });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Rəyi təsdiq et/rədd et
router.put('/reviews/:id/approve', auth, adminAuth, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved }
    });

    // Əgər təsdiq edililibsə, müəllimin reytinqini yenilə
    if (isApproved) {
      await updateTeacherRating(review.teacherId);
    }

    res.json({ message: 'Rəy statusu yeniləndi', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Müəllimin reytinqini yeniləmə funksiyası
async function updateTeacherRating(teacherId) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        teacherId,
        isApproved: true
      }
    });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = (totalRating / reviews.length).toFixed(1);
      
      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          rating: parseFloat(avgRating),
          totalReviews: reviews.length
        }
      });
    } else {
      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          rating: 0,
          totalReviews: 0
        }
      });
    }
  } catch (error) {
    console.error('Reytinq yenilənmə xətası:', error);
  }
}

module.exports = router;
