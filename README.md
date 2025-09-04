## ⚡ Quraşdırma və İstifadə

### 1. Layihəni yükləyin
```bash
git clone https://github.com/yourusername/derstap.git
cd derstap
```

### 2. Backend quraşdırması
```bash
cd backend
npm install
```

**Environment variables yaradın** (`.env` faylı):
```env
MONGODB_URI=mongodb://localhost:27017/derstap
JWT_SECRET=derstap_secret_key_2025
PORT=5000
NODE_ENV=development
```

**Demo məlumatları yükləyin**:
```bash
npm run seed
```

**Backend-i işə salın**:
```bash
npm run dev
```

### 3. Frontend quraşdırması
```bash
cd ../frontend
npm install
```

**Environment variables yaradın** (`.env` faylı):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Frontend-i işə salın**:
```bash
npm start
```

### 4. MongoDB quraşdırması
MongoDB-nun quraşdırıldığından əmin olun və işə salın:
```bash
mongod
```

## ⚠️ Xəta Həlləri

### Ümumi Xətalar:
1. **MongoDB bağlantı xətası**: 
   - MongoDB servisin işlədiyini yoxlayın: `mongod`
   - `.env` faylında `MONGODB_URI` düzgün olduğunu yoxlayın

2. **Port artıq istifadədə**:
   - Backend üçün port dəyişdirin: `PORT=5001`
   - Frontend üçün: `npm start` sonra `y` deyə digər port seçin

3. **CORS xətası**:
   - Backend-də CORS middleware düzgün quraşdırılıb
   - Frontend API URL-ni yoxlayın: `REACT_APP_API_URL`

4. **JWT Token xətası**:
   - Brauzerdə localStorage-ı təmizləyin
   - Yenidən login edin

### Frontend Xətaları:
1. **Component import xətaları**: Bütün komponentlər `export default` istifadə edir
2. **CSS class xətaları**: Tailwind CDN linkini index.html-də yoxlayın
3. **API response xətaları**: Backend işl# DərsTap - Ağıllı Təhsil Platforması

DərsTap müəllim və abituriyentləri bir araya gətirən ağıllı platformadır. Bu layihə müəllimlərə özlərini tanıtmaq və abituriyentlərə uyğun müəllim tapmaq imkanı yaradır.

## 🚀 Xüsusiyyətlər

### Müəllimlər üçün:
- **Profil yaradılması** - Ad, soyad, şəkil, təcrübə, fənn, qiymət, şəhər
- **Online/Offline status** göstəricisi
- **Profil baxış statistikası**
- **Reytinq və rəy sistemi**

### Abituriyentlər üçün:
- **Geniş axtarış sistemi** - Şəhər, fənn, qiymət, sinif və reytinq üzrə
- **Müəllim profillərinə baxış**
- **Əlaqə nömrəsi əldə etmə**
- **Rəy və reytinq vermə**

### Admin Paneli:
- **İstifadəçi idarəsi**
- **Məzmun moderasiyası**
- **Rəy və reytinq nəzarəti**
- **Aktivlik statistikaları**

## 🛠️ Texnologiyalar

### Backend:
- **Node.js** - Server mühiti
- **Express.js** - Web framework
- **MongoDB** - Verilənlər bazası
- **JWT** - Autentifikasiya
- **Bcrypt** - Şifrə şifrələmə

### Frontend:
- **React.js** - İstifadəçi interfeysi
- **Tailwind CSS** - Stil framework
- **Axios** - HTTP sorğular
- **React Router** - Naviqasiya

## 📁 Layihə Strukturu

