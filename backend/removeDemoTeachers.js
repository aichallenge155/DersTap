const mongoose = require('mongoose');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Review = require('./models/Review');
require('dotenv').config();

const removeDemoTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı uğurludur');

    // Demo müəllim profilləri sil
    await Teacher.deleteMany({});
    console.log('✅ Bütün müəllim profilləri silindi');

    // Demo müəllim istifadəçiləri sil (admin istifadəçi qalsın)
    await User.deleteMany({ role: 'teacher' });
    console.log('✅ Bütün müəllim istifadəçiləri silindi');

    // Demo rəyləri sil
    await Review.deleteMany({});
    console.log('✅ Bütün rəylər silindi');

    console.log('\n🎯 Demo məlumatlar təmizləndi! Yalnız admin hesabı qaldı.');
    console.log('Admin: admin@derstap.az / admin123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Xəta:', error);
    process.exit(1);
  }
};

removeDemoTeachers();
