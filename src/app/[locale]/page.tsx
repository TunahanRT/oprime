import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, BarChart3, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-4 py-20 md:py-32">
        <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            OPRIME
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Radyasyon Zırhlama Simülasyon Platformu
          </p>
          <p className="max-w-[750px] text-sm text-muted-foreground">
            Nükleer fizikçiler ve mühendisler için profesyonel simülasyon çözümleri
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/simulations/new">
              <Button size="lg" className="gap-2">
                Simülasyon Oluştur
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Güvenilir Simülasyon</CardTitle>
              <CardDescription>
                Doğru ve güvenilir radyasyon zırhlama simülasyonları
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Hızlı İşlem</CardTitle>
              <CardDescription>
                Arka planda işlenen simülasyonlar, hızlı sonuçlar
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Detaylı Raporlar</CardTitle>
              <CardDescription>
                Excel ve grafik formatında detaylı analiz raporları
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Malzeme Kütüphanesi</CardTitle>
              <CardDescription>
                Geniş malzeme kütüphanesi ve özel malzeme tanımlama
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-12 md:py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nasıl Çalışır?</h2>
          <div className="grid gap-6 md:grid-cols-3 mt-8 max-w-4xl">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Simülasyon Oluştur</h3>
              <p className="text-muted-foreground text-center">
                Parçacık tipi, enerji ve malzeme parametrelerini belirleyin
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">İşleme Al</h3>
              <p className="text-muted-foreground text-center">
                Simülasyonunuz arka planda işlenir, durumu takip edebilirsiniz
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Sonuçları İndir</h3>
              <p className="text-muted-foreground text-center">
                Tamamlanan simülasyonların raporlarını ve grafiklerini indirin
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
