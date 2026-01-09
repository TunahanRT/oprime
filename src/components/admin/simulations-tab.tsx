import { prisma } from '@/lib/prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Search, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export async function AdminSimulationsTab() {
  const simulations = await prisma.simulation.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

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
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simülasyon Yönetimi</CardTitle>
        <CardDescription>
          Tüm simülasyonları görüntüleyin ve yönetin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Simülasyon ara..."
                className="pl-8"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            {simulations.map((simulation) => (
              <div
                key={simulation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={`/simulations/${simulation.id}`}
                      className="font-medium hover:underline"
                    >
                      {simulation.title}
                    </Link>
                  </div>
                  <div className="text-sm text-muted-foreground space-x-4">
                    <span>Kullanıcı: {simulation.user.name || simulation.user.email}</span>
                    <span>
                      {new Date(simulation.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span>
                      {simulation.particleType === 'neutron' ? 'Nötron' : 'Gama'} -{' '}
                      {simulation.energy} {simulation.energyUnit}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(simulation.status)}
                  <Link href={`/simulations/${simulation.id}`}>
                    <Button variant="outline" size="sm">
                      Detay
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {simulations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Henüz simülasyon bulunmuyor
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
