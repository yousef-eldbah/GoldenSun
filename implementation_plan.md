# مخطط تنفيذ منصة التصدير الرقمية "Sun Golden" 🌍🍊 (النسخة المعتمدة)

منصة رقمية متكاملة لشركة التصدير الحاصلة على ثقة المستوردين حول العالم (**Sun Golden**)، تعتمد على أحدث تقنيات الويب (**Next.js 15 App Router**, **Supabase**, **Tailwind CSS**, **next-intl**)، وتهدف لبناء الثقة، عرض المنتجات (فواكه وخضروات طازجة ومجمدة)، استقبال طلبات الأسعار (RFQ)، وتقديم أدوات تفاعلية احترافية للمستوردين (حاسبة الحاويات، تقويم المواسم، دليل التعبئة، خريطة التصدير).

---

## 🎯 القرارات الفنية والحلول المعتمدة (Architectural Decisions)

### 1️⃣ التوافق القانوني الأوروبي (GDPR Compliance):
- **مربع اختيار الموافقة الصريحة (Consent Checkbox)**: يوضع في فورم الـ RFQ خيار إجباري غير مفعل تلقائياً: *"أوافق على استخدام بياناتي للتواصل معي بخصوص طلبي وفقاً لسياسة الخصوصية"* (`I agree to the processing of my personal data for the purpose of contacting me regarding my inquiry`).
- **صفحة سياسة الخصوصية (`/privacy-policy`)**: صفحة قانونية مخصصة برابط فوتوت ثابت باللغات الثلاث (`en`, `de`, `es`).

### 2️⃣ المعالجة التلقائية وضغط الصور (Automatic Image Pipeline):
- الموظف يرفع الصور من أي جهاز وبأي حجم (حتى لو 10 ميجابايت).
- السيرفر/الـ Frontend يقوم تلقائياً بضغط وتحويل الصورة إلى صيغة **WebP** بحجم مثالي (بين 100KB إلى 300KB كحد أقصى) وبأبعاد متناسبة قبل تخزينها في **Supabase Storage**.
- يتم تحسين الأداء بالكامل بدون أي مجهود من الموظف لضمان سرعة فائقة وتفوق في تقييمات **Google PageSpeed**.

### 3️⃣ هندسة قاعدة البيانات المنظمة (Relational Translation & Media Architecture):
- **جداول الترجمة المنفصلة (Normalization)**: استخدام جداول `product_translations`, `category_translations`, `article_translations` لربط النصوص المترجمة برمز اللغة (`locale`: `en`, `de`, `es`) لضمان سرعة الاستعلامات والـ Indexing السريع في PostgreSQL.
- **جدول الصور المستقل (`product_images`)**: جدول خاص يربط الصور بالمنتج مع تحديد صورة الغلاف (`is_cover`) وترتيب العرض (`display_order`).
- **حاسبة الحاويات المحركة بقاعدة البيانات (`container_rules`)**: تخزين أوزان الكراتين، أبعادها، وسعة الحاوية الـ Reefer 40ft/20ft في جدول بالـ Database، ليتمكن الأدمن من تعديل قواعد الحسابات مستقبلاً دون الحاجة لتعديل الكود.
- **وحدة الإعدادات الموحدة (`site_settings`)**: جدول مخصص لجميع بيانات الشركة (الهواتف، الواتساب، الإيميل، شبكات التواصل، معرفات Google Analytics و Microsoft Clarity).

### 4️⃣ الأمان والصلاحيات (Security & RBAC):
- **الحد من الطلبات الزائدة (Rate Limiting)**: حماية فورومات الـ RFQ والتواصل من الإغراق والتخمين.
- **الحماية من البوتات (reCAPTCHA / Turnstile)**: حماية الفورم من السبام.
- **سياسات الأمان على مستوى الصفوف (Supabase Row Level Security - RLS)**: حظر الوصول المباشر لجداول الطلبات والإعدادات لغير الأدمن.
- **إدارة الصلاحيات (Role-Based Access Control)**: فصل صلاحيات الموظف (إضافة وتعديل المنتجات والمقالات) عن صلاحيات الأدمن الرئيسي (تعديل إعدادات الموقع، حذف المستخدمين، إدارة المفاتيح).

