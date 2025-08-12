// Multi-language translation system for EDUCE
const translations = {
    az: {
        // Navigation
        nav_home: "Ana Səhifə",
        nav_how_it_works: "Necə İşləyir",
        nav_features: "Xüsusiyyətlər",
        nav_contact: "Əlaqə",
        nav_psychologist_login: "Psixoloq Girişi",
        
        // Hero Section
        hero_title: "Uşaqların Potensialını Kəşf Edin",
        hero_subtitle: "Elmi əsaslı psixoloji qiymətləndirmələr və AI dəstəkli təhlillər vasitəsilə uşaqların gələcəyini formalaşdırın",
        hero_cta: "İndi Başlayın",
        hero_learn_more: "Ətraflı Öyrən",
        
        // How It Works Section
        how_it_works_title: "Necə İşləyir",
        how_it_works_subtitle: "Sadə 3 addımda uşağınızın psixoloji qiymətləndirməsini əldə edin",
        step1_title: "Qeydiyyatdan Keçin",
        step1_desc: "Uşağınızın məlumatlarını daxil edin və profil yaradın",
        step2_title: "Psixoloq Seçin",
        step2_desc: "Təcrübəli psixoloqlarımızdan birini seçin",
        step3_title: "Nəticələri Alın",
        step3_desc: "Ətraflı hesabat və tövsiyələr əldə edin",
        
        // Features Section
        features_title: "Niyə EDUCE Seçməlisiniz?",
        features_subtitle: "Uşağınızın psixoloji inkişafı üçün ən yaxşı həlllər",
        feature1_title: "AI Dəstəkli Analiz",
        feature1_desc: "Süni intellekt vasitəsilə dəqiq və ətraflı analiz",
        feature2_title: "Peşəkar Psixoloqlar",
        feature2_desc: "Təcrübəli və sertifikatlaşdırılmış mütəxəssislər",
        feature3_title: "Təhlükəsiz Platform",
        feature3_desc: "Məlumatlarınızın tam təhlükəsizliyi təmin edilir",
        feature4_title: "24/7 Dəstək",
        feature4_desc: "Hər zaman sizin yanınızdayıq",
        
        // Stats Section
        stats_children: "Uşaq",
        stats_psychologists: "Psixoloq", 
        stats_assessments: "Qiymətləndirmə",
        stats_satisfaction: "Məmnunluq",
        
        // Footer
        footer_navigation: "Naviqasiya",
        footer_about: "Layihə Haqqında",
        footer_team: "Komanda",
        footer_contact: "Əlaqə",
        footer_parent_login: "Valideyn Girişi",
        footer_psychologist_login: "Psixoloq Girişi",
        footer_register: "Qeydiyyat",
        footer_admin: "Admin Panel",
        footer_project_lead: "Layihə Rəhbəri",
        footer_developer: "Baş Developer və Layihə Meneceri",
        footer_rights: "© 2024 EDUCE Platform. Bütün hüquqlar qorunur.",
        
        // Buttons and Actions
        btn_start_now: "İndi Başlayın",
        btn_watch_demo: "Demo İzlə",
        btn_get_started: "Başlayın",
        btn_close: "Bağla",
        btn_send_email: "Email Göndər",
        
        // Profile Menu
        profile_my_profile: "Mənim Profilim",
        profile_my_children: "Mənim Uşaqlarım",
        profile_assessments: "Qiymətləndirmələr",
        profile_logout: "Çıxış",
        
        // Modals
        modal_about_title: "EDUCE Haqqında",
        modal_team_title: "Layihə Komandası",
        modal_contact_title: "Əlaqə Məlumatları",
        
        // Login Pages
        login_title: "Giriş",
        admin_login_title: "Admin və Psixoloq Girişi",
        customer_login_title: "Valideyn Girişi", 
        email_label: "Email",
        password_label: "Şifrə",
        login_button: "Giriş Et",
        forgot_password: "Şifrəni unutmusunuz?",
        register_link: "Hesabınız yoxdur? Qeydiyyatdan keçin",
        
        // Register Pages
        register_title: "Qeydiyyat",
        customer_register_title: "Valideyn Qeydiyyatı",
        psychologist_register_title: "Psixoloq Qeydiyyatı",
        full_name_label: "Ad və Soyad",
        phone_label: "Telefon",
        confirm_password_label: "Şifrəni Təsdiq Et",
        register_button: "Qeydiyyat",
        login_link: "Artıq hesabınız var? Giriş edin",
        
        // Admin Panel
        admin_panel_title: "EDUCE Admin Panel",
        dashboard: "İdarə Paneli",
        users_management: "İstifadəçi İdarəetməsi",
        psychologists_management: "Psixoloq İdarəetməsi", 
        children_management: "Uşaq İdarəetməsi",
        requests_management: "Sorğu İdarəetməsi",
        statistics: "Statistika",
        settings: "Tənzimləmələr",
        total_users: "Ümumi İstifadəçilər",
        pending_requests: "Gözləyən Sorğular",
        completed_assessments: "Tamamlanmış Qiymətləndirmələr",
        
        // Psychologist Dashboard
        psychologist_dashboard: "Psixoloq Paneli",
        my_profile: "Mənim Profilim",
        pending_requests: "Gözləyən Sorğular",
        active_assessments: "Aktiv Qiymətləndirmələr",
        completed_work: "Tamamlanmış İşlər",
        accept: "Qəbul Et",
        reject: "Rədd Et",
        
        // Forms
        child_name: "Uşağın Adı",
        child_age: "Yaş",
        child_grade: "Sinif",
        specialization: "İxtisas",
        experience: "Təcrübə",
        description: "Təsvir",
        
        // How It Works Section
        how_it_works_title: "EDUCE Necə İşləyir",
        how_it_works_subtitle: "Uşağınızın potensialını açmaq üçün dörd sadə addım",
        step1_title: "Qeydiyyat",
        step1_description: "Hesabınızı yaradın və uşağınızın yaşı, maraqları və təhsil keçmişi haqqında əsas məlumatları təqdim edin.",
        step2_title: "Testi Keçin",
        step2_description: "Uşağınız əyləncəli, interaktiv mühitdə elmi əsasda hazırlanmış psixoloji qiymətləndirmələri tamamlayır.",
        step3_title: "Psixoloq Analizi",
        step3_description: "Lisenziyalı psixoloqlar nəticələri nəzərdən keçirir və uşağınızın idrak nümunələri haqqında peşəkar fikirlər verirlər.",
        step4_title: "AI Dəstəkli Hesabat",
        step4_description: "Karyera tövsiyələri, öyrənmə strategiyaları və fərdiləşdirilmiş inkişaf planları ilə hərtərəfli hesabat alın.",
        
        // Features Section
        features_title: "Niyə EDUCE Seçməlisiniz?",
        features_subtitle: "Qabaqcıl texnologiya peşəkar təcrübə ilə birləşir",
        feature1_title: "AI Dəstəkli Analiz",
        feature1_description: "Ən son süni intellekt texnologiyalarından istifadə edərək uşağınızın güclü tərəflərini və inkişaf sahələrini müəyyən edin.",
        feature2_title: "Peşəkar Psixoloqlar",
        feature2_description: "Komandamız lisenziyalı uşaq psixoloqlarından ibarətdir və hər biri 10+ il təcrübəyə malikdir.",
        feature3_title: "Təhlükəsiz və Məxfi",
        feature3_description: "Ailənizin məlumatları bank səviyyəsində təhlükəsizliklə qorunur. Biz şəxsi məlumatları üçüncü tərəflərlə heç vaxt paylaşmırıq.",
        feature4_title: "İrəliləyişin İzlənməsi",
        feature4_description: "Ətraflı irəliləyiş hesabatları və mərhələ nailiyyətləri ilə uşağınızın zamanla inkişafını izləyin.",
        feature5_title: "24/7 Dəstək",
        feature5_description: "Bizim xüsusi dəstək komandamız nəticələri başa düşməyə kömək etmək və suallarınızı cavablandırmaq üçün həmişə əlçatandır.",
        
        // CTA Section
        cta_title: "Uşağınızın Potensialını Kəşf Etməyə Hazırsınız?",
        cta_subtitle: "EDUCE ilə artıq öz yollarını tapmış minlərlə ailəyə qoşulun.",
        cta_get_started: "Başlayın",
        cta_join_psychologist: "Psixoloq Olaraq Qoşulun",
        
        // Contact Section
        contact_title: "Bizimlə Əlaqə",
        contact_subtitle: "Suallarınız var? Uşağınızın potensialını başa düşməyə kömək etmək üçün buradayıq.",
        contact_email: "E-poçt Göndər",
        contact_call: "Zəng Et",
        contact_hours: "İş Saatları",
        contact_hours_time: "B.e-Cü: 9:00-18:00",
        contact_form_name: "Ad Soyad",
        contact_form_email: "E-poçt Ünvanı",
        contact_form_message: "Mesaj",
        contact_form_placeholder: "Uşağınız haqqında və sizə necə kömək edə biləcəyimiz barədə bizə danışın...",
        contact_send_message: "Mesaj Göndər",
        
        // Common
        loading: "Yüklənir...",
        error: "Xəta",
        success: "Uğurlu",
        cancel: "Ləğv et",
        save: "Saxla",
        edit: "Redaktə et",
        delete: "Sil",
        add: "Əlavə et",
        view: "Bax",
        select: "Seç",
        back: "Geri",
        next: "Növbəti",
        submit: "Göndər",
        reset: "Sıfırla"
    },
    
    en: {
        // Navigation
        nav_home: "Home",
        nav_how_it_works: "How It Works",
        nav_features: "Features",
        nav_contact: "Contact",
        nav_psychologist_login: "Psychologist Login",
        
        // Hero Section
        hero_title: "Discover Your Child's Potential",
        hero_subtitle: "Shape your child's future with science-backed psychological assessments and AI-powered insights",
        hero_cta: "Get Started Now",
        hero_learn_more: "Learn More",
        
        // How It Works Section
        how_it_works_title: "How It Works",
        how_it_works_subtitle: "Get your child's psychological assessment in 3 simple steps",
        step1_title: "Register",
        step1_desc: "Enter your child's information and create a profile",
        step2_title: "Choose Psychologist",
        step2_desc: "Select one of our experienced psychologists",
        step3_title: "Get Results",
        step3_desc: "Receive detailed reports and recommendations",
        
        // Features Section
        features_title: "Why Choose EDUCE?",
        features_subtitle: "The best solutions for your child's psychological development",
        feature1_title: "AI-Powered Analysis",
        feature1_desc: "Accurate and detailed analysis through artificial intelligence",
        feature2_title: "Professional Psychologists",
        feature2_desc: "Experienced and certified specialists",
        feature3_title: "Secure Platform",
        feature3_desc: "Complete security of your data is ensured",
        feature4_title: "24/7 Support",
        feature4_desc: "We are always by your side",
        
        // Stats Section
        stats_children: "Children",
        stats_psychologists: "Psychologists",
        stats_assessments: "Assessments",
        stats_satisfaction: "Satisfaction",
        
        // Footer
        footer_navigation: "Navigation",
        footer_about: "About Project",
        footer_team: "Team",
        footer_contact: "Contact",
        footer_parent_login: "Parent Login",
        footer_psychologist_login: "Psychologist Login",
        footer_register: "Register",
        footer_admin: "Admin Panel",
        footer_project_lead: "Project Lead",
        footer_developer: "Lead Developer & Project Manager",
        footer_rights: "© 2024 EDUCE Platform. All rights reserved.",
        
        // Buttons and Actions
        btn_start_now: "Start Now",
        btn_watch_demo: "Watch Demo",
        btn_get_started: "Get Started",
        btn_close: "Close",
        btn_send_email: "Send Email",
        
        // Profile Menu
        profile_my_profile: "My Profile",
        profile_my_children: "My Children",
        profile_assessments: "Assessments",
        profile_logout: "Logout",
        
        // Modals
        modal_about_title: "About EDUCE",
        modal_team_title: "Project Team",
        modal_contact_title: "Contact Information",
        
        // Login Pages
        login_title: "Login",
        admin_login_title: "Admin & Psychologist Login",
        customer_login_title: "Parent Login",
        email_label: "Email",
        password_label: "Password",
        login_button: "Login",
        forgot_password: "Forgot Password?",
        register_link: "Don't have an account? Register",
        
        // Register Pages
        register_title: "Register",
        customer_register_title: "Parent Registration",
        psychologist_register_title: "Psychologist Registration",
        full_name_label: "Full Name",
        phone_label: "Phone",
        confirm_password_label: "Confirm Password",
        register_button: "Register",
        login_link: "Already have an account? Login",
        
        // Admin Panel
        admin_panel_title: "EDUCE Admin Panel",
        dashboard: "Dashboard",
        users_management: "User Management",
        psychologists_management: "Psychologist Management",
        children_management: "Children Management",
        requests_management: "Request Management",
        statistics: "Statistics",
        settings: "Settings",
        total_users: "Total Users",
        pending_requests: "Pending Requests",
        completed_assessments: "Completed Assessments",
        
        // Psychologist Dashboard
        psychologist_dashboard: "Psychologist Dashboard",
        my_profile: "My Profile",
        pending_requests: "Pending Requests",
        active_assessments: "Active Assessments",
        completed_work: "Completed Work",
        accept: "Accept",
        reject: "Reject",
        
        // Forms
        child_name: "Child's Name",
        child_age: "Age",
        child_grade: "Grade",
        specialization: "Specialization",
        experience: "Experience",
        description: "Description",
        
        // How It Works Section
        how_it_works_title: "How EDUCE Works",
        how_it_works_subtitle: "Four simple steps to unlock your child's potential",
        step1_title: "Registration",
        step1_description: "Create your account and provide basic information about your child's age, interests, and educational background.",
        step2_title: "Take the Test",
        step2_description: "Your child completes scientifically-designed psychological assessments in a fun, interactive environment.",
        step3_title: "Psychologist Analysis",
        step3_description: "Licensed psychologists review the results and provide professional insights into your child's cognitive patterns.",
        step4_title: "AI-Powered Report",
        step4_description: "Receive a comprehensive report with career recommendations, learning strategies, and personalized development plans.",
        
        // Features Section
        features_title: "Why Choose EDUCE?",
        features_subtitle: "Advanced technology meets professional expertise",
        feature1_title: "AI-Powered Analysis",
        feature1_description: "Identify your child's strengths and areas for development using the latest artificial intelligence technologies.",
        feature2_title: "Professional Psychologists",
        feature2_description: "Our team consists of licensed child psychologists, each with 10+ years of experience.",
        feature3_title: "Secure & Private",
        feature3_description: "Your family's data is protected with bank-level security. We never share personal information with third parties.",
        feature4_title: "Progress Tracking",
        feature4_description: "Monitor your child's development over time with detailed progress reports and milestone achievements.",
        feature5_title: "24/7 Support",
        feature5_description: "Our dedicated support team is always available to help you understand results and answer your questions.",
        
        // CTA Section
        cta_title: "Ready to Discover Your Child's Potential?",
        cta_subtitle: "Join thousands of families who have already found their path with EDUCE.",
        cta_get_started: "Get Started",
        cta_join_psychologist: "Join as Psychologist",
        
        // Contact Section
        contact_title: "Get in Touch",
        contact_subtitle: "Have questions? We're here to help you understand your child's potential.",
        contact_email: "Email Us",
        contact_call: "Call Us",
        contact_hours: "Office Hours",
        contact_hours_time: "Mon-Fri: 9AM-6PM EST",
        contact_form_name: "Full Name",
        contact_form_email: "Email Address",
        contact_form_message: "Message",
        contact_form_placeholder: "Tell us about your child and how we can help...",
        contact_send_message: "Send Message",
        
        // Common
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        add: "Add",
        view: "View",
        select: "Select",
        back: "Back",
        next: "Next",
        submit: "Submit",
        reset: "Reset"
    },
    
    ru: {
        // Navigation
        nav_home: "Главная",
        nav_how_it_works: "Как Это Работает",
        nav_features: "Особенности",
        nav_contact: "Контакты",
        nav_psychologist_login: "Вход Психолога",
        
        // Hero Section
        hero_title: "Откройте Потенциал Вашего Ребенка",
        hero_subtitle: "Формируйте будущее вашего ребенка с помощью научно обоснованных психологических оценок и аналитики на основе ИИ",
        hero_cta: "Начать Сейчас",
        hero_learn_more: "Узнать Больше",
        
        // How It Works Section
        how_it_works_title: "Как Это Работает",
        how_it_works_subtitle: "Получите психологическую оценку вашего ребенка за 3 простых шага",
        step1_title: "Регистрация",
        step1_desc: "Введите информацию о вашем ребенке и создайте профиль",
        step2_title: "Выберите Психолога",
        step2_desc: "Выберите одного из наших опытных психологов",
        step3_title: "Получите Результаты",
        step3_desc: "Получите подробные отчеты и рекомендации",
        
        // Features Section
        features_title: "Почему Выбрать EDUCE?",
        features_subtitle: "Лучшие решения для психологического развития вашего ребенка",
        feature1_title: "Анализ на Основе ИИ",
        feature1_desc: "Точный и подробный анализ с помощью искусственного интеллекта",
        feature2_title: "Профессиональные Психологи",
        feature2_desc: "Опытные и сертифицированные специалисты",
        feature3_title: "Безопасная Платформа",
        feature3_desc: "Обеспечивается полная безопасность ваших данных",
        feature4_title: "Поддержка 24/7",
        feature4_desc: "Мы всегда рядом с вами",
        
        // Stats Section
        stats_children: "Детей",
        stats_psychologists: "Психологов",
        stats_assessments: "Оценок",
        stats_satisfaction: "Удовлетворенность",
        
        // Footer
        footer_navigation: "Навигация",
        footer_about: "О Проекте",
        footer_team: "Команда",
        footer_contact: "Контакты",
        footer_parent_login: "Вход Родителя",
        footer_psychologist_login: "Вход Психолога",
        footer_register: "Регистрация",
        footer_admin: "Админ Панель",
        footer_project_lead: "Руководитель Проекта",
        footer_developer: "Ведущий Разработчик и Менеджер Проекта",
        footer_rights: "© 2024 EDUCE Platform. Все права защищены.",
        
        // Buttons and Actions
        btn_start_now: "Начать Сейчас",
        btn_watch_demo: "Смотреть Демо",
        btn_get_started: "Начать",
        btn_close: "Закрыть",
        btn_send_email: "Отправить Email",
        
        // Profile Menu
        profile_my_profile: "Мой Профиль",
        profile_my_children: "Мои Дети",
        profile_assessments: "Оценки",
        profile_logout: "Выход",
        
        // Modals
        modal_about_title: "О EDUCE",
        modal_team_title: "Команда Проекта",
        modal_contact_title: "Контактная Информация",
        
        // Login Pages
        login_title: "Вход",
        admin_login_title: "Вход Администратора и Психолога",
        customer_login_title: "Вход Родителя",
        email_label: "Email",
        password_label: "Пароль",
        login_button: "Войти",
        forgot_password: "Забыли пароль?",
        register_link: "Нет аккаунта? Зарегистрируйтесь",
        
        // Register Pages
        register_title: "Регистрация",
        customer_register_title: "Регистрация Родителя",
        psychologist_register_title: "Регистрация Психолога",
        full_name_label: "Полное Имя",
        phone_label: "Телефон",
        confirm_password_label: "Подтвердите Пароль",
        register_button: "Зарегистрироваться",
        login_link: "Уже есть аккаунт? Войти",
        
        // Admin Panel
        admin_panel_title: "EDUCE Админ Панель",
        dashboard: "Панель Управления",
        users_management: "Управление Пользователями",
        psychologists_management: "Управление Психологами",
        children_management: "Управление Детьми",
        requests_management: "Управление Запросами",
        statistics: "Статистика",
        settings: "Настройки",
        total_users: "Всего Пользователей",
        pending_requests: "Ожидающие Запросы",
        completed_assessments: "Завершенные Оценки",
        
        // Psychologist Dashboard
        psychologist_dashboard: "Панель Психолога",
        my_profile: "Мой Профиль",
        pending_requests: "Ожидающие Запросы",
        active_assessments: "Активные Оценки",
        completed_work: "Завершенная Работа",
        accept: "Принять",
        reject: "Отклонить",
        
        // Forms
        child_name: "Имя Ребенка",
        child_age: "Возраст",
        child_grade: "Класс",
        specialization: "Специализация",
        experience: "Опыт",
        description: "Описание",
        
        // How It Works Section
        how_it_works_title: "Как Работает EDUCE",
        how_it_works_subtitle: "Четыре простых шага для раскрытия потенциала вашего ребенка",
        step1_title: "Регистрация",
        step1_description: "Создайте аккаунт и предоставьте основную информацию о возрасте, интересах и образовательном фоне вашего ребенка.",
        step2_title: "Прохождение Теста",
        step2_description: "Ваш ребенок выполняет научно разработанные психологические оценки в веселой, интерактивной среде.",
        step3_title: "Анализ Психолога",
        step3_description: "Лицензированные психологи изучают результаты и предоставляют профессиональные выводы о когнитивных паттернах вашего ребенка.",
        step4_title: "AI-Отчет",
        step4_description: "Получите всеобъемлющий отчет с рекомендациями по карьере, стратегиями обучения и персонализированными планами развития.",
        
        // Features Section
        features_title: "Почему Выбрать EDUCE?",
        features_subtitle: "Передовые технологии встречаются с профессиональным опытом",
        feature1_title: "AI-Анализ",
        feature1_description: "Определите сильные стороны и области развития вашего ребенка, используя новейшие технологии искусственного интеллекта.",
        feature2_title: "Профессиональные Психологи",
        feature2_description: "Наша команда состоит из лицензированных детских психологов, каждый с опытом работы 10+ лет.",
        feature3_title: "Безопасно и Конфиденциально",
        feature3_description: "Данные вашей семьи защищены с банковским уровнем безопасности. Мы никогда не делимся личной информацией с третьими сторонами.",
        feature4_title: "Отслеживание Прогресса",
        feature4_description: "Отслеживайте развитие вашего ребенка со временем с подробными отчетами о прогрессе и достижениях.",
        feature5_title: "Поддержка 24/7",
        feature5_description: "Наша специализированная команда поддержки всегда доступна, чтобы помочь понять результаты и ответить на ваши вопросы.",
        
        // CTA Section
        cta_title: "Готовы Открыть Потенциал Вашего Ребенка?",
        cta_subtitle: "Присоединяйтесь к тысячам семей, которые уже нашли свой путь с EDUCE.",
        cta_get_started: "Начать",
        cta_join_psychologist: "Присоединиться как Психолог",
        
        // Contact Section
        contact_title: "Связаться с Нами",
        contact_subtitle: "Есть вопросы? Мы здесь, чтобы помочь понять потенциал вашего ребенка.",
        contact_email: "Написать Email",
        contact_call: "Позвонить",
        contact_hours: "Рабочие Часы",
        contact_hours_time: "Пн-Пт: 9:00-18:00",
        contact_form_name: "Полное Имя",
        contact_form_email: "Email Адрес",
        contact_form_message: "Сообщение",
        contact_form_placeholder: "Расскажите нам о вашем ребенке и как мы можем помочь...",
        contact_send_message: "Отправить Сообщение",
        
        // Common
        loading: "Загрузка...",
        error: "Ошибка",
        success: "Успех",
        cancel: "Отмена",
        save: "Сохранить",
        edit: "Редактировать",
        delete: "Удалить",
        add: "Добавить",
        view: "Просмотр",
        select: "Выбрать",
        back: "Назад",
        next: "Далее",
        submit: "Отправить",
        reset: "Сбросить"
    }
};

