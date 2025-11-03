const dotenv = require('dotenv');
const seedData = require('./seedData.prisma');

dotenv.config();

const runSeed = async () => {
  console.log('🌱 Seed data başlayır...\n');
  
  try {
    await seedData();
    console.log('\n✅ Seed data tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed data xətası:', error);
    process.exit(1);
  }
};

runSeed();
