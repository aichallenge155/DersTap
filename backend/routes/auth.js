const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Qeydiyyat
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, role, phone, city, teacherData } = req.body;

    // İstifadəçi mövcudluğunu yoxla
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email artıq qeydiyyatdan keçib' });
    }

    // Yeni istifadəçi yarat
    const user = new User({
      name,
      surname,
      email,
      password,
      role,
      phone,
      city
    });

    await user.save();

    // Əgər müəllimdirsə, müəllim profili yarat
    if (role === 'teacher' && teacherData) {
      const teacher = new Teacher({
        userId: user._id,
        subjects: teacherData.subjects,
        experience: teacherData.experience,
        education: teacherData.education,
        teachingMode: teacherData.teachingMode,
        onlineRate: teacherData.onlineRate || 0,
        offlineRate: teacherData.offlineRate || 0,
        grade: teacherData.grade,
        bio: teacherData.bio || ''
      });
      await teacher.save();
    }

    // JWT token yarat
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'derstap_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Qeydiyyat uğurludur',
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Giriş
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // İstifadəçini tap
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Yanlış email və ya şifrə' });
    }

    // Şifrəni yoxla
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Yanlış email və ya şifrə' });
    }

    // Online statusu yenilə
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Token yarat
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'derstap_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Giriş uğurludur',
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// Çıxış
router.post('/logout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isOnline = false;
    user.lastSeen = new Date();
    await user.save();

    res.json({ message: 'Çıxış uğurludur' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// İstifadəçi məlumatlarını al
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

module.exports = router;