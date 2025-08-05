import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    // Search local database first
    const localFoods = await prisma.food.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { brand: { contains: query } }
        ]
      },
      take: 10
    })

    // If we have local results, return them
    if (localFoods.length > 0) {
      return NextResponse.json({ foods: localFoods, source: 'local' })
    }

    // If no local results, use nutrition API (USDA FoodData Central)
    const USDA_API_KEY = process.env.USDA_API_KEY
    
    if (!USDA_API_KEY) {
      // Return some mock data for development
      const mockFoods = [
        {
          id: 'mock-1',
          name: `${query} (Mock)`,
          brand: 'Generic',
          caloriesPer100g: 150,
          proteinPer100g: 8.0,
          carbsPer100g: 25.0,
          fatPer100g: 3.5,
          fiberPer100g: 2.0,
          sugarPer100g: 5.0,
          sodiumPer100g: 200.0
        }
      ]
      return NextResponse.json({ foods: mockFoods, source: 'mock' })
    }

    // Call USDA API
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10&dataType=Foundation,SR%20Legacy`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from USDA API')
    }

    const data = await response.json()
    
    // Transform USDA data to our format
    const foods = data.foods?.map((food: any) => {
      const nutrients = food.foodNutrients || []
      
      const getNutrient = (nutrientId: number) => {
        const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId)
        return nutrient?.value || 0
      }

      return {
        id: `usda-${food.fdcId}`,
        name: food.description,
        brand: food.brandOwner || null,
        caloriesPer100g: Math.round(getNutrient(1008)), // Energy
        proteinPer100g: parseFloat(getNutrient(1003).toFixed(2)), // Protein
        carbsPer100g: parseFloat(getNutrient(1005).toFixed(2)), // Carbs
        fatPer100g: parseFloat(getNutrient(1004).toFixed(2)), // Fat
        fiberPer100g: parseFloat(getNutrient(1079).toFixed(2)), // Fiber
        sugarPer100g: parseFloat(getNutrient(2000).toFixed(2)), // Sugar
        sodiumPer100g: parseFloat(getNutrient(1093).toFixed(2)) // Sodium
      }
    }) || []

    return NextResponse.json({ foods, source: 'usda' })

  } catch (error) {
    console.error('Food search error:', error)
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 })
  }
}