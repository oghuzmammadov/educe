# EDUCE Database Quraşdırılması və İstifadəsi

Bu faylda EDUCE psixoloji qiymətləndirmə platforması üçün PostgreSQL database-nin quraşdırılması və istifadəsi barədə məlumat verilir.

## 🚀 Avtomatik Quraşdırılma (Tövsiyə edilir)

**Artıq əl ilə database setup etməyə ehtiyac yoxdur!** Server başlayanda avtomatik olaraq:

✅ Database yaradır (əgər yoxdursa)  
✅ Bütün cədvəlləri yaradır  
✅ İndekslər əlavə edir  
✅ Default admin və psixoloq hesabları yaradır  

### İstifadə üçün sadə addımlar:

1. **PostgreSQL yüklə və işə sal:**
```bash
# Windows üçün PostgreSQL yüklə və service başlat
# pgAdmin 4 istifadə edə bilərsən
```

2. **Asılılıqları yüklə:**
```bash
npm install
```

3. **Serveri başlat:**
```bash
npm start
```

Bu qədər! Server başlayanda avtomatik olaraq hər şey quraşdırılacaq.

## 🔧 Konfiqurasiya (config.js)

Database əlaqə məlumatları `config.js` faylında:

```javascript
database: {
    host: 'localhost',
    port: 5432,
    name: 'educe_db',
    user: 'postgres',
    password: 'password'
}
```

## 🔐 Default Hesablar

Server ilk dəfə başlayanda avtomatik yaradılır:

### Admin Hesabı:
- **Email:** nsuenactus@gmail.com
- **Şifrə:** nsuenactus2025
- **Səlahiyyət:** Bütün əməliyyatlar

### Psixoloq Hesabları:
- **Dr. Sarah Johnson:** sarah.johnson@pathify.com / password123 ✅ (təsdiqlənmiş)
- **Dr. Michael Chen:** michael.chen@pathify.com / password123 ✅ (təsdiqlənmiş)
- **Dr. Emily Rodriguez:** emily.rodriguez@pathify.com / password123 ✅ (təsdiqlənmiş)
- **Dr. James Wilson:** james.wilson@pathify.com / password123 ⏳ (gözləyir)
- **Dr. Lisa Martinez:** lisa.martinez@pathify.com / password123 ⏳ (gözləyir)

## 📊 Database Cədvəlləri

Avtomatik yaradılan 7 əsas cədvəl:

1. **users** - Bütün istifadəçilər (müştərilər, psixoloqlar, adminlər)
2. **psychologists** - Psixoloq ətraflı məlumatları
3. **children** - Uşaq məlumatları
4. **assessment_requests** - Qiymətləndirmə sorğuları
5. **game_results** - Oyun nəticələri
6. **ai_analysis** - AI analiz nəticələri
7. **api_configs** - API konfiqurasiyaları

## 🛠️ Problemlərin həlli

### PostgreSQL bağlantı problemləri:

1. **PostgreSQL işləyirmi yoxla:**
```bash
# Windows üçün services.msc aç və PostgreSQL service yoxla
```

2. **İstifadəçi yaratma:**
```sql
CREATE USER postgres WITH PASSWORD 'password' SUPERUSER;
```

3. **Database əlaqə testləri:**
```bash
psql -U postgres -h localhost
```

### Ümumi problemlər:

**Problem:** `database "pathify_db" does not exist`  
**Həll:** Server avtomatik yaradacaq, sadəcə PostgreSQL işlədiyindən əmin ol.

**Problem:** `authentication failed for user "postgres"`  
**Həll:** config.js faylında şifrəni yoxla və düzəlt.

**Problem:** `ECONNREFUSED`  
**Həll:** PostgreSQL service başlat.

## 📚 API Endpointləri

Server başlayanda avtomatik olaraq hazır endpointlər:

### Autentifikasiya:
- `POST /api/auth/register` - Yeni istifadəçi qeydiyyatı
- `POST /api/auth/login` - Giriş

### Psixoloqlar:
- `GET /api/psychologists` - Təsdiqlənmiş psixoloqlar
- `GET /api/admin/psychologists` - Bütün psixoloqlar (admin)
- `POST /api/admin/psychologists/:id/approve` - Psixoloq təsdiqi

### Uşaqlar:
- `GET /api/children` - İstifadəçinin uşaqları
- `POST /api/children` - Yeni uşaq əlavə et

### Qiymətləndirmə:
- `POST /api/assessment-requests` - Qiymətləndirmə sorğusu
- `GET /api/assessment-requests` - Sorğuları gör
- `POST /api/assessment-requests/:id/respond` - Sorğuya cavab ver

### Oyun və analiz:
- `POST /api/game-results` - Oyun nəticələri yadda saxla
- `GET /api/game-results` - Oyun nəticələri
- `POST /api/ai-analysis` - AI analiz yadda saxla
- `GET /api/ai-analysis` - AI analiz al

## 🔒 Təhlükəsizlik

- JWT token autentifikasiyası
- Şifrələr bcrypt ilə hash-lənir
- CORS konfiqurasiyası
- Rate limiting
- Helmet security headers

## 💡 İpuçuları

1. **Development üçün:** `npm run dev` (nodemon ilə)
2. **Production üçün:** `npm start`
3. **JWT tokenləri:** 24 saat etibarlıdır
4. **API header:** `Authorization: Bearer <token>`
5. **Frontend avtomatik:** localStorage-dan API-ya keçir

## 🔄 Məlumat köçürülməsi

Frontend avtomatik olaraq:
- localStorage məlumatlarını aşkar edir
- Mövcud məlumatları API-ya köçürür
- API mövcud olduqda avtomatik istifadə edir
- API olmadıqda localStorage-a qayıdır

Bu sistemlə istifadəçilər heç bir məlumat itirmədən API-ya keçir.

---

**Qeyd:** Bu quraşdırılma tam avtomatikdir. Sadəcə PostgreSQL işlədiyindən əmin ol və serveri başlat! 