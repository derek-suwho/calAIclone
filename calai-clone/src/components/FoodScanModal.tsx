'use client'

import { useState, useRef } from 'react'
import { Camera, X, Upload, Check } from 'lucide-react'

interface ScannedFood {
  id: string
  name: string
  brand?: string
  confidence: number
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  suggestedServing: number
}

interface FoodScanModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFood: (food: any, servingSize: number, mealType: string) => void
  mealType: string
}

export default function FoodScanModal({ isOpen, onClose, onAddFood, mealType }: FoodScanModalProps) {
  const [scanning, setScanning] = useState(false)
  const [scannedFood, setScannedFood] = useState<ScannedFood | null>(null)
  const [servingSize, setServingSize] = useState(100)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    setScanning(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/scan-food', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setScannedFood(data.recognizedFood)
        setServingSize(data.recognizedFood.suggestedServing || 100)
      }
    } catch (error) {
      console.error('Food scan error:', error)
    } finally {
      setScanning(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleAddScannedFood = () => {
    if (scannedFood) {
      onAddFood(scannedFood, servingSize, mealType)
      onClose()
      setScannedFood(null)
      setServingSize(100)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Scan Food</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {!scannedFood ? (
            <div className="text-center">
              {scanning ? (
                <div className="py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Scanning food...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <p className="text-gray-400 mb-6">
                    Take a photo or upload an image of your food to get instant nutrition information
                  </p>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-green-600 hover:bg-green-700 rounded-lg py-3 font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Photo</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Note: This is a simulation for demo purposes
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Scanned Result */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-500">Food Recognized!</span>
                </div>
                
                <h3 className="font-semibold text-lg">{scannedFood.name}</h3>
                {scannedFood.brand && (
                  <p className="text-gray-400 text-sm">{scannedFood.brand}</p>
                )}
                <p className="text-gray-400 text-sm">
                  Confidence: {Math.round(scannedFood.confidence * 100)}%
                </p>
              </div>

              {/* Serving Size */}
              <div>
                <label className="block text-sm font-medium mb-2">Serving Size (grams)</label>
                <input
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(Number(e.target.value))}
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                />
              </div>

              {/* Nutrition Preview */}
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Calories: {Math.round((scannedFood.caloriesPer100g * servingSize) / 100)}</div>
                  <div>Protein: {((scannedFood.proteinPer100g * servingSize) / 100).toFixed(1)}g</div>
                  <div>Carbs: {((scannedFood.carbsPer100g * servingSize) / 100).toFixed(1)}g</div>
                  <div>Fat: {((scannedFood.fatPer100g * servingSize) / 100).toFixed(1)}g</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setScannedFood(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-3 font-medium transition-colors"
                >
                  Scan Again
                </button>
                <button
                  onClick={handleAddScannedFood}
                  className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg py-3 font-medium transition-colors"
                >
                  Add to {mealType}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}