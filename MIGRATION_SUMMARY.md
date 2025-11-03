# 🎯 DərsTap Backend Migration Xülasəsi

## MongoDB + Mongoose + Railway → PostgreSQL + Prisma + Render

---

## ✅ Tamamlanan İşlər

### 1. **Prisma Schema Yaradıldı**
- ✅ `prisma/schema.prisma` - User, Teacher, Review modelləri
- ✅ PostgreSQL datasource konfiqurasiyası
- ✅ Relations və indexlər əlavə edildi

### 2. **Backend Faylları Yeniləndi**
- ✅ `server.js` - Prisma Client inteqrasiyası
- ✅ `lib/prisma.js` - Prisma utility fayl
- ✅ Bütün route faylları Prisma üçün yeniləndi:
  - `routes/auth.prisma.js`
  - `routes/teachers.prisma.js`
  - `routes/reviews.prisma.js`
  - `routes/admin.prisma.js`
- ✅ `middleware/auth.prisma.js` - JWT auth Prisma ilə

### 3. **Seed Data**
- ✅ `seedData.prisma.js` - Prisma ilə seed
- ✅ `runSeed.prisma.js` - Seed runner
- ✅ Admin hesabı yaradılması

### 4. **Konfiqurasiya Faylları**
- ✅ `package.json` - Dependencies yeniləndi, Prisma scripts əlavə edildi
- ✅ `.env.example` - PostgreSQL environment variables
- ✅ `render.yaml` - Render deployment konfiqurasiyası
- ✅ `.gitignore` - Prisma və environment faylları

### 5. **Sənədləşdirmə**
- ✅ `MIGRATION_GUIDE.md` - Ətraflı migrasiya təlimatı
- ✅ `README.md` - Yeni backend dokumentasiyası

---

## 📋 Növbəti Addımlar (Siz etməlisiniz)

### Addım 1: Neon PostgreSQL Database Yarat
1. [neon.tech](https://neon.tech) saytına daxil olun
2. Yeni proyekt yaradın
3. Database connection string əldə edin

### Addım 2: Köhnə Faylları Əvəz Et

**Windows PowerShell-də:**

```powershell
cd backend

# Middleware
Move-Item -Force middleware/auth.prisma.js middleware/auth.js

# Routes
Move-Item -Force routes/auth.prisma.js routes/auth.js
Move-Item -Force routes/teachers.prisma.js routes/teachers.js
Move-Item -Force routes/reviews.prisma.js routes/reviews.js
Move-Item -Force routes/admin.prisma.js routes/admin.js

# Seed files
Move-Item -Force seedData.prisma.js seedData.js
Move-Item -Force runSeed.prisma.js runSeed.js
```

### Addım 3: Köhnə Faylları Sil

```powershell
# Models qovluğu (artıq lazım deyil)
Remove-Item -Recurse -Force models/

# Köhnə database.js
Remove-Item -Force database.js

# Railway konfiqurasiyası
Remove-Item -Force railway.json

# Prisma config (lazım deyil)
Remove-Item -Force prisma.config.ts
```

### Addım 4: Environment Variables

`.env` faylını yeniləyin:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/derstap?sslmode=require"
JWT_SECRET=your_strong_secret_key_here
PORT=5000
NODE_ENV=development
```

### Addım 5: Dependencies Quraşdır

```bash
# Köhnə node_modules sil
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Yeni dependencies
npm install

# Prisma Client generate
npm run prisma:generate
```

### Addım 6: Database Migration

```bash
# İlk migration
npm run prisma:migrate
# Migration adı: "init"
```

### Addım 7: Seed Data

```bash
npm run seed
```

Admin hesabı:
- Email: `admin@derstap.az`
- Şifrə: `admin123456`

### Addım 8: Test

```bash
# Development
npm run dev

# Test API
# http://localhost:5000
```

### Addım 9: Render Deploy

1. [render.com](https://render.com) - Hesab yarat
2. **New Web Service** yarat
3. Repository: DersTap
4. Root Directory: `backend`
5. Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
6. Start Command: `npm start`
7. Environment Variables əlavə et:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

---

## 🔄 Əsas Dəyişikliklər

### Database
- **Əvvəl:** MongoDB (NoSQL)
- **İndi:** PostgreSQL (SQL)

### ORM
- **Əvvəl:** Mongoose
- **İndi:** Prisma

### Hosting
- **Əvvəl:** Railway
- **İndi:** Render

### ID Format
- **Əvvəl:** MongoDB ObjectId (24 char hex)
- **İndi:** UUID (36 char)

### Queries
- **Əvvəl:** `User.findOne({ email })`
- **İndi:** `prisma.user.findUnique({ where: { email } })`

---

## 📊 Fayl Strukturu

```
backend/
├── prisma/
│   └── schema.prisma          ✅ Yeni
├── lib/
│   └── prisma.js              ✅ Yeni
├── middleware/
│   ├── auth.js                🔄 Yeniləndi
│   └── auth.prisma.js         📝 Köçürülməli
├── routes/
│   ├── auth.js                🔄 Yeniləndi
│   ├── teachers.js            🔄 Yeniləndi
│   ├── reviews.js             🔄 Yeniləndi
│   ├── admin.js               🔄 Yeniləndi
│   ├── auth.prisma.js         📝 Köçürülməli
│   ├── teachers.prisma.js     📝 Köçürülməli
│   ├── reviews.prisma.js      📝 Köçürülməli
│   └── admin.prisma.js        📝 Köçürülməli
├── models/                    ❌ Silinməli
├── server.js                  🔄 Yeniləndi
├── seedData.js                🔄 Yeniləndi
├── seedData.prisma.js         📝 Köçürülməli
├── runSeed.js                 🔄 Yeniləndi
├── runSeed.prisma.js          📝 Köçürülməli
├── package.json               🔄 Yeniləndi
├── .env.example               ✅ Yeni
├── .gitignore                 ✅ Yeni
├── render.yaml                ✅ Yeni
├── README.md                  ✅ Yeni
└── MIGRATION_GUIDE.md         ✅ Yeni
```

---

## ⚠️ Diqqət

1. **Frontend dəyişməyəcək** - API endpoint-lər eyni qalır
2. **ID formatı dəyişir** - MongoDB ObjectId → UUID
3. **Mongoose middleware-lər** (pre-save hooks) manual olaraq implement edilməlidir
4. **Relations** artıq SQL foreign key-lər ilə idarə olunur

---

## 🆘 Kömək

Ətraflı təlimat: `MIGRATION_GUIDE.md`

Problem yaranarsa:
1. `.env` faylını yoxlayın
2. `npm run prisma:studio` ilə database-i yoxlayın
3. Logs-lara baxın

---

## 🎉 Uğurlar!

Migrasiya hazırdır! Yuxarıdakı addımları izləyin və backend sisteminiz PostgreSQL + Prisma + Render üzərində işləyəcək.
