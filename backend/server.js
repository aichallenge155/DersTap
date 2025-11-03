const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prisma instance-ni global olaraq əlçatan et
app.locals.prisma = prisma;

// Routes import
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

// Database bağlantısını yoxla
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL (Neon) bağlantısı uğurludur');
  } catch (error) {
    console.error('❌ PostgreSQL bağlantı xətası:', error);
    process.exit(1);
  }
}

connectDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Ana route
app.get('/', (req, res) => {
  res.json({ message: 'DərsTap API işləyir! (PostgreSQL + Prisma)' });
});

// Xəta idarəsi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Serverda xəta baş verdi!' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
});