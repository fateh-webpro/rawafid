# موقع روافد سبأ المحدودة — دليل التسليم والنشر

موقع إلكتروني احترافي ثنائي اللغة (عربي/إنجليزي) لشركة **روافد سبأ المحدودة** لتأجير المعدات الثقيلة في الرياض، مع **لوحة تحكم كاملة** لإدارة المحتوى دون برمجة.

---

## 🧱 التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| الإطار | **Next.js 15** (App Router) + **React 19** |
| اللغة | **TypeScript** |
| التنسيق | **Tailwind CSS v4** |
| قاعدة البيانات | **Prisma ORM** — SQLite (تطوير) → **PostgreSQL** (إنتاج) |
| الثنائية اللغوية | **next-intl** (عربي RTL افتراضي + إنجليزي) |
| الحركة | **Framer Motion** |
| النماذج | **React Hook Form + Zod** |
| المصادقة | جلسات JWT (httpOnly) + bcrypt — مبنية داخليًا في `src/lib/auth.ts` |
| البريد | **nodemailer** (SMTP) |

---

## 📁 بنية المشروع

```
rawafid-saba/
├── src/app/
│   ├── [locale]/          صفحات الموقع العامة (عربي/إنجليزي)
│   ├── admin/             لوحة التحكم (محمية)
│   ├── api/               واجهات: /api/quote (الطلبات) و /api/upload (الرفع)
│   ├── robots.ts          robots.txt (تلقائي)
│   └── sitemap.ts         sitemap.xml (تلقائي وديناميكي)
├── src/components/        المكوّنات (هيدر، بطاقات، نماذج، أيقونات…)
├── src/lib/               المنطق: db, auth, settings, seo, email…
├── messages/              كل نصوص الموقع (ar.json / en.json)
├── prisma/schema.prisma   مخطط قاعدة البيانات + seed.mjs (بيانات أولية)
└── public/                الصور والملفات الثابتة
```

---

## 🚀 التشغيل محليًا (للتطوير)

```bash
npm install
npx prisma db push        # ينشئ قاعدة البيانات
node prisma/seed.mjs      # يزرع الفئات والمعدات ومستخدم المدير
npm run dev               # http://localhost:3000
```

**دخول لوحة التحكم** (`/admin`):
- البريد: `admin@rawafidsaba.com`
- المرور: `Rawafid@2018`  ← **يجب تغييرها فورًا من `/admin/account`**

---

## 🌐 خطوات النشر (6 مهام للمطور)

### 1) تحويل قاعدة البيانات إلى PostgreSQL
في `prisma/schema.prisma` غيّر مزوّد قاعدة البيانات:
```prisma
datasource db {
  provider = "postgresql"   // كان: sqlite
  url      = env("DATABASE_URL")
}
```
ثم في `.env` ضع رابط PostgreSQL (Neon / Supabase / VPS)، ونفّذ:
```bash
npx prisma db push
node prisma/seed.mjs
```
> المخطط متوافق تمامًا — لا حاجة لتعديل أي كود آخر.

### 2) تخزين الصور والملفات سحابيًا
الرفع الحالي (`src/app/api/upload/route.ts`) يحفظ في `public/uploads` — يصلح للتطوير فقط.
على استضافة serverless (Vercel) الملفات لا تدوم، لذا استبدل منطق الحفظ بتخزين كائنات:
**Vercel Blob** أو **AWS S3** أو **Cloudinary**. (نقطة التعديل الوحيدة هي دالة `POST` في ذلك الملف.)

### 3) إعداد البريد (SMTP) لإشعارات الطلبات
في `.env` املأ بيانات بريد الشركة (مثل بريد هوستنجر):
```
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_USER="info@yourdomain.com"
SMTP_PASS="********"
SMTP_FROM="info@yourdomain.com"
```
ثم من لوحة التحكم ← **الإعدادات** ← «بريد استقبال الطلبات» ضع البريد الذي تصله الإشعارات.
> بدون هذا، الطلبات تبقى محفوظة في اللوحة (لا تضيع)، لكن لا يُرسَل إشعار بريدي.

### 4) ضبط رابط الموقع النهائي
في `.env`:
```
NEXT_PUBLIC_SITE_URL="https://النطاق-النهائي.com"
```
> يُحدّث تلقائيًا: canonical، hreflang، sitemap، Open Graph.

### 5) تغيير كلمة مرور المدير
من `/admin/account` بعد أول دخول.

### 6) بعد النشر — الفهرسة
- أضِف الموقع إلى **Google Search Console**.
- أرسل `https://النطاق/sitemap.xml`.
- (اختياري) اربط Google Analytics / Meta Pixel للحملات الإعلانية.

---

## 🔑 متغيّرات البيئة (`.env`) — ملخّص

```
DATABASE_URL="..."                 # رابط PostgreSQL
AUTH_SECRET="..."                  # سلسلة عشوائية طويلة (لتوقيع الجلسات)
NEXT_PUBLIC_SITE_URL="https://..." # النطاق النهائي
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM   # البريد
```
> `.env` غير مرفوع في Git (يحوي أسرارًا) — أنشئه على الاستضافة يدويًا.
> ولّد `AUTH_SECRET` بأمر: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 🖥️ خيارات الاستضافة الموصى بها

| الخيار | الوصف | الملاحظات |
|---|---|---|
| **Vercel + Neon** (موصى به) | نشر تلقائي + PostgreSQL مُدار | مجاني لهذا الحجم؛ يتطلب تخزين صور سحابي (Vercel Blob) |
| **Hostinger VPS** | كل شيء على خادم واحد بـ Docker | تحكّم كامل؛ صيانة أكثر؛ الرفع المحلي يعمل كما هو |

الأمر الأساسي للبناء والتشغيل في الإنتاج:
```bash
npm install
npx prisma generate
npm run build
npm run start
```

---

## 🎛️ ما يديره صاحب الموقع من اللوحة (بلا برمجة)

الطلبات · الفئات · المعدات (مع مواصفات) · المشاريع · المدونة · **نصوص كل الصفحات** (ar/en) · **الإعدادات** (التواصل، الأرقام، صورة الهيدر، روابط التواصل الاجتماعي، رابط نشاط الألمنيوم) · المستخدمون.

**التصميم العميق** (الألوان، الخطوط، التخطيط، الحركة) يُعدَّل من الكود فقط — الألوان والخطوط معرّفة مركزيًا في `src/app/globals.css`.

---

## ⚠️ ملاحظات مهمة

- **لا تُشغّل `npm run build` وخادم التطوير (`npm run dev`) معًا** — يتقاسمان مجلد `.next` ويتعارضان. أوقف أحدهما أولًا.
- الهوية البصرية (الألوان/الخطوط/الشعار) مستخرجة من دليل هوية الشركة الرسمي — أي تعديل يجب أن يوافق الدليل.
- صور المعدات الحالية من أسطول الشركة الفعلي، عدا **تاور لايت** وبعض الصور التي قد تُستبدل لاحقًا من اللوحة.
