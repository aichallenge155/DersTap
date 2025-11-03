const express = require('express');
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Rəy əlavə et
router.post('/', auth, async (req, res) => {
  try {
    const { teacherId, rating, comment, subject, lessonDate } = req.body;

    // Yalnız tələbələr və valideynlər rəy verə bilər
    if (req.user.role === 'teacher') {
      return res.status(403).json({ message: 'Müəllimlər rəy verə bilməz' });
    }

    // Müəllimin mövcudluğunu yoxla
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Müəllim tapılmadı' });
    }

    // Əvvəlcə bu tələbənin bu müəllimə rəy verib-vermədiyini yoxla
    const existingReview = await prisma.review.findUnique({
      where: {
        teacherId_studentId: {
          teacherId,
          studentId: req.user.id
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Siz artıq bu müəllimə rəy vermişsiniz' });
    }

    // Yeni rəy yarat
    const review = await prisma.review.create({
      data: {
        teacherId,
        studentId: req.user.id,
        rating,
        comment,
        subject,
        lessonDate: new Date(lessonDate)
      }
    });

    // Müəllimin reytinqini yenilə
    await updateTeacherRating(teacherId);

    res.status(201).json({ message: 'Rəy uğurla əlavə edildi', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Müəllimin rəylərini al
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        teacherId: req.params.teacherId,
        isApproved: true
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Rəyi yenilə
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Rəy tapılmadı' });
    }

    // Yalnız rəyin müəllifi yeniləyə bilər
    if (review.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Bu rəyi yeniləmək icazəniz yoxdur' });
    }

    const { rating, comment } = req.body;
    
    const updatedReview = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        rating: rating || review.rating,
        comment: comment || review.comment,
        isApproved: false // Yenidən təsdiq gözləsin
      }
    });

    // Müəllimin reytinqini yenilə
    await updateTeacherRating(review.teacherId);

    res.json({ message: 'Rəy uğurla yeniləndi', review: updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Rəyi sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Rəy tapılmadı' });
    }

    // Yalnız rəyin müəllifi və ya admin silə bilər
    if (review.studentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu rəyi silmək icazəniz yoxdur' });
    }

    const teacherId = review.teacherId;
    await prisma.review.delete({
      where: { id: req.params.id }
    });

    // Müəllimin reytinqini yenilə
    await updateTeacherRating(teacherId);

    res.json({ message: 'Rəy uğurla silindi' });
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
