# DərsTap Backend API

**PostgreSQL + Prisma + Render**

Modern və scalable backend API sistemi müəllim-tələbə platforması üçün.

---

## 🚀 Texnologiyalar

- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Framework:** Express.js
- **Authentication:** JWT
- **Hosting:** Render
- **Node.js:** v16+

---

## 📦 Quraşdırma

### 1. Dependencies

```bash
npm install
```

### 2. Environment Variables

`.env` faylı yarat:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### 3. Prisma Setup

```bash
# Prisma Client generate et
npm run prisma:generate

# Database migration
npm run prisma:migrate

# Seed data yüklə
npm run seed
```

---

## 🏃 İşə Salma

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server işləyəcək: `http://localhost:5000`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Qeydiyyat
- `POST /api/auth/login` - Giriş
- `POST /api/auth/logout` - Çıxış
- `GET /api/auth/me` - İstifadəçi məlumatları

### Teachers
- `GET /api/teachers` - Bütün müəllimlər (filterlə)
- `GET /api/teachers/:id` - Müəllim profili
- `PUT /api/teachers/profile` - Profil yenilə
- `GET /api/teachers/top/rated` - TOP müəllimlər

### Reviews
- `POST /api/reviews` - Rəy əlavə et
- `GET /api/reviews/teacher/:teacherId` - Müəllimin rəyləri
- `PUT /api/reviews/:id` - Rəy yenilə
- `DELETE /api/reviews/:id` - Rəy sil

### Admin
- `GET /api/admin/stats` - Statistika
- `GET /api/admin/users` - İstifadəçilər
- `GET /api/admin/teachers` - Müəllimlər
- `GET /api/admin/reviews/pending` - Gözləyən rəylər

---

## 🗄️ Database Schema

### User
- id, name, surname, email, password
- role (teacher/student/parent/admin)
- phone, city, isActive, isOnline

### Teacher
- userId, subjects[], experience, education
- onlineRate, offlineRate, teachingMode[]
- rating, totalReviews, isVerified, isPremium

### Review
- teacherId, studentId, rating, comment
- subject, lessonDate, isApproved

---

## 🛠️ Scripts

```bash
npm start              # Production server
npm run dev            # Development server
npm run seed           # Seed database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio
```

---

## 📖 Migration Guide

Ətraflı migrasiya təlimatı üçün: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 👨‍💻 Developer

**DərsTap Team**

---

## 📄 License

MIT
