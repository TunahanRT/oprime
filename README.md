# OPRIME - Radyasyon Zırhlama Simülasyon Platformu

OPRIME, nükleer fizikçiler ve mühendisler için radyasyon zırhlama simülasyonları oluşturup yönetebilecekleri profesyonel bir web platformudur.

## 🚀 Özellikler

- **Modern Web Teknolojileri**: Next.js 14, TypeScript, Tailwind CSS
- **Kullanıcı Yönetimi**: Supabase Auth ile güvenli kimlik doğrulama
- **Veritabanı**: PostgreSQL (Supabase) + Prisma ORM
- **Çok Dilli Destek**: Türkçe ve İngilizce (next-intl)
- **Dark/Light Mode**: Otomatik tema değiştirme
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Simülasyon Yönetimi**: Adım adım simülasyon oluşturma formu
- **Admin Paneli**: Kullanıcı ve simülasyon yönetimi

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı (ücretsiz tier)
- PostgreSQL veritabanı (Supabase sağlar)

## 🛠️ Kurulum

1. **Projeyi klonlayın veya indirin**

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini ayarlayın**
   
   `.env.local` dosyası oluşturun:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/oprime?schema=public"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Supabase projesi oluşturun**
   - [Supabase](https://supabase.com) üzerinden yeni bir proje oluşturun
   - Project URL ve API keys'leri `.env.local` dosyasına ekleyin

5. **Veritabanını migrate edin**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

6. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

7. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## 📁 Proje Yapısı

```
oprime/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # i18n route group
│   │   │   ├── (auth)/         # Auth routes
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/    # Protected routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── simulations/
│   │   │   │   │   ├── new/    # Yeni simülasyon
│   │   │   │   │   └── [id]/   # Simülasyon detayı
│   │   │   │   └── admin/       # Admin paneli
│   │   │   └── page.tsx        # Ana sayfa
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── simulations/
│   │   │   └── admin/
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── auth/               # Auth components
│   │   ├── simulation/         # Simulation components
│   │   ├── dashboard/          # Dashboard components
│   │   └── admin/              # Admin components
│   ├── lib/
│   │   ├── supabase/           # Supabase clients
│   │   ├── prisma/             # Prisma client
│   │   ├── utils/              # Utility functions
│   │   └── validations/        # Zod schemas
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   ├── store/                  # Zustand stores
│   └── i18n/                   # Translation files
├── prisma/
│   └── schema.prisma           # Database schema
└── public/                      # Static files
```

## 🔐 İlk Admin Kullanıcı Oluşturma

Veritabanında manuel olarak admin kullanıcı oluşturabilirsiniz:

```sql
-- Supabase SQL Editor'de çalıştırın
INSERT INTO users (id, email, "passwordHash", "isAdmin", "emailVerified")
VALUES (
  gen_random_uuid(),
  'admin@oprime.com',
  '$2a$10$...', -- bcrypt hash of your password
  true,
  true
);
```

Veya Prisma Studio kullanarak:
```bash
npx prisma studio
```

## 🎨 UI Componentleri

Proje [shadcn/ui](https://ui.shadcn.com) component library kullanıyor. Yeni component eklemek için:

```bash
npx shadcn@latest add [component-name]
```

## 🌐 Çeviriler

Çeviriler `src/i18n/messages/` klasöründe bulunur:
- `tr.json` - Türkçe çeviriler
- `en.json` - İngilizce çeviriler

Yeni çeviri eklemek için bu dosyaları düzenleyin.

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Kullanıcı kaydı

### Simulations
- `GET /api/simulations` - Kullanıcının simülasyonları
- `POST /api/simulations` - Yeni simülasyon oluştur
- `GET /api/simulations/[id]` - Simülasyon detayı

## 🚧 Geliştirme Durumu

### ✅ Tamamlanan
- [x] Proje yapısı ve kurulum
- [x] Authentication sistemi (Supabase)
- [x] Veritabanı şeması (Prisma)
- [x] UI componentleri (shadcn/ui)
- [x] Dark/Light mode
- [x] i18n yapılandırması
- [x] Ana sayfa (landing page)
- [x] Login/Register sayfaları
- [x] Dashboard sayfası
- [x] Simülasyonlar listesi
- [x] Yeni simülasyon formu (TÜM ADIMLAR)
  - [x] Adım 1: Temel Bilgiler
  - [x] Adım 2: Kaynak Parametreleri
  - [x] Adım 3: Malzeme Yönetimi (tam özellikli)
  - [x] Adım 4: Katman Yapısı (görsel önizleme ile)
  - [x] Adım 5: Dosya Yükleme (Supabase Storage)
  - [x] Adım 6: Özet ve Gönder
- [x] Simülasyon detay sayfası
- [x] Admin paneli
  - [x] Kullanıcı yönetimi
  - [x] Simülasyon yönetimi
  - [x] İstatistikler ve grafikler (Recharts)

### 📋 Yapılacaklar (İleride)
- [ ] Simülasyon motoru entegrasyonu (backend simülasyon engine)
- [ ] Sonuç görselleştirme (daha detaylı grafikler)
- [ ] Excel rapor oluşturma (otomatik)
- [ ] Email bildirimleri (simülasyon tamamlandığında)
- [ ] Unit testler
- [ ] E2E testler
- [ ] Performance optimizasyonları

## 🐛 Bilinen Sorunlar

- Simülasyon formu henüz tamamlanmadı (sadece ilk 2 adım implement edildi)
- Admin paneli henüz oluşturulmadı
- Dosya yükleme özelliği henüz eklenmedi

## 📄 Lisans

Bu proje özel bir projedir.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request göndermeden önce issue açın.

## 📧 İletişim

Sorularınız için: info@oprime.com.tr

---

**Not**: Bu proje aktif geliştirme aşamasındadır. Production'a geçmeden önce tüm özelliklerin tamamlanması ve test edilmesi gerekmektedir.
