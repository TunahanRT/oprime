import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import * as z from 'zod'
import bcrypt from 'bcryptjs'

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
      },
    })

    // Create Supabase auth user
    const supabase = await createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
        },
      },
    })

    if (signUpError) {
      // Rollback database user if Supabase signup fails
      await prisma.user.delete({ where: { id: user.id } })
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
