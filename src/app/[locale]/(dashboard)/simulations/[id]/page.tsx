import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, BarChart3, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default async function SimulationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  })

  if (!dbUser) {
    notFound()
  }

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!simulation || simulation.userId !== dbUser.id) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      completed: {
        label: 'Tamamlandı',
        variant: 'default',
        icon: CheckCircle2,
      },
      processing: {
        label: 'İşleniyor',
        variant: 'secondary',
        icon: Clock,
      },
      pending: {
        label: 'Beklemede',
        variant: 'outline',
        icon: AlertCircle,
      },
      failed: {
        label: 'Başarısız',
        variant: 'destructive',
        icon: XCircle,
      },
    }

    const config = configs[status] || configs.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-2">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const materials = simulation.materials as any[]
  const layers = simulation.layers as any[]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/simulations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{simulation.title}</h1>
            <p className="text-muted-foreground">
              Oluşturulma: {new Date(simulation.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        {getStatusBadge(simulation.status)}
      </div>

      {simulation.description && (
        <Card>
          <CardHeader>
            <CardTitle>Açıklama</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{simulation.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kaynak Parametreleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parçacık Tipi:</span>
              <span className="font-medium">
                {simulation.particleType === 'neutron' ? 'Nötron' : 'Gama'}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Enerji:</span>
              <span className="font-medium">
                {simulation.energy} {simulation.energyUnit}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parçacık Sayısı:</span>
              <span className="font-medium">
                {simulation.particleCount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Malzemeler</CardTitle>
            <CardDescription>{materials.length} malzeme tanımlı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {materials.map((material: any) => (
                <div key={material.id} className="text-sm">
                  <span className="font-medium">{material.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({material.density} g/cm³)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Katman Yapısı</CardTitle>
          <CardDescription>{layers.length} katman</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {layers.map((layer: any, index: number) => {
              const material = materials.find((m: any) => m.id === layer.materialId)
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-medium">Katman {index + 1}</span>
                    <span className="text-muted-foreground ml-2">
                      {material?.name || 'Bilinmeyen'} - {layer.thickness} cm
                    </span>
                  </div>
                </div>
              )
            })}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Toplam Kalınlık:</span>
              <span>
                {layers.reduce((sum: number, l: any) => sum + l.thickness, 0).toFixed(2)} cm
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {simulation.uploadedFiles && simulation.uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yüklenen Dosyalar</CardTitle>
            <CardDescription>{simulation.uploadedFiles.length} dosya</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {simulation.uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.split('/').pop()}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {simulation.status === 'completed' && (
        <>
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Simülasyon Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {simulation.transmissionRate !== null && (
                <div className="flex justify-between items-center p-4 bg-background rounded">
                  <span className="font-medium">Transmisyon Oranı:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {(simulation.transmissionRate * 100).toFixed(2)}%
                  </span>
                </div>
              )}

              {simulation.resultFiles && simulation.resultFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Sonuç Dosyaları:</h4>
                  {simulation.resultFiles.map((file, index) => (
                    <Button key={index} variant="outline" className="w-full justify-start" asChild>
                      <a href={file} download>
                        <Download className="h-4 w-4 mr-2" />
                        {file.split('/').pop()}
                      </a>
                    </Button>
                  ))}
                </div>
              )}

              {simulation.summaryData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Özet Veriler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(simulation.summaryData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {simulation.status === 'processing' && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Simülasyon işleniyor...
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Simülasyonunuz arka planda işleniyor. Tamamlandığında sonuçlar burada görüntülenecektir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {simulation.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">
                  Simülasyon beklemede
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Simülasyonunuz kuyruğa alındı. İşleme başladığında durum güncellenecektir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Link href="/simulations/new">
          <Button>
            Yeni Simülasyon Oluştur
          </Button>
        </Link>
        <Link href="/simulations">
          <Button variant="outline">
            Tüm Simülasyonlar
          </Button>
        </Link>
      </div>
    </div>
  )
}
