# 🪟 Windows'ta OPRIME'ı Canlıya Alma - Adım Adım Rehber

## 📍 Dosyaların Konumu

Projeniz şu klasörde:
```
C:\OneDrive\Belgeler\cursor\oprime
```

---

## 🎯 ADIM 1: Supabase Hazırlığı (10 dakika)

### 1.1. Supabase Hesabı Oluşturun

1. Tarayıcınızda [supabase.com](https://supabase.com) açın
2. **"Start your project"** veya **"Sign Up"** butonuna tıklayın
3. GitHub ile giriş yapın (en kolay yol)
4. Email ve şifre ile kayıt olun

### 1.2. Yeni Proje Oluşturun

1. Supabase dashboard'da **"New Project"** butonuna tıklayın
2. **Organization**: Varsayılanı seçin (yoksa oluşturun)
3. **Project Name**: `oprime` yazın
4. **Database Password**: Güçlü bir şifre belirleyin (KAYDEDİN!)
5. **Region**: En yakın bölgeyi seçin (örn: `West Europe`)
6. **Pricing Plan**: Free tier seçin
7. **"Create new project"** butonuna tıklayın
8. ⏳ 2-3 dakika bekleyin (proje oluşturuluyor)

### 1.3. Supabase Bilgilerini Not Edin

Proje hazır olduğunda:

1. Sol menüden **Settings** (⚙️) tıklayın
2. **API** sekmesine gidin
3. Şu bilgileri kopyalayıp bir not defterine kaydedin:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **General** sekmesine gidin
5. **Reference ID**'yi kopyalayın (örn: `abcdefghijklmnop`)

### 1.4. Storage Bucket Oluşturun

1. Sol menüden **Storage** tıklayın
2. **"New bucket"** butonuna tıklayın
3. **Name**: `simulation-files` yazın
4. **Public bucket**: ✅ İşaretleyin
5. **"Create bucket"** butonuna tıklayın

---

## 🎯 ADIM 2: Veritabanını Hazırlama (5 dakika)

### 2.1. PowerShell'i Açın

1. **Windows tuşu + X** basın
2. **"Windows PowerShell"** veya **"Terminal"** seçin
3. Şu komutu çalıştırın:

```powershell
cd "C:\OneDrive\Belgeler\cursor\oprime"
```

### 2.2. Environment Dosyası Oluşturun

1. PowerShell'de şu komutu çalıştırın:

```powershell
notepad .env.local
```

2. Notepad açıldığında şu içeriği yapıştırın (değerleri kendi bilgilerinizle değiştirin):

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[ŞİFRENİZ]@db.[PROJE-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJE-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE-ROLE-KEY]

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[RANDOM-32-KARAKTER]

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Değerleri değiştirin:**
   - `[ŞİFRENİZ]` → Supabase'de belirlediğiniz database şifresi
   - `[PROJE-REF]` → Supabase Reference ID (örn: `abcdefghijklmnop`)
   - `[ANON-KEY]` → Supabase anon public key
   - `[SERVICE-ROLE-KEY]` → Supabase service_role key
   - `[RANDOM-32-KARAKTER]` → Rastgele 32 karakter (aşağıdaki komutla oluşturun)

4. **NEXTAUTH_SECRET oluşturmak için:**

   PowerShell'de şu komutu çalıştırın:
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```
   
   Çıkan metni kopyalayıp `NEXTAUTH_SECRET=` sonrasına yapıştırın.

5. Notepad'de **Ctrl+S** ile kaydedin ve kapatın.

### 2.3. Veritabanını Migrate Edin

PowerShell'de şu komutları sırayla çalıştırın:

```powershell
# Bağımlılıkları yükle (ilk kez)
npm install

# Veritabanını migrate et
npx prisma migrate dev --name init

# Prisma Client'ı generate et
npx prisma generate
```

✅ Başarılı olursa "Migration applied" mesajı görürsünüz.

---

## 🎯 ADIM 3: GitHub'a Yükleme (5 dakika)

### 3.1. Git Kurulumu (Yoksa)

1. [git-scm.com/download/win](https://git-scm.com/download/win) adresinden Git'i indirin
2. Kurulumu yapın (varsayılan ayarlarla devam edin)

### 3.2. GitHub Hesabı Oluşturun

1. [github.com](https://github.com) adresine gidin
2. **"Sign up"** ile hesap oluşturun
3. Email doğrulamasını yapın

### 3.3. Yeni Repository Oluşturun

1. GitHub'da sağ üstten **"+"** > **"New repository"** tıklayın
2. **Repository name**: `oprime` yazın
3. **Public** seçin (veya Private)
4. **"Create repository"** butonuna tıklayın
5. ⚠️ **"Initialize with README"** işaretlemeyin!

### 3.4. Projeyi GitHub'a Push Edin

PowerShell'de (proje klasöründe) şu komutları çalıştırın:

```powershell
# Git'i başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit - OPRIME project"

# GitHub repository'nizi ekleyin (URL'i kendi repository'nizle değiştirin)
git remote add origin https://github.com/KULLANICI_ADINIZ/oprime.git

# Ana branch'i ayarla
git branch -M main

# GitHub'a yükle
git push -u origin main
```

GitHub kullanıcı adı ve şifre isteyecek (veya token).

---

## 🎯 ADIM 4: Vercel'e Deploy (5 dakika)

### 4.1. Vercel Hesabı Oluşturun

1. [vercel.com](https://vercel.com) adresine gidin
2. **"Sign Up"** butonuna tıklayın
3. **"Continue with GitHub"** seçin
4. GitHub hesabınızla giriş yapın
5. Vercel'e GitHub erişim izni verin

### 4.2. Yeni Proje Oluşturun

1. Vercel dashboard'da **"Add New..."** > **"Project"** tıklayın
2. GitHub repository listenizden **"oprime"** seçin
3. **"Import"** butonuna tıklayın

### 4.3. Proje Ayarları

1. **Framework Preset**: Next.js (otomatik algılanır)
2. **Root Directory**: `./` (varsayılan)
3. **Build Command**: `npm run build` (varsayılan)
4. **Output Directory**: `.next` (varsayılan)

### 4.4. Environment Variables Ekleyin

**"Environment Variables"** bölümüne tıklayın ve şunları ekleyin:

**1. DATABASE_URL:**
```
Key: DATABASE_URL
Value: postgresql://postgres:[ŞİFRENİZ]@db.[PROJE-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
Environment: Production, Preview, Development (hepsini seçin)
```

**2. NEXT_PUBLIC_SUPABASE_URL:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://[PROJE-REF].supabase.co
Environment: Production, Preview, Development
```

**3. NEXT_PUBLIC_SUPABASE_ANON_KEY:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [ANON-KEY]
Environment: Production, Preview, Development
```

**4. SUPABASE_SERVICE_ROLE_KEY:**
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: [SERVICE-ROLE-KEY]
Environment: Production, Preview, Development
```

**5. NEXTAUTH_URL:**
```
Key: NEXTAUTH_URL
Value: https://oprime.vercel.app
(İlk deploy sonrası gerçek URL ile güncelleyeceğiz)
Environment: Production, Preview, Development
```

**6. NEXTAUTH_SECRET:**
```
Key: NEXTAUTH_SECRET
Value: [RANDOM-32-KARAKTER] (Adım 2.2'de oluşturduğunuz)
Environment: Production, Preview, Development
```

**7. NEXT_PUBLIC_APP_URL:**
```
Key: NEXT_PUBLIC_APP_URL
Value: https://oprime.vercel.app
(İlk deploy sonrası gerçek URL ile güncelleyeceğiz)
Environment: Production, Preview, Development
```

Her birini ekledikten sonra **"Add"** butonuna tıklayın.

### 4.5. Deploy!

1. Tüm environment variables eklendikten sonra
2. **"Deploy"** butonuna tıklayın
3. ⏳ 2-3 dakika bekleyin (build işlemi)

### 4.6. İlk Deploy Sonrası

1. Deploy tamamlandığında **"Visit"** butonuna tıklayın
2. URL'inizi kopyalayın (örn: `https://oprime-abc123.vercel.app`)
3. Vercel dashboard'a geri dönün
4. **Settings** > **Environment Variables** gidin
5. `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` değerlerini gerçek URL ile güncelleyin
6. **"Redeploy"** butonuna tıklayın (Deployments sekmesinde)

---

## 🎯 ADIM 5: Supabase Redirect URLs (2 dakika)

1. Supabase dashboard'a gidin
2. Sol menüden **Authentication** > **URL Configuration** tıklayın
3. **Redirect URLs** bölümüne şunu ekleyin:
   ```
   https://[VERCEL-URL].vercel.app/**
   https://[VERCEL-URL].vercel.app/auth/callback
   ```
   (Vercel URL'inizi yazın)
4. **"Add"** butonuna tıklayın
5. **"Save"** butonuna tıklayın

---

## 🎯 ADIM 6: İlk Admin Kullanıcı (3 dakika)

### Yöntem 1: Supabase SQL Editor (Kolay)

1. Supabase dashboard'da **SQL Editor** tıklayın
2. **"New query"** tıklayın
3. Şu SQL'i yapıştırın:

```sql
-- Önce Supabase Auth'da kullanıcı oluşturun:
-- Authentication > Users > Add User
-- Email ve şifre belirleyin

-- Sonra bu SQL'i çalıştırın (email'i değiştirin):
INSERT INTO users (id, email, "passwordHash", "isAdmin", "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@oprime.com',  -- Supabase Auth'daki email
  '$2a$10$TemporaryHash12345678901234567890123456789012345678901234567890',  -- Geçici hash
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET "isAdmin" = true;
```

4. **"Run"** butonuna tıklayın

### Yöntem 2: Prisma Studio (Alternatif)

PowerShell'de (proje klasöründe):

```powershell
npx prisma studio
```

Tarayıcıda açılan Prisma Studio'da:
1. **User** tablosuna tıklayın
2. **"Add record"** butonuna tıklayın
3. Şu bilgileri girin:
   - `email`: admin@oprime.com
   - `passwordHash`: Geçici bir değer (örn: `$2a$10$temp`)
   - `isAdmin`: ✅ true
   - `emailVerified`: ✅ true
4. **"Save 1 change"** tıklayın

---

## ✅ TEST ETME (5 dakika)

1. **Vercel URL'inizi açın** (örn: `https://oprime-abc123.vercel.app`)
2. **Ana sayfayı kontrol edin** - Çalışıyor mu?
3. **"Kayıt Ol"** butonuna tıklayın
4. Yeni bir kullanıcı oluşturun
5. **Giriş yapın**
6. **Dashboard'u kontrol edin**
7. **"Yeni Simülasyon Oluştur"** butonuna tıklayın
8. Formu doldurmayı deneyin

---

## 🆘 SORUN GİDERME

### Build Hatası

**Hata**: "Prisma Client not generated"
**Çözüm**: Vercel dashboard'da **Settings** > **Build & Development Settings** > **Install Command**:
```
npm install && npx prisma generate
```

### Database Connection Error

**Hata**: "Can't reach database"
**Çözüm**: 
- `DATABASE_URL` doğru mu kontrol edin
- Supabase dashboard'da database'in aktif olduğunu kontrol edin
- Connection pooling kullanıyorsanız `?pgbouncer=true` ekleyin

### 404 Errors

**Hata**: Sayfalar açılmıyor
**Çözüm**: 
- Vercel'de **Redeploy** yapın
- Build logs'u kontrol edin

### Environment Variables Çalışmıyor

**Hata**: Değişkenler yüklenmiyor
**Çözüm**:
- Vercel dashboard'da variables'ların doğru environment'a eklendiğini kontrol edin
- **Redeploy** yapın

---

## 🎉 BAŞARILI!

Artık siteniz canlıda! 🚀

**URL'iniz**: `https://[PROJECT-NAME].vercel.app`

---

## 📝 ÖZET - Yapılacaklar Listesi

- [ ] Supabase hesabı oluşturuldu
- [ ] Supabase projesi oluşturuldu
- [ ] Supabase bilgileri not edildi
- [ ] Storage bucket oluşturuldu
- [ ] .env.local dosyası oluşturuldu
- [ ] Veritabanı migrate edildi
- [ ] GitHub repository oluşturuldu
- [ ] Proje GitHub'a push edildi
- [ ] Vercel hesabı oluşturuldu
- [ ] Vercel'de proje oluşturuldu
- [ ] Environment variables eklendi
- [ ] İlk deploy yapıldı
- [ ] NEXTAUTH_URL güncellendi
- [ ] Supabase redirect URLs eklendi
- [ ] İlk admin kullanıcı oluşturuldu
- [ ] Test edildi

---

**Sorularınız varsa bana sorun!** 😊
