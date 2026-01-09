import { Sidebar } from '@/components/layout/sidebar'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  })

  // Only show admin link if user is admin
  return (
    <div className="flex h-screen">
      <Sidebar isAdmin={dbUser?.isAdmin || false} />
      <div className="flex-1 overflow-auto">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
