# DərsTap Backend Migration Guide
## MongoDB + Mongoose + Railway → PostgreSQL + Prisma + Render

Bu təlimat backend sistemini MongoDB-dən PostgreSQL-ə keçirmək üçün addım-addım yol göstərir.

---

## 📋 Migrasiya Addımları

### 1. Neon PostgreSQL Database Yarat

1. [Neon.tech](https://neon.tech) saytına daxil ol
2. Yeni proyekt yarat
3. Database connection string-i əldə et (format: `postgresql://username:password@host/database?sslmode=require`)
4. Connection string-i saxla

### 2. Backend Fayllarını Yenilə

Köhnə Mongoose fayllarını Prisma faylları ilə əvəz et:

**Və ya Windows PowerShell-də:**

```powershell
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

### 3. Köhnə Mongoose Fayllarını Sil

**Və ya Windows PowerShell-də:**

```powershell
# Models qovluğunu sil
Remove-Item -Recurse -Force models/

# Köhnə database.js faylını sil
Remove-Item -Force database.js

# Railway konfiqurasiyasını sil
Remove-Item -Force railway.json
```

### 4. Environment Variables Konfiqurasiya Et

`.env` faylını yenilə:

```env
# PostgreSQL Database (Neon)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### 5. Dependencies Quraşdır

**Windows PowerShell-də:**

```powershell
# Köhnə node_modules-u sil
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Yeni dependencies quraşdır
npm install

# Prisma Client generate et
npm run prisma:generate
```

### 6. Database Migration

**Windows PowerShell-də:**

```powershell
# İlk migration yarat
npm run prisma:migrate

# Migration adı daxil edin: "init" və ya "initial_setup"
```

### 7. Seed Data Yüklə

**Windows PowerShell-də:**

```powershell
npm run seed
```

Bu admin hesabı yaradacaq:
- **Email:** admin@derstap.az
- **Şifrə:** admin123456

### 8. Local Test

**Windows PowerShell-də:**

```powershell
# Development rejimində başlat
npm run dev

# Və ya production rejimində
npm start
```

Test et:
- `http://localhost:5000` - API işləyir
- `http://localhost:5000/api/auth/login` - Login test et

---

## 🚀 Render-də Deploy

### 1. Render Hesabı Yarat

1. [Render.com](https://render.com) saytına daxil ol
2. GitHub hesabını bağla

### 2. Yeni Web Service Yarat

1. **New +** → **Web Service**
2. Repository seç: `DersTap`
3. Konfiqurasiya:
   - **Name:** derstap-backend
   - **Region:** Frankfurt (və ya ən yaxın)
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command:** `npm start`

### 3. Environment Variables Əlavə Et

Render dashboard-da **Environment** bölməsinə:

```
DATABASE_URL = postgresql://username:password@host/database?sslmode=require
JWT_SECRET = your_strong_secret_key
NODE_ENV = production
```

### 4. Deploy

**Deploy** düyməsinə bas və gözlə. Deploy uğurlu olduqdan sonra:

```
https://derstap-backend.onrender.com
```

### 5. Seed Data Yüklə (Production)

Render Shell-də:

```bash
npm run seed
```

---

## 📊 Prisma Studio (Database GUI)

Local development üçün:

```bash
npm run prisma:studio
```

Browser-də açılacaq: `http://localhost:5555`

---

## 🔄 Frontend Konfiqurasiyası

Frontend-də API URL-ni yenilə:

**`frontend/src/config.js`** və ya **`.env`**:

```javascript
// Development
const API_URL = 'http://localhost:5000/api';

// Production
const API_URL = 'https://derstap-backend.onrender.com/api';
```

---

## ✅ Yoxlama Siyahısı

- [ ] Neon PostgreSQL database yaradıldı
- [ ] `.env` faylı konfiqurasiya edildi
- [ ] Prisma faylları köhnə faylları əvəz etdi
- [ ] Dependencies quraşdırıldı
- [ ] Prisma migration işlədi
- [ ] Seed data yükləndi
- [ ] Local test uğurlu oldu
- [ ] Render-də deploy edildi
- [ ] Production-da test edildi
- [ ] Frontend API URL yeniləndi

---

## 🆘 Problemlər və Həllər

### Problem: Prisma Client generate olmur

```bash
npx prisma generate --schema=./prisma/schema.prisma
```

### Problem: Migration xətası

```bash
# Migration reset et
npx prisma migrate reset

# Yenidən migration yarat
npm run prisma:migrate
```

### Problem: Connection xətası

- DATABASE_URL düzgün formatda olduğunu yoxla
- SSL mode aktivdir: `?sslmode=require`
- Neon database aktiv olduğunu yoxla

### Problem: Render deploy xətası

- Build logs yoxla
- Environment variables düzgün qurulub
- `postinstall` script işləyir

---

## 📚 Əlavə Resurslar

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Render Documentation](https://render.com/docs)

---

## 🎉 Uğurlar!

Artıq backend sisteminiz PostgreSQL + Prisma + Render üzərində işləyir!
