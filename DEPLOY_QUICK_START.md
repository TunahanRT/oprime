# ⚡ Hızlı Deployment - 5 Dakikada Canlıya Alın!

## 🎯 En Hızlı Yol (Vercel Dashboard)

### 1. Hazırlık (2 dakika)

```bash
# Projeyi GitHub'a push edin (opsiyonel ama önerilir)
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/oprime.git
git push -u origin main
```

### 2. Vercel'e Deploy (3 dakika)

1. **vercel.com** → GitHub ile giriş yap
2. **"Add New Project"** → Repository seç
3. **Environment Variables** ekle (aşağıdaki listeyi kopyala-yapıştır):

```
DATABASE_URL=postgresql://postgres:[ŞİFRE]@db.[PROJE-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://[PROJE-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE-ROLE-KEY]
NEXTAUTH_URL=https://[VERCEL-URL].vercel.app
NEXTAUTH_SECRET=[RANDOM-32-KARAKTER]
NEXT_PUBLIC_APP_URL=https://[VERCEL-URL].vercel.app
```

4. **"Deploy"** butonuna tıkla! 🚀

### 3. İlk Deploy Sonrası (1 dakika)

1. Deploy tamamlandıktan sonra Vercel URL'inizi kopyala
2. **Settings** > **Environment Variables** → `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL` güncelle
3. **Redeploy** yap

### 4. Supabase Ayarları (1 dakika)

1. Supabase Dashboard → **Authentication** > **URL Configuration**
2. **Redirect URLs** ekle:
   ```
   https://[VERCEL-URL].vercel.app/**
   ```

## ✅ Bitti!

Artık siteniz canlıda: `https://[PROJECT].vercel.app`

---

## 🔍 Değerleri Nereden Bulurum?

- **Supabase Şifre**: Proje oluştururken belirlediğiniz şifre
- **Proje REF**: Supabase Settings > General > Reference ID
- **ANON KEY**: Supabase Settings > API > anon public key
- **SERVICE ROLE KEY**: Supabase Settings > API > service_role key
- **NEXTAUTH_SECRET**: Terminal'de `openssl rand -base64 32` çalıştır

## 🆘 Sorun mu var?

- Build hatası → Vercel logs'a bak
- Database hatası → DATABASE_URL'i kontrol et
- Auth hatası → Supabase redirect URLs'i kontrol et
