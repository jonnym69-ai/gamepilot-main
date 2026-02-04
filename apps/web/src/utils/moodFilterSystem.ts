/**
 * Clean Mood → Genre → Feature Mapping System
 * 
 * This system provides accurate, predictable recommendations by enforcing
 * non-overlapping mood categories and feature-based filtering where appropriate.
 */

import type { Game } from '@gamepilot/types'
import { deriveMoodFromGame } from './moodMapping'

// Core mood categories with strict, non-overlapping definitions
export interface MoodFilterConfig {
  id: string
  name: string
  description: string
  icon: string // Icon for display
  color: string // Tailwind gradient class
  
  // Feature-based requirements (for Social and Competitive)
  requiredFeatures?: string[]
  excludedFeatures?: string[]
  
  // Genre-based requirements (for Story, Adventure, Chill, Creative)
  includedGenres?: string[]
  excludedGenres?: string[]
  
  // Priority rules
  priority: number // Higher priority overrides lower priority
  
  // Matching logic
  matches: (game: Game) => boolean
  scoreReason: (game: Game) => string
}

// Feature detection helpers
const hasMultiplayerFeatures = (game: Game): boolean => {
  const features = [
    'multiplayer', 'coop', 'co-op', 'cooperative', 'online', 'party', 
    'shared-world', 'mmorpg', 'mmo', 'team-based', 'pvp', 'local-multiplayer'
  ]
  
  const moods = game.moods || []
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  const title = game.title.toLowerCase()
  
  return features.some(feature => 
    moods.some(mood => mood.toLowerCase().includes(feature)) ||
    genres.some(genre => genre.includes(feature)) ||
    title.includes(feature)
  )
}

const hasCompetitiveFeatures = (game: Game): boolean => {
  const competitiveFeatures = [
    'competitive', 'fps', 'shooter', 'moba', 'fighting', 'racing', 
    'esports', 'skill-based', 'pvp', 'ranked', 'tournament'
  ]
  
  const moods = game.moods || []
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  const title = game.title.toLowerCase()
  
  return competitiveFeatures.some(feature => 
    moods.some(mood => mood.toLowerCase().includes(feature)) ||
    genres.some(genre => genre.includes(feature)) ||
    title.includes(feature)
  )
}

const checkRelaxingFeatures = (game: Game): boolean => {
  const relaxingFeatures = [
    'relaxing', 'cozy', 'casual', 'meditative', 'peaceful', 'calm',
    'low-stress', 'zen', 'ambient'
  ]
  
  const moods = game.moods || []
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  
  return relaxingFeatures.some(feature => 
    moods.some(mood => mood.toLowerCase().includes(feature)) ||
    genres.some(genre => genre.includes(feature))
  )
}

const checkCreativeFeatures = (game: Game): boolean => {
  const creativeFeatures = [
    'building', 'crafting', 'sandbox', 'city-builder', 'design',
    'creation', 'customization', 'modding', 'construction'
  ]
  
  const moods = game.moods || []
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  const title = game.title.toLowerCase()
  
  return creativeFeatures.some(feature => 
    moods.some(mood => mood.toLowerCase().includes(feature)) ||
    genres.some(genre => genre.includes(feature)) ||
    title.includes(feature)
  )
}

const checkStoryFeatures = (game: Game): boolean => {
  const storyFeatures = [
    'story-rich', 'narrative', 'visual-novel', 'walking-simulator',
    'story-driven', 'cinematic', 'dialogue-heavy', 'interactive-fiction'
  ]
  
  const moods = game.moods || []
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  
  return storyFeatures.some(feature => 
    moods.some(mood => mood.toLowerCase().includes(feature)) ||
    genres.some(genre => genre.includes(feature))
  )
}

const checkAdventureFeatures = (game: Game): boolean => {
  const adventureFeatures = [
    'open-world', 'exploration', 'metroidvania', 'survival-adventure',
    'action-adventure', 'platformer', 'quest', 'discovery'
  ]
  
  const moods = game.moods || []
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  
  return adventureFeatures.some(feature => 
    moods.some(mood => mood.toLowerCase().includes(feature)) ||
    genres.some(genre => genre.includes(feature))
  )
}

