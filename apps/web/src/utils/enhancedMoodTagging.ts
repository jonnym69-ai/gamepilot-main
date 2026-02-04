/**
 * Enhanced Mood Tagging System
 * Automatically assigns and improves mood tags for games
 */

import type { Game } from '@gamepilot/types'
import { MOODS, type MoodId } from '@gamepilot/static-data'
import { deriveMoodFromGame } from './moodMapping'

/**
 * Enhanced mood assignment with multiple moods per game
 * Returns up to 2 most relevant moods for each game
 */
export function getEnhancedMoods(game: Game): MoodId[] {
  const primaryMood = deriveMoodFromGame(game)
  if (!primaryMood) return []
  
  const moods: MoodId[] = [primaryMood]
  
  // Add secondary mood based on game characteristics
  const secondaryMood = getSecondaryMood(game, primaryMood)
  if (secondaryMood && secondaryMood !== primaryMood) {
    moods.push(secondaryMood)
  }
  
  return moods
}

/**
 * Get secondary mood based on game characteristics
 */
function getSecondaryMood(game: Game, primaryMood: MoodId): MoodId | null {
  const genres = game.genres?.map(g => g.name.toLowerCase()) || []
  const tags = game.tags?.map(t => t.toLowerCase()) || []
  const title = game.title.toLowerCase()
  
  // Skip if game already has explicit moods
  if (game.moods && Array.isArray(game.moods) && game.moods.length > 1) {
    return null
  }
  
  // Determine secondary mood based on combinations
  switch (primaryMood) {
    case 'competitive':
      // Competitive + Social (team games)
      if (genres.includes('multiplayer') || tags.includes('team-based') || 
          title.includes('valorant') || title.includes('overwatch') || title.includes('apex')) {
        return 'social'
      }
      // Competitive + Energetic (fast-paced)
      if (genres.includes('shooter') || genres.includes('action') ||
          title.includes('doom') || title.includes('quake') || title.includes('ultrakill')) {
        return 'energetic'
      }
      break
      
    case 'story':
      // Story + Exploratory (open-world RPGs)
      if (genres.includes('open-world') || genres.includes('adventure') ||
          title.includes('skyrim') || title.includes('witcher') || title.includes('elden ring')) {
        return 'exploratory'
      }
      // Story + Focused (strategic RPGs)
      if (genres.includes('strategy') || genres.includes('tactical') ||
          title.includes('baldur\'s gate') || title.includes('divinity') || title.includes('xcom')) {
        return 'focused'
      }
      break
      
    case 'creative':
      // Creative + Chill (relaxed building)
      if (genres.includes('casual') || genres.includes('puzzle') ||
          title.includes('stardew valley') || title.includes('animal crossing') || title.includes('the sims')) {
        return 'chill'
      }
      // Creative + Focused (complex simulation)
      if (genres.includes('strategy') || genres.includes('management') ||
          title.includes('factorio') || title.includes('oxygen not included') || title.includes('rimworld')) {
        return 'focused'
      }
      break
      
    case 'social':
      // Social + Chill (casual multiplayer)
      if (genres.includes('casual') || genres.includes('party') ||
          title.includes('among us') || title.includes('fall guys') || title.includes('human: fall flat')) {
        return 'chill'
      }
      // Social + Competitive (competitive multiplayer)
      if (tags.includes('competitive') || genres.includes('fighting') || genres.includes('sports') ||
          title.includes('rocket league') || title.includes('fifa') || title.includes('nba')) {
        return 'competitive'
      }
      break
      
    case 'exploratory':
      // Exploratory + Story (narrative exploration)
      if (genres.includes('rpg') || genres.includes('visual-novel') ||
          title.includes('subnautica') || title.includes('no man\'s sky') || title.includes('outer wilds')) {
        return 'story'
      }
      // Exploratory + Energetic (action exploration)
      if (genres.includes('action') || genres.includes('shooter') ||
          title.includes('tomb raider') || title.includes('uncharted') || title.includes('horizon')) {
        return 'energetic'
      }
      break
      
    case 'focused':
      // Focused + Creative (puzzle/strategy)
      if (genres.includes('puzzle') || genres.includes('simulation') ||
          title.includes('portal') || title.includes('zachtronics') || title.includes('infinifactory')) {
        return 'creative'
      }
      // Focused + Competitive (strategy games)
      if (genres.includes('multiplayer') || tags.includes('competitive') ||
          title.includes('starcraft') || title.includes('age of empires') || title.includes('civilization')) {
        return 'competitive'
      }
      break
      
    case 'energetic':
      // Energetic + Competitive (action games)
      if (genres.includes('multiplayer') || genres.includes('fighting') ||
          title.includes('smash bros') || title.includes('street fighter') || title.includes('mortal kombat')) {
        return 'competitive'
      }
      // Energetic + Social (party games)
      if (genres.includes('party') || tags.includes('local-multiplayer') ||
          title.includes('mario party') || title.includes('super smash bros') || title.includes('fall guys')) {
        return 'social'
      }
      break
      
    case 'chill':
      // Chill + Creative (relaxed creation)
      if (genres.includes('simulation') || genres.includes('building') ||
          title.includes('powerwash') || title.includes('unpacking') || title.includes('townscaper')) {
        return 'creative'
      }
      // Chill + Social (casual multiplayer)
      if (genres.includes('multiplayer') || tags.includes('co-op') ||
          title.includes('stardew valley') || title.includes('animal crossing') || title.includes('it takes two')) {
        return 'social'
      }
      break
  }
  
  return null
}

