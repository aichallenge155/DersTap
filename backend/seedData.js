const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    // Əvvəlcə bütün məlumatları sil
    await User.deleteMany({});
    await Teacher.deleteMany({});
    await Review.deleteMany({});

    console.log('Köhnə məlumatlar silindi...');

    // Admin istifadəçi yarat (sadəcə admin qalsın)
    const adminUser = new User({
      name: 'Admin',
      surname: 'DərsTap',
      email: 'admin@derstap.az',
      password: 'admin123456',
      role: 'admin',
      phone: '+994501234567',
      city: 'Bakı',
      isActive: true
    });
    await adminUser.save();

    console.log('\n=== Admin hesabı yaradıldı! ===');
    console.log('Email: admin@derstap.az');
    console.log('Şifrə: admin123456');
    console.log('\n✅ Sistem real istifadəçilər üçün hazırdır!');

  } catch (error) {
    console.error('❌ Seed data xətası:', error);
  }
};

module.exports = seedData;
