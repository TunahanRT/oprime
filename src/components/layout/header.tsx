'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './language-toggle'
import { usePathname } from 'next/navigation'

export function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">{t('appName')}</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          {!isAuthPage && (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/simulations">
                <Button variant="ghost">Simülasyonlar</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
          <LanguageToggle />
          {!isAuthPage && (
            <Link href="/login">
              <Button variant="outline">Giriş Yap</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
