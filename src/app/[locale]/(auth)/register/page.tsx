'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { prisma } from '@/lib/prisma/client'

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Şifreler eşleşmiyor',
  path: ['passwordConfirm'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError(null)

    try {
      // Supabase Auth ile kullanıcı oluştur
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (authData.user) {
        // Prisma ile kullanıcıyı veritabanına ekle
        // Not: Bu işlem API route'unda yapılmalı, şimdilik burada bırakıyoruz
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kayıt Ol</CardTitle>
        <CardDescription>
          Yeni bir hesap oluşturmak için bilgilerinizi girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">İsim (Opsiyonel)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Adınız"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
            {password && (
              <p className="text-xs text-muted-foreground">
                Şifre gücü: {password.length >= 8 ? 'Güçlü' : password.length >= 6 ? 'Orta' : 'Zayıf'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Şifre Tekrar</Label>
            <Input
              id="passwordConfirm"
              type="password"
              {...register('passwordConfirm')}
            />
            {errors.passwordConfirm && (
              <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Giriş yapın
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
