'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Shield, ShieldOff, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserActionsProps {
  user: {
    id: string
    email: string
    isAdmin: boolean
  }
}

export function AdminUserActions({ user }: UserActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleAdmin = async () => {
    if (!confirm(`Bu kullanıcının admin yetkisini ${user.isAdmin ? 'kaldırmak' : 'vermek'} istediğinize emin misiniz?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !user.isAdmin }),
      })

      if (!response.ok) {
        throw new Error('İşlem başarısız')
      }

      router.refresh()
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleAdmin}>
          {user.isAdmin ? (
            <>
              <ShieldOff className="h-4 w-4 mr-2" />
              Admin Yetkisini Kaldır
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Admin Yetkisi Ver
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