### 5️⃣ القرارات الحاسمة (الاستبعاد والتأجيل):
- **مؤجلة للمرحلة الثانية**: Full Text Search المتقدم، Dashboard التحليلات المخصص، مكتبة وسائط معقدة كـ WordPress، ونظام المدونات المتقدم للغاية.
- **مرفوضة نهائياً**: Page Builder معقد (الصفحات الثابتة تُبنى كودياً بشكل جميل وتُترك حقول النص الأساسية للأدمن)، وفصل حاسبة الحاويات عن صفحة المنتج (ستكون متاحة كصفحة مستقلة للـ SEO + ويدجت مدمج داخل صفحة التفاصيل).

---

## 🏗️ الهيكلية التقنية (Architecture & Tech Stack)

* **الواجهة الأمامية (Frontend)**: Next.js 15 (App Router with Server Components & ISR/SSR), TypeScript, Tailwind CSS v4, Lucide Icons.
* **إدارة اللغات و SEO**: `next-intl` لدعم `/en`, `/de`, `/es` مع محركات SEO مخصصة لكل لغة (`hreflang`, Localized OpenGraph, Dynamic Canonical URLs, Localized JSON-LD Schemas).
* **قاعدة البيانات والباك إند (Backend)**: Supabase PostgreSQL + Supabase Auth + Supabase Storage + RLS Policies.
* **النماذج والتحقق (Forms & Validation)**: React Hook Form + Zod Schema validation.
* **إرسال الإشعارات والبريد**: Next.js API Route / Server Actions + Resend API (لإرسال إيميل فوري للشركة وإيميل تأكيد للمستورد عند إرسال RFQ).
* **إدارة الحالة (State Management)**: Zustand / React Context لسلة الـ RFQ وأدوات المقارنة وحاسبة الحاويات.

---

## 🗄️ تصميم قاعدة البيانات المحدث (Supabase Schema Plan)

```sql
-- 1. Categories & Translations
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL, -- 'en', 'de', 'es'
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(category_id, locale)
);

-- 2. Products & Translations
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  hs_code TEXT,
  storage_temp TEXT,
  brix_level TEXT,
  pdf_catalog_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  seasonality JSONB, -- { "jan": true, "feb": true, ... }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  origin TEXT,
  shelf_life TEXT,
  sizes TEXT[],
  UNIQUE(product_id, locale)
);

-- 3. Product Images (Dedicated Table)
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  is_cover BOOLEAN DEFAULT false
);

-- 4. Container Rules (Dynamic DB Rules)
CREATE TABLE container_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  package_type TEXT NOT NULL, -- 'Telescope Carton 15kg', 'Open Top 10kg'
  net_weight_kg NUMERIC NOT NULL,
  gross_weight_kg NUMERIC NOT NULL,
  cartons_per_pallet INT NOT NULL,
  pallets_per_40ft_reefer INT DEFAULT 20,
  pallets_per_20ft_reefer INT DEFAULT 10
);

-- 5. RFQs & Items (Lead Generation + GDPR)
CREATE TABLE rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  port_of_discharge TEXT,
  incoterm TEXT, -- 'FOB', 'CIF', 'CFR'
  estimated_etd DATE,
  notes TEXT,
  gdpr_consent BOOLEAN NOT NULL DEFAULT true,
  status TEXT DEFAULT 'new', -- 'new', 'in_review', 'quoted', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rfq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity_tons NUMERIC NOT NULL,
  preferred_packaging TEXT
);

-- 6. Site Settings (Unified Settings Module)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);
```

