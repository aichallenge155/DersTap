const express = require('express');
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Bütün müəllimləri al (filterlə)
router.get('/', async (req, res) => {
  try {
    const { city, subject, minPrice, maxPrice, minRating, grade } = req.query;
    
    let where = {};
    let userWhere = {};

    if (city) userWhere.city = { contains: city, mode: 'insensitive' };
    if (subject) where.subjects = { has: subject };
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (grade) where.grade = { contains: grade, mode: 'insensitive' };

    // Qiymət filtri
    if (minPrice || maxPrice) {
      const priceFilter = [];
      if (minPrice && maxPrice) {
        priceFilter.push({
          OR: [
            { onlineRate: { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) } },
            { offlineRate: { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) } }
          ]
        });
      } else if (minPrice) {
        priceFilter.push({
          OR: [
            { onlineRate: { gte: parseFloat(minPrice) } },
            { offlineRate: { gte: parseFloat(minPrice) } }
          ]
        });
      } else if (maxPrice) {
        priceFilter.push({
          OR: [
            { onlineRate: { lte: parseFloat(maxPrice) } },
            { offlineRate: { lte: parseFloat(maxPrice) } }
          ]
        });
      }
      where.AND = priceFilter;
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        ...where,
        user: userWhere
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            city: true,
            phone: true,
            isOnline: true,
            lastSeen: true
          }
        }
      },
      orderBy: [
        { isPremium: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Müəyyən müəllimin profilini al
router.get('/:id', async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            city: true,
            phone: true,
            isOnline: true,
            lastSeen: true
          }
        }
      }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Müəllim tapılmadı' });
    }

    // Profil baxış sayını artır
    await prisma.teacher.update({
      where: { id: req.params.id },
      data: { profileViews: { increment: 1 } }
    });

    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Müəllim profilini yenilə
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Yalnız müəllimlər profil yeniləyə bilər' });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.user.id }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Müəllim profili tapılmadı' });
    }

    const {
      subjects,
      experience,
      education,
      onlineRate,
      offlineRate,
      teachingMode,
      grade,
      bio,
      availableHours
    } = req.body;

    // Yenilənəcək məlumatları hazırla
    const updateData = {};
    if (subjects) updateData.subjects = subjects;
    if (experience !== undefined) updateData.experience = experience;
    if (education) updateData.education = education;
    if (onlineRate !== undefined) updateData.onlineRate = onlineRate;
    if (offlineRate !== undefined) updateData.offlineRate = offlineRate;
    if (teachingMode) updateData.teachingMode = teachingMode;
    if (grade) updateData.grade = grade;
    if (bio !== undefined) updateData.bio = bio;
    if (availableHours) updateData.availableHours = availableHours;

    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacher.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            city: true,
            phone: true,
            isOnline: true
          }
        }
      }
    });

    res.json({
      message: 'Profil uğurla yeniləndi',
      teacher: updatedTeacher
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Premium status yenilə
router.put('/:id/premium', auth, async (req, res) => {
  try {
    // Bu əməliyyat admin və ya müəllim tərəfindən edilə bilər
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'İcazə yoxdur' });
    }

    const teacher = await prisma.teacher.update({
      where: { id: req.params.id },
      data: { isPremium: req.body.isPremium }
    });

    res.json({ message: 'Premium status yeniləndi', teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Ən yaxşı müəllimlər (TOP siyahısı)
router.get('/top/rated', async (req, res) => {
  try {
    const topTeachers = await prisma.teacher.findMany({
      where: { rating: { gte: 4.0 } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            city: true,
            isOnline: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { totalReviews: 'desc' }
      ],
      take: 10
    });

    res.json(topTeachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

module.exports = router;
