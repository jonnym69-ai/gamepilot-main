/**
 * Fixed Mood-Based Recommendations Component
 * 
 * Uses the new clean mood filtering system with accurate, predictable results
 * and non-overlapping mood categories.
 */

import React, { useState, useMemo } from 'react'
import type { Game } from '@gamepilot/types'
import { LazyImage } from '../LazyImage'
import { Loading } from '../Loading'
import { toast } from '../Toast'
import { 
  filterGamesByMood, 
  getMoodRecommendation, 
  MoodFilterId, 
  MOOD_FILTERS,
  validateMoodSystem
} from '../../utils/moodFilterSystem'

interface MoodBasedRecommendationsProps {
  games: Game[]
  primaryMood?: MoodFilterId
  secondaryMood?: MoodFilterId
  onGameSelect?: (game: Game) => void
  onQuickPlay?: (game: Game) => void
  isLoading?: boolean
}

interface RecommendationScore {
  game: Game
  score: number
  reason: string
  moodAlignment: number
  confidence: number
}

export const MoodBasedRecommendationsFixed: React.FC<MoodBasedRecommendationsProps> = ({
  games,
  primaryMood,
  secondaryMood,
  onGameSelect,
  onQuickPlay,
  isLoading = false
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'confidence'>('score')
  const [showReasons, setShowReasons] = useState(true)
  const [showValidation, setShowValidation] = useState(false)

  // Generate recommendations using the new clean filtering system
  const recommendations = useMemo(() => {
    if (!primaryMood || games.length === 0) return []

    // Get primary mood recommendations
    const primaryRecommendations = filterGamesByMood(games, primaryMood, 20)
    
    // Score each recommendation
    const scored: RecommendationScore[] = primaryRecommendations.map(game => {
      const recommendation = getMoodRecommendation(game, primaryMood)
      if (!recommendation) {
        return {
          game,
          score: 50,
          reason: 'General mood match',
          moodAlignment: 50,
          confidence: 0.5
        }
      }

      // Add secondary mood bonus if applicable
      let finalScore = recommendation.score
      let finalReason = recommendation.reason
      
      if (secondaryMood && secondaryMood !== primaryMood) {
        const secondaryRec = getMoodRecommendation(game, secondaryMood)
        if (secondaryRec) {
          finalScore = Math.min(100, finalScore + 15) // Bonus for matching both moods
          finalReason += ` + ${secondaryMood} mood`
        }
      }

      return {
        game,
        score: finalScore,
        reason: finalReason,
        moodAlignment: recommendation.score,
        confidence: recommendation.score / 100
      }
    })

    // Sort and filter
    return scored
      .filter(rec => rec.score > 60) // Only show good matches
      .sort((a, b) => {
        switch (sortBy) {
          case 'score': return b.score - a.score
          case 'confidence': return b.confidence - a.confidence
          default: return b.score - a.score
        }
      })
      .slice(0, 12) // Top 12 recommendations
  }, [games, primaryMood, secondaryMood, sortBy])

  // Validate mood system (for debugging)
  const validationResults = useMemo(() => {
    if (!showValidation || games.length === 0) return null
    return validateMoodSystem(games)
  }, [showValidation, games])

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center h-32">
          <Loading size="md" />
        </div>
      </div>
    )
  }

  if (!primaryMood) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="text-center text-gray-400">
          <span className="text-2xl mb-2 block">🎭</span>
          <p>Select a mood to see personalized recommendations</p>
        </div>
      </div>
    )
  }

  const primaryMoodData = MOOD_FILTERS.find(m => m.id === primaryMood)
  const secondaryMoodData = secondaryMood ? MOOD_FILTERS.find(m => m.id === secondaryMood) : null

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            Mood-Based Recommendations
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${primaryMoodData?.color || 'bg-gray-600'}`}>
              {primaryMoodData?.icon} {primaryMoodData?.name}
            </span>
            {secondaryMoodData && (
              <>
                <span className="text-gray-400">+</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${secondaryMoodData.color || 'bg-gray-600'}`}>
                  {secondaryMoodData.icon} {secondaryMoodData.name}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReasons(!showReasons)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showReasons ? 'Hide' : 'Show'} Reasons
          </button>
          
          <button
            onClick={() => setShowValidation(!showValidation)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showValidation ? 'Hide' : 'Show'} Validation
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm bg-gray-700 text-white border border-gray-600 rounded px-3 py-1"
            aria-label="Sort recommendations by"
            title="Sort recommendations by"
          >
            <option value="score">Best Match</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>

      {/* Validation Results */}
      {showValidation && validationResults && (
        <div className="mb-6 p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
          <h4 className="text-sm font-bold text-white mb-2">Mood System Validation</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="text-center">
              <div className="text-blue-400 font-bold">{validationResults.social}</div>
              <div className="text-gray-400">Social</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-bold">{validationResults.competitive}</div>
              <div className="text-gray-400">Competitive</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold">{validationResults.story}</div>
              <div className="text-gray-400">Story</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">{validationResults.adventure}</div>
              <div className="text-gray-400">Adventure</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-400 font-bold">{validationResults.chill}</div>
              <div className="text-gray-400">Chill</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-400 font-bold">{validationResults.creative}</div>
              <div className="text-gray-400">Creative</div>
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span className="text-gray-400">Overlap: </span>
            <span className={validationResults.totalOverlap > 0 ? 'text-yellow-400' : 'text-green-400'}>
              {validationResults.totalOverlap} games
            </span>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.game.id}
            className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all cursor-pointer group"
            onClick={() => onGameSelect?.(rec.game)}
          >
            {/* Game Cover */}
            <div className="relative mb-3">
              <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                {rec.game.coverImage ? (
                  <LazyImage
                    src={rec.game.coverImage}
                    alt={rec.game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <span className="text-3xl opacity-50">🎮</span>
                  </div>
                )}
              </div>
              
              {/* Score Badge */}
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-xs font-bold text-white">
                  {Math.round(rec.score)}%
                </span>
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                {rec.game.title}
              </h4>
              
              {/* Score Breakdown */}
              <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-400">{Math.round(rec.moodAlignment)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400">{Math.round(rec.confidence * 100)}%</span>
                </div>
              </div>

              {/* Reasons */}
              {showReasons && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 line-clamp-2">
                    • {rec.reason}
                  </p>
                </div>
              )}

              {/* Genres */}
              {rec.game.genres && rec.game.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {rec.game.genres.slice(0, 2).map(genre => (
                    <span
                      key={genre.id}
                      className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onGameSelect?.(rec.game)
                  }}
                  className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickPlay?.(rec.game)
                  }}
                  className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Found {recommendations.length} matching games</span>
          <button
            onClick={() => toast.info('Recommendations', 'Using clean mood filtering system with non-overlapping categories')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Learn more about recommendations →
          </button>
        </div>
      </div>
    </div>
  )
}
