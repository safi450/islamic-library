#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إنشاء ملف PDF تجريبي للاختبار
"""

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.units import cm
    import os
    
    # إنشاء مجلد books إذا لم يكن موجوداً
    if not os.path.exists('books'):
        os.makedirs('books')
    
    # إنشاء ملف PDF
    pdf_file = "books/tafsir-ibn-kathir.pdf"
    c = canvas.Canvas(pdf_file, pagesize=A4)
    width, height = A4
    
    # إضافة صفحات تجريبية
    for page_num in range(1, 11):
        # عنوان الصفحة
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(width/2, height - 3*cm, f"Islamic Library - Test Book")
        
        c.setFont("Helvetica", 18)
        c.drawCentredString(width/2, height - 5*cm, f"Tafsir Ibn Kathir")
        
        # رقم الصفحة
        c.setFont("Helvetica-Bold", 48)
        c.drawCentredString(width/2, height/2, f"Page {page_num}")
        
        # نص تجريبي
        c.setFont("Helvetica", 12)
        text_lines = [
            "This is a sample PDF file for testing the PDF reader.",
            "The Islamic Library PDF Reader supports:",
            "- Page navigation (Previous/Next)",
            "- Zoom in/out",
            "- Dark mode",
            "- Fullscreen mode",
            "- Download functionality",
            "- Keyboard shortcuts",
            "- Last page memory",
            "",
            "Keyboard Shortcuts:",
            "- Arrow Left/Right: Navigate pages",
            "- +/- : Zoom in/out",
            "- ESC: Close reader",
        ]
        
        y_position = height/2 - 3*cm
        for line in text_lines:
            c.drawString(3*cm, y_position, line)
            y_position -= 0.6*cm
        
        # تذييل الصفحة
        c.setFont("Helvetica-Oblique", 10)
        c.drawCentredString(width/2, 2*cm, f"Islamic Library - Free & Ad-Free")
        c.drawCentredString(width/2, 1.5*cm, f"Sadaqah Jariyah - May Allah reward you")
        
        c.showPage()
    
    # حفظ الملف
    c.save()
    print(f"✅ تم إنشاء ملف PDF تجريبي: {pdf_file}")
    print(f"📄 عدد الصفحات: 10")
    print(f"📁 الموقع: {os.path.abspath(pdf_file)}")
    
except ImportError:
    print("❌ مكتبة reportlab غير مثبتة!")
    print("📦 لتثبيتها، استخدم الأمر:")
    print("   pip install reportlab")
    print("")
    print("💡 بدلاً من ذلك، يمكنك:")
    print("   1. تحميل أي ملف PDF")
    print("   2. وضعه في مجلد books/")
    print("   3. تسميته: tafsir-ibn-kathir.pdf")
except Exception as e:
    print(f"❌ حدث خطأ: {e}")