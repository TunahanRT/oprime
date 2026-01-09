import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { simulationSchema } from '@/lib/validations/simulation'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const simulations = await prisma.simulation.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ simulations })
  } catch (error) {
    console.error('Error fetching simulations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = simulationSchema.parse(body)

    const simulation = await prisma.simulation.create({
      data: {
        userId: dbUser.id,
        title: validatedData.title,
        description: validatedData.description,
        particleType: validatedData.particleType,
        energy: validatedData.energy,
        energyUnit: validatedData.energyUnit,
        particleCount: validatedData.particleCount,
        materials: validatedData.materials as any,
        layers: validatedData.layers as any,
        uploadedFiles: validatedData.uploadedFiles || [],
        status: 'pending',
      },
    })

    // TODO: Trigger simulation processing job here

    return NextResponse.json({ id: simulation.id, simulation }, { status: 201 })
  } catch (error) {
    console.error('Error creating simulation:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
