'use client'

import { useState } from 'react'
import { Camera, Plus, Search, User, BarChart3, Droplets, Scale } from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('diary')
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">C</span>
          </div>
          <h1 className="text-xl font-bold">Cal AI</h1>
        </div>
        <User className="w-6 h-6" />
      </header>

      {/* Date */}
      <div className="p-4 text-center">
        <p className="text-gray-400 text-sm">{today}</p>
      </div>

      {/* Calorie Summary Card */}
      <div className="mx-4 mb-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-400 mb-2">1,247</div>
            <div className="text-gray-400 text-sm">Calories consumed</div>
            <div className="text-gray-500 text-xs">553 remaining</div>
          </div>
          
          {/* Progress Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="rgb(31, 41, 55)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.69)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">69%</span>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-blue-400">89g</div>
              <div className="text-xs text-gray-400">Protein</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-yellow-400">156g</div>
              <div className="text-xs text-gray-400">Carbs</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-400">52g</div>
              <div className="text-xs text-gray-400">Fat</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 flex items-center space-x-3 shadow-lg">
            <Camera className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Scan Food</div>
              <div className="text-xs opacity-80">Take a photo</div>
            </div>
          </button>
          <button className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center space-x-3">
            <Search className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Search</div>
              <div className="text-xs text-gray-400">Find foods</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex bg-gray-900 rounded-lg p-1">
          {['diary', 'progress', 'water'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4">
        {activeTab === 'diary' && (
          <div className="space-y-4">
            {/* Meals */}
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
              <div key={meal} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{meal}</h3>
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-sm text-gray-400">
                  {meal === 'Breakfast' ? '2 items • 420 cal' : 'Add food'}
                </div>
                {meal === 'Breakfast' && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="font-medium">Oatmeal with berries</div>
                        <div className="text-xs text-gray-400">1 bowl</div>
                      </div>
                      <div className="text-sm">280 cal</div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="font-medium">Greek yogurt</div>
                        <div className="text-xs text-gray-400">1 cup</div>
                      </div>
                      <div className="text-sm">140 cal</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-semibold">Weight Progress</h3>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">72.5 kg</div>
              <div className="text-sm text-gray-400">-0.5 kg this week</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center space-x-2 mb-3">
                <Scale className="w-5 h-5" />
                <h3 className="font-semibold">Goal Progress</h3>
              </div>
              <div className="text-sm text-gray-400 mb-2">Target: 70 kg</div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-sm text-gray-400 mt-2">75% complete</div>
            </div>
          </div>
        )}

        {activeTab === 'water' && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <Droplets className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Water Intake</h3>
              </div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-400 mb-1">1.2L</div>
                <div className="text-sm text-gray-400">of 2.5L goal</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                  <div
                    key={glass}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center ${
                      glass <= 3
                        ? 'bg-blue-400 border-blue-400'
                        : 'border-gray-700'
                    }`}
                  >
                    <Droplets className={`w-4 h-4 ${glass <= 3 ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                ))}
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-medium transition-colors">
                Add Glass
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  )
}