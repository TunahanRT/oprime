# OPRIME Kurulum Rehberi

Bu dosya, OPRIME projesini çalıştırmak için gerekli adımları detaylı olarak açıklar.

## 📋 Ön Gereksinimler

1. **Node.js 18+** - [İndir](https://nodejs.org/)
2. **npm veya yarn** - Node.js ile birlikte gelir
3. **Supabase hesabı** - [Ücretsiz kayıt](https://supabase.com)
4. **Git** (opsiyonel)

## 🚀 Adım Adım Kurulum

### 1. Projeyi Klonlayın veya İndirin

```bash
# Eğer Git kullanıyorsanız
git clone <repository-url>
cd oprime

# Veya ZIP olarak indirip açın
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Supabase Projesi Oluşturun

1. [Supabase](https://supabase.com) sitesine gidin ve ücretsiz hesap oluşturun
2. "New Project" butonuna tıklayın
3. Proje adı: `oprime` (veya istediğiniz bir isim)
4. Database password belirleyin (kaydedin!)
5. Region seçin (en yakın bölgeyi seçin)
6. Proje oluşturulduktan sonra:
   - **Settings** > **API** bölümüne gidin
   - `Project URL` ve `anon public` key'i kopyalayın
   - **Settings** > **API** > **Service Role** key'i de kopyalayın (güvenli tutun!)

### 4. Supabase Storage Bucket Oluşturun

1. Supabase dashboard'da **Storage** bölümüne gidin
2. **New bucket** butonuna tıklayın
3. Bucket adı: `simulation-files`
4. **Public bucket** seçeneğini işaretleyin (veya private yapıp signed URL kullanın)
5. **Create bucket** butonuna tıklayın

### 5. Environment Değişkenlerini Ayarlayın

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[RANDOM-32-CHARACTER-STRING]

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Önemli:**
- `[YOUR-PASSWORD]` yerine Supabase'de belirlediğiniz database şifresini yazın
- `[YOUR-PROJECT-REF]` yerine Supabase proje referansınızı yazın (Settings > General > Reference ID)
- `[YOUR-ANON-KEY]` yerine Supabase anon key'inizi yazın
- `[YOUR-SERVICE-ROLE-KEY]` yerine Supabase service role key'inizi yazın
- `NEXTAUTH_SECRET` için rastgele 32 karakterlik bir string oluşturun (örnek: `openssl rand -base64 32`)

### 6. Veritabanını Migrate Edin

```bash
# Prisma schema'yı veritabanına uygula
npx prisma migrate dev --name init

# Prisma Client'ı generate et
npx prisma generate
```

Eğer hata alırsanız:
- DATABASE_URL'in doğru olduğundan emin olun
- Supabase'de database'in hazır olduğunu kontrol edin
- Connection pooling kullanıyorsanız, `?pgbouncer=true` parametresini ekleyin

### 7. İlk Admin Kullanıcı Oluşturun

Supabase SQL Editor'de veya Prisma Studio ile:

**Yöntem 1: Supabase SQL Editor**
1. Supabase dashboard'da **SQL Editor**'e gidin
2. Aşağıdaki SQL'i çalıştırın (şifreyi değiştirin!):

```sql
-- Önce Supabase Auth'da kullanıcı oluşturun (Dashboard > Authentication > Add User)
-- Sonra bu SQL'i çalıştırın (email'i Supabase Auth'daki email ile eşleştirin)

INSERT INTO users (id, email, "passwordHash", "isAdmin", "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@oprime.com',  -- Supabase Auth'daki email
  '$2a$10$YourHashedPasswordHere',  -- bcrypt hash (şimdilik geçici)
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET "isAdmin" = true;
```

**Yöntem 2: Prisma Studio (Daha Kolay)**
```bash
npx prisma studio
```
1. Tarayıcıda açılan Prisma Studio'da `User` tablosuna gidin
2. "Add record" butonuna tıklayın
3. Email, passwordHash (bcrypt hash), isAdmin: true doldurun
4. Kaydedin

**Not:** Şimdilik passwordHash için geçici bir değer kullanabilirsiniz. Gerçek kullanıcı kaydı Supabase Auth üzerinden yapılacak.

### 8. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🔧 Sorun Giderme

### "DATABASE_URL is not set" hatası
- `.env.local` dosyasının proje kök dizininde olduğundan emin olun
- Dosya adının `.env.local` olduğundan emin (`.env` değil)
- Sunucuyu yeniden başlatın

### "Prisma Client not generated" hatası
```bash
npx prisma generate
```

### "Table does not exist" hatası
```bash
npx prisma migrate dev
```

### Supabase bağlantı hatası
- Supabase projenizin aktif olduğundan emin olun
- DATABASE_URL'deki şifrenin doğru olduğundan emin olun
- Supabase dashboard'da database'in hazır olduğunu kontrol edin

### Dosya yükleme hatası
- Supabase Storage'da `simulation-files` bucket'ının oluşturulduğundan emin olun
- Bucket'ın public olduğundan veya doğru policy'lerin ayarlandığından emin olun

## 📝 Sonraki Adımlar

1. ✅ Proje çalışıyor mu kontrol edin
2. ✅ Ana sayfayı ziyaret edin
3. ✅ Kayıt ol sayfasından yeni kullanıcı oluşturun
4. ✅ Giriş yapın
5. ✅ Dashboard'u kontrol edin
6. ✅ Yeni simülasyon oluşturmayı deneyin

## 🎉 Başarılı!

Artık OPRIME platformu çalışıyor! Geliştirmeye devam edebilirsiniz.
