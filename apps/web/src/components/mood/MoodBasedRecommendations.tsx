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
  reasons: string[]
  moodAlignment: number
  genreMatch: number
  playstyleMatch: number
}

export const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({
  games,
  primaryMood,
  secondaryMood,
  onGameSelect,
  onQuickPlay,
  isLoading = false
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'moodAlignment' | 'genreMatch'>('score')
  const [showReasons, setShowReasons] = useState(true)

  // Generate recommendations using the new mood filter system
  const recommendations = useMemo(() => {
    if (!primaryMood || games.length === 0) return []

    // Get primary mood recommendations
    const primaryRecommendations = filterGamesByMood(games, primaryMood, 20)
    
    // Score each recommendation
    const scored: RecommendationScore[] = primaryRecommendations.map((game: any) => {
      const recommendation = getMoodRecommendation(game, primaryMood)
      if (!recommendation) {
        return {
          game,
          score: 50,
          reasons: ['General mood match'],
          moodAlignment: 50,
          genreMatch: 50,
          playstyleMatch: 50
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
        reasons: [finalReason],
        moodAlignment: recommendation.score,
        genreMatch: recommendation.score,
        playstyleMatch: recommendation.score
      }
    })

    // Sort and filter
    return scored
      .filter(rec => rec.score > 60) // Only show good matches
      .sort((a, b) => {
        switch (sortBy) {
          case 'score': return b.score - a.score
          case 'moodAlignment': return b.moodAlignment - a.moodAlignment
          case 'genreMatch': return b.playstyleMatch - a.playstyleMatch
          default: return b.score - a.score
        }
      })
      .slice(0, 12) // Top 12 recommendations
  }, [games, primaryMood, secondaryMood, sortBy])

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

  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="text-center text-gray-400">
          <span className="text-2xl mb-2 block">🔍</span>
          <p>No games match your current mood selection</p>
          <p className="text-sm mt-2">Try selecting different moods or adding more games to your library</p>
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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${primaryMoodData?.color || 'bg-gray-600'}`}>
              {primaryMoodData?.icon} {primaryMoodData?.name}
            </span>
            {secondaryMoodData && (
              <>
                <span className="text-gray-400">+</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${secondaryMoodData.color || 'bg-gray-600'}`}>
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
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm bg-gray-700 text-white border border-gray-600 rounded px-3 py-1"
            aria-label="Sort recommendations by"
            title="Sort recommendations by"
          >
            <option value="score">Best Match</option>
            <option value="moodAlignment">Mood Match</option>
            <option value="genreMatch">Genre Match</option>
          </select>
        </div>
      </div>

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
                  <span className="text-gray-400">{Math.round(rec.genreMatch)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-400">{Math.round(rec.playstyleMatch)}%</span>
                </div>
              </div>

              {/* Reasons */}
              {showReasons && rec.reasons.length > 0 && (
                <div className="space-y-1">
                  {rec.reasons.slice(0, 2).map((reason, index) => (
                    <p key={index} className="text-xs text-gray-400 line-clamp-2">
                      • {reason}
                    </p>
                  ))}
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
            onClick={() => toast.info('Recommendations', 'Using enhanced mood filter system with non-overlapping categories')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Learn more about recommendations →
          </button>
        </div>
      </div>
    </div>
  )
}