```
derstap/
├── backend/
│   ├── models/
│   │   ├── User.js          # İstifadəçi modeli
│   │   ├── Teacher.js       # Müəllim modeli
│   │   └── Review.js        # Rəy modeli
│   ├── routes/
│   │   ├── auth.js          # Autentifikasiya marşrutları
│   │   ├── teachers.js      # Müəllim marşrutları
│   │   ├── reviews.js       # Rəy marşrutları
│   │   └── admin.js         # Admin marşrutları
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── server.js            # Ana server faylı
│   ├── database.js          # DB bağlantısı
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── TeacherCard.js
│   │   │   ├── SearchFilters.js
│   │   │   └── ReviewModal.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── TeacherProfile.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── AdminPanel.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## ⚡ Quraşdırma və İstifadə

### 1. Layihəni yükləyin
```bash
git clone https://github.com/yourusername/derstap.git
cd derstap
```

### 2. Backend quraşdırması
```bash
cd backend
npm install
```

**Environment variables yaradın** (`.env` faylı):
```env
MONGODB_URI=mongodb://localhost:27017/derstap
JWT_SECRET=derstap_secret_key_2025
PORT=5000
```

**Backend-i işə salın**:
```bash
npm run dev
```

### 3. Frontend quraşdırması
```bash
cd ../frontend
npm install
```

**Environment variables yaradın** (`.env` faylı):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Frontend-i işə salın**:
```bash
npm start
```

### 4. MongoDB quraşdırması
MongoDB-nun quraşdırıldığından əmin olun və işə salın:
```bash
mongod
```

## 🔐 Demo Hesablar

Sistemə test etmək üçün bu hesablarla giriş edə bilərsiniz:

- **Müəllim**: teacher@demo.com / 123456
- **Tələbə**: student@demo.com / 123456  
- **Admin**: admin@demo.com / 123456

## 📊 API Endpoints

### Autentifikasiya
- `POST /api/auth/register` - Qeydiyyat
- `POST /api/auth/login` - Giriş
- `POST /api/auth/logout` - Çıxış
- `GET /api/auth/me` - İstifadəçi məlumatları

### Müəllimlər
- `GET /api/teachers` - Bütün müəllimləri al (filterlə)
- `GET /api/teachers/:id` - Müəyyən müəllimi al
- `PUT /api/teachers/profile` - Müəllim profilini yenilə
- `GET /api/teachers/top/rated` - Ən yaxşı müəllimlər

### Rəylər
- `POST /api/reviews` - Rəy əlavə et
- `GET /api/reviews/teacher/:teacherId` - Müəllimin rəylərini al
- `PUT /api/reviews/:id` - Rəyi yenilə
- `DELETE /api/reviews/:id` - Rəyi sil

### Admin
- `GET /api/admin/stats` - Statistikalar
- `GET /api/admin/users` - Bütün istifadəçilər
- `PUT /api/admin/users/:id/status` - İstifadəçi statusu
- `GET /api/admin/reviews/pending` - Gözləyən rəylər

## 🎨 Dizayn Xüsusiyyətləri

- **Responsive design** - Bütün cihazlarla uyğun
- **Modern UI/UX** - Tailwind CSS ilə hazırlanmış
- **Animasiyalar** - Smooth transitions və hover effects
- **Loading states** - İstifadəçi təcrübəsi üçün
- **Error handling** - Xətalar üçün user-friendly mesajlar

## 🔮 Gələcək Planlar

### Qısa Müddətli:
- Müəllimlər üçün nümunə dərs videoları
- Reytinq sisteminin təkmilləşməsi
- Şikayət və moderasiya sistemi

### Orta Müddətli:
- Platforma üzərindən sınaq dərslərinin keçirilməsi
- Tam kurs sistemi (video dərslər, testlər, PDF materiallar)
- Sertifikat sistemi

### Uzun Müddətli:
- Mobil tətbiq (push bildirişlər, dərs xatırlatmaları)
- Regionlara uyğun müəllim tapma funksiyası
- Video zəng funksiyası

## 💰 Monetizasiya Modeli

- **Aylıq Abunə** - Müəllimlər üçün platformadan istifadə
- **Premium Profil** - Axtarış nəticələrində ön sıralarda çıxma
- **Komissiya əsaslı Dərslər** - Platforma üzərindən keçirilən ödənişli dərslər
- **Reklam Yerləşdirmə** - Hədəflənmiş reklam yerləşdirmə

## 🤝 Töhfə Vermək

1. Layihəni fork edin
2. Feature branch yaradın (`git checkout -b feature/AmazingFeature`)
3. Dəyişiklikləri commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch-ı push edin (`git push origin feature/AmazingFeature`)
5. Pull Request yaradın

## 📝 Lisenziya

Bu layihə MIT lisenziyası altındadır. Ətraflı məlumat üçün `LICENSE` faylına baxın.

## 📞 Əlaqə

- **Email**: info@derstap.az
- **Telefon**: +994 XX XXX XX XX
- **LinkedIn**: [DərsTap](https://linkedin.com/company/derstap)
- **Instagram**: [@derstap.az](https://instagram.com/derstap.az)

---

⭐ Bu layihə sizə faydalıdırsa, star verməyi unutmayın!