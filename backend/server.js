const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Məlumat yükləmə
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes import
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

// Database bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/derstap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı uğurludur'))
.catch((err) => console.error('MongoDB bağlantı xətası:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Ana route
app.get('/', (req, res) => {
  res.json({ message: 'DərsTap API işləyir!' });
});

// Xəta idarəsi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Serverda xəta baş verdi!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
});