import React, { createContext, useContext, useMemo, useState } from 'react';

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'French' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'id', name: 'Indonesian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

const english = {
  common_back: '< Back',
  common_active: 'Active',
  common_light: 'Light',
  common_dark: 'Dark',
  common_system: 'System',
  common_unable_open: 'Unable to open',
  common_link_unsupported: 'This link is not supported on your device.',
  common_something_wrong: 'Something went wrong',
  common_try_again: 'Please try again.',
  common_close: 'Close',
  tabs_home: 'Home',
  tabs_prayer_time: 'Prayer Time',
  tabs_quran: 'Quran',
  tabs_info: 'Info',
  info_kicker: 'MYGNI SUPPORT',
  info_title: 'Info & Settings',
  info_subtitle:
    'Manage app details, policy pages, quick actions, theme mode, and language.',
  info_theme: 'Theme',
  info_color_theme: 'Color Theme',
  info_color_theme_hint: 'Choose your preferred accent color',
  menu_takti: 'Takti',
  info_language: 'Language',
  info_language_hint: 'Change app language for supported screens.',
  info_choose_language: 'Choose Language',
  info_about_title: 'About Us',
  info_about_subtitle: 'Know the mission and app details',
  info_contact_title: 'Contact Us',
  info_contact_subtitle: 'Reach support for help and feedback',
  info_privacy_title: 'Privacy Policy',
  info_privacy_subtitle: 'Understand your data and privacy',
  info_terms_title: 'Terms & Conditions',
  info_terms_subtitle: 'Read usage terms and guidelines',
  info_share_title: 'Share App',
  info_share_subtitle: 'Invite friends and family',
  info_more_apps_title: 'More Apps',
  info_more_apps_subtitle: 'See other apps from our team',
  info_rate_title: 'Rate This App',
  info_rate_subtitle: 'Support us with your rating',
  info_coming_soon: 'This section will be available soon.',
  info_share_failed: 'Share failed',
  info_share_failed_subtitle: 'Unable to share app right now.',
  info_share_message:
    'Check out MyGNI app for prayer times, Quran, and Islamic resources.',
  about_description: `🌙 About Ajmer Garib Nawaz

Ajmer Garib Nawaz is a comprehensive Islamic mobile application thoughtfully designed to help Muslims strengthen their connection with faith in their daily lives. The app brings together essential Islamic tools and resources in one convenient platform, making it easier to practice and learn anytime, anywhere.

With features such as accurate prayer times, Quran reading, an Islamic calendar, a rich collection of duas, and various educational resources, the app aims to support users in their spiritual journey with authenticity and ease.

Inspired by the teachings and legacy of Khwaja Moinuddin Chishti, Ajmer Garib Nawaz strives to promote peace, knowledge, and devotion. We are committed to providing reliable and verified Islamic content so that users can engage with their faith confidently.

Our mission is to make Islamic knowledge accessible, simple, and meaningful for everyone—whether at home, at work, or on the go.`,

  privacy_description: `🔐 Privacy Policy – Ajmer Garib Nawaz

At Ajmer Garib Nawaz, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we handle user data and ensure a safe and secure experience for all users.

📌 1. Information We Collect
We are committed to minimal data collection. Our app does not require users to provide personal information such as name, email, or phone number to access core features.

However, in certain cases, we may collect:

• Location Data (Optional): Used only to provide accurate prayer times and nearby Islamic places. This data is processed on-device and is not stored on our servers.  
• Device Information (Non-Personal): Basic technical information (such as device type, OS version) may be collected to improve app performance and compatibility.

📌 2. How We Use Information
Any information collected is used solely for:
• Providing accurate prayer times based on location  
• Enhancing app functionality and user experience  
• Fixing bugs and improving performance  

We do not use your data for advertising, profiling, or selling to third parties.

📌 3. Data Storage and Security
• We do not store personal user data on our servers  
• All processing is done securely  
• We implement reasonable security measures  

📌 4. Permissions We Use
• Location Access: For prayer times and nearby Islamic places  
• Storage Access (if applicable): For saving Quran/audio content  

📌 5. Third-Party Services
We may use trusted third-party services for analytics or crash reporting. These do not collect personally identifiable information.

📌 6. Children’s Privacy
We do not knowingly collect data from children.

📌 7. User Control
• You can disable location anytime  
• You can uninstall the app to remove data  

📌 8. Changes to This Policy
We may update this policy from time to time.

📌 9. Contact Us
Email: your@email.com`,

  terms_description: `📜 Terms & Conditions – Ajmer Garib Nawaz

By downloading, accessing, or using the Ajmer Garib Nawaz application, you agree to comply with these Terms & Conditions.

📌 1. Acceptance of Terms
By using this application, you agree to these terms. If not, please do not use the app.

📌 2. Purpose of the Application
This app provides Islamic information such as prayer times, Quran reading, duas, and educational resources.

📌 3. Accuracy of Information
We strive for accuracy, but:
• We do not guarantee completeness  
• Prayer times may vary  
• Users should verify with scholars  

📌 4. Use of the App
You must not:
• Misuse or disrupt the app  
• Copy or distribute content without permission  
• Use the app for unlawful activities  

📌 5. Intellectual Property
All content belongs to Ajmer Garib Nawaz and is protected by law.

📌 6. User Responsibilities
Users must use the app responsibly and verify religious information when needed.

📌 7. Third-Party Services
We are not responsible for third-party content or services.

📌 8. Limitation of Liability
The app is provided "as is". We are not liable for any damages or inaccuracies.

📌 9. Updates and Modifications
We may update the app and terms at any time.

📌 10. Termination
We may suspend access if terms are violated.

📌 11. Governing Law
These terms are governed by the laws of India.

📌 12. Contact Us
Email: your@email.com`,

  home_kicker: 'ASSALAMU ALAIKUM',
  home_title: 'Ajmer Garib Nawaz',
  home_subtitle: 'Dates may vary by 1 day depending on moon sighting.',
  home_upcoming_urs: 'Upcoming Urs',
  home_ajmer_shareef: 'Ajmer Shareef',
  home_explore_menu: 'Explore Menu',
  home_daily_picks: 'Daily Picks',
  home_name_of_day: 'NAME OF THE DAY',
  home_dua_of_day: 'DUA OF THE DAY',
  home_quote_of_day: 'QUOTE OF THE DAY',
  home_rate_title: 'Rate This App',
  home_rate_text: 'Support MyGNI by rating the app on the store.',
  menu_name_of_allah: '99 Name of Allah',
  menu_islamic_dua: 'Islamic Dua',
  menu_islamic_calendar: 'Islamic Calendar',
  menu_six_kalima: 'Six Kalima',
  menu_namaz_rakat: 'Namaz Rakat',
  menu_islamic_quotes: 'Islamic Quotes',
  menu_quran: 'Quran',
  menu_qibla_finder: 'Qibla Finder',
  menu_hadish: 'Hadish',
  menu_tasbih_counter: 'Tasbih Counter',
  menu_zakat_calculator: 'Zakat Calculator',
  menu_must_visit_place: 'Must Visit Place',
  menu_populer_hotels: 'Populer Hotels',
  menu_hajj_umrah_guide: 'Hajj & Umrah Guide',
  menu_nearby_places: 'Nearby Places',
  namaz_kicker: 'NAMAZ GUIDE',
  namaz_title: 'Namaz Rakat',
  namaz_subtitle:
    'View daily prayers and Jumu’ah with their sunnah, fard, nafl, and witr rakats.',
  namaz_sunnah: 'Sunnah',
  namaz_fard: 'Fard',
  namaz_nafl: 'Nafl',
  namaz_witr: 'Witr',
  namaz_total: 'Total',
  common_translation: 'Translation',
  common_english: 'English',
  screen_allah_kicker: 'ASMA UL HUSNA',
  screen_allah_title: '99 Names of Allah',
  screen_allah_subtitle:
    'Read the Arabic name, English transliteration, and meaning.',
  screen_dua_kicker: 'DUA COLLECTION',
  screen_dua_title: 'Islamic Dua',
  screen_dua_subtitle:
    'Read each dua in Arabic, English transliteration, and meaning.',
  screen_kalima_kicker: 'KALIMA COLLECTION',
  screen_kalima_title: 'Six Kalima',
  screen_kalima_subtitle:
    'Read each kalima in Arabic, English transliteration, and translation.',
  screen_quotes_kicker: 'REFLECTIONS',
  screen_quotes_title: 'Islamic Quotes',
  screen_quotes_subtitle:
    'Read inspiring quotes from the Quran and sayings of the Prophet.',
  screen_hadith_kicker: 'HADITH COLLECTION',
  screen_hadith_title: 'Islamic Hadish',
  screen_hadith_subtitle: 'Read selected hadith with their source references.',
  screen_hajj_kicker: 'PILGRIMAGE GUIDE',
  screen_hajj_title: 'Hajj & Umrah Guide',
  screen_hajj_subtitle:
    'Follow the steps clearly with separate guides for Hajj and Umrah.',
  screen_hajj_tab_hajj: 'Hajj',
  screen_hajj_tab_umrah: 'Umrah',
  screen_qibla_kicker: 'QIBLA DIRECTION',
  screen_qibla_title: 'Qibla Finder',
  screen_qibla_subtitle:
    'Direction is calculated from the current default location in the app.',
  screen_qibla_bearing: 'Qibla Bearing',
  screen_qibla_hint: 'Clockwise from North toward Makkah',
  screen_qibla_location: 'Current default location',
  screen_qibla_how: 'How to use',
  screen_qibla_how_text:
    'Face North first, then turn clockwise until you align near the shown degree. This helps you face the Kaaba for prayer.',
  screen_tasbih_kicker: 'DHIKR TRACKER',
  screen_tasbih_title: 'Tasbih Counter',
  screen_tasbih_subtitle:
    'Tap the counter to increase your dhikr count and reset anytime.',
  screen_tasbih_tap: 'Tap to Count',
  screen_tasbih_target: 'Target',
  screen_tasbih_remaining: 'Remaining',
  screen_tasbih_add_one: 'Add One',
  screen_tasbih_reset: 'Reset',
  screen_prayer_settings_kicker: 'PRAYER PREFERENCES',
  screen_prayer_settings_title: 'Prayer Settings',
  screen_prayer_settings_subtitle:
    'Configure madhab, calculation method, high latitude rule, and manual adjustments.',
  screen_prayer_settings_madhab: 'Madhab',
  screen_prayer_settings_method: 'Calculation Method',
  screen_prayer_settings_rule: 'High Latitude Rule',
  screen_prayer_settings_fajr: 'Fajr Adjustment',
  screen_prayer_settings_isha: 'Isha Adjustment',
  screen_prayer_settings_summary: 'Current Summary',
  screen_prayer_settings_method_short: 'Method',
  screen_prayer_settings_rule_short: 'Rule',
  screen_prayer_settings_min: 'min',
  screen_zakat_kicker: 'ZAKAT',
  screen_zakat_title: 'Zakat Calculator',
  screen_zakat_subtitle:
    'Enter your zakatable assets and short-term debts to estimate 2.5% zakat with a full breakdown.',
  screen_zakat_note: 'Important Note',
  screen_zakat_note_text:
    "This is an estimate. Nisab values for gold and silver are not fetched automatically, so enter today's market value yourself and confirm with a scholar when needed.",
  screen_zakat_enter: 'Enter Amounts',
  screen_zakat_details: 'Calculation Details',
  screen_zakat_cash_balance: 'Cash & Bank Balance',
  screen_zakat_cash_hint: 'Money in hand, savings, wallet',
  screen_zakat_gold_value: 'Gold Value',
  screen_zakat_gold_hint: 'Current value of zakatable gold',
  screen_zakat_silver_value: 'Silver Value',
  screen_zakat_silver_hint: 'Current value of zakatable silver',
  screen_zakat_business_assets: 'Business Assets',
  screen_zakat_business_hint: 'Stock, trade goods, business cash',
  screen_zakat_investments: 'Investments',
  screen_zakat_investments_hint: 'Zakatable shares or receivables',
  screen_zakat_debts: 'Immediate Debts',
  screen_zakat_debts_hint: 'Short-term payable debts only',
  screen_zakat_cash_bank: 'Cash & Bank',
  screen_zakat_total_assets: 'Total Assets',
  screen_zakat_minus_debts: 'Minus Debts',
  screen_zakat_net_amount: 'Net Zakatable Amount',
  screen_zakat_due: 'Zakat Due (2.5%)',
  screen_zakat_due_text:
    'Zakat is calculated as 2.5% of the net zakatable amount.',
  screen_zakat_due_empty: 'Add your amounts above to calculate your zakat.',
  screen_quran_kicker: 'BISMILLAH',
  screen_quran_title: 'Quran - All Surah',
  screen_quran_subtitle: 'Tap any Surah to view all Ayat',
  screen_quran_detail_kicker: 'SURAH DETAILS',
  screen_quran_ayat: 'Ayat',
  screen_quran_search_placeholder: 'Search surah by name, translation, or number',
  screen_quran_search_empty_title: 'No surah found',
  screen_quran_search_empty_text:
    'Try a different surah name, translation, or surah number.',
  screen_deen_ai_kicker: 'GUIDED DISCOVERY',
  screen_deen_ai_title: 'Deen AI',
  screen_deen_ai_subtitle:
    'Ask about Islamic topics and get Quran-based matches with free reference results.',
  screen_calendar_kicker: 'HIJRI VIEW',
  screen_calendar_title: 'Islamic Calendar',
  screen_calendar_today: 'Today',
  screen_calendar_english_date: 'English date',
  screen_calendar_monthly: 'Monthly Calendar',
  screen_calendar_approx: 'Approximate Hijri view',
  screen_calendar_current_date: 'Current Islamic Date',
  screen_calendar_festivals: 'Islamic Festivals',
  screen_calendar_observances: 'Common observances',
  screen_calendar_next: 'Next',
  screen_places_kicker: 'AJMER GUIDE',
  screen_places_title: 'Must Visit Place',
  screen_places_subtitle:
    'Important religious and historic places to visit in Ajmer.',
  screen_hotels_kicker: 'AJMER STAY',
  screen_hotels_title: 'Populer Hotels',
  screen_hotels_subtitle:
    'Popular hotel options near Ajmer Dargah for visitors and pilgrims.',
  screen_prayer_kicker: 'SALAH TRACKER',
  screen_prayer_title: 'Prayer Times',
  screen_prayer_next: 'Next Prayer',
  screen_prayer_live: 'Live',
  screen_prayer_time_remaining: 'Time Remaining',
  screen_prayer_previous_day: 'Previous Day',
  screen_prayer_next_day: 'Next Day',
  screen_prayer_clear_all: 'Clear All',
  screen_prayer_next_badge: 'NEXT',
  screen_prayer_alert_on: 'Alert On',
  screen_prayer_set_alert: 'Set Alert',
  screen_prayer_permission_needed: 'Permission needed',
  screen_prayer_permission_text:
    'Please allow notifications to receive prayer alerts.',
  screen_prayer_notifications_not_enabled: 'Notifications are not enabled yet.',
  screen_prayer_alerts_cleared: 'Prayer alerts cleared.',
  screen_prayer_disable_title: 'Prayer notifications disabled',
  screen_prayer_disable_text: 'All scheduled prayer alerts were removed.',
  screen_prayer_unable_schedule: 'Unable to schedule notifications',
  screen_prayer_unable_cancel: 'Unable to cancel notifications',
  screen_intro_welcome_title: 'Prayer Time',
  screen_intro_welcome_text:
    'Check accurate daily prayer times and stay connected to every salah on time.',
  screen_intro_learn_title: 'Quran',
  screen_intro_learn_text:
    'Read the Quran with a simple, focused experience designed for daily reflection.',
  screen_intro_consistent_title: 'Deen AI',
  screen_intro_consistent_text:
    'Ask Deen AI for quick Islamic guidance, learning support, and helpful answers anytime.',
  screen_intro_next: 'Next',
  screen_intro_get_started: 'Get Started',
} as const;

