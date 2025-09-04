const express = require('express');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Bütün müəllimləri al (filterlə)
router.get('/', async (req, res) => {
  try {
    const { city, subject, minPrice, maxPrice, minRating, grade } = req.query;
    
    let filter = {};
    let userFilter = {};

    if (city) userFilter.city = new RegExp(city, 'i');
    if (subject) filter.subjects = new RegExp(subject, 'i');
    if (minPrice || maxPrice) {
      filter.$or = [];
      if (minPrice && maxPrice) {
        filter.$or.push(
          { onlineRate: { $gte: Number(minPrice), $lte: Number(maxPrice) } },
          { offlineRate: { $gte: Number(minPrice), $lte: Number(maxPrice) } }
        );
      } else if (minPrice) {
        filter.$or.push(
          { onlineRate: { $gte: Number(minPrice) } },
          { offlineRate: { $gte: Number(minPrice) } }
        );
      } else if (maxPrice) {
        filter.$or.push(
          { onlineRate: { $lte: Number(maxPrice) } },
          { offlineRate: { $lte: Number(maxPrice) } }
        );
      }
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (grade) filter.grade = new RegExp(grade, 'i');

    const teachers = await Teacher.find(filter)
      .populate({
        path: 'userId',
        match: userFilter,
        select: 'name surname city phone isOnline lastSeen'
      })
      .sort({ isPremium: -1, rating: -1, createdAt: -1 });

    // Null olan userId-ləri filtrələ (şəhər filtri səbəbindən)
    const filteredTeachers = teachers.filter(teacher => teacher.userId);

    res.json(filteredTeachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Müəyyən müəllimin profilini al
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'name surname city phone isOnline lastSeen');

    if (!teacher) {
      return res.status(404).json({ message: 'Müəllim tapılmadı' });
    }

    // Profil baxış sayını artır
    teacher.profileViews += 1;
    await teacher.save();

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

    const teacher = await Teacher.findOne({ userId: req.user._id });
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

    // Yenilənəcək sahələri müəyyən et
    if (subjects) teacher.subjects = subjects;
    if (experience !== undefined) teacher.experience = experience;
    if (education) teacher.education = education;
    if (onlineRate !== undefined) teacher.onlineRate = onlineRate;
    if (offlineRate !== undefined) teacher.offlineRate = offlineRate;
    if (teachingMode) teacher.teachingMode = teachingMode;
    if (grade) teacher.grade = grade;
    if (bio !== undefined) teacher.bio = bio;
    if (availableHours) teacher.availableHours = availableHours;

    await teacher.save();

    const updatedTeacher = await Teacher.findById(teacher._id)
      .populate('userId', 'name surname city phone isOnline');

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

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Müəllim tapılmadı' });
    }

    teacher.isPremium = req.body.isPremium;
    await teacher.save();

    res.json({ message: 'Premium status yeniləndi', teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Ən yaxşı müəllimlər (TOP siyahısı)
router.get('/top/rated', async (req, res) => {
  try {
    const topTeachers = await Teacher.find({ rating: { $gte: 4.0 } })
      .populate('userId', 'name surname city isOnline')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(10);

    res.json(topTeachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

module.exports = router;