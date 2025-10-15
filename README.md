# 📚 المكتبة الإسلامية

<div align="center">

![Islamic Library](https://img.shields.io/badge/المكتبة-الإسلامية-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**مكتبة إسلامية شاملة لقراءة وتحميل الكتب الإسلامية مجاناً وبدون إعلانات**

[🌐 زيارة الموقع](https://safi450.github.io/islamic-library/) | [📖 الدليل](#-المميزات) | [🤝 المساهمة](#-المساهمة)

</div>

---

## ✨ المميزات

- 📖 **قراءة مباشرة** - اقرأ الكتب مباشرة في المتصفح
- 📥 **تحميل مجاني** - حمّل الكتب بصيغة PDF
- 🔍 **بحث متقدم** - ابحث عن الكتب حسب العنوان، المؤلف، أو الموضوع
- 🏷️ **تصنيفات متعددة** - القرآن، الحديث، الفقه، العقيدة، والمزيد
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة
- 🌙 **واجهة عربية** - تصميم جميل يدعم اللغة العربية بالكامل
- 🚫 **بدون إعلانات** - تجربة قراءة نقية بدون إزعاج
- ⚡ **سريع وخفيف** - تحميل سريع وأداء ممتاز

## 🎯 التصنيفات المتوفرة

- 📗 القرآن الكريم وعلومه
- 📘 الحديث النبوي وعلومه
- 📙 الفقه الإسلامي
- 📕 العقيدة والتوحيد
- 📓 السيرة النبوية
- 📔 التاريخ الإسلامي
- 📖 الأدب والأخلاق

## 🚀 البدء السريع

### المتطلبات

- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- لا يتطلب أي تثبيت أو إعدادات خاصة

### التشغيل المحلي

1. **استنساخ المشروع:**
   ```bash
   git clone https://github.com/safi450/islamic-library.git
   ```

2. **افتح المشروع:**
   ```bash
   cd islamic-library
   ```

3. **افتح الملف الرئيسي:**
   - افتح `index.html` في المتصفح
   - أو استخدم Live Server في VS Code

## 📂 هيكل المشروع

```
islamic-library/
├── index.html              # الصفحة الرئيسية
├── admin.html             # لوحة الإدارة
├── help.html              # صفحة المساعدة
├── css/
│   └── style.css          # ملفات التنسيق
├── js/
│   ├── script.js          # السكريبت الرئيسي
│   ├── books-data.js      # بيانات الكتب
│   └── pdf-reader.js      # قارئ PDF
├── books/                 # مجلد الكتب (PDF)
├── images/                # الصور والأيقونات
│   └── covers/           # أغلفة الكتب
└── README.md             # هذا الملف
```

## 🛠️ التقنيات المستخدمة

- **HTML5** - هيكل الصفحات
- **CSS3** - التنسيق والتصميم
- **JavaScript (Vanilla)** - البرمجة والتفاعل
- **Font Awesome** - الأيقونات
- **Google Fonts (Cairo)** - الخطوط العربية
- **PDF.js** - عرض ملفات PDF

## 📖 كيفية إضافة كتاب جديد

1. **أضف ملف PDF:**
   - ضع ملف PDF في مجلد `books/`

2. **أضف صورة الغلاف:**
   - ضع صورة الغلاف في `images/covers/`

3. **حدّث بيانات الكتب:**
   - افتح `js/books-data.js`
   - أضف بيانات الكتاب الجديد:

   ```javascript
   {
       id: 10,
       title: "اسم الكتاب",
       author: "اسم المؤلف",
       category: "quran",
       categoryName: "القرآن وعلومه",
       pages: 500,
       rating: 4.8,
       downloads: 1000,
       description: "وصف الكتاب...",
       cover: "images/covers/book-cover.jpg",
       pdfFile: "books/book-name.pdf",
       publishYear: "2024",
       publisher: "دار النشر"
   }
   ```

## 🤝 المساهمة

نرحب بمساهماتكم! إذا كنت تريد المساهمة:

1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📧 التواصل

- **الموقع:** [https://safi450.github.io/islamic-library](https://safi450.github.io/islamic-library)
- **البريد الإلكتروني:** safifofh@gmail.com
- **GitHub:** [@safi450](https://github.com/safi450)

## 🌟 الدعم

إذا أعجبك المشروع، لا تنسَ إعطائه ⭐ على GitHub!

---

<div align="center">

**صُنع بـ ❤️ لخدمة الإسلام والمسلمين**

</div>