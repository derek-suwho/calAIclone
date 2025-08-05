import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, dailyCalorieGoal, dailyWaterGoal, targetWeight, currentWeight } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          dailyCalorieGoal,
          dailyWaterGoal,
          targetWeight,
          currentWeight
        }
      })
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          dailyCalorieGoal: dailyCalorieGoal || 2000,
          dailyWaterGoal: dailyWaterGoal || 2500,
          targetWeight,
          currentWeight
        }
      })
    }

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error('User creation/update error:', error)
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}