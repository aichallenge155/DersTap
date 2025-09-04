const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
require('dotenv').config();

const addSampleTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı uğurludur');

    // Sample teacher users
    const teacherUsers = [
      {
        name: 'Aynur',
        surname: 'Məmmədova',
        email: 'aynur.mammadova@example.com',
        password: '123456',
        role: 'teacher',
        phone: '+994551111111',
        city: 'Bakı',
        isActive: true
      },
      {
        name: 'Elvin',
        surname: 'İbrahimov',
        email: 'elvin.ibrahimov@example.com',
        password: '123456',
        role: 'teacher',
        phone: '+994551111112',
        city: 'Gəncə',
        isActive: true
      },
      {
        name: 'Nigar',
        surname: 'Əliyeva',
        email: 'nigar.aliyeva@example.com',
        password: '123456',
        role: 'teacher',
        phone: '+994551111113',
        city: 'Sumqayıt',
        isActive: true
      }
    ];

    const createdTeacherUsers = [];
    for (const teacherData of teacherUsers) {
      const user = new User(teacherData);
      await user.save();
      createdTeacherUsers.push(user);
    }

    // Sample teacher profiles
    const teacherProfiles = [
      {
        userId: createdTeacherUsers[0]._id,
        subjects: ['Riyaziyyat', 'Fizika'],
        experience: 8,
        education: 'Bakı Dövlət Universiteti, Riyaziyyat fakültəsi',
        teachingMode: ['online', 'offline'],
        onlineRate: 30,
        offlineRate: 40,
        grade: '10-11 sinif',
        bio: 'Riyaziyyat və fizika fənnlərindən 8 illik təcrübə. Abituriyent hazırlığında mütəxəssis.',
        rating: 4.8,
        totalReviews: 24,
        isVerified: true,
        isPremium: true,
        profileViews: 156,
        completedLessons: 89
      },
      {
        userId: createdTeacherUsers[1]._id,
        subjects: ['İngilis dili', 'Rus dili'],
        experience: 5,
        education: 'Azərbaycan Dilləri Universiteti',
        teachingMode: ['online'],
        onlineRate: 25,
        offlineRate: 0,
        grade: '5-11 sinif',
        bio: 'Xarici dillər müəllimi. IELTS və TOEFL hazırlığı.',
        rating: 4.6,
        totalReviews: 18,
        isVerified: true,
        isPremium: false,
        profileViews: 98,
        completedLessons: 67
      },
      {
        userId: createdTeacherUsers[2]._id,
        subjects: ['Kimya', 'Biologiya'],
        experience: 12,
        education: 'Azərbaycan Tibb Universiteti',
        teachingMode: ['offline'],
        onlineRate: 0,
        offlineRate: 45,
        grade: '9-11 sinif',
        bio: 'Tibbi təhsilli kimya və biologiya müəllimi. Universitet qəbuluna hazırlıq.',
        rating: 4.9,
        totalReviews: 31,
        isVerified: true,
        isPremium: true,
        profileViews: 203,
        completedLessons: 124
      }
    ];

    for (const teacherProfile of teacherProfiles) {
      const teacher = new Teacher(teacherProfile);
      await teacher.save();
    }

    console.log('\n✅ 3 nümunə müəllim əlavə edildi!');
    console.log('Artıq müəllim axtarışı işləyəcək.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Xəta:', error);
    process.exit(1);
  }
};

addSampleTeachers();
