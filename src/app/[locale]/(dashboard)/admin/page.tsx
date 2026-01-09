import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, FileText, BarChart3 } from 'lucide-react'
import { AdminUsersTab } from '@/components/admin/users-tab'
import { AdminSimulationsTab } from '@/components/admin/simulations-tab'
import { AdminStatsTab } from '@/components/admin/stats-tab'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  })

  if (!dbUser || !dbUser.isAdmin) {
    redirect('/dashboard')
  }

  // Get stats
  const [totalUsers, totalSimulations, activeSimulations] = await Promise.all([
    prisma.user.count(),
    prisma.simulation.count(),
    prisma.simulation.count({
      where: {
        status: {
          in: ['pending', 'processing'],
        },
      },
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <p className="text-muted-foreground">
          Platform yönetimi ve istatistikler
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Simülasyon</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSimulations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Simülasyonlar</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSimulations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            İstatistikler
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Kullanıcılar
          </TabsTrigger>
          <TabsTrigger value="simulations">
            <FileText className="h-4 w-4 mr-2" />
            Simülasyonlar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="space-y-4">
          <AdminStatsTab />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <AdminUsersTab />
        </TabsContent>
        <TabsContent value="simulations" className="space-y-4">
          <AdminSimulationsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
