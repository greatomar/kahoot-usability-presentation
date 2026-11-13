# Usability Testing of Kahoot Android Application

عرض تقديمي أكاديمي لاختبار قابلية استخدام تطبيق **Kahoot على Android**، بمقارنة بين **طلاب الثانوية** و**طلاب المتوسط** — بهوية Hybrid (Kahoot × Editorial)، ونسختين متزامنتين من مصدر بيانات واحد.

**حالة الدراسة:** نُفذت مع **20 مشاركاً** (13 ثانوية · 7 متوسط) و**100 محاولة** و**20 استجابة SUS**. نتائج HTML وPPTX مبنية من بيانات `data/` الفعلية.

---

## التشغيل السريع

| النسخة | الملف | التشغيل |
|---|---|---|
| HTML (الأساسية) | `kahoot-usability-presentation.html` | افتحه مباشرة في أي متصفح — ملف واحد مستقل يعمل **دون إنترنت** (الخطوط والأصول مضمنة) |
| PowerPoint | `kahoot-usability-presentation.pptx` | افتحه في PowerPoint أو LibreOffice — كل النصوص والأشكال والجداول عناصر أصلية قابلة للتحرير |

**التنقل في HTML:** الأسهم ← → (اليسار = التالي في اتجاه RTL) · مسافة (Shift+مسافة للرجوع) · Home / End · النقر على نصفي الشاشة · السحب باللمس · رابط مباشر لأي شريحة عبر `#رقم` (مثال `…html#6`).

## الشرائح الاثنتا عشرة

1. الغلاف — عنوان عربي + شعار Kahoot
2. Inside the App — أربع لقطات حقيقية من تطبيق Android
3. About the App — تعريف التطبيق + الشعار داخل العنوان
4. Participants — طلاب الثانوية وطلاب المتوسط (13 · 7)
5. Methodology — الخطوات السبع + آلية الوقت والمهلة (5–10 ثوانٍ)
6. Testing Tasks — المهام الخمس + السيناريو والخطوات وما نقيسه
7. Results — High School — جدول نتائج الثانوية (الزمن · الإكمال · الأخطاء · SUS)
8. Results — Middle School — جدول نتائج المتوسط
9. Analysis — لوحة موحدة للإكمال والأوقات والأخطاء
10. SUS & Feedback — نتائج SUS الفعلية (76.5 عام)
11. Problems & Conclusion — مشكلات وتوصيات واستنتاج من البيانات
12. Team — أسماء أعضاء الفريق

## النسخة النهائية والمقارنة

| الملف | الوصف |
|---|---|
| `final/kahoot-usability-presentation-final.html` | النسخة النهائية من HTML (مرجع التصميم) |
| `final/kahoot-usability-presentation-final.pptx` | النسخة النهائية من PPTX بعد المراجعة في DeckCraft |
| `comparison/comparison-montage.png` | لوحة مقارنة HTML مقابل PPTX لكل الشرائح |
| `comparison/side-by-side/` | صورة مقارنة لكل شريحة (HTML يسار · PPTX يمين) |
| `comparison/README.md` | تقرير الفروقات والإصلاحات |

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
├── assets/logos/                # شعار Kahoot (SVG للـHTML + PNG للـPPTX بألوان الهوية)
├── assets/screenshots/          # لقطات التطبيق (أصلية + نسخ web مضمّنة في HTML)
├── previews/                    # صور شرائح HTML وPPTX + Montage
└── .tools/ + .venv/             # LibreOffice محمول + بيئة Python معزولة (للبناء فقط)
```

## إعادة البناء

```bash
pnpm install          # مرة واحدة (pptxgenjs + playwright-core للفحص)
pnpm build            # = compute-metrics + build:html + build:pptx
```

ثم راجع `DATA-ENTRY.md` لصيغة كل ملف بيانات. تفاصيل بيئة العرض والفحص في `QA-REPORT.md`.

## ما يحتاج تعبئة يدوية

- `tasks.json`: الوقت المعياري لكل مهمة (لم يُسجل بعد؛ يظهر `—` في شريحة الأوقات).
- اقتباسات المشاركين النصية واقتراحات التحسين (لم تُسجل في أداة التتبع).
- مراجعة نصوص المشكلات والتوصيات في الشريحة 11 والتأكد من مطابقتها لتفسير الفريق.

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