// Clean mood filter configurations
export const MOOD_FILTERS: readonly MoodFilterConfig[] = [
  {
    // Social: Feature-based ONLY - multiplayer/coop games
    id: 'social',
    name: 'Social',
    description: 'Playing and connecting with others',
    icon: '👥',
    color: 'from-teal-500 to-cyan-600',
    priority: 10, // Highest priority - overrides genre matching
    
    requiredFeatures: ['multiplayer', 'coop', 'co-op', 'cooperative', 'online', 'party', 'shared-world'],
    excludedFeatures: ['single-player', 'solo-only'],
    
    matches: (game: Game) => hasMultiplayerFeatures(game),
    scoreReason: () => 'Multiplayer/cooperative gameplay'
  },
  
  {
    // Competitive: Feature-based - skill-based competitive games
    id: 'competitive',
    name: 'Competitive',
    description: 'Challenge-seeking and achievement-focused',
    icon: '⚔️',
    color: 'from-red-500 to-orange-600',
    priority: 9, // High priority
    
    requiredFeatures: ['competitive', 'fps', 'moba', 'fighting', 'racing', 'esports', 'skill-based'],
    excludedFeatures: ['casual', 'relaxing', 'cozy'],
    
    matches: (game: Game) => hasCompetitiveFeatures(game),
    scoreReason: () => 'Competitive skill-based gameplay'
  },
  
  {
    // Story: Narrative-first games, NO generic adventure
    id: 'story',
    name: 'Story',
    description: 'Immersive narrative experiences',
    icon: '📖',
    color: 'from-purple-500 to-pink-600',
    priority: 7,
    
    includedGenres: ['rpg', 'jrpg', 'visual-novel', 'interactive-fiction'],
    excludedGenres: ['adventure', 'action-adventure', 'open-world'], // No adventure bleed
    
    matches: (game: Game) => {
      const genres = game.genres?.map(g => g.name.toLowerCase()) || []
      const hasStoryGenre = genres.some(g => 
        ['rpg', 'jrpg', 'role-playing'].includes(g)
      )
      const hasStoryFeatures = checkStoryFeatures(game)
      return hasStoryGenre || hasStoryFeatures
    },
    scoreReason: () => 'Story-driven narrative experience'
  },
  
  {
    // Adventure: Exploration-first, NO RPG or narrative-only games
    id: 'adventure',
    name: 'Adventure',
    description: 'Exploration and discovery experiences',
    icon: '🧭',
    color: 'from-green-500 to-teal-600',
    priority: 6,
    
    includedGenres: ['action-adventure', 'metroidvania', 'platformer'],
    excludedGenres: ['rpg', 'jrpg', 'visual-novel'], // No RPG bleed
    
    matches: (game: Game) => {
      const genres = game.genres?.map(g => g.name.toLowerCase()) || []
      const hasAdventureGenre = genres.some(g => 
        ['action-adventure', 'metroidvania', 'platformer'].includes(g)
      )
      const hasAdventureFeatures = checkAdventureFeatures(game)
      return hasAdventureGenre || hasAdventureFeatures
    },
    scoreReason: () => 'Exploration-focused adventure'
  },
  
  {
    // Chill: Low-pressure, NO competitive puzzle or survival crafting
    id: 'chill',
    name: 'Chill',
    description: 'Relaxed and laid-back gaming sessions',
    icon: '🌊',
    color: 'from-blue-400 to-cyan-500',
    priority: 5,
    
    includedGenres: ['puzzle', 'casual', 'simulation'],
    excludedGenres: ['action', 'shooter', 'survival', 'competitive'], // No competitive bleed
    
    matches: (game: Game) => {
      const genres = game.genres?.map(g => g.name.toLowerCase()) || []
      const hasChillGenre = genres.some(g => 
        ['puzzle', 'casual', 'simulation'].includes(g)
      )
      const hasRelaxingFeatures = checkRelaxingFeatures(game)
      const hasCompetitiveElements = hasCompetitiveFeatures(game)
      
      return (hasChillGenre || hasRelaxingFeatures) && !hasCompetitiveElements
    },
    scoreReason: () => 'Relaxing, low-pressure gameplay'
  },
  
  {
    // Creative: Expression-first games
    id: 'creative',
    name: 'Creative',
    description: 'Building and expressing creativity',
    icon: '🎨',
    color: 'from-green-500 to-emerald-600',
    priority: 4,
    
    includedGenres: ['sandbox', 'city-builder', 'simulation'],
    excludedGenres: ['action', 'shooter', 'competitive'],
    
    matches: (game: Game) => {
      const genres = game.genres?.map(g => g.name.toLowerCase()) || []
      const hasCreativeGenre = genres.some(g => 
        ['sandbox', 'city-builder', 'simulation'].includes(g)
      )
      const hasCreativeFeatures = checkCreativeFeatures(game)
      return hasCreativeGenre || hasCreativeFeatures
    },
    scoreReason: () => 'Creative building and expression'
  }
] as const

export type MoodFilterId = typeof MOOD_FILTERS[number]['id']

