'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isAdmin?: boolean
}

const navigation = [
  {
    name: 'dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    name: 'simulations',
    href: '/simulations',
    icon: FileText,
    label: 'Simülasyonlar',
  },
  {
    name: 'admin',
    href: '/admin',
    icon: Users,
    label: 'Admin',
    adminOnly: true,
  },
]

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  
  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || isAdmin
  )

  return (
    <aside className="w-64 border-r bg-background p-4">
      <nav className="space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-secondary'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
