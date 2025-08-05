import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, foodData, servingSize, mealType } = body

    if (!userId || !foodData || !servingSize || !mealType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // First, ensure the food exists in our database
    let food = await prisma.food.findFirst({
      where: { id: foodData.id }
    })

    if (!food) {
      // Create the food entry if it doesn't exist
      food = await prisma.food.create({
        data: {
          id: foodData.id,
          name: foodData.name,
          brand: foodData.brand,
          caloriesPer100g: foodData.caloriesPer100g,
          proteinPer100g: foodData.proteinPer100g,
          carbsPer100g: foodData.carbsPer100g,
          fatPer100g: foodData.fatPer100g,
          fiberPer100g: foodData.fiberPer100g || 0,
          sugarPer100g: foodData.sugarPer100g || 0,
          sodiumPer100g: foodData.sodiumPer100g || 0
        }
      })
    }

    // Calculate nutrition based on serving size
    const servingRatio = servingSize / 100
    const calories = Math.round(food.caloriesPer100g * servingRatio)
    const protein = parseFloat((food.proteinPer100g * servingRatio).toFixed(2))
    const carbs = parseFloat((food.carbsPer100g * servingRatio).toFixed(2))
    const fat = parseFloat((food.fatPer100g * servingRatio).toFixed(2))

    // Create food entry
    const foodEntry = await prisma.foodEntry.create({
      data: {
        userId,
        foodId: food.id,
        servingSize,
        mealType: mealType.toLowerCase(),
        calories,
        protein,
        carbs,
        fat
      },
      include: {
        food: true
      }
    })

    return NextResponse.json({ success: true, foodEntry })

  } catch (error) {
    console.error('Add food error:', error)
    return NextResponse.json({ error: 'Failed to add food' }, { status: 500 })
  }
}