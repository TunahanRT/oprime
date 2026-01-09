'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations('common')

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{t('appName')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tagline')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <p className="text-sm text-muted-foreground">
              info@oprime.com.tr
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OPRIME. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
