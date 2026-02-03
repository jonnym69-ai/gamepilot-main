import { useState, useCallback, useEffect, useRef } from 'react'
import { useLibraryStore } from '../stores/useLibraryStore'
import { getSteamRecommendations, type SteamRecommendations } from '../services/steamRecommendations'

/**
 * Hook for Steam game recommendations
 * SAFE: Complete isolation from mood system
 */

interface UseSteamRecommendationsState {
  recommendations: SteamRecommendations
  isLoading: boolean
  error: string | null
  lastRefresh: Date | null
}

interface UseSteamRecommendationsReturn extends UseSteamRecommendationsState {
  refreshRecommendations: () => Promise<void>
  clearRecommendations: () => void
  hasRecommendations: boolean
  recommendationCount: number
}

/**
 * Steam recommendations hook
 * SAFE: Only uses library data, no mood system interaction
 */
export function useSteamRecommendations(limit: number = 10): UseSteamRecommendationsReturn {
  const { games } = useLibraryStore()
  
  const [state, setState] = useState<UseSteamRecommendationsState>({
    recommendations: {
      games: [],
      totalFound: 0,
      genresSearched: [],
      excludedCount: 0
    },
    isLoading: false,
    error: null,
    lastRefresh: null
  })

  // Debouncing ref to prevent rapid API calls
  const lastRefreshTime = useRef<number>(0)
  const DEBOUNCE_DELAY = 2000 // 2 seconds between refreshes

  const refreshRecommendations = useCallback(async () => {
    const now = Date.now()
    if (now - lastRefreshTime.current < DEBOUNCE_DELAY) {
      console.log('🔄 Refresh throttled - please wait')
      return
    }
    
    lastRefreshTime.current = now
    console.log('🔄 Refreshing Steam recommendations...')
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const recommendations = await getSteamRecommendations(games || [], limit)
      
      setState({
        recommendations,
        isLoading: false,
        error: null,
        lastRefresh: new Date()
      })

      console.log('✅ Steam recommendations refreshed:', {
        count: recommendations.games.length,
        totalFound: recommendations.totalFound,
        genresSearched: recommendations.genresSearched
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Steam recommendations'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))

      console.error('❌ Error refreshing Steam recommendations:', error)
    }
  }, [games, limit])

  // Initialize recommendations only once when games are available
  useEffect(() => {
    if (games && games.length > 0 && !state.lastRefresh && !state.isLoading) {
      refreshRecommendations()
    }
  }, [games, refreshRecommendations, state.lastRefresh, state.isLoading])

  const clearRecommendations = useCallback(() => {
    setState({
      recommendations: {
        games: [],
        totalFound: 0,
        genresSearched: [],
        excludedCount: 0
      },
      isLoading: false,
      error: null,
      lastRefresh: null
    })
  }, [])

  const hasRecommendations = state.recommendations.games.length > 0
  const recommendationCount = state.recommendations.games.length

  return {
    ...state,
    refreshRecommendations,
    clearRecommendations,
    hasRecommendations,
    recommendationCount
  }
}
