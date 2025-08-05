import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      dailyCalorieGoal: 2000,
      dailyWaterGoal: 2500,
      targetWeight: 70.0,
      currentWeight: 72.5
    }
  })

  // Create some common foods
  const foods = [
    {
      id: 'apple',
      name: 'Apple',
      caloriesPer100g: 52,
      proteinPer100g: 0.3,
      carbsPer100g: 14.0,
      fatPer100g: 0.2,
      fiberPer100g: 2.4,
      sugarPer100g: 10.4,
      sodiumPer100g: 1.0
    },
    {
      id: 'banana',
      name: 'Banana',
      caloriesPer100g: 89,
      proteinPer100g: 1.1,
      carbsPer100g: 23.0,
      fatPer100g: 0.3,
      fiberPer100g: 2.6,
      sugarPer100g: 12.2,
      sodiumPer100g: 1.0
    },
    {
      id: 'oatmeal',
      name: 'Oatmeal',
      caloriesPer100g: 68,
      proteinPer100g: 2.4,
      carbsPer100g: 12.0,
      fatPer100g: 1.4,
      fiberPer100g: 1.7,
      sugarPer100g: 0.3,
      sodiumPer100g: 49.0
    },
    {
      id: 'greek-yogurt',
      name: 'Greek Yogurt',
      brand: 'Plain',
      caloriesPer100g: 97,
      proteinPer100g: 9.0,
      carbsPer100g: 3.9,
      fatPer100g: 5.0,
      fiberPer100g: 0.0,
      sugarPer100g: 3.9,
      sodiumPer100g: 35.0
    },
    {
      id: 'chicken-breast',
      name: 'Chicken Breast',
      brand: 'Skinless',
      caloriesPer100g: 165,
      proteinPer100g: 31.0,
      carbsPer100g: 0.0,
      fatPer100g: 3.6,
      fiberPer100g: 0.0,
      sugarPer100g: 0.0,
      sodiumPer100g: 74.0
    }
  ]

  for (const food of foods) {
    await prisma.food.upsert({
      where: { id: food.id },
      update: {},
      create: food
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })