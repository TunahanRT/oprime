import { prisma } from '@/lib/prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Shield, ShieldOff } from 'lucide-react'
import { AdminUserActions } from './user-actions'

export async function AdminUsersTab() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          simulations: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kullanıcı Yönetimi</CardTitle>
        <CardDescription>
          Tüm kullanıcıları görüntüleyin ve yönetin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kullanıcı ara..."
                className="pl-8"
                disabled
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left text-sm font-medium">Kullanıcı</th>
                    <th className="p-4 text-left text-sm font-medium">E-posta</th>
                    <th className="p-4 text-left text-sm font-medium">Simülasyonlar</th>
                    <th className="p-4 text-left text-sm font-medium">Durum</th>
                    <th className="p-4 text-left text-sm font-medium">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.name || 'İsimsiz'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <Badge variant="outline">{user._count.simulations}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {user.isAdmin ? (
                            <Badge variant="default" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <ShieldOff className="h-3 w-3" />
                              Kullanıcı
                            </Badge>
                          )}
                          {user.emailVerified ? (
                            <Badge variant="outline">Doğrulanmış</Badge>
                          ) : (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                              Doğrulanmamış
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <AdminUserActions user={user} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Henüz kullanıcı bulunmuyor
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