// Current language state
let currentLanguage = localStorage.getItem('educe_language') || 'az';

// Language management functions
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('educe_language', lang);
        updatePageLanguage();
        updateCurrentLanguageDisplay();
        closeLanguageMenu();
        
        // Show language change notification
        showEnhancedNotification(`Dil dəyişdirildi: ${getLanguageName(lang)}`, 'success');
    }
}

function getLanguageName(lang) {
    const names = {
        'az': 'Azərbaycan',
        'en': 'English', 
        'ru': 'Русский'
    };
    return names[lang] || lang.toUpperCase();
}

function updateCurrentLanguageDisplay() {
    const currentLangElement = document.getElementById('currentLanguage');
    if (currentLangElement) {
        currentLangElement.textContent = currentLanguage.toUpperCase();
    }
    
    // Update active language option
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.onclick.toString().includes(`'${currentLanguage}'`)) {
            option.classList.add('active');
        }
    });
}

function updatePageLanguage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Handle placeholder translations
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
    
    // Update document language attribute
    document.documentElement.lang = currentLanguage;
}

function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

function closeLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    if (menu) {
        menu.classList.remove('active');
    }
}

// Initialize language system
function initializeLanguageSystem() {
    updateCurrentLanguageDisplay();
    updatePageLanguage();
    
    // Close language menu when clicking outside
    document.addEventListener('click', function(event) {
        const languageSelector = document.querySelector('.language-selector');
        const languageMenu = document.getElementById('languageMenu');
        
        if (languageSelector && !languageSelector.contains(event.target)) {
            closeLanguageMenu();
        }
    });
}

// Make functions globally available
window.changeLanguage = changeLanguage;
window.toggleLanguageMenu = toggleLanguageMenu;
window.closeLanguageMenu = closeLanguageMenu;
window.initializeLanguageSystem = initializeLanguageSystem;

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageSystem);
} else {
    initializeLanguageSystem();
}
