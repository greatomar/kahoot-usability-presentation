# Usability Testing of Kahoot Android Application

عرض تقديمي أكاديمي لاختبار قابلية استخدام تطبيق **Kahoot على Android**، بمقارنة بين **طلاب الجامعة** و**طلاب الثانوية** — بهوية Hybrid (Kahoot × Editorial)، ونسختين متزامنتين من مصدر بيانات واحد.

**حالة الدراسة:** لم تُنفذ الاختبارات بعد. جميع مناطق النتائج في حالات فراغ مصممة (Empty States) — لا توجد أي أرقام أو اقتباسات أو أسماء افتراضية. عند إدخال البيانات الحقيقية وإعادة البناء تُملأ النتائج تلقائياً.

---

## التشغيل السريع

| النسخة | الملف | التشغيل |
|---|---|---|
| HTML (الأساسية) | `kahoot-usability-presentation.html` | افتحه مباشرة في أي متصفح — ملف واحد مستقل يعمل **دون إنترنت** (الخطوط والأصول مضمنة) |
| PowerPoint | `kahoot-usability-presentation.pptx` | افتحه في PowerPoint أو LibreOffice — كل النصوص والأشكال والجداول عناصر أصلية قابلة للتحرير |

**التنقل في HTML:** الأسهم ← → (اليسار = التالي في اتجاه RTL) · مسافة (Shift+مسافة للرجوع) · Home / End · النقر على نصفي الشاشة · السحب باللمس · رابط مباشر لأي شريحة عبر `#رقم` (مثال `…html#6`).

## الشرائح العشر

1. الغلاف — حقول فارغة للفريق والمقرر والدكتور والتاريخ
2. About Kahoot — تعريف التطبيق + مكان للقطة Android حقيقية
3. Participants — الفئتان + أماكن صور بموافقة المشاركين
4. Methodology — الخطوات السبع + آلية الوقت والمهلة (5–10 ثوانٍ)
5. Testing Tasks — المهام الخمس + الوقت المعياري (فارغ)
6. Task Completion — هيكل تحليل الإكمال (Empty State)
7. Time Analysis — المعياري مقابل الفعلي + الزمن الكلي
8. Error Analysis — Error / Assistance / Hesitation
9. SUS & Feedback — المقياس وطريقة الحساب + أماكن الاقتباسات
10. Problems & Conclusion — أقسام جاهزة للتعبئة بعد الدراسة

## بنية المشروع

```text
├── kahoot-usability-presentation.html   # الناتج: HTML مستقل (مبني — لا تعدّله يدوياً)
├── kahoot-usability-presentation.pptx   # الناتج: PPTX قابل للتحرير
├── data/                                # ★ مصدر الحقيقة الوحيد — أدخل بياناتك هنا
│   ├── participants.json  ├── tasks.json  ├── observations.json
│   ├── sus-responses.json └── feedback.json
├── src/
│   ├── design/tokens.mjs        # الألوان والخطوط والمقاسات (مشترك بين النسختين)
│   ├── content/slides-html.mjs  # محتوى وتخطيط شرائح HTML
│   ├── styles/presentation.css  # أنماط HTML
│   ├── scripts/presentation.js  # التنقل والتفاعل
│   ├── template.html            # قالب الصفحة
│   └── data/metrics.json        # مخرجات طبقة الحساب (تتولد تلقائياً)
├── scripts/
│   ├── compute-metrics.mjs      # طبقة معالجة البيانات وحساب المؤشرات + SUS
│   ├── build-html.mjs           # بناء HTML (تضمين الخطوط base64)
│   ├── build-pptx.mjs           # بناء PPTX (PptxGenJS + عناصر أصلية)
│   ├── qa-html.mjs              # فحص HTML في متصفح حقيقي
│   └── *.py                     # أدوات OpenAI slides skill: عرض/فحص الشرائح
├── pptx/pptxgenjs_helpers/      # مكتبات مساعدة من OpenAI slides skill
├── assets/fonts/                # Thmanyah Sans + IBM Plex Sans Arabic + Inter (محلية)
├── previews/                    # صور الشرائح العشر (html/ وpptx/) + Montage
└── .tools/ + .venv/             # LibreOffice محمول + بيئة Python معزولة (للبناء فقط)
```

## إعادة البناء بعد إدخال البيانات

```bash
pnpm install          # مرة واحدة (pptxgenjs + playwright-core للفحص)
pnpm build            # = compute-metrics + build:html + build:pptx
```

ثم راجع `DATA-ENTRY.md` لصيغة كل ملف بيانات. تفاصيل بيئة العرض والفحص في `QA-REPORT.md`.

## ما يحتاج تعبئة يدوية

- الغلاف: أسماء الفريق (Group A/B)، اسم المقرر، اسم الدكتور، تاريخ العرض.
- شريحة 2: لقطة شاشة حقيقية من Kahoot Android (مكان محدد داخل إطار الهاتف).
- شريحة 3: صور المشاركين بعد موافقتهم + الأعداد (تتحسب تلقائياً من `participants.json`).
- `tasks.json`: الوقت المعياري لكل مهمة بعد التجربة الداخلية للفريق.
- بقية النتائج: تُملأ تلقائياً من ملفات `data/` — المشكلات والتوصيات والاستنتاج تُحرر نصياً في شريحة 10 بعد الدراسة.

## الأدوات والمكتبات

| الغرض | الأداة |
|---|---|
| بناء PPTX | PptxGenJS 4 + OpenAI **slides skill** (helpers + render/validation scripts) |
| بناء HTML | Node.js (ESM) — توليد ملف مستقل بلا أي اعتماد خارجي وقت العرض |
| الخطوط | Thmanyah Sans (عناوين عربية) · IBM Plex Sans Arabic (نصوص) · Inter (إنجليزي/أرقام) |
| عرض PPTX وفحصه | LibreOffice 26.8 محمول داخل `.tools` + Poppler + سكربتات المهارة (overflow/fonts) |
| فحص HTML | playwright-core + Chromium محلي (Helium) — تنقل/خطوط/أخطاء/عمل دون إنترنت |
| Python (للبناء فقط) | بيئة `.venv` معزولة: Pillow · pdf2image · python-pptx · numpy |

**ملاحظة الخطوط في PPTX:** لضمان ظهور التصميم كما هو على جهاز العرض، ثبّت الخطوط من `assets/fonts` (ملفات OTF/TTF) على الجهاز، وإلا استبدلها PowerPoint بخطوط نظام بديلة مع بقاء المحتوى قابلاً للتحرير.
