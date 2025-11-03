const bcrypt = require('bcryptjs');
const prisma = require('./lib/prisma');

const seedData = async () => {
  try {
    // Əvvəlcə bütün məlumatları sil
    await prisma.review.deleteMany({});
    await prisma.teacher.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Köhnə məlumatlar silindi...');

    // Şifrəni hashla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123456', salt);

    // Admin istifadəçi yarat
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        surname: 'DərsTap',
        email: 'admin@derstap.az',
        password: hashedPassword,
        role: 'admin',
        phone: '+994501234567',
        city: 'Bakı',
        isActive: true
      }
    });

    console.log('\n=== Admin hesabı yaradıldı! ===');
    console.log('Email: admin@derstap.az');
    console.log('Şifrə: admin123456');
    console.log('\n✅ Sistem real istifadəçilər üçün hazırdır!');

  } catch (error) {
    console.error('❌ Seed data xətası:', error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = seedData;
