import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'

export default async function SimulationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Giriş yapmanız gerekiyor</div>
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      simulations: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!dbUser) {
    return <div>Kullanıcı bulunamadı</div>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      processing: 'secondary',
      pending: 'outline',
      failed: 'destructive',
    }
    
    const labels: Record<string, string> = {
      completed: 'Tamamlandı',
      processing: 'İşleniyor',
      pending: 'Beklemede',
      failed: 'Başarısız',
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Simülasyonlarım</h1>
          <p className="text-muted-foreground">
            Tüm simülasyonlarınızı görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/simulations/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Simülasyon
          </Button>
        </Link>
      </div>

      {dbUser.simulations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Henüz simülasyon oluşturmadınız</p>
            <Link href="/simulations/new">
              <Button>İlk Simülasyonunuzu Oluşturun</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {dbUser.simulations.map((sim) => (
            <Card key={sim.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{sim.title}</CardTitle>
                    <CardDescription>
                      {sim.description || 'Açıklama yok'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(sim.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>Parçacık: {sim.particleType === 'neutron' ? 'Nötron' : 'Gama'}</p>
                    <p>Enerji: {sim.energy} {sim.energyUnit}</p>
                    <p>Oluşturulma: {new Date(sim.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <Link href={`/simulations/${sim.id}`}>
                    <Button variant="outline">Detayları Gör</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