---

## 🚦 مراحل التنفيذ المحدثة (Step-by-Step Implementation Roadmap)

### Phase 1: الأساسات والأمان وتهيئة قاعدة البيانات (Setup, Security & DB)
- [ ] إنشاء مشروع Next.js 15 مع TypeScript و Tailwind CSS v4.
- [ ] تهيئة `next-intl` لهيكلية اللغات الثلاث (`/en`, `/de`, `/es`).
- [ ] إنشاء الجداول وسياسات الأمان RLS وقواعد الحاويات وإعدادات الموقع في **Supabase**.
- [ ] إعداد خطة ضغط الصور التلقائية (WebP Pipeline) في الـ Frontend/Server.

### Phase 2: صفحة المنتجات والكتالوج (Product Catalog & Dynamic Details)
- [ ] بناء الكتالوج مع تصفية الفواكه والخضروات والمنتجات الموسمية.
- [ ] صفحة التفاصيل للمنتج مع معرض الصور المستقل (`product_images`) وكارت المواصفات الفنية المترجم، وزر إضافة للـ RFQ، وتنزيل ملف PDF.

### Phase 3: أدوات المستورد التفاعلية (Exporter Interactive Tools)
- [ ] **حاسبة الحاويات المحركة بقاعدة البيانات (Container Calculator)**: الاعتماد على جدول `container_rules`.
- [ ] **تقويم المواسم والشهادات وخريطة التصدير**.
- [ ] **مقارنة المنتجات ومستكشف التعبئة**.

### Phase 4: نظام الـ RFQ المتوافق مع GDPR والبريد الإلكتروني
- [ ] بناء سلة الـ RFQ ونموذج تقديم الطلب بوجود **GDPR Consent Checkbox** إجباري غير مفعل تلقائياً.
- [ ] تطبيق **Rate Limiting** و **reCAPTCHA/Turnstile** لمنع البوتات والـ Spam.
- [ ] ربط النموذج بـ Supabase وبناء API لإرسال الإشعارات البريدية فورياً للشركة والتأكيد للعميل.

### Phase 5: المحرك الشامل للـ SEO والأداء Fast & Bulletproof SEO
- [ ] إعداد الـ Meta Data الديناميكية و `hreflang` للغة الحالية والبديلة.
- [ ] إنشاء Schemas المترجمة (Product, Organization, FAQ, Breadcrumbs) وإنشاء `sitemap.xml` مخصص لكل لغة وصفحة `privacy-policy`.

### Phase 6: لوحة تحكم الأدمن والصلاحيات (Admin Dashboard & Settings Module)
- [ ] تسجيل دخول آمن عبر Supabase Auth وتحديد أدوار المستخدمين (Admin vs Employee).
- [ ] إدارة المنتجات والمواصفات والترجمات مع رفع وضغط الصور تلقائياً.
- [ ] وحدة إدارة إعدادات الموقع `site_settings` (الهواتف، التواصل، معلمات التحليل).
- [ ] جدول طلبات الـ RFQ مع دعم تصفية الطلبات وتصديرها إلى **Excel (XLSX)** و **PDF**.

---

## 🧪 خطة التحقق والعمل الاحترافي (Verification Plan)

### Automated Checks & Build Verification
* تشغيل `npm run build` للتأكد من خلو المشروع من أخطاء الـ TypeScript والـ SSR.
* التحقق من سلامة الترجمات في اللغات الثلاث (`en`, `de`, `es`).

### Manual & Interactive Verification
* اختبار ضغط صورة بحجم 8MB والتأكد من تحويلها إلى WebP بحجم أصغر من 300KB في Supabase Storage.
* اختبار نموذج الـ RFQ والتأكد من فرض الـ GDPR Checkbox وحماية الـ Rate Limiting.
* إدخال طلب تجريبي وتصديره من لوحة التحكم بصيغة Excel و PDF.
