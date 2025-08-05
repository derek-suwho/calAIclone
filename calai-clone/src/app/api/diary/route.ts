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

    // Get food entries for the day
    const foodEntries = await prisma.foodEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        food: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by meal type
    const meals = {
      breakfast: foodEntries.filter(entry => entry.mealType === 'breakfast'),
      lunch: foodEntries.filter(entry => entry.mealType === 'lunch'),
      dinner: foodEntries.filter(entry => entry.mealType === 'dinner'),
      snacks: foodEntries.filter(entry => entry.mealType === 'snacks')
    }

    // Calculate totals
    const totals = foodEntries.reduce((acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    // Get user's daily goal
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyCalorieGoal: true }
    })

    const remaining = (user?.dailyCalorieGoal || 2000) - totals.calories

    return NextResponse.json({
      meals,
      totals: {
        ...totals,
        protein: parseFloat(totals.protein.toFixed(2)),
        carbs: parseFloat(totals.carbs.toFixed(2)),
        fat: parseFloat(totals.fat.toFixed(2))
      },
      goal: user?.dailyCalorieGoal || 2000,
      remaining: Math.max(0, remaining)
    })

  } catch (error) {
    console.error('Diary fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch diary' }, { status: 500 })
  }
}