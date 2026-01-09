# 🚀 OPRIME Deployment Rehberi - Vercel

Bu rehber, OPRIME projesini Vercel'e deploy etmek için adım adım talimatlar içerir.

## 📋 Ön Hazırlık

### 1. Supabase Projesi Hazır Olmalı

- ✅ Supabase projesi oluşturulmuş
- ✅ Database migration yapılmış (`npx prisma migrate deploy`)
- ✅ Storage bucket oluşturulmuş (`simulation-files`)
- ✅ Environment variables not edilmiş

### 2. GitHub Repository (Opsiyonel ama Önerilen)

Vercel'e deploy etmek için GitHub'a push etmeniz önerilir:

```bash
# Git repository oluştur
git init
git add .
git commit -m "Initial commit"
git branch -M main

# GitHub'da yeni repository oluştur, sonra:
git remote add origin https://github.com/YOUR_USERNAME/oprime.git
git push -u origin main
```

## 🎯 Vercel'e Deploy Adımları

### Yöntem 1: Vercel Dashboard (Önerilen)

1. **Vercel Hesabı Oluşturun**
   - [vercel.com](https://vercel.com) adresine gidin
   - GitHub ile giriş yapın (önerilir)

2. **Yeni Proje Oluşturun**
   - Dashboard'da **"Add New..."** > **"Project"** tıklayın
   - GitHub repository'nizi seçin veya **"Import Git Repository"** ile bağlayın
   - Proje adı: `oprime` (veya istediğiniz isim)

3. **Framework Preset**
   - Framework Preset: **Next.js** (otomatik algılanır)
   - Root Directory: `./` (varsayılan)

4. **Environment Variables Ekleyin**

   Vercel dashboard'da **Environment Variables** bölümüne şunları ekleyin:

   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
   
   NEXTAUTH_URL=https://[YOUR-VERCEL-URL].vercel.app
   NEXTAUTH_SECRET=[RANDOM-32-CHAR-STRING]
   
   NEXT_PUBLIC_APP_URL=https://[YOUR-VERCEL-URL].vercel.app
   ```

   **Önemli:**
   - `[PASSWORD]` → Supabase database şifresi
   - `[PROJECT-REF]` → Supabase proje referansı
   - `[YOUR-ANON-KEY]` → Supabase anon key
   - `[YOUR-SERVICE-ROLE-KEY]` → Supabase service role key
   - `[YOUR-VERCEL-URL]` → Vercel deployment URL'i (ilk deploy sonrası otomatik oluşur)
   - `NEXTAUTH_SECRET` → Rastgele 32 karakter (örnek: `openssl rand -base64 32`)

   **Environment Variables için:**
   - Production, Preview, Development için ayrı ayrı ekleyebilirsiniz
   - İlk deploy için Production'a ekleyin

5. **Build Settings**

   Vercel otomatik olarak algılar, ama kontrol edin:
   - Build Command: `npm run build`
   - Output Directory: `.next` (otomatik)
   - Install Command: `npm install`

6. **Deploy!**

   - **"Deploy"** butonuna tıklayın
   - İlk build 2-3 dakika sürebilir
   - Build tamamlandığında URL otomatik oluşur

7. **İlk Deploy Sonrası**

   - Deploy tamamlandıktan sonra, `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` değişkenlerini güncelleyin
   - Settings > Environment Variables'dan düzenleyin
   - **"Redeploy"** yapın

### Yöntem 2: Vercel CLI

1. **Vercel CLI Kurulumu**

   ```bash
   npm i -g vercel
   ```

2. **Login**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   # Proje dizininde
   cd oprime
   
   # İlk deploy
   vercel
   
   # Production deploy
   vercel --prod
   ```

4. **Environment Variables**

   CLI ile de ekleyebilirsiniz:

   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # ... diğerleri
   ```

   Veya dashboard'dan ekleyin (daha kolay).

## 🔧 Post-Deployment Ayarları

### 1. Supabase Auth Redirect URLs

Supabase dashboard'da:

1. **Authentication** > **URL Configuration** bölümüne gidin
2. **Redirect URLs** kısmına Vercel URL'inizi ekleyin:
   ```
   https://[YOUR-VERCEL-URL].vercel.app/**
   https://[YOUR-VERCEL-URL].vercel.app/auth/callback
   ```

### 2. Database Migration

Vercel'de otomatik çalışır (`postinstall` script), ama manuel de yapabilirsiniz:

```bash
# Vercel CLI ile
vercel env pull .env.local
npx prisma migrate deploy
```

### 3. İlk Admin Kullanıcı

Supabase SQL Editor'de veya Prisma Studio ile oluşturun (SETUP.md'deki gibi).

## 🐛 Sorun Giderme

### Build Hatası: "Prisma Client not generated"

**Çözüm:**
- `package.json`'da `postinstall` script'i var mı kontrol edin
- Vercel build logs'u kontrol edin
- Manuel olarak `prisma generate` ekleyin

### Database Connection Error

**Çözüm:**
- `DATABASE_URL` doğru mu kontrol edin
- Supabase connection pooling kullanıyorsanız `?pgbouncer=true` ekleyin
- Supabase dashboard'da database'in aktif olduğunu kontrol edin

### Environment Variables Not Working

**Çözüm:**
- Vercel dashboard'da variables'ların doğru environment'a eklendiğini kontrol edin
- Redeploy yapın
- Build logs'da variables'ların yüklendiğini kontrol edin

### 404 Errors on Routes

**Çözüm:**
- Next.js App Router kullanıyoruz, routing otomatik
- `[locale]` route group'unun doğru yapılandırıldığını kontrol edin
- Middleware'in doğru çalıştığını kontrol edin

## 📊 Monitoring

Vercel dashboard'da:
- **Analytics** → Trafik ve performans
- **Logs** → Hata logları
- **Deployments** → Deployment geçmişi

## 🔄 Continuous Deployment

GitHub'a push ettiğinizde otomatik deploy olur:
- `main` branch → Production
- Diğer branch'ler → Preview deployments

## 🌐 Custom Domain (Opsiyonel)

1. Vercel dashboard'da **Settings** > **Domains**
2. Domain ekleyin
3. DNS ayarlarını yapın (Vercel talimatları verir)
4. SSL otomatik olarak eklenir

## ✅ Deployment Checklist

- [ ] Supabase projesi hazır
- [ ] Database migration yapıldı
- [ ] Storage bucket oluşturuldu
- [ ] GitHub repository oluşturuldu (opsiyonel)
- [ ] Vercel hesabı oluşturuldu
- [ ] Environment variables eklendi
- [ ] İlk deploy yapıldı
- [ ] NEXTAUTH_URL güncellendi
- [ ] Supabase redirect URLs eklendi
- [ ] İlk admin kullanıcı oluşturuldu
- [ ] Test edildi (login, register, simulation create)

## 🎉 Başarılı!

Artık OPRIME canlıda! 🚀

URL'iniz: `https://[YOUR-PROJECT].vercel.app`

---

**Not:** İlk deploy sonrası mutlaka:
1. NEXTAUTH_URL'i güncelleyin
2. Supabase redirect URLs ekleyin
3. Test edin!