export type TranslationKey = keyof typeof english;
type TranslationMap = Record<TranslationKey, string>;

const translations: Record<LanguageCode, TranslationMap> = {
  en: english,
  zh: {
    ...english,
    common_back: '< 返回',
    common_active: '当前',
    common_light: '浅色',
    common_dark: '深色',
    common_system: '跟随系统',
    tabs_home: '首页',
    tabs_prayer_time: '礼拜时间',
    tabs_quran: '古兰经',
    tabs_info: '信息',
    info_title: '信息与设置',
    info_theme: '主题',
    info_language: '语言',
    info_choose_language: '选择语言',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: '功能菜单',
    home_daily_picks: '每日推荐',
    menu_name_of_allah: '真主 99 尊名',
    menu_islamic_dua: '伊斯兰祈祷',
    menu_islamic_calendar: '伊斯兰历',
    menu_six_kalima: '六段信词',
    menu_namaz_rakat: '礼拜拜数',
    menu_islamic_quotes: '伊斯兰语录',
    menu_qibla_finder: '朝向查找',
    menu_hadish: '圣训',
    menu_tasbih_counter: '念珠计数',
    menu_zakat_calculator: '天课计算器',
    menu_must_visit_place: '必去地点',
    menu_populer_hotels: '热门酒店',
    menu_hajj_umrah_guide: '朝觐与副朝指南',
    namaz_title: '礼拜拜数',
    namaz_sunnah: '圣行',
    namaz_fard: '主命',
    namaz_nafl: '自愿',
    namaz_witr: '维特尔',
    about_description: '🌙 关于 Ajmer Garib Nawaz\n\nAjmer Garib Nawaz 是一款全面的伊斯兰移动应用程序，经过精心设计，帮助穆斯林在日常生活中加强与信仰的联系。该应用程序将基本的伊斯兰工具和资源整合在一个便捷的平台上，让用户随时随地更容易地实践和学习。\n\n该应用程序具有准确的祈祷时间、古兰经阅读、伊斯兰历法、丰富的祈祷词收藏以及各种教育资源等功能，旨在以真实性和易用性支持用户的灵性之旅。\n\n受 Khwaja Moinuddin Chishti 的教诲和遗产启发，Ajmer Garib Nawaz 致力于促进和平、知识和虔诚。我们致力于提供可靠和经过验证的伊斯兰内容，让用户能够自信地与信仰互动。\n\n我们的使命是让伊斯兰知识对每个人都易于获取、简单且有意义——无论是在家中、工作场所还是在路上。',
    privacy_description: '🔐 隐私政策 – Ajmer Garib Nawaz\n\n在 Ajmer Garib Nawaz，我们重视您的隐私，并致力于保护您的个人信息。本隐私政策解释了我们如何处理用户数据并确保所有用户的安全和安全体验。\n\n📌 1. 我们收集的信息\n\n我们致力于最小化数据收集。我们的应用程序不需要用户提供姓名、电子邮件或电话号码等个人信息来访问核心功能。\n\n但是，在某些情况下，我们可能会收集：\n\n位置数据（可选）：\n仅用于提供准确的祈祷时间和附近的伊斯兰场所。\n此数据在设备上处理，不存储在我们的服务器上。\n设备信息（非个人）：\n基本技术信息（如设备类型、操作系统版本）可能会被收集以改进应用程序性能和兼容性。\n\n📌 2. 我们如何使用信息\n\n收集的任何信息仅用于：\n\n根据位置提供准确的祈祷时间\n增强应用程序功能和用户体验\n修复错误并改进性能\n\n我们不会将您的数据用于广告、分析或出售给第三方。\n\n📌 3. 数据存储和安全\n我们不在服务器上存储个人用户数据\n所有处理（如基于位置的计算）都是安全进行的\n我们实施合理的安保措施来保护应用程序及其用户\n\n📌 4. 我们使用的权限\n\n我们的应用程序可能会请求以下权限：\n\n位置访问：用于祈祷时间和附近的伊斯兰场所\n存储访问（如适用）：用于保存或访问古兰经/音频内容\n\n我们仅请求严格必要的权限以实现应用程序功能。\n\n📌 5. 第三方服务\n\n我们的应用程序可能会使用受信任的第三方服务（如分析或崩溃报告工具）来改进性能。\n\n这些服务：\n\n不收集个人身份信息\n遵循严格的隐私和安全标准\n\n📌 6. 儿童隐私\n\n我们的应用程序适合一般受众，不 knowingly 收集儿童的个人信息。如果您认为此类数据已被共享，请联系我们进行删除。\n\n📌 7. 用户控制\n\n您对您的数据拥有完全控制权：\n\n您可以随时禁用位置服务\n您可以卸载应用程序以删除所有相关数据\n\n📌 8. 本政策的变更\n\n我们可能会不时更新本隐私政策。任何更改将在应用程序中反映。我们鼓励用户定期查看此页面。\n\n📌 9. 联系我们\n\n如果您对本隐私政策有任何疑问或担忧，请联系我们：\n\n电子邮件：（您的电子邮件地址）',
  },
  es: {
    ...english,
    common_back: '< Atrás',
    common_active: 'Activo',
    common_light: 'Claro',
    common_dark: 'Oscuro',
    common_system: 'Sistema',
    tabs_home: 'Inicio',
    tabs_prayer_time: 'Horario de oración',
    tabs_quran: 'Corán',
    info_title: 'Información y ajustes',
    info_theme: 'Tema',
    info_language: 'Idioma',
    info_choose_language: 'Elegir idioma',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'Menú',
    home_daily_picks: 'Selecciones del día',
    menu_name_of_allah: '99 nombres de Alá',
    menu_islamic_dua: 'Dua islámica',
    menu_islamic_calendar: 'Calendario islámico',
    menu_islamic_quotes: 'Frases islámicas',
    menu_qibla_finder: 'Buscador de qibla',
    menu_hadish: 'Hadiz',
    menu_tasbih_counter: 'Contador tasbih',
    menu_zakat_calculator: 'Calculadora de zakat',
    menu_must_visit_place: 'Lugar imperdible',
    menu_populer_hotels: 'Hoteles populares',
    menu_hajj_umrah_guide: 'Guía de Hajj y Umrah',
    about_description: '🌙 Acerca de Ajmer Garib Nawaz\n\nAjmer Garib Nawaz es una aplicación móvil islámica integral diseñada cuidadosamente para ayudar a los musulmanes a fortalecer su conexión con la fe en su vida diaria. La aplicación reúne herramientas y recursos islámicos esenciales en una plataforma conveniente, facilitando la práctica y el aprendizaje en cualquier momento y lugar.\n\nCon características como horarios de oración precisos, lectura del Corán, calendario islámico, una rica colección de duás y diversos recursos educativos, la aplicación busca apoyar el viaje espiritual de los usuarios con autenticidad y facilidad.\n\nInspirada en las enseñanzas y el legado de Khwaja Moinuddin Chishti, Ajmer Garib Nawaz se esfuerza por promover la paz, el conocimiento y la devoción. Estamos comprometidos a proporcionar contenido islámico confiable y verificado para que los usuarios puedan interactuar con su fe con confianza.\n\nNuestra misión es hacer que el conocimiento islámico sea accesible, simple y significativo para todos, ya sea en casa, en el trabajo o en movimiento.',
    privacy_description: '🔐 Política de Privacidad – Ajmer Garib Nawaz\n\nEn Ajmer Garib Nawaz, valoramos su privacidad y estamos comprometidos a proteger su información personal. Esta Política de Privacidad explica cómo manejamos los datos de usuario y aseguramos una experiencia segura y segura para todos los usuarios.\n\n📌 1. Información que Recopilamos\n\nEstamos comprometidos con la recopilación mínima de datos. Nuestra aplicación no requiere que los usuarios proporcionen información personal como nombre, correo electrónico o número de teléfono para acceder a las funciones principales.\n\nSin embargo, en ciertos casos, podemos recopilar:\n\nDatos de Ubicación (Opcional):\nSe utiliza únicamente para proporcionar horarios de oración precisos y lugares islámicos cercanos.\nEstos datos se procesan en el dispositivo y no se almacenan en nuestros servidores.\nInformación del Dispositivo (No Personal):\nLa información técnica básica (como tipo de dispositivo, versión del sistema operativo) puede recopilarse para mejorar el rendimiento y la compatibilidad de la aplicación.\n\n📌 2. Cómo Usamos la Información\n\nCualquier información recopilada se utiliza únicamente para:\n\nProporcionar horarios de oración precisos basados en la ubicación\nMejorar la funcionalidad de la aplicación y la experiencia del usuario\nCorregir errores y mejorar el rendimiento\n\nNo utilizamos sus datos para publicidad, creación de perfiles o venta a terceros.\n\n📌 3. Almacenamiento y Seguridad de Datos\nNo almacenamos datos personales de usuario en nuestros servidores\nTodo el procesamiento (como cálculos basados en ubicación) se realiza de forma segura\nImplementamos medidas de seguridad razonables para proteger la aplicación y sus usuarios\n\n📌 4. Permisos que Utilizamos\n\nNuestra aplicación puede solicitar los siguientes permisos:\n\nAcceso a Ubicación: Para horarios de oración y lugares islámicos cercanos\nAcceso a Almacenamiento (si corresponde): Para guardar o acceder a contenido de Corán/audio\n\nSolo solicitamos permisos estrictamente necesarios para la funcionalidad de la aplicación.\n\n📌 5. Servicios de Terceros\n\nNuestra aplicación puede utilizar servicios de terceros confiables (como herramientas de análisis o informes de fallos) para mejorar el rendimiento.\n\nEstos servicios:\n\nNo recopilan información de identificación personal\nSiguen estándares estrictos de privacidad y seguridad\n\n📌 6. Privacidad de los Niños\n\nNuestra aplicación es adecuada para audiencias generales y no recopila knowingly información personal de niños. Si cree que dichos datos han sido compartidos, contáctenos para su eliminación.\n\n📌 7. Control del Usuario\n\nUsted tiene control total sobre sus datos:\n\nPuede desactivar los servicios de ubicación en cualquier momento\nPuede desinstalar la aplicación para eliminar todos los datos asociados\n\n📌 8. Cambios a Esta Política\n\nPodemos actualizar esta Política de Privacidad de vez en cuando. Cualquier cambio se reflejará en la aplicación. Animamos a los usuarios a revisar esta página periódicamente.\n\n📌 9. Contáctenos\n\nSi tiene alguna pregunta o inquietud sobre esta Política de Privacidad, contáctenos:\n\nCorreo electrónico: (su correo electrónico aquí)',
  },
  ar: {
    ...english,
    common_back: '< رجوع',
    common_active: 'النشط',
    common_light: 'فاتح',
    common_dark: 'داكن',
    common_system: 'النظام',
    tabs_home: 'الرئيسية',
    tabs_prayer_time: 'مواقيت الصلاة',
    tabs_quran: 'القرآن',
    tabs_info: 'المعلومات',
    info_title: 'المعلومات والإعدادات',
    info_theme: 'المظهر',
    info_language: 'اللغة',
    info_choose_language: 'اختر اللغة',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'قائمة الاستكشاف',
    home_daily_picks: 'اختيارات اليوم',
    menu_name_of_allah: 'أسماء الله الحسنى 99',
    menu_islamic_dua: 'الدعاء الإسلامي',
    menu_islamic_calendar: 'التقويم الإسلامي',
    menu_six_kalima: 'الكلمات الست',
    menu_namaz_rakat: 'ركعات الصلاة',
    menu_islamic_quotes: 'اقتباسات إسلامية',
    menu_qibla_finder: 'تحديد القبلة',
    menu_hadish: 'الحديث',
    menu_tasbih_counter: 'عداد التسبيح',
    menu_zakat_calculator: 'حاسبة الزكاة',
    menu_must_visit_place: 'أماكن يجب زيارتها',
    menu_populer_hotels: 'فنادق مشهورة',
    menu_hajj_umrah_guide: 'دليل الحج والعمرة',
    namaz_title: 'ركعات الصلاة',
    namaz_sunnah: 'سنة',
    namaz_fard: 'فرض',
    namaz_nafl: 'نفل',
    namaz_witr: 'وتر',
    about_description: '🌙 حول أجمر غريب نواز\n\nأجمر غريب نواز هو تطبيق إسلامي شامل للهواتف المحمولة مصمم بعناية لمساعدة المسلمين على تعزيز ارتباطهم بالإيمان في حياتهم اليومية. يجمع التطبيق الأدوات والموارد الإسلامية الأساسية في منصة واحدة مريحة، مما يجعل من السهل الممارسة والتعلم في أي وقت وأي مكان.\n\nمع ميزات مثل مواقيت الصلاة الدقيقة، قراءة القرآن، التقويم الإسلامي، مجموعة غنية من الأدعية، ومختلف الموارد التعليمية، يهدف التطبيق إلى دعم رحلة المستخدمين الروحية بالأصالة والسهولة.\n\nمستوحى من تعاليم وإرث خواجة معين الدين التششتي، يسعى أجمر غريب نواز لتعزيز السلام والمعرفة والتقوى. نحن ملتزمون بتقديم محتوى إسلامي موثوق ومُتحقق ليتمكن المستخدمون من التفاعل مع إيمانهم بثقة.\n\nمهمتنا هي جعل المعرفة الإسلامية متاحة وبسيطة وذات معنى للجميع - سواء في المنزل أو العمل أو أثناء التنقل.',
    privacy_description: '🔐 سياسة الخصوصية – أجمر غريب نواز\n\nفي أجمر غريب نواز، نحن نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. توضح سياسة الخصوصية هذه كيفية تعاملنا مع بيانات المستخدم وضمان تجربة آمنة وآمنة لجميع المستخدمين.\n\n📌 1. المعلومات التي نجمعها\n\nنحن ملتزمون بتقليل جمع البيانات. لا يتطلب تطبيقنا من المستخدمين تقديم معلومات شخصية مثل الاسم أو البريد الإلكتروني أو رقم الهاتف للوصول إلى الوظائف الأساسية.\n\nومع ذلك، في بعض الحالات، قد نجمع:\n\nبيانات الموقع (اختيارية):\nتُستخدم فقط لتوفير أوقات الصلاة الدقيقة والأماكن الإسلامية القريبة.\nتتم معالجة هذه البيانات على الجهاز ولا يتم تخزينها على خوادمنا.\nمعلومات الجهاز (غير شخصية):\nقد يتم جمع المعلومات التقنية الأساسية (مثل نوع الجهاز، إصدار نظام التشغيل) لتحسين أداء التطبيق والتوافق.\n\n📌 2. كيف نستخدم المعلومات\n\nأي معلومات يتم جمعها تُستخدم فقط لـ:\n\nتوفير أوقات الصلاة الدقيقة بناءً على الموقع\nتعزيز وظائف التطبيق وتجربة المستخدم\nإصلاح الأخطاء وتحسين الأداء\n\nلا نستخدم بياناتك للإعلانات أو التنميط أو البيع لأطراف ثالثة.\n\n📌 3. تخزين البيانات وأمانها\nلا نخزن بيانات المستخدم الشخصية على خوادمنا\nيتم إجراء جميع المعالجة (مثل الحسابات المبنية على الموقع) بشكل آمن\nنطبق تدابير أمنية معقولة لحماية التطبيق ومستخدميه\n\n📌 4. الأذونات التي نستخدمها\n\nقد يطلب تطبيقنا الأذونات التالية:\n\nالوصول إلى الموقع: لأوقات الصلاة والأماكن الإسلامية القريبة\nالوصول إلى التخزين (إن أمكن): لحفظ الوصول إلى محتوى القرآن/الصوت\n\nنطلب فقط الأذونات الضرورية بدقة لوظائف التطبيق.\n\n📌 5. خدمات الطرف الثالث\n\nقد يستخدم تطبيقنا خدمات طرف ثالث موثوقة (مثل أدوات التحليل أو تقارير الأعطال) لتحسين الأداء.\n\nهذه الخدمات:\n\nلا تجمع معلومات التعريف الشخصية\nتتبع معايير صارمة للخصوصية والأمان\n\n📌 6. خصوصية الأطفال\n\nتطبيقنا مناسب للجمهور العام ولا يجمع knowingly معلومات شخصية من الأطفال. إذا كنت تعتقد أن مثل هذه البيانات قد تم مشاركتها، يرجى الاتصال بنا للحذف.\n\n📌 7. سيطرة المستخدم\n\nلديك سيطرة كاملة على بياناتك:\n\nيمكنك تعطيل خدمات الموقع في أي وقت\nيمكنك إلغاء تثبيت التطبيق لإزالة جميع البيانات المرتبطة\n\n📌 8. التغييرات في هذه السياسة\n\nقد نحدث سياسة الخصوصية هذه من وقت لآخر. سيتم عكس أي تغييرات في التطبيق. نشجع المستخدمين على مراجعة هذه الصفحة بشكل دوري.\n\n📌 9. اتصل بنا\n\nإذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى الاتصال بنا:\n\nالبريد الإلكتروني: (بريدك الإلكتروني هنا)',
  },
  hi: {
    ...english,
    common_back: '< वापस',
    common_active: 'सक्रिय',
    common_light: 'लाइट',
    common_dark: 'डार्क',
    common_system: 'सिस्टम',
    tabs_home: 'होम',
    tabs_prayer_time: 'नमाज़ समय',
    tabs_quran: 'कुरआन',
    tabs_info: 'जानकारी',
    info_title: 'जानकारी और सेटिंग्स',
    info_theme: 'थीम',
    info_language: 'भाषा',
    info_choose_language: 'भाषा चुनें',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'एक्सप्लोर मेनू',
    home_daily_picks: 'आज की पसंद',
    menu_name_of_allah: 'अल्लाह के 99 नाम',
    menu_islamic_dua: 'इस्लामिक दुआ',
    menu_islamic_calendar: 'इस्लामिक कैलेंडर',
    menu_six_kalima: 'छह कलिमा',
    menu_namaz_rakat: 'नमाज़ रकात',
    menu_islamic_quotes: 'इस्लामिक कोट्स',
    menu_qibla_finder: 'किबला फाइंडर',
    menu_hadish: 'हदीस',
    menu_tasbih_counter: 'तस्बीह काउंटर',
    menu_zakat_calculator: 'ज़कात कैलकुलेटर',
    menu_must_visit_place: 'जरूर घूमने की जगह',
    menu_populer_hotels: 'लोकप्रिय होटल',
    menu_hajj_umrah_guide: 'हज और उमराह गाइड',
    namaz_title: 'नमाज़ रकात',
    namaz_sunnah: 'सुन्नत',
    namaz_fard: 'फ़र्ज़',
    namaz_nafl: 'नफ़्ल',
    namaz_witr: 'वितर',
    about_description: '🌙 अजमेर गरीब नवाज के बारे में\n\nअजमेर गरीब नवाज एक व्यापक इस्लामी मोबाइल एप्लिकेशन है जो मुसलमानों को उनकी दैनिक जीवन में अपने信仰 से जुड़ाव को मजबूत करने में मदद करने के लिए विचारपूर्वक डिज़ाइन किया गया है। ऐप आवश्यक इस्लामी उपकरणों और संसाधनों को एक सुविधाजनक प्लेटफॉर्म में एक साथ लाता है, जिससे कहीं भी, कभी भी अभ्यास और सीखना आसान हो जाता है।\n\nसटीक नमाज़ समय, कुरआन पढ़ना, इस्लामिक कैलेंडर, दुआओं का समृद्ध संग्रह, और विभिन्न शैक्षिक संसाधनों जैसी सुविधाओं के साथ, ऐप उपयोगकर्ताओं की आध्यात्मिक यात्रा को प्रामाणिकता और आसानी के साथ समर्थन करने का लक्ष्य रखता है।\n\nख्वाजा मोईनुद्दीन चिश्ती की शिक्षाओं और विरासत से प्रेरित, अजमेर गरीब नवाज शांति, ज्ञान और भक्ति को बढ़ावा देने का प्रयास करता है। हम विश्वसनीय और सत्यापित इस्लामी सामग्री प्रदान करने के लिए प्रतिबद्ध हैं ताकि उपयोगकर्ता आत्मविश्वास से अपने信仰 के साथ जुड़ सकें।\n\nहमारा मिशन इस्लामी ज्ञान को सभी के लिए सुलभ, सरल और सार्थक बनाना है - चाहे घर पर, कार्यालय में या चलते-फिरते।',
    privacy_description: 'गोपनीयता नीति\n\nअंतिम अपडेट: [दिनांक]\n\nयह गोपनीयता नीति बताती है कि कैसे "अजमेर गरीब नवाज" ऐप ("हम", "हमारे", या "ऐप") आपकी व्यक्तिगत जानकारी एकत्र करता है, उपयोग करता है और सुरक्षित रखता है। इस ऐप का उपयोग करके, आप इस नीति में वर्णित प्रथाओं से सहमत होते हैं।\n\n1. हम कौन सी जानकारी एकत्र करते हैं\n\nव्यक्तिगत जानकारी:\n• स्थान डेटा: नमाज़ समय और किबला दिशा की गणना के लिए आपके वर्तमान स्थान तक पहुंच। यह डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत किया जाता है और हमारे सर्वर पर नहीं भेजा जाता।\n• अधिसूचना सेटिंग्स: आपकी प्रार्थना अधिसूचना प्राथमिकताएं। यह डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत किया जाता है।\n\nगैर-व्यक्तिगत जानकारी:\n• ऐप उपयोग आंकड़े: कौन सी सुविधाएं आप सबसे अधिक उपयोग करते हैं। यह डेटा गुमनाम है और सुधार के लिए उपयोग किया जाता है।\n• डिवाइस जानकारी: आपका ऑपरेटिंग सिस्टम और ऐप संस्करण। यह डेटा ऐप के प्रदर्शन को ट्रैक करने के लिए उपयोग किया जाता है।\n\n2. हम आपकी जानकारी कैसे उपयोग करते हैं\n\n• नमाज़ समय और किबला दिशा की सटीक गणना के लिए।\n• प्रार्थना अधिसूचनाएं भेजने के लिए।\n• ऐप की कार्यक्षमता में सुधार के लिए।\n• तकनीकी सहायता प्रदान करने के लिए।\n\n3. जानकारी साझा करना और प्रकटीकरण\n\nहम आपकी व्यक्तिगत जानकारी को तीसरे पक्ष के साथ नहीं बेचते, व्यापार नहीं करते या अन्यथा साझा नहीं करते। हम केवल निम्नलिखित मामलों में जानकारी साझा कर सकते हैं:\n\n• कानूनी आवश्यकता: कानून द्वारा आवश्यक होने पर।\n• सुरक्षा: हमारे अधिकारों और संपत्ति की रक्षा के लिए।\n\n4. डेटा सुरक्षा\n\nहम आपकी जानकारी की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपायों का उपयोग करते हैं:\n\n• डेटा एन्क्रिप्शन: संवेदनशील डेटा को एन्क्रिप्ट किया जाता है।\n• स्थानीय संग्रहण: अधिकांश डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत किया जाता है।\n• नियमित सुरक्षा ऑडिट: हमारी सुरक्षा प्रथाओं की नियमित जांच।\n\n5. आपकी अनुमतियां और अधिकार\n\nस्थान पहुंच: ऐप को सटीक नमाज़ समय और किबला दिशा प्रदान करने के लिए आपके स्थान की आवश्यकता होती है। आप किसी भी समय अपनी डिवाइस सेटिंग्स में इस अनुमति को रद्द कर सकते हैं।\n\nअधिसूचना अनुमतियां: प्रार्थना समय की याद दिलाने के लिए। आप अधिसूचनाओं को बंद कर सकते हैं।\n\nआपके अधिकार:\n• अपनी जानकारी तक पहुंच: आप ऐप सेटिंग्स में अपनी संग्रहीत जानकारी देख सकते हैं।\n• डेटा हटाना: आप ऐप को अनइंस्टॉल करके सभी स्थानीय डेटा हटा सकते हैं।\n• ऑप्ट-आउट: आप ऐप का उपयोग बंद करके किसी भी डेटा संग्रह से ऑप्ट-आउट कर सकते हैं।\n\n6. बच्चों की गोपनीयता\n\nयह ऐप 13 वर्ष से कम उम्र के बच्चों के लिए नहीं है। हम जानबूझकर बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते।\n\n7. नीति में परिवर्तन\n\nहम इस गोपनीयता नीति को समय-समय पर अपडेट कर सकते हैं। महत्वपूर्ण परिवर्तनों के बारे में हम आपको ऐप के माध्यम से सूचित करेंगे।\n\n8. हमसे संपर्क करें\n\nगोपनीयता संबंधी प्रश्नों के लिए, कृपया हमसे संपर्क करें:\nईमेल: [आपका ईमेल]\n\nइस नीति को पढ़ने के लिए धन्यवाद। आपका विश्वास हमारे लिए महत्वपूर्ण है।',
  },
  fr: {
    ...english,
    common_back: '< Retour',
    common_light: 'Clair',
    common_dark: 'Sombre',
    common_system: 'Système',
    tabs_home: 'Accueil',
    tabs_prayer_time: 'Heures de prière',
    tabs_quran: 'Coran',
    tabs_info: 'Infos',
    info_title: 'Infos et réglages',
    info_theme: 'Thème',
    info_language: 'Langue',
    info_choose_language: 'Choisir la langue',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'Menu',
    home_daily_picks: 'Choix du jour',
    menu_name_of_allah: '99 noms d’Allah',
    menu_islamic_dua: 'Doua islamique',
    menu_islamic_calendar: 'Calendrier islamique',
    menu_islamic_quotes: 'Citations islamiques',
    menu_quran: 'Coran',
    menu_hadish: 'Hadith',
    menu_tasbih_counter: 'Compteur de tasbih',
    menu_zakat_calculator: 'Calculateur de zakat',
    menu_must_visit_place: 'Lieu à visiter',
    menu_populer_hotels: 'Hôtels populaires',
    menu_hajj_umrah_guide: 'Guide du Hajj et de la Omra',
    about_description: '🌙 À propos d\'Ajmer Garib Nawaz\n\nAjmer Garib Nawaz est une application mobile islamique complète conçue avec soin pour aider les musulmans à renforcer leur connexion avec la foi dans leur vie quotidienne. L\'application rassemble des outils et ressources islamiques essentiels sur une plateforme pratique, facilitant la pratique et l\'apprentissage à tout moment et en tout lieu.\n\nAvec des fonctionnalités telles que des horaires de prière précis, la lecture du Coran, un calendrier islamique, une riche collection de douas et diverses ressources éducatives, l\'application vise à soutenir le voyage spirituel des utilisateurs avec authenticité et facilité.\n\nInspirée par les enseignements et l\'héritage de Khwaja Moinuddin Chishti, Ajmer Garib Nawaz s\'efforce de promouvoir la paix, la connaissance et la dévotion. Nous nous engageons à fournir un contenu islamique fiable et vérifié afin que les utilisateurs puissent s\'engager avec leur foi en toute confiance.\n\nNotre mission est de rendre la connaissance islamique accessible, simple et significative pour tous - que ce soit à la maison, au travail ou en déplacement.',
    privacy_description: 'Politique de confidentialité\n\nDernière mise à jour : [date]\n\nCette politique de confidentialité explique comment l\'application "Ajmer Garib Nawaz" ("nous", "notre" ou "l\'application") collecte, utilise et protège vos informations personnelles. En utilisant cette application, vous acceptez les pratiques décrites dans cette politique.\n\n1. Quelles informations collectons-nous\n\nInformations personnelles :\n• Données de localisation : Accès à votre position actuelle pour calculer les heures de prière et la direction de la Qibla. Ces données sont stockées localement sur votre appareil et ne sont pas envoyées à nos serveurs.\n• Paramètres de notification : Vos préférences de notification de prière. Ces données sont stockées localement sur votre appareil.\n\nInformations non personnelles :\n• Statistiques d\'utilisation de l\'application : Quelles fonctionnalités vous utilisez le plus. Ces données sont anonymes et utilisées pour les améliorations.\n• Informations sur l\'appareil : Votre système d\'exploitation et la version de l\'application. Ces données sont utilisées pour suivre les performances de l\'application.\n\n2. Comment utilisons-nous vos informations\n\n• Pour calculer avec précision les heures de prière et la direction de la Qibla.\n• Pour envoyer des notifications de prière.\n• Pour améliorer les fonctionnalités de l\'application.\n• Pour fournir un support technique.\n\n3. Partage et divulgation des informations\n\nNous ne vendons, n\'échangeons ni ne partageons autrement vos informations personnelles avec des tiers. Nous pouvons partager des informations uniquement dans les cas suivants :\n\n• Obligation légale : Lorsque requis par la loi.\n• Sécurité : Pour protéger nos droits et nos biens.\n\n4. Sécurité des données\n\nNous utilisons des mesures de sécurité standard de l\'industrie pour protéger vos informations :\n\n• Chiffrement des données : Les données sensibles sont chiffrées.\n• Stockage local : La plupart des données sont stockées localement sur votre appareil.\n• Audits de sécurité réguliers : Vérifications régulières de nos pratiques de sécurité.\n\n5. Vos autorisations et droits\n\nAccès à la localisation : L\'application nécessite votre localisation pour fournir des heures de prière précises et la direction de la Qibla. Vous pouvez révoquer cette autorisation à tout moment dans les paramètres de votre appareil.\n\nAutorisations de notification : Pour les rappels des heures de prière. Vous pouvez désactiver les notifications.\n\nVos droits :\n• Accès à vos informations : Vous pouvez voir vos informations stockées dans les paramètres de l\'application.\n• Suppression des données : Vous pouvez supprimer toutes les données locales en désinstallant l\'application.\n• Désinscription : Vous pouvez vous désinscrire de toute collecte de données en cessant d\'utiliser l\'application.\n\n6. Confidentialité des enfants\n\nCette application n\'est pas destinée aux enfants de moins de 13 ans. Nous ne collectons pas sciemment d\'informations personnelles auprès des enfants.\n\n7. Modifications de la politique\n\nNous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons des changements importants via l\'application.\n\n8. Nous contacter\n\nPour toute question concernant la confidentialité, veuillez nous contacter :\nEmail : [votre email]\n\nMerci d\'avoir lu cette politique. Votre confiance nous est précieuse.',
  },
  ru: {
    ...english,
    common_back: '< Назад',
    common_light: 'Светлая',
    common_dark: 'Тёмная',
    common_system: 'Система',
    tabs_home: 'Главная',
    tabs_prayer_time: 'Время намаза',
    tabs_quran: 'Коран',
    info_title: 'Инфо и настройки',
    info_theme: 'Тема',
    info_language: 'Язык',
    info_choose_language: 'Выбрать язык',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'Меню',
    home_daily_picks: 'Выбор дня',
    menu_name_of_allah: '99 имен Аллаха',
    menu_islamic_dua: 'Исламская дуа',
    menu_islamic_calendar: 'Исламский календарь',
    menu_six_kalima: 'Шесть калима',
    menu_namaz_rakat: 'Ракааты намаза',
    menu_islamic_quotes: 'Исламские цитаты',
    menu_qibla_finder: 'Поиск киблы',
    menu_hadish: 'Хадис',
    menu_tasbih_counter: 'Счётчик тасбиха',
    menu_zakat_calculator: 'Калькулятор закята',
    menu_must_visit_place: 'Обязательное место',
    menu_populer_hotels: 'Популярные отели',
    menu_hajj_umrah_guide: 'Гид по хаджу и умре',
    about_description: '🌙 О Ajmer Garib Nawaz\n\nAjmer Garib Nawaz - это комплексное исламское мобильное приложение, тщательно разработанное для помощи мусульманам в укреплении их связи с верой в повседневной жизни. Приложение объединяет основные исламские инструменты и ресурсы на одной удобной платформе, делая практику и обучение проще в любое время и в любом месте.\n\nС функциями, такими как точное время молитв, чтение Корана, исламский календарь, богатая коллекция дуа и различные образовательные ресурсы, приложение стремится поддерживать духовное путешествие пользователей с аутентичностью и лёгкостью.\n\nВдохновлённое учениями и наследием Хваджи Моинуддина Чишти, Ajmer Garib Nawaz стремится продвигать мир, знания и преданность. Мы стремимся предоставлять надёжный и проверенный исламский контент, чтобы пользователи могли уверенно взаимодействовать со своей верой.\n\nНаша миссия - сделать исламские знания доступными, простыми и значимыми для всех - будь то дома, на работе или в пути.',
    privacy_description: 'Политика конфиденциальности\n\nПоследнее обновление: [дата]\n\nЭта политика конфиденциальности объясняет, как приложение "Ajmer Garib Nawaz" ("мы", "наш" или "приложение") собирает, использует и защищает вашу личную информацию. Используя это приложение, вы соглашаетесь с практиками, описанными в этой политике.\n\n1. Какую информацию мы собираем\n\nЛичная информация:\n• Данные о местоположении: Доступ к вашему текущему местоположению для расчёта времени молитв и направления киблы. Эти данные хранятся локально на вашем устройстве и не отправляются на наши серверы.\n• Настройки уведомлений: Ваши предпочтения уведомлений о молитвах. Эти данные хранятся локально на вашем устройстве.\n\nНеличная информация:\n• Статистика использования приложения: Какие функции вы используете чаще всего. Эти данные анонимны и используются для улучшений.\n• Информация об устройстве: Ваша операционная система и версия приложения. Эти данные используются для отслеживания производительности приложения.\n\n2. Как мы используем вашу информацию\n\n• Для точного расчёта времени молитв и направления киблы.\n• Для отправки уведомлений о молитвах.\n• Для улучшения функциональности приложения.\n• Для предоставления технической поддержки.\n\n3. Обмен и раскрытие информации\n\nМы не продаём, не обмениваем и не делимся иначе вашей личной информацией с третьими сторонами. Мы можем делиться информацией только в следующих случаях:\n\n• Законное требование: Когда требуется по закону.\n• Безопасность: Для защиты наших прав и имущества.\n\n4. Безопасность данных\n\nМы используем стандартные отраслевые меры безопасности для защиты вашей информации:\n\n• Шифрование данных: Конфиденциальные данные шифруются.\n• Локальное хранение: Большинство данных хранится локально на вашем устройстве.\n• Регулярные аудиты безопасности: Регулярные проверки наших практик безопасности.\n\n5. Ваши разрешения и права\n\nДоступ к местоположению: Приложению требуется ваше местоположение для предоставления точного времени молитв и направления киблы. Вы можете отозвать это разрешение в любое время в настройках вашего устройства.\n\nРазрешения на уведомления: Для напоминаний о времени молитв. Вы можете отключить уведомления.\n\nВаши права:\n• Доступ к вашей информации: Вы можете просмотреть вашу сохранённую информацию в настройках приложения.\n• Удаление данных: Вы можете удалить все локальные данные, удалив приложение.\n• Отказ от подписки: Вы можете отказаться от любой сбора данных, прекратив использование приложения.\n\n6. Конфиденциальность детей\n\nЭто приложение не предназначено для детей младше 13 лет. Мы сознательно не собираем личную информацию у детей.\n\n7. Изменения в политике\n\nМы можем обновлять эту политику конфиденциальности время от времени. Мы уведомим вас о важных изменениях через приложение.\n\n8. Связаться с нами\n\nПо вопросам конфиденциальности, пожалуйста, свяжитесь с нами:\nEmail: [ваш email]\n\nСпасибо за прочтение этой политики. Ваше доверие важно для нас.',
  },
  pt: {
    ...english,
    common_back: '< Voltar',
    tabs_home: 'Início',
    tabs_prayer_time: 'Horário de oração',
    tabs_quran: 'Alcorão',
    info_title: 'Info e configurações',
    info_theme: 'Tema',
    info_language: 'Idioma',
    info_choose_language: 'Escolher idioma',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'Menu',
    home_daily_picks: 'Escolhas do dia',
    menu_name_of_allah: '99 nomes de Allah',
    menu_islamic_dua: 'Dua islâmica',
    menu_islamic_calendar: 'Calendário islâmico',
    menu_islamic_quotes: 'Citações islâmicas',
    menu_qibla_finder: 'Localizador de qibla',
    menu_hadish: 'Hadith',
    menu_tasbih_counter: 'Contador de tasbih',
    menu_zakat_calculator: 'Calculadora de zakat',
    menu_must_visit_place: 'Lugar para visitar',
    menu_populer_hotels: 'Hotéis populares',
    menu_hajj_umrah_guide: 'Guia de Hajj e Umrah',
    about_description: '🌙 Sobre Ajmer Garib Nawaz\n\nAjmer Garib Nawaz é um aplicativo móvel islâmico abrangente, cuidadosamente projetado para ajudar os muçulmanos a fortalecerem sua conexão com a fé em sua vida diária. O aplicativo reúne ferramentas e recursos islâmicos essenciais em uma plataforma conveniente, facilitando a prática e o aprendizado a qualquer hora e em qualquer lugar.\n\nCom recursos como horários de oração precisos, leitura do Alcorão, calendário islâmico, uma rica coleção de duás e diversos recursos educacionais, o aplicativo visa apoiar a jornada espiritual dos usuários com autenticidade e facilidade.\n\nInspirado pelos ensinamentos e legado de Khwaja Moinuddin Chishti, Ajmer Garib Nawaz se esforça para promover a paz, o conhecimento e a devoção. Estamos comprometidos em fornecer conteúdo islâmico confiável e verificado para que os usuários possam se engajar com sua fé com confiança.\n\nNossa missão é tornar o conhecimento islâmico acessível, simples e significativo para todos - seja em casa, no trabalho ou em movimento.',
    privacy_description: 'Política de Privacidade\n\nÚltima atualização: [data]\n\nEsta política de privacidade explica como o aplicativo "Ajmer Garib Nawaz" ("nós", "nosso" ou "aplicativo") coleta, usa e protege suas informações pessoais. Ao usar este aplicativo, você concorda com as práticas descritas nesta política.\n\n1. Que informações coletamos\n\nInformações pessoais:\n• Dados de localização: Acesso à sua localização atual para calcular horários de oração e direção da qibla. Esses dados são armazenados localmente no seu dispositivo e não são enviados aos nossos servidores.\n• Configurações de notificação: Suas preferências de notificação de oração. Esses dados são armazenados localmente no seu dispositivo.\n\nInformações não pessoais:\n• Estatísticas de uso do aplicativo: Quais recursos você usa com mais frequência. Esses dados são anônimos e usados para melhorias.\n• Informações do dispositivo: Seu sistema operacional e versão do aplicativo. Esses dados são usados para rastrear o desempenho do aplicativo.\n\n2. Como usamos suas informações\n\n• Para calcular com precisão os horários de oração e direção da qibla.\n• Para enviar notificações de oração.\n• Para melhorar a funcionalidade do aplicativo.\n• Para fornecer suporte técnico.\n\n3. Compartilhamento e divulgação de informações\n\nNão vendemos, trocamos ou compartilhamos de outra forma suas informações pessoais com terceiros. Podemos compartilhar informações apenas nos seguintes casos:\n\n• Obrigação legal: Quando exigido por lei.\n• Segurança: Para proteger nossos direitos e propriedades.\n\n4. Segurança de dados\n\nUsamos medidas de segurança padrão da indústria para proteger suas informações:\n\n• Criptografia de dados: Dados sensíveis são criptografados.\n• Armazenamento local: A maioria dos dados é armazenada localmente no seu dispositivo.\n• Auditorias de segurança regulares: Verificações regulares de nossas práticas de segurança.\n\n5. Suas permissões e direitos\n\nAcesso à localização: O aplicativo precisa da sua localização para fornecer horários de oração precisos e direção da qibla. Você pode revogar essa permissão a qualquer momento nas configurações do seu dispositivo.\n\nPermissões de notificação: Para lembretes dos horários de oração. Você pode desativar as notificações.\n\nSeus direitos:\n• Acesso às suas informações: Você pode ver suas informações armazenadas nas configurações do aplicativo.\n• Exclusão de dados: Você pode excluir todos os dados locais desinstalando o aplicativo.\n• Cancelamento: Você pode cancelar qualquer coleta de dados parando de usar o aplicativo.\n\n6. Privacidade infantil\n\nEste aplicativo não é destinado a crianças menores de 13 anos. Não coletamos conscientemente informações pessoais de crianças.\n\n7. Alterações na política\n\nPodemos atualizar esta política de privacidade de tempos em tempos. Notificaremos você sobre mudanças importantes através do aplicativo.\n\n8. Entre em contato conosco\n\nPara perguntas sobre privacidade, entre em contato conosco:\nEmail: [seu email]\n\nObrigado por ler esta política. Sua confiança é importante para nós.',
  },
  bn: {
    ...english,
    common_back: '< ফিরে যান',
    tabs_home: 'হোম',
    tabs_prayer_time: 'নামাজের সময়',
    tabs_quran: 'কুরআন',
    tabs_info: 'তথ্য',
    info_title: 'তথ্য ও সেটিংস',
    info_theme: 'থিম',
    info_language: 'ভাষা',
    info_choose_language: 'ভাষা নির্বাচন করুন',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'এক্সপ্লোর মেনু',
    home_daily_picks: 'দৈনিক পছন্দ',
    menu_name_of_allah: 'আল্লাহর ৯৯ নাম',
    menu_islamic_dua: 'ইসলামিক দোয়া',
    menu_islamic_calendar: 'ইসলামিক ক্যালেন্ডার',
    menu_six_kalima: 'ছয় কালিমা',
    menu_namaz_rakat: 'নামাজ রাকাত',
    menu_islamic_quotes: 'ইসলামিক উক্তি',
    menu_hadish: 'হাদিস',
    menu_tasbih_counter: 'তাসবিহ কাউন্টার',
    menu_zakat_calculator: 'যাকাত ক্যালকুলেটর',
    menu_must_visit_place: 'দেখতেই হবে এমন স্থান',
    menu_populer_hotels: 'জনপ্রিয় হোটেল',
    menu_hajj_umrah_guide: 'হজ ও উমরাহ গাইড',
    about_description: '🌙 অজমের গরীব নওয়াজ সম্পর্কে\n\nঅজমের গরীব নওয়াজ একটি বিস্তৃত ইসলামিক মোবাইল অ্যাপ্লিকেশন যা মুসলমানদের তাদের দৈনন্দিন জীবনে তাদের বিশ্বাসের সাথে সংযোগকে শক্তিশালী করতে সাহায্য করার জন্য যত্ন সহকারে ডিজাইন করা হয়েছে। অ্যাপটি একটি সুবিধাজনক প্ল্যাটফর্মে প্রয়োজনীয় ইসলামিক টুলস এবং রিসোর্সগুলিকে একত্রিত করে, যা যে কোনও সময় এবং যে কোনও স্থানে অনুশীলন এবং শিক্ষাকে সহজ করে তোলে।\n\nসঠিক নামাজের সময়, কুরআন পঠন, ইসলামিক ক্যালেন্ডার, দোয়ার সমৃদ্ধ সংগ্রহ এবং বিভিন্ন শিক্ষামূলক রিসোর্সের মতো বৈশিষ্ট্য সহ, অ্যাপটি ব্যবহারকারীদের আধ্যাত্মিক যাত্রাকে প্রামাণিকতা এবং সহজতার সাথে সমর্থন করার লক্ষ্য রাখে।\n\nখাজা মইনুদ্দিন চিশতির শিক্ষা এবং ঐতিহ্য দ্বারা অনুপ্রাণিত, অজমের গরীব নওয়াজ শান্তি, জ্ঞান এবং ভক্তি প্রচারের চেষ্টা করে। আমরা ব্যবহারকারীদের তাদের বিশ্বাসের সাথে আত্মবিশ্বাসের সাথে যুক্ত হতে পারে এমন নির্ভরযোগ্য এবং যাচাইকৃত ইসলামিক কনটেন্ট প্রদানের জন্য প্রতিশ্রুতিবদ্ধ।\n\nআমাদের মিশন হল ইসলামিক জ্ঞানকে সকলের জন্য সহজলভ্য, সহজ এবং অর্থপূর্ণ করে তোলা - তা ঘরে, কাজে বা চলার পথে হোক।',
    privacy_description: 'গোপনীয়তা নীতি\n\nসর্বশেষ আপডেট: [তারিখ]\n\nএই গোপনীয়তা নীতি ব্যাখ্যা করে যে কীভাবে "অজমের গরীব নওয়াজ" অ্যাপ ("আমরা", "আমাদের" বা "অ্যাপ") আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করে। এই অ্যাপটি ব্যবহার করে, আপনি এই নীতিতে বর্ণিত অনুশীলনগুলির সাথে সম্মত হন।\n\n১. আমরা কোন তথ্য সংগ্রহ করি\n\nব্যক্তিগত তথ্য:\n• অবস্থান ডেটা: নামাজের সময় এবং কিবলার দিক গণনা করার জন্য আপনার বর্তমান অবস্থানে অ্যাক্সেস। এই ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত হয় এবং আমাদের সার্ভারে পাঠানো হয় না।\n• বিজ্ঞপ্তি সেটিংস: আপনার নামাজ বিজ্ঞপ্তি পছন্দ। এই ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত হয়।\n\nঅ-ব্যক্তিগত তথ্য:\n• অ্যাপ ব্যবহার পরিসংখ্যান: আপনি কোন বৈশিষ্ট্যগুলি সবচেয়ে বেশি ব্যবহার করেন। এই ডেটা বেনামী এবং উন্নতির জন্য ব্যবহার করা হয়।\n• ডিভাইস তথ্য: আপনার অপারেটিং সিস্টেম এবং অ্যাপ সংস্করণ। এই ডেটা অ্যাপের কর্মক্ষমতা ট্র্যাক করার জন্য ব্যবহার করা হয়।\n\n২. আমরা কীভাবে আপনার তথ্য ব্যবহার করি\n\n• নামাজের সময় এবং কিবলার দিক সঠিকভাবে গণনা করার জন্য।\n• নামাজ বিজ্ঞপ্তি পাঠানোর জন্য।\n• অ্যাপের কার্যকারিতা উন্নত করার জন্য।\n• প্রযুক্তিগত সহায়তা প্রদানের জন্য।\n\n৩. তথ্য ভাগ করে নেওয়া এবং প্রকাশ\n\nআমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে বিক্রি, বিনিময় বা অন্যথায় ভাগ করে নেই। আমরা শুধুমাত্র নিম্নলিখিত ক্ষেত্রে তথ্য ভাগ করে নিতে পারি:\n\n• আইনি বাধ্যবাধকতা: আইন দ্বারা প্রয়োজনীয় হলে।\n• নিরাপত্তা: আমাদের অধিকার এবং সম্পত্তি রক্ষা করার জন্য।\n\n৪. ডেটা নিরাপত্তা\n\nআমরা আপনার তথ্য রক্ষা করার জন্য শিল্প-মান নিরাপত্তা ব্যবস্থা ব্যবহার করি:\n\n• ডেটা এনক্রিপশন: সংবেদনশীল ডেটা এনক্রিপ্ট করা হয়।\n• স্থানীয় সংরক্ষণ: বেশিরভাগ ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত হয়।\n• নিয়মিত নিরাপত্তা অডিট: আমাদের নিরাপত্তা অনুশীলনের নিয়মিত পরীক্ষা।\n\n৫. আপনার অনুমতি এবং অধিকার\n\nঅবস্থান অ্যাক্সেস: অ্যাপটিকে সঠিক নামাজের সময় এবং কিবলার দিক প্রদান করার জন্য আপনার অবস্থান প্রয়োজন। আপনি যে কোনও সময় আপনার ডিভাইস সেটিংসে এই অনুমতি প্রত্যাহার করতে পারেন।\n\nবিজ্ঞপ্তি অনুমতি: নামাজের সময়ের স্মরণের জন্য। আপনি বিজ্ঞপ্তিগুলি বন্ধ করতে পারেন।\n\nআপনার অধিকার:\n• আপনার তথ্যে অ্যাক্সেস: আপনি অ্যাপ সেটিংসে আপনার সংরক্ষিত তথ্য দেখতে পারেন।\n• ডেটা মুছে ফেলা: আপনি অ্যাপটি আনইনস্টল করে সমস্ত স্থানীয় ডেটা মুছে ফেলতে পারেন।\n• অপ্ট-আউট: আপনি অ্যাপটি ব্যবহার বন্ধ করে যে কোনও ডেটা সংগ্রহ থেকে অপ্ট-আউট করতে পারেন।\n\n৬. শিশুদের গোপনীয়তা\n\nএই অ্যাপটি ১৩ বছরের কম বয়সী শিশুদের জন্য নয়। আমরা জেনেশুনে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।\n\n৭. নীতিতে পরিবর্তন\n\nআমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। গুরুত্বপূর্ণ পরিবর্তনের বিষয়ে আমরা অ্যাপের মাধ্যমে আপনাকে অবহিত করব।\n\n৮. আমাদের সাথে যোগাযোগ করুন\n\nগোপনীয়তা সম্পর্কিত প্রশ্নের জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:\nইমেল: [আপনার ইমেল]\n\nএই নীতি পড়ার জন্য ধন্যবাদ। আপনার আস্থা আমাদের জন্য গুরুত্বপূর্ণ।',
  },
  id: {
    ...english,
    common_back: '< Kembali',
    tabs_home: 'Beranda',
    tabs_prayer_time: 'Waktu salat',
    info_title: 'Info & pengaturan',
    info_theme: 'Tema',
    info_language: 'Bahasa',
    info_choose_language: 'Pilih bahasa',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'Menu eksplorasi',
    home_daily_picks: 'Pilihan harian',
    menu_name_of_allah: '99 Nama Allah',
    menu_islamic_dua: 'Doa Islami',
    menu_islamic_calendar: 'Kalender Islami',
    menu_islamic_quotes: 'Kutipan Islami',
    menu_qibla_finder: 'Pencari kiblat',
    menu_tasbih_counter: 'Penghitung tasbih',
    menu_zakat_calculator: 'Kalkulator zakat',
    menu_must_visit_place: 'Tempat wajib dikunjungi',
    menu_populer_hotels: 'Hotel populer',
    menu_hajj_umrah_guide: 'Panduan Haji & Umrah',
    about_description: '🌙 Tentang Ajmer Garib Nawaz\n\nAjmer Garib Nawaz adalah aplikasi mobile Islam yang komprehensif yang dirancang dengan hati-hati untuk membantu umat Muslim memperkuat hubungan mereka dengan iman dalam kehidupan sehari-hari. Aplikasi ini mengumpulkan alat dan sumber daya Islam penting dalam satu platform yang nyaman, memudahkan praktik dan pembelajaran kapan saja dan di mana saja.\n\nDengan fitur seperti waktu salat yang akurat, membaca Al-Quran, kalender Islam, koleksi doa yang kaya, dan berbagai sumber daya pendidikan, aplikasi ini bertujuan untuk mendukung perjalanan spiritual pengguna dengan keaslian dan kemudahan.\n\nTerinspirasi dari ajaran dan warisan Khwaja Moinuddin Chishti, Ajmer Garib Nawaz berusaha mempromosikan perdamaian, pengetahuan, dan ketakwaan. Kami berkomitmen untuk menyediakan konten Islam yang dapat diandalkan dan terverifikasi sehingga pengguna dapat berinteraksi dengan iman mereka dengan percaya diri.\n\nMisi kami adalah membuat pengetahuan Islam dapat diakses, sederhana, dan bermakna bagi semua orang - baik di rumah, di tempat kerja, atau saat bepergian.',
    privacy_description: 'Kebijakan Privasi\n\nPembaruan terakhir: [tanggal]\n\nKebijakan privasi ini menjelaskan bagaimana aplikasi "Ajmer Garib Nawaz" ("kami", "milik kami" atau "aplikasi") mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda. Dengan menggunakan aplikasi ini, Anda setuju dengan praktik yang dijelaskan dalam kebijakan ini.\n\n1. Informasi apa yang kami kumpulkan\n\nInformasi pribadi:\n• Data lokasi: Akses ke lokasi Anda saat ini untuk menghitung waktu salat dan arah kiblat. Data ini disimpan secara lokal di perangkat Anda dan tidak dikirim ke server kami.\n• Pengaturan notifikasi: Preferensi notifikasi salat Anda. Data ini disimpan secara lokal di perangkat Anda.\n\nInformasi non-pribadi:\n• Statistik penggunaan aplikasi: Fitur mana yang paling sering Anda gunakan. Data ini anonim dan digunakan untuk perbaikan.\n• Informasi perangkat: Sistem operasi dan versi aplikasi Anda. Data ini digunakan untuk melacak kinerja aplikasi.\n\n2. Bagaimana kami menggunakan informasi Anda\n\n• Untuk menghitung waktu salat dan arah kiblat dengan akurat.\n• Untuk mengirim notifikasi salat.\n• Untuk meningkatkan fungsionalitas aplikasi.\n• Untuk memberikan dukungan teknis.\n\n3. Berbagi dan pengungkapan informasi\n\nKami tidak menjual, menukar, atau membagikan informasi pribadi Anda dengan pihak ketiga. Kami hanya dapat membagikan informasi dalam kasus berikut:\n\n• Kewajiban hukum: Ketika diperlukan oleh hukum.\n• Keamanan: Untuk melindungi hak dan properti kami.\n\n4. Keamanan data\n\nKami menggunakan langkah-langkah keamanan standar industri untuk melindungi informasi Anda:\n\n• Enkripsi data: Data sensitif dienkripsi.\n• Penyimpanan lokal: Sebagian besar data disimpan secara lokal di perangkat Anda.\n• Audit keamanan rutin: Pemeriksaan rutin terhadap praktik keamanan kami.\n\n5. Izin dan hak Anda\n\nAkses lokasi: Aplikasi memerlukan lokasi Anda untuk memberikan waktu salat yang akurat dan arah kiblat. Anda dapat mencabut izin ini kapan saja di pengaturan perangkat Anda.\n\nIzin notifikasi: Untuk pengingat waktu salat. Anda dapat menonaktifkan notifikasi.\n\nHak Anda:\n• Akses ke informasi Anda: Anda dapat melihat informasi tersimpan Anda di pengaturan aplikasi.\n• Penghapusan data: Anda dapat menghapus semua data lokal dengan menghapus instalasi aplikasi.\n• Berhenti berlangganan: Anda dapat berhenti dari pengumpulan data apa pun dengan berhenti menggunakan aplikasi.\n\n6. Privasi anak-anak\n\nAplikasi ini tidak ditujukan untuk anak-anak di bawah 13 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak.\n\n7. Perubahan kebijakan\n\nKami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan penting melalui aplikasi.\n\n8. Hubungi kami\n\nUntuk pertanyaan tentang privasi, silakan hubungi kami:\nEmail: [email Anda]\n\nTerima kasih telah membaca kebijakan ini. Kepercayaan Anda penting bagi kami.',
  },
  tr: {
    ...english,
    common_back: '< Geri',
    tabs_home: 'Ana sayfa',
    tabs_prayer_time: 'Namaz vakti',
    tabs_quran: 'Kuran',
    tabs_info: 'Bilgi',
    info_title: 'Bilgi ve ayarlar',
    info_theme: 'Tema',
    info_language: 'Dil',
    info_choose_language: 'Dil seçin',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'Menü',
    home_daily_picks: 'Günün seçimleri',
    menu_name_of_allah: 'Allah’ın 99 ismi',
    menu_islamic_dua: 'İslami dua',
    menu_islamic_calendar: 'İslami takvim',
    menu_namaz_rakat: 'Namaz rekatı',
    menu_islamic_quotes: 'İslami sözler',
    menu_qibla_finder: 'Kıble bulucu',
    menu_hadish: 'Hadis',
    menu_tasbih_counter: 'Tesbih sayacı',
    menu_zakat_calculator: 'Zekat hesaplayıcı',
    menu_must_visit_place: 'Görülmesi gereken yer',
    menu_populer_hotels: 'Popüler oteller',
    menu_hajj_umrah_guide: 'Hac ve Umre rehberi',
    about_description: '🌙 Ajmer Garib Nawaz Hakkında\n\nAjmer Garib Nawaz, Müslümanların günlük yaşamlarında inançlarıyla olan bağlarını güçlendirmeye yardımcı olmak için özenle tasarlanmış kapsamlı bir İslam mobil uygulamasıdır. Uygulama, temel İslam araçlarını ve kaynaklarını tek bir uygun platformda bir araya getirerek, pratik yapmayı ve öğrenmeyi her zaman ve her yerde kolaylaştırır.\n\nKesin namaz vakitleri, Kuran okuma, İslam takvimi, zengin dua koleksiyonu ve çeşitli eğitim kaynakları gibi özelliklerle uygulama, kullanıcıların ruhani yolculuklarını özgünlük ve kolaylıkla desteklemeyi amaçlar.\n\nHoca Moinuddin Çişti\'nin öğretileri ve mirasından ilham alan Ajmer Garib Nawaz, barış, bilgi ve takvayı teşvik etmeye çalışır. Kullanıcıların inançlarıyla güvenle etkileşim kurabilmeleri için güvenilir ve doğrulanmış İslam içeriği sağlamaya kararlıyız.\n\nMisyonumuz, İslam bilgisini herkes için erişilebilir, basit ve anlamlı hale getirmektir - ister evde, ister iş yerinde, ister yolda olsun.',
    privacy_description: 'Gizlilik Politikası\n\nSon güncelleme: [tarih]\n\nBu gizlilik politikası, "Ajmer Garib Nawaz" uygulamasının ("biz", "bizim" veya "uygulama") kişisel bilgilerinizi nasıl topladığını, kullandığını ve koruduğunu açıklamaktadır. Bu uygulamayı kullanarak, bu politikada açıklanan uygulamaları kabul etmiş olursunuz.\n\n1. Hangi bilgileri topluyoruz\n\nKişisel bilgiler:\n• Konum verileri: Namaz vakitlerini ve kıble yönünü hesaplamak için mevcut konumunuza erişim. Bu veriler cihazınızda yerel olarak saklanır ve sunucularımıza gönderilmez.\n• Bildirim ayarları: Namaz bildirimi tercihleriniz. Bu veriler cihazınızda yerel olarak saklanır.\n\nKişisel olmayan bilgiler:\n• Uygulama kullanım istatistikleri: Hangi özellikleri en çok kullandığınız. Bu veriler anonimdir ve iyileştirmeler için kullanılır.\n• Cihaz bilgileri: İşletim sisteminiz ve uygulama sürümünüz. Bu veriler uygulama performansını izlemek için kullanılır.\n\n2. Bilgilerinizi nasıl kullanıyoruz\n\n• Namaz vakitlerini ve kıble yönünü doğru şekilde hesaplamak için.\n• Namaz bildirimleri göndermek için.\n• Uygulamanın işlevselliğini geliştirmek için.\n• Teknik destek sağlamak için.\n\n3. Bilgi paylaşımı ve ifşa\n\nKişisel bilgilerinizi üçüncü taraflarla satmaz, değişmez veya başka şekilde paylaşmayız. Bilgileri yalnızca aşağıdaki durumlarda paylaşabiliriz:\n\n• Yasal zorunluluk: Yasalarca gerekli olduğunda.\n• Güvenlik: Haklarımızı ve mülkümüzü korumak için.\n\n4. Veri güvenliği\n\nBilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz:\n\n• Veri şifreleme: Hassas veriler şifrelenir.\n• Yerel depolama: Verilerin çoğu cihazınızda yerel olarak saklanır.\n• Düzenli güvenlik denetimleri: Güvenlik uygulamalarımızın düzenli kontrolleri.\n\n5. İzinleriniz ve haklarınız\n\nKonum erişimi: Uygulamanın doğru namaz vakitleri ve kıble yönü sağlaması için konumunuz gerekir. Bu izni istediğiniz zaman cihaz ayarlarınızdan geri çekebilirsiniz.\n\nBildirim izinleri: Namaz vakti hatırlatıcıları için. Bildirimleri kapatabilirsiniz.\n\nHaklarınız:\n• Bilgilerinize erişim: Saklanan bilgilerinizi uygulama ayarlarından görüntüleyebilirsiniz.\n• Veri silme: Uygulamayı kaldırarak tüm yerel verileri silebilirsiniz.\n• Abonelikten çıkma: Uygulamayı kullanmayı bırakarak herhangi bir veri toplamadan çıkabilirsiniz.\n\n6. Çocukların gizliliği\n\nBu uygulama 13 yaşın altındaki çocuklar için değildir. Bilinçli olarak çocuklardan kişisel bilgi toplamıyoruz.\n\n7. Politika değişiklikleri\n\nBu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler hakkında sizi uygulama aracılığıyla bilgilendireceğiz.\n\n8. Bizimle iletişime geçin\n\nGizlilik ile ilgili sorular için lütfen bizimle iletişime geçin:\nE-posta: [e-posta adresiniz]\n\nBu politikayı okuduğunuz için teşekkür ederiz. Güveniniz bizim için önemlidir.',
  },
  de: {
    ...english,
    common_back: '< Zurück',
    tabs_home: 'Start',
    tabs_prayer_time: 'Gebetszeiten',
    tabs_quran: 'Koran',
    info_title: 'Info & Einstellungen',
    info_theme: 'Thema',
    info_language: 'Sprache',
    info_choose_language: 'Sprache wählen',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'Menü',
    home_daily_picks: 'Tagesauswahl',
    menu_name_of_allah: '99 Namen Allahs',
    menu_islamic_dua: 'Islamische Dua',
    menu_islamic_calendar: 'Islamischer Kalender',
    menu_islamic_quotes: 'Islamische Zitate',
    menu_qibla_finder: 'Qibla-Finder',
    menu_hadish: 'Hadith',
    menu_tasbih_counter: 'Tasbih-Zähler',
    menu_zakat_calculator: 'Zakat-Rechner',
    menu_must_visit_place: 'Sehenswerter Ort',
    menu_populer_hotels: 'Beliebte Hotels',
    menu_hajj_umrah_guide: 'Hajj- und Umrah-Leitfaden',
    about_description: '🌙 Über Ajmer Garib Nawaz\n\nAjmer Garib Nawaz ist eine umfassende islamische Mobile-App, die sorgfältig entwickelt wurde, um Muslimen zu helfen, ihre Verbindung zum Glauben im täglichen Leben zu stärken. Die App bringt wichtige islamische Tools und Ressourcen auf einer praktischen Plattform zusammen, wodurch Praxis und Lernen jederzeit und überall einfacher werden.\n\nMit Funktionen wie genauen Gebetszeiten, Koran-Lesung, islamischem Kalender, einer reichen Sammlung von Duas und verschiedenen Bildungsressourcen zielt die App darauf ab, die spirituelle Reise der Nutzer mit Authentizität und Leichtigkeit zu unterstützen.\n\nInspiriert von den Lehren und dem Erbe von Khwaja Moinuddin Chishti strebt Ajmer Garib Nawaz danach, Frieden, Wissen und Hingabe zu fördern. Wir verpflichten uns, zuverlässige und verifizierte islamische Inhalte bereitzustellen, damit Nutzer vertrauensvoll mit ihrem Glauben interagieren können.\n\nUnsere Mission ist es, islamisches Wissen für alle zugänglich, einfach und bedeutungsvoll zu machen - sei es zu Hause, bei der Arbeit oder unterwegs.',
    privacy_description: 'Datenschutzrichtlinie\n\nLetzte Aktualisierung: [Datum]\n\nDiese Datenschutzrichtlinie erklärt, wie die "Ajmer Garib Nawaz"-App ("wir", "unsere" oder "App") Ihre personenbezogenen Daten sammelt, verwendet und schützt. Durch die Nutzung dieser App stimmen Sie den in dieser Richtlinie beschriebenen Praktiken zu.\n\n1. Welche Informationen wir sammeln\n\nPersonenbezogene Informationen:\n• Standortdaten: Zugriff auf Ihren aktuellen Standort zur Berechnung der Gebetszeiten und Qibla-Richtung. Diese Daten werden lokal auf Ihrem Gerät gespeichert und nicht an unsere Server gesendet.\n• Benachrichtigungseinstellungen: Ihre Gebetsbenachrichtigungspräferenzen. Diese Daten werden lokal auf Ihrem Gerät gespeichert.\n\nNicht personenbezogene Informationen:\n• App-Nutzungsstatistiken: Welche Funktionen Sie am häufigsten verwenden. Diese Daten sind anonym und werden für Verbesserungen verwendet.\n• Geräteinformationen: Ihr Betriebssystem und Ihre App-Version. Diese Daten werden verwendet, um die App-Leistung zu verfolgen.\n\n2. Wie wir Ihre Informationen verwenden\n\n• Zur genauen Berechnung der Gebetszeiten und Qibla-Richtung.\n• Zum Senden von Gebetsbenachrichtigungen.\n• Zur Verbesserung der App-Funktionalität.\n• Zur Bereitstellung technischer Unterstützung.\n\n3. Teilen und Offenlegung von Informationen\n\nWir verkaufen, tauschen oder teilen Ihre personenbezogenen Daten nicht anderweitig mit Dritten. Wir können Informationen nur in folgenden Fällen teilen:\n\n• Gesetzliche Verpflichtung: Wenn gesetzlich erforderlich.\n• Sicherheit: Zum Schutz unserer Rechte und unseres Eigentums.\n\n4. Datensicherheit\n\nWir verwenden branchenübliche Sicherheitsmaßnahmen zum Schutz Ihrer Informationen:\n\n• Datenverschlüsselung: Sensible Daten werden verschlüsselt.\n• Lokale Speicherung: Die meisten Daten werden lokal auf Ihrem Gerät gespeichert.\n• Regelmäßige Sicherheitsaudits: Regelmäßige Überprüfungen unserer Sicherheitspraktiken.\n\n5. Ihre Berechtigungen und Rechte\n\nStandortzugriff: Die App benötigt Ihren Standort, um genaue Gebetszeiten und Qibla-Richtung bereitzustellen. Sie können diese Berechtigung jederzeit in Ihren Geräteeinstellungen widerrufen.\n\nBenachrichtigungsberechtigungen: Für Gebetszeiterinnerungen. Sie können Benachrichtigungen deaktivieren.\n\nIhre Rechte:\n• Zugriff auf Ihre Informationen: Sie können Ihre gespeicherten Informationen in den App-Einstellungen einsehen.\n• Datenlöschung: Sie können alle lokalen Daten löschen, indem Sie die App deinstallieren.\n• Abmeldung: Sie können sich von jeglicher Datensammlung abmelden, indem Sie die App nicht mehr verwenden.\n\n6. Datenschutz für Kinder\n\nDiese App ist nicht für Kinder unter 13 Jahren bestimmt. Wir sammeln nicht wissentlich personenbezogene Daten von Kindern.\n\n7. Änderungen der Richtlinie\n\nWir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über wichtige Änderungen über die App informieren.\n\n8. Kontaktieren Sie uns\n\nBei Fragen zum Datenschutz kontaktieren Sie uns bitte:\nE-Mail: [Ihre E-Mail]\n\nVielen Dank für das Lesen dieser Richtlinie. Ihr Vertrauen ist uns wichtig.',
  },
  ja: {
    ...english,
    common_back: '< 戻る',
    common_light: 'ライト',
    common_dark: 'ダーク',
    common_system: 'システム',
    tabs_home: 'ホーム',
    tabs_prayer_time: '礼拝時間',
    tabs_quran: 'クルアーン',
    tabs_info: '情報',
    info_title: '情報と設定',
    info_theme: 'テーマ',
    info_language: '言語',
    info_choose_language: '言語を選択',
    home_title: 'Ajmer Garib Nawaz',
    home_explore_menu: 'メニュー',
    home_daily_picks: '今日のおすすめ',
    menu_name_of_allah: 'アッラーの99の御名',
    menu_islamic_dua: 'イスラムのドゥアー',
    menu_islamic_calendar: 'イスラム暦',
    menu_namaz_rakat: 'ナマズのラカート',
    menu_islamic_quotes: 'イスラムの言葉',
    menu_qibla_finder: 'キブラ検索',
    menu_tasbih_counter: 'タスビーフカウンター',
    menu_zakat_calculator: 'ザカート計算機',
    menu_must_visit_place: '必見の場所',
    menu_populer_hotels: '人気ホテル',
    menu_hajj_umrah_guide: 'ハッジとウムラのガイド',
    about_description: '🌙 Ajmer Garib Nawazについて\n\nAjmer Garib Nawazは、ムスリムが日常生活で信仰とのつながりを強化するのを助けるために慎重に設計された包括的なイスラムモバイルアプリケーションです。このアプリは、便利なプラットフォームで重要なイスラムツールとリソースをまとめ、いつでもどこでも実践と学習を容易にします。\n\n正確な礼拝時間、クルアーン朗読、イスラム暦、豊富なドゥアーコレクション、さまざまな教育リソースなどの機能により、このアプリはユーザーの霊的旅を真正性と容易さでサポートすることを目指しています。\n\nKhawaja Moinuddin Chishtiの教えと遺産に触発されたAjmer Garib Nawazは、平和、知識、献身を促進するよう努めています。私たちは、ユーザーが自信を持って信仰と関わることを可能にする信頼性が高く検証されたイスラムコンテンツを提供することにコミットしています。\n\n私たちの使命は、イスラム知識をすべての人にとってアクセスしやすく、シンプルで意味のあるものにすることです - 家でも、職場でも、外出先でも。',
    privacy_description: 'プライバシーポリシー\n\n最終更新日: [日付]\n\nこのプライバシーポリシーは、「Ajmer Garib Nawaz」アプリ（「私たち」、「私たちの」または「アプリ」）があなたの個人情報をどのように収集、使用、保護するかを説明しています。このアプリを使用することにより、このポリシーに記載された慣行に同意したことになります。\n\n1. 収集する情報\n\n個人情報:\n• 位置情報: 礼拝時間とキブラ方向の計算のために現在の位置へのアクセス。このデータはデバイスにローカルで保存され、私たちのサーバーに送信されません。\n• 通知設定: あなたの礼拝通知の好み。このデータはデバイスにローカルで保存されます。\n\n非個人情報:\n• アプリ使用統計: どの機能を最も頻繁に使用するか。このデータは匿名で、改善のために使用されます。\n• デバイス情報: あなたのオペレーティングシステムとアプリバージョン。このデータはアプリのパフォーマンスを追跡するために使用されます。\n\n2. 情報の使用方法\n\n• 礼拝時間とキブラ方向を正確に計算するため。\n• 礼拝通知を送信するため。\n• アプリの機能を改善するため。\n• 技術サポートを提供するため。\n\n3. 情報の共有と開示\n\n私たちはあなたの個人情報を第三者と販売、交換、またはその他の方法で共有しません。以下のケースでのみ情報を共有する場合があります:\n\n• 法的義務: 法律で要求される場合。\n• セキュリティ: 私たちの権利と財産を保護するため。\n\n4. データセキュリティ\n\n私たちはあなたの情報を保護するために業界標準のセキュリティ対策を使用しています:\n\n• データ暗号化: 機密データは暗号化されます。\n• ローカルストレージ: ほとんどのデータはデバイスにローカルで保存されます。\n• 定期的なセキュリティ監査: 私たちのセキュリティ慣行の定期的なチェック。\n\n5. あなたの許可と権利\n\n位置情報アクセス: 正確な礼拝時間とキブラ方向を提供するためにアプリはあなたの位置情報を必要とします。この許可はいつでもデバイスの設定で取り消すことができます。\n\n通知許可: 礼拝時間のリマインダーのため。通知を無効にすることができます。\n\nあなたの権利:\n• あなたの情報へのアクセス: アプリ設定で保存された情報を表示できます。\n• データ削除: アプリをアンインストールすることですべてのローカルデータを削除できます。\n• オプトアウト: アプリの使用を停止することであらゆるデータ収集からオプトアウトできます。\n\n6. 子供のプライバシー\n\nこのアプリは13歳未満の子供を対象としていません。私たちは意図的に子供から個人情報を収集しません。\n\n7. ポリシーの変更\n\n私たちはこのプライバシーポリシーを随時更新する場合があります。重要な変更についてはアプリを通じて通知します。\n\n8. お問い合わせ\n\nプライバシーに関する質問については、お問い合わせください:\nメール: [あなたのメール]\n\nこのポリシーをお読みいただきありがとうございます。あなたの信頼は私たちにとって重要です。',
  },
};

type LocalizationContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key] ?? english[key],
    }),
    [language],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error('useLocalization must be used inside LocalizationProvider');
  }

  return context;
}
