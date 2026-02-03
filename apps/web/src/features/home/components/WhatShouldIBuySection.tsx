import React from 'react'
import { getMockStoreRecommendations } from '../utils/homeHelpers'

interface WhatShouldIBuyProps {
  games: any[]
}

export const WhatShouldIBuySection: React.FC<WhatShouldIBuyProps> = ({ games }) => {
  const recommendations = getMockStoreRecommendations(games)

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-2xl">🛒</span>
          What Should I Buy?
        </h2>
        <div className="text-sm text-gray-400">
          Based on your library
        </div>
      </div>

      <div className="glass-morphism rounded-xl p-6">
        <div className="mb-4">
          <p className="text-gray-300 text-sm">
            Coming Soon: Real Store Integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-all cursor-pointer"
            >
              {/* Header Image - 16:9 aspect ratio with consistent sizing */}
              <div className="aspect-video w-full overflow-hidden rounded-t-md">
                {rec.image ? (
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20 text-4xl text-gray-500">
                  🎮
                </div>
              </div>

              {/* Game Info */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-white">
                  {rec.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="px-2 py-1 bg-gaming-accent/20 rounded text-gaming-accent">
                    {rec.genre}
                  </span>
                  {rec.rating && (
                    <span>⭐ {rec.rating}</span>
                  )}
                </div>

                <p className="text-sm text-gray-300 line-clamp-2">
                  {rec.description}
                </p>

                <div className="text-sm text-gaming-accent font-medium">
                  {rec.reason}
                </div>

                {rec.price && (
                  <div className="text-lg font-bold text-white">
                    {rec.price}
                  </div>
                )}

                <button
                  disabled
                  className="w-full px-3 py-2 bg-gray-700 text-gray-400 rounded text-sm font-medium cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            🚀 Store integration coming soon! These recommendations will be linked to real purchase options.
          </p>
        </div>
      </div>
    </section>
  )
}
