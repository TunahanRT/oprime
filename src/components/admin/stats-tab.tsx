import { prisma } from '@/lib/prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export async function AdminStatsTab() {
  // Get statistics
  const [
    totalUsers,
    totalSimulations,
    simulationsByStatus,
    simulationsByParticleType,
    recentSimulations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.simulation.count(),
    prisma.simulation.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    }),
    prisma.simulation.groupBy({
      by: ['particleType'],
      _count: {
        id: true,
      },
    }),
    prisma.simulation.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    }),
  ])

  const statusData = simulationsByStatus.map((item) => ({
    name: item.status === 'completed' ? 'Tamamlandı' :
          item.status === 'processing' ? 'İşleniyor' :
          item.status === 'pending' ? 'Beklemede' : 'Başarısız',
    value: item._count.id,
  }))

  const particleData = simulationsByParticleType.map((item) => ({
    name: item.particleType === 'neutron' ? 'Nötron' : 'Gama',
    value: item._count.id,
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Simülasyon Durumları</CardTitle>
          <CardDescription>Simülasyonların durum dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parçacık Tipi Dağılımı</CardTitle>
          <CardDescription>Nötron vs Gama simülasyonları</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={particleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {particleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Son Simülasyonlar</CardTitle>
          <CardDescription>En son oluşturulan simülasyonlar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentSimulations.map((sim) => (
              <div
                key={sim.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <p className="font-medium">{sim.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {sim.user.email} • {new Date(sim.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {sim.particleType === 'neutron' ? 'Nötron' : 'Gama'} • {sim.energy} {sim.energyUnit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
