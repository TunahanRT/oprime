import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Giriş yapmanız gerekiyor</div>
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      simulations: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!dbUser) {
    return <div>Kullanıcı bulunamadı</div>
  }

  const stats = {
    total: dbUser.simulations.length,
    pending: dbUser.simulations.filter(s => s.status === 'pending').length,
    processing: dbUser.simulations.filter(s => s.status === 'processing').length,
    completed: dbUser.simulations.filter(s => s.status === 'completed').length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hoş Geldiniz, {dbUser.name || dbUser.email}</h1>
        <p className="text-muted-foreground">
          Simülasyonlarınızı yönetin ve yeni simülasyonlar oluşturun
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Simülasyon</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İşleniyor</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>Yeni simülasyon oluşturun veya mevcut simülasyonlarınızı görüntüleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/simulations/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yeni Simülasyon Oluştur
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Simulations */}
      <Card>
        <CardHeader>
          <CardTitle>Son Simülasyonlar</CardTitle>
          <CardDescription>En son oluşturduğunuz simülasyonlar</CardDescription>
        </CardHeader>
        <CardContent>
          {dbUser.simulations.length === 0 ? (
            <p className="text-muted-foreground">Henüz simülasyon oluşturmadınız</p>
          ) : (
            <div className="space-y-4">
              {dbUser.simulations.map((sim) => (
                <div key={sim.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-semibold">{sim.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sim.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      sim.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      sim.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      sim.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {sim.status === 'completed' ? 'Tamamlandı' :
                       sim.status === 'processing' ? 'İşleniyor' :
                       sim.status === 'pending' ? 'Beklemede' :
                       'Başarısız'}
                    </span>
                    <Link href={`/simulations/${sim.id}`}>
                      <Button variant="outline" size="sm">Detay</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
