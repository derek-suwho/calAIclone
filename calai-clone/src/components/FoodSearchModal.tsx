'use client'

import { useState } from 'react'
import { Search, X, Plus } from 'lucide-react'

interface Food {
  id: string
  name: string
  brand?: string
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
}

interface FoodSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFood: (food: Food, servingSize: number, mealType: string) => void
  mealType: string
}

export default function FoodSearchModal({ isOpen, onClose, onAddFood, mealType }: FoodSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Food[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [servingSize, setServingSize] = useState(100)

  const searchFoods = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/food/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.foods || [])
    } catch (error) {
      console.error('Food search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = () => {
    if (selectedFood) {
      onAddFood(selectedFood, servingSize, mealType)
      onClose()
      setSearchQuery('')
      setSearchResults([])
      setSelectedFood(null)
      setServingSize(100)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Add to {mealType}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchFoods()}
                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={searchFoods}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg px-4 py-2 font-medium transition-colors"
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-4 space-y-2">
              {searchResults.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedFood?.id === food.id
                      ? 'bg-green-600 border-green-500'
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{food.name}</div>
                  {food.brand && <div className="text-sm text-gray-400">{food.brand}</div>}
                  <div className="text-sm text-gray-300">
                    {food.caloriesPer100g} cal per 100g
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery && !loading ? (
            <div className="p-4 text-center text-gray-400">
              No foods found. Try a different search term.
            </div>
          ) : null}
        </div>

        {/* Add Food Section */}
        {selectedFood && (
          <div className="p-4 border-t border-gray-800">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Serving Size (grams)</label>
              <input
                type="number"
                value={servingSize}
                onChange={(e) => setServingSize(Number(e.target.value))}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
              />
            </div>
            
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300">
                <div>Calories: {Math.round((selectedFood.caloriesPer100g * servingSize) / 100)}</div>
                <div>Protein: {((selectedFood.proteinPer100g * servingSize) / 100).toFixed(1)}g</div>
                <div>Carbs: {((selectedFood.carbsPer100g * servingSize) / 100).toFixed(1)}g</div>
                <div>Fat: {((selectedFood.fatPer100g * servingSize) / 100).toFixed(1)}g</div>
              </div>
            </div>

            <button
              onClick={handleAddFood}
              className="w-full bg-green-600 hover:bg-green-700 rounded-lg py-3 font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Food</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}