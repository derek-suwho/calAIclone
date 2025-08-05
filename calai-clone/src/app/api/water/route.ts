import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get start and end of day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Get water entries for the day
    const waterEntries = await prisma.waterEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Calculate total water intake
    const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0)

    // Get user's daily water goal
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyWaterGoal: true }
    })

    const dailyGoal = user?.dailyWaterGoal || 2500
    const glassesConsumed = Math.floor(totalWater / 250) // Assuming 250ml per glass

    return NextResponse.json({
      totalWater,
      dailyGoal,
      glassesConsumed,
      entries: waterEntries
    })

  } catch (error) {
    console.error('Water fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch water data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount = 250 } = body // Default to 250ml per glass

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Add water entry
    const waterEntry = await prisma.waterEntry.create({
      data: {
        userId,
        amount
      }
    })

    return NextResponse.json({ success: true, waterEntry })

  } catch (error) {
    console.error('Add water error:', error)
    return NextResponse.json({ error: 'Failed to add water' }, { status: 500 })
  }
}