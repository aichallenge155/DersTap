const express = require('express');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Review = require('../models/Review');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin paneli statistikaları
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalParents = await User.countDocuments({ role: 'parent' });
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    const totalReviews = await Review.countDocuments();

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
    
    let filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { surname: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

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
    
    let filter = {};
    if (verified !== undefined) filter.isVerified = verified === 'true';

    const teachers = await Teacher.find(filter)
      .populate('userId', 'name surname email city phone isActive')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(filter);

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
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).populate('userId', 'name surname email');

    if (!teacher) {
      return res.status(404).json({ message: 'Müəllim tapılmadı' });
    }

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

    const reviews = await Review.find({ isApproved: false })
      .populate('studentId', 'name surname')
      .populate({
        path: 'teacherId',
        populate: {
          path: 'userId',
          select: 'name surname'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ isApproved: false });

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
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Rəy tapılmadı' });
    }

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