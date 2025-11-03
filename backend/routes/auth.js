const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Qeydiyyat
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, role, phone, city, teacherData } = req.body;

    // İstifadəçi mövcudluğunu yoxla
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Bu email artıq qeydiyyatdan keçib' });
    }

    // Şifrəni hashla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni istifadəçi yarat
    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
        role,
        phone,
        city
      }
    });

    // Əgər müəllimdirsə, müəllim profili yarat
    if (role === 'teacher' && teacherData) {
      await prisma.teacher.create({
        data: {
          userId: user.id,
          subjects: teacherData.subjects,
          experience: teacherData.experience,
          education: teacherData.education,
          teachingMode: teacherData.teachingMode,
          onlineRate: teacherData.onlineRate || 0,
          offlineRate: teacherData.offlineRate || 0,
          grade: teacherData.grade,
          bio: teacherData.bio || ''
        }
      });
    }

    // JWT token yarat
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'derstap_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Qeydiyyat uğurludur',
      token,
      user: {
        id: user.id,
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
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Yanlış email və ya şifrə' });
    }

    // Şifrəni yoxla
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Yanlış email və ya şifrə' });
    }

    // Online statusu yenilə
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isOnline: true,
        lastSeen: new Date()
      }
    });

    // Token yarat
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'derstap_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Giriş uğurludur',
      token,
      user: {
        id: user.id,
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
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isOnline: false,
        lastSeen: new Date()
      }
    });

    res.json({ message: 'Çıxış uğurludur' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

// İstifadəçi məlumatlarını al
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası' });
  }
});

module.exports = router;