/**
 * Get mood compatibility score between two moods
 * Higher score means more compatible
 */
export function getMoodCompatibility(mood1: MoodId, mood2: MoodId): number {
  if (mood1 === mood2) return 1.0
  
  const mood1Obj = MOODS.find(m => m.id === mood1)
  const mood2Obj = MOODS.find(m => m.id === mood2)
  
  if (!mood1Obj || !mood2Obj) return 0
  
  // Check shared associated genres
  const sharedGenres = mood1Obj.associatedGenres.filter(genre => 
    mood2Obj.associatedGenres.includes(genre)
  )
  
  // Calculate compatibility based on shared genres
  const totalGenres = new Set([...mood1Obj.associatedGenres, ...mood2Obj.associatedGenres]).size
  const compatibility = sharedGenres.length / totalGenres
  
  return compatibility
}

/**
 * Get mood intensity modifier for recommendations
 * Some moods work better at different intensities
 */
export function getMoodIntensityMultiplier(mood: MoodId, intensity: number): number {
  switch (mood) {
    case 'competitive':
      return intensity > 0.7 ? 1.2 : 0.8 // High intensity for competitive
    case 'chill':
      return intensity < 0.5 ? 1.2 : 0.9 // Low intensity for chill
    case 'energetic':
      return intensity > 0.8 ? 1.3 : 0.7 // Very high intensity for energetic
    case 'focused':
      return intensity > 0.6 ? 1.1 : 0.9 // Medium-high intensity for focused
    case 'creative':
      return intensity > 0.4 && intensity < 0.8 ? 1.1 : 0.9 // Balanced for creative
    default:
      return 1.0
  }
}

/**
 * Enhanced mood scoring for recommendations
 * Takes into account multiple factors for better matching
 */
export function calculateEnhancedMoodScore(game: Game, primaryMood: MoodId, secondaryMood: MoodId | null, intensity: number): number {
  let score = 50 // Base score
  
  const gameMoods = getEnhancedMoods(game)
  
  // Primary mood matching
  if (gameMoods.includes(primaryMood)) {
    score += 100 // Perfect primary match
  }
  
  // Secondary mood matching
  if (secondaryMood && gameMoods.includes(secondaryMood)) {
    score += 50 // Secondary match
  }
  
  // Mood compatibility
  if (gameMoods.length > 0) {
    const primaryCompatibility = getMoodCompatibility(primaryMood, gameMoods[0])
    score += primaryCompatibility * 75
    
    if (secondaryMood && gameMoods.length > 1) {
      const secondaryCompatibility = getMoodCompatibility(secondaryMood, gameMoods[1])
      score += secondaryCompatibility * 25
    }
  }
  
  // Apply intensity multiplier
  const intensityMultiplier = getMoodIntensityMultiplier(primaryMood, intensity)
  score = score * intensityMultiplier
  
  // Genre-based bonus
  const primaryMoodObj = MOODS.find(m => m.id === primaryMood)
  if (primaryMoodObj && game.genres) {
    const matchingGenres = game.genres.filter(genre => 
      primaryMoodObj.associatedGenres.includes(genre.name.toLowerCase())
    )
    score += matchingGenres.length * 10
  }
  
  return Math.min(100, Math.max(0, score))
}

/**
 * Batch enhance mood tags for multiple games
 */
export function enhanceGameMoods(games: Game[]): Game[] {
  return games.map(game => ({
    ...game,
    moods: getEnhancedMoods(game)
  }))
}
