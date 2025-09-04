const express = require('express');
const Review = require('../models/Review');
const Teacher = require('../models/Teacher');
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
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Müəllim tapılmadı' });
    }

    // Əvvəlcə bu tələbənin bu müəllimə rəy verib-vermədiyini yoxla
    const existingReview = await Review.findOne({
      teacherId,
      studentId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Siz artıq bu müəllimə rəy vermişsiniz' });
    }

    // Yeni rəy yarat
    const review = new Review({
      teacherId,
      studentId: req.user._id,
      rating,
      comment,
      subject,
      lessonDate
    });

    await review.save();

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
    const reviews = await Review.find({ 
      teacherId: req.params.teacherId,
      isApproved: true 
    })
      .populate('studentId', 'name surname')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Rəyi yenilə
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Rəy tapılmadı' });
    }

    // Yalnız rəyin müəllifi yeniləyə bilər
    if (review.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu rəyi yeniləmək icazəniz yoxdur' });
    }

    const { rating, comment } = req.body;
    
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.isApproved = false; // Yenidən təsdiq gözləsin

    await review.save();

    // Müəllimin reytinqini yenilə
    await updateTeacherRating(review.teacherId);

    res.json({ message: 'Rəy uğurla yeniləndi', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Rəyi sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Rəy tapılmadı' });
    }

    // Yalnız rəyin müəllifi və ya admin silə bilər
    if (review.studentId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu rəyi silmək icazəniz yoxdur' });
    }

    const teacherId = review.teacherId;
    await Review.findByIdAndDelete(req.params.id);

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
    const reviews = await Review.find({ teacherId, isApproved: true });
    const teacher = await Teacher.findById(teacherId);

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      teacher.rating = (totalRating / reviews.length).toFixed(1);
      teacher.totalReviews = reviews.length;
    } else {
      teacher.rating = 0;
      teacher.totalReviews = 0;
    }

    await teacher.save();
  } catch (error) {
    console.error('Reytinq yenilənmə xətası:', error);
  }
}

module.exports = router;