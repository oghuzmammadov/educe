# 🧠 EDUCE - Uşaq Psixoloji Qiymətləndirmə Platforması

**EDUCE** - uşaqların psixoloji inkişafını qiymətləndirmək və dəstəkləmək üçün nəzərdə tutulmuş innovativ veb platformasıdır. Bu sistem valideyinlər, psixoloqlar və administratorlar arasında səmərəli əlaqə qurur və uşaqların psixoloji sağlamlığını təmin etmək üçün hərtərəfli həllər təqdim edir.

## 👨‍💼 Layihə Rəhbəri
**Oğuz Məmmədov** - Layihə Rəhbəri və Baş Developer

## 🎯 Layihənin Məqsədi

EDUCE platforması uşaqların psixoloji inkişafını izləmək, qiymətləndirmək və lazım gələn dəstəyi təmin etmək məqsədilə yaradılmışdır. Platform aşağıdakı əsas məqsədlərə xidmət edir:

- **Erkən Müdaxilə**: Uşaqlarda psixoloji problemlərin erkən aşkarlanması
- **Peşəkar Dəstək**: Kvalifisiyalı psixoloqlarla əlaqə qurulması
- **Məlumat İdarəetməsi**: Qiymətləndirmə nəticələrinin sistematik saxlanması
- **Ailə Dəstəyi**: Valideyinlərə uşaqlarının inkişafı haqqında məlumat verilməsi

## ⚡ Əsas Xüsusiyyətlər

### 👥 İstifadəçi Növləri
- **🏠 Valideyinlər**: Uşaqlarını qeydiyyatdan keçirir, psixoloq seçir və nəticələri izləyir
- **👨‍⚕️ Psixoloqlar**: Qiymətləndirmə sorğularını idarə edir və analiz aparır
- **👨‍💼 Administratorlar**: Sistemi idarə edir və istifadəçiləri təsdiqləyir

### 🔧 Funksional İmkanlar

#### Valideyinlər üçün:
- ✅ Uşaq profilləri yaradılması və idarə edilməsi
- ✅ Psixoloqlar siyahısından seçim
- ✅ Qiymətləndirmə sorğuları göndərilməsi
- ✅ Test nəticələri və AI analizlərinin izlənməsi
- ✅ Profil məlumatlarının idarə edilməsi

#### Psixoloqlar üçün:
- ✅ Qiymətləndirmə sorğularının qəbul/rədd edilməsi
- ✅ Uşaqların oyun nəticələrinin təhlili
- ✅ AI dəstəkli analiz hesabatları
- ✅ Profil məlumatlarının yenilənməsi

#### Administratorlar üçün:
- ✅ Bütün istifadəçilərin idarə edilməsi
- ✅ Psixoloqların təsdiqlənməsi
- ✅ Sistem statistikalarının izlənməsi
- ✅ Məlumat bazasının idarə edilməsi

## 🛠️ Texniki Spesifikasiyalar

### Backend
- **Node.js** - Server mühiti
- **Express.js** - Web framework
- **SQLite** - Məlumat bazası
- **JWT** - Autentifikasiya
- **bcrypt** - Şifrə təhlükəsizliyi

### Frontend
- **HTML5** - Struktur
- **CSS3** - Stilizasiya və animasiyalar
- **JavaScript (ES6+)** - İnteraktivlik
- **Responsive Design** - Mobil uyğunluq

### Məlumat Bazası
- **SQLite** - Yerli məlumat saxlama
- **15+ Cədvəl** - İstifadəçilər, psixoloqlar, uşaqlar, sorğular və s.
- **JWT Token** - Təhlükəsiz autentifikasiya

## 🚀 Quraşdırma və İstifadə

### Sistemin İşə Salınması

```bash
# 1. Layihəni yükləyin
git clone [repository-url]
cd tehsil-sayt

# 2. Asılılıqları quraşdırın
npm install

# 3. Serveri işə salın
npm start
```

### 🔐 Default Hesablar

**Admin Panel:**
- Email: `nsuenactus@gmail.com`
- Şifrə: `nsuenactus2025`

**Təsdiqlənmiş Psixoloqlar:**
- `sarah.johnson@educe.com / password123`
- `michael.chen@educe.com / password123`
- `emily.rodriguez@educe.com / password123`

## 📊 API Endpoints

### Autentifikasiya
- `POST /api/auth/register` - İstifadəçi qeydiyyatı
- `POST /api/auth/login` - Giriş

### İstifadəçi İdarəetməsi
- `GET /api/users/profile` - Profil məlumatları
- `PUT /api/users/profile` - Profil yenilənməsi

### Psixoloq İdarəetməsi
- `GET /api/psychologists` - Təsdiqlənmiş psixoloqlar
- `POST /api/psychologists/register` - Psixoloq qeydiyyatı
- `PUT /api/psychologists/my-profile` - Profil yenilənməsi

### Admin İdarəetməsi
- `GET /api/admin/psychologists` - Bütün psixoloqlar
- `PUT /api/admin/psychologists/:id/approval` - Təsdiqləmə
- `GET /api/admin/children` - Bütün uşaqlar
- `GET /api/admin/stats` - Sistem statistikaları

## 🔒 Təhlükəsizlik

- **JWT Token** autentifikasiyası
- **bcrypt** şifrə hashlənməsi
- **Role-based** giriş nəzarəti
- **SQL Injection** qorunması
- **XSS** qorunması

## 📱 Responsiv Dizayn

Platform bütün cihazlarda optimal işləmək üçün nəzərdə tutulmuşdur:
- 💻 Desktop kompüterlər
- 📱 Mobil telefonlar
- 📟 Planşetlər

## 🎨 UI/UX Xüsusiyyətləri

- **Modern Dizayn** - Müasir və istifadəçi dostu interfeys
- **Animasiyalar** - Smooth keçidlər və effektlər
- **Modal Pəncərələr** - İnteraktiv məlumat görüntüləmə
- **Notification Sistemi** - İstifadəçi məlumatlandırması
- **Dark/Light Theme** - Gözə uyğun rəng sxemləri

## 🔄 Data Flow

1. **Valideyinlər** uşaqlarını qeydiyyatdan keçirir
2. **Psixoloq seçimi** edilir və sorğu göndərilir
3. **Psixoloq** sorğunu qəbul edir
4. **Qiymətləndirmə** prosesi başlayır
5. **Nəticələr** AI analizi ilə emal edilir
6. **Hesabatlar** valideyinlərə təqdim edilir

## 📈 Gələcək İnkişaf Planları

- 🤖 **AI Analiz** sisteminin təkmilləşdirilməsi
- 📊 **Təfərrüatlı Hesabatlar** əlavə edilməsi
- 📧 **Email Bildirişləri** sistemi
- 🎮 **İnteraktiv Oyunlar** modulu
- 📱 **Mobil Tətbiq** versiyası
- 🌐 **Çoxdilli Dəstək** əlavə edilməsi

## 📞 Əlaqə

**Layihə Rəhbəri:** Oğuz Məmmədov
**Email:** nsuenactus@gmail.com

---

## 📝 Lisenziya

Bu layihə təhsil məqsədilə hazırlanmışdır və ADA University çərçivəsində inkişaf etdirilir.

---

**© 2024 EDUCE Platform - Uşaq Psixoloji Qiymətləndirmə Sistemi**
**Layihə Rəhbəri: Oğuz Məmmədov**