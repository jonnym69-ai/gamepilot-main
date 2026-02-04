import { useState, useCallback, useMemo } from 'react'
import { MOODS, type MoodId } from '@gamepilot/static-data'
import type { Game } from '../types'
import { calculateEnhancedMoodScore, enhanceGameMoods } from '../utils/enhancedMoodTagging'

/**
 * New Mood-based recommendation hook using the unified mood system
 * Uses deriveMoodFromGame for consistent mood assignment across the app
 */

interface MoodRecommendationState {
  primaryMood?: MoodId
  secondaryMood?: MoodId
  intensity: number
  recommendations: Game[]
  isLoading: boolean
  error?: string
}

interface UseNewMoodRecommendationsProps {
  games: Game[]
  onRecommendationsChange?: (recommendations: Game[]) => void
}

export function useNewMoodRecommendations({ games, onRecommendationsChange }: UseNewMoodRecommendationsProps) {
  const [state, setState] = useState<MoodRecommendationState>({
    intensity: 0.8,
    recommendations: [],
    isLoading: false
  })

  // Enhanced mood scoring using the new enhanced system
  const calculateMoodScore = useCallback((game: Game, moodId: MoodId, intensity: number): number => {
    return calculateEnhancedMoodScore(game, moodId, state.secondaryMood || null, intensity)
  }, [state.secondaryMood])

  const selectMood = useCallback(async (primaryMood: MoodId, secondaryMood?: MoodId) => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }))

    try {
      const primary = MOODS.find(m => m.id === primaryMood)
      if (!primary) {
        throw new Error(`Primary mood not found: ${primaryMood}`)
      }

      // Enhanced mood filtering with better scoring
      const filteredGames = useMemo(() => {
        if (!primaryMood) return games
        
        // First enhance all games with better mood tags
        const enhancedGames = enhanceGameMoods(games)
        
        // Score and filter games based on mood compatibility
        const scoredGames = enhancedGames.map(game => ({
          game,
          score: calculateMoodScore(game, primaryMood, state.intensity)
        }))
        
        // Sort by score and return top recommendations
        return scoredGames
          .sort((a, b) => b.score - a.score)
          .slice(0, 12) // Top 12 recommendations
          .map(item => item.game)
      }, [games, primaryMood, state.intensity, calculateMoodScore])

      const enhancedRecommendations = filteredGames.map((game: Game) => {
        let score = calculateMoodScore(game, primaryMood, state.intensity)
        let reasoning = `Matches ${primary.name.toLowerCase()} mood`

        if (secondaryMood) {
          const secondary = MOODS.find(m => m.id === secondaryMood)
          if (secondary) {
            const secondaryScore = calculateMoodScore(game, secondaryMood, state.intensity)
            score = (score + secondaryScore) / 2
            reasoning += ` and ${secondary.name.toLowerCase()} mood`
          }
        }

        return {
          ...game,
          moodScore: score,
          reasoning
        }
      })

      // Sort by score and filter
      const recommendations = enhancedRecommendations
        .filter((game: any) => game.moodScore > 40)
        .sort((a: any, b: any) => b.moodScore - a.moodScore)
        .slice(0, 10)

      setState(prev => ({
        ...prev,
        primaryMood,
        secondaryMood,
        recommendations,
        isLoading: false
      }))

      onRecommendationsChange?.(recommendations)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate recommendations',
        isLoading: false,
        recommendations: []
      }))
    }
  }, [games, state.intensity, calculateMoodScore, onRecommendationsChange])

  const clearMood = useCallback(() => {
    setState(prev => ({
      ...prev,
      primaryMood: undefined,
      secondaryMood: undefined,
      recommendations: []
    }))
    onRecommendationsChange?.([])
  }, [onRecommendationsChange])

  const setIntensity = useCallback((intensity: number) => {
    setState(prev => ({ ...prev, intensity }))
  }, [])

  return {
    // State
    primaryMood: state.primaryMood,
    secondaryMood: state.secondaryMood,
    intensity: state.intensity,
    recommendations: state.recommendations,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    selectMood,
    clearMood,
    setIntensity,
    
    // Computed
    hasRecommendations: state.recommendations.length > 0,
    recommendationCount: state.recommendations.length,
    primaryMoodInfo: state.primaryMood ? MOODS.find(m => m.id === state.primaryMood) : undefined,
    secondaryMoodInfo: state.secondaryMood ? MOODS.find(m => m.id === state.secondaryMood) : undefined
  }
}