/**
 * Filter games by mood using the centralized mood mapping system
 * This is now the single source of truth for mood filtering
 */
export function filterGamesByMood(games: Game[], moodId: MoodFilterId, limit?: number): Game[] {
  const filtered = games.filter(game => {
    // Use the centralized mood mapping to determine if game matches the mood
    const derivedMood = deriveMoodFromGame(game)
    return derivedMood === moodId
  })
  
  return limit ? filtered.slice(0, limit) : filtered
}

/**
 * Count how many criteria a game matches for a given mood
 */
function countMatchingCriteria(game: Game, moodFilter: MoodFilterConfig): number {
  let matches = 0
  
  // Check required features
  if (moodFilter.requiredFeatures) {
    const requiredMatches = moodFilter.requiredFeatures.filter(feature =>
      hasFeature(game, feature)
    ).length
    matches += requiredMatches * 2 // Weight required features higher
  }
  
  // Check included genres
  if (moodFilter.includedGenres) {
    const genreMatches = moodFilter.includedGenres.filter(genre =>
      hasGenre(game, genre)
    ).length
    matches += genreMatches
  }
  
  return matches
}

/**
 * Check if a game has a specific feature
 */
function hasFeature(game: Game, feature: string): boolean {
  const moods = game.moods || []
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  const title = game.title.toLowerCase()
  
  return moods.some(mood => mood.toLowerCase().includes(feature.toLowerCase())) ||
         genres.some(genre => genre.includes(feature.toLowerCase())) ||
         title.includes(feature.toLowerCase())
}

/**
 * Check if a game has a specific genre
 */
function hasGenre(game: Game, genre: string): boolean {
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  return genres.some(g => g.includes(genre.toLowerCase()))
}

/**
 * Get mood recommendation with scoring
 */
export function getMoodRecommendation(
  game: Game, 
  moodId: MoodFilterId
): { score: number; reason: string; matches: boolean } | null {
  const moodFilter = MOOD_FILTERS.find(filter => filter.id === moodId)
  if (!moodFilter) return null
  
  const matches = moodFilter.matches(game)
  if (!matches) return null
  
  // Calculate score based on matching criteria
  const criteriaMatches = countMatchingCriteria(game, moodFilter)
  const maxPossibleCriteria = (moodFilter.requiredFeatures?.length || 0) * 2 + 
                           (moodFilter.includedGenres?.length || 0)
  
  const score = maxPossibleCriteria > 0 ? Math.min(100, (criteriaMatches / maxPossibleCriteria) * 100) : 50
  
  return {
    score,
    reason: moodFilter.scoreReason(game),
    matches: true
  }
}

/**
 * Get all mood recommendations for a game
 */
export function getAllMoodRecommendations(game: Game): Array<{
  moodId: MoodFilterId
  moodName: string
  score: number
  reason: string
}> {
  return MOOD_FILTERS
    .map(moodFilter => {
      const recommendation = getMoodRecommendation(game, moodFilter.id)
      if (!recommendation) return null
      
      return {
        moodId: moodFilter.id,
        moodName: moodFilter.name,
        score: recommendation.score,
        reason: recommendation.reason
      }
    })
    .filter((rec): rec is NonNullable<typeof rec> => rec !== null)
    .sort((a, b) => b.score - a.score)
}

/**
 * Validate mood system output
 */
export function validateMoodSystem(games: Game[]): {
  social: number
  story: number
  adventure: number
  chill: number
  competitive: number
  creative: number
  totalOverlap: number
} {
  const results = {
    social: 0,
    story: 0,
    adventure: 0,
    chill: 0,
    competitive: 0,
    creative: 0,
    totalOverlap: 0
  }
  
  // Count games per mood
  const moodCounts: Record<string, Set<string>> = {}
  MOOD_FILTERS.forEach(mood => {
    moodCounts[mood.id] = new Set()
  })
  
  games.forEach(game => {
    MOOD_FILTERS.forEach(mood => {
      if (mood.matches(game)) {
        moodCounts[mood.id].add(game.id)
      }
    })
  })
  
  // Calculate overlap (games that match multiple moods)
  const allGameIds = new Set<string>()
  let totalMoodAssignments = 0
  
  Object.values(moodCounts).forEach(gameSet => {
    gameSet.forEach(gameId => {
      allGameIds.add(gameId)
      totalMoodAssignments++
    })
  })
  
  results.totalOverlap = totalMoodAssignments - allGameIds.size
  
  // Count per mood
  Object.entries(moodCounts).forEach(([moodId, gameSet]) => {
    results[moodId as keyof typeof results] = gameSet.size
  })
  
  return results
}

type NonNullable<T> = T extends null | undefined ? never : T
