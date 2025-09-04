const mongoose = require('mongoose');
const seedData = require('./seedData');
require('dotenv').config();

const runSeed = async () => {
  try {
    // Database bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/derstap', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB bağlantısı uğurludur');
    console.log('Demo məlumatlar yaradılır...\n');

    // Seed məlumatlarını çalışdır
    await seedData();

    console.log('\n✅ Seed əməliyyatı tamamlandı!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed xətası:', error);
    process.exit(1);
  }
};

runSeed();