/**
 * Mood Filter System Integration Validation
 * 
 * Tests the new mood filter system with real user library data
 * to ensure accurate, predictable recommendations for beta testing.
 */

import type { Game } from '@gamepilot/types'
import { getMoodRecommendation, MoodFilterId, MOOD_FILTERS, validateMoodSystem, filterGamesByMood } from './moodFilterSystem'

// Validation results interface
export interface ValidationResult {
  moodId: MoodFilterId
  moodName: string
  totalGames: number
  filteredGames: number
  overlapCount: number
  sampleGames: string[]
  accuracy: {
    socialGames: number
    storyGames: number
    adventureGames: number
    chillGames: number
    competitiveGames: number
    creativeGames: number
  }
  issues: string[]
}

/**
 * Validate mood filter system with real game library
 */
export function validateMoodIntegration(games: Game[]): ValidationResult[] {
  console.log(`🧪 Validating mood filter system with ${games.length} games`)
  
  const results: ValidationResult[] = []
  
  // Test each mood filter
  for (const moodFilter of MOOD_FILTERS) {
    console.log(`\n📊 Testing ${moodFilter.name} mood...`)
    
    // Get filtered games
    const filteredGames = filterGamesByMood(games, moodFilter.id, 100)
    
    // Calculate overlap (games that match multiple moods)
    let overlapCount = 0
    const gameMoodMatches = new Map<string, string[]>()
    
    games.forEach(game => {
      const matchingMoods: string[] = []
      MOOD_FILTERS.forEach(filter => {
        if (filter.matches(game)) {
          matchingMoods.push(filter.id)
        }
      })
      
      if (matchingMoods.length > 1) {
        overlapCount++
      }
      
      gameMoodMatches.set(game.id, matchingMoods)
    })
    
    // Analyze accuracy for this mood
    const accuracy = analyzeMoodAccuracy(filteredGames, moodFilter.id)
    
    // Identify issues
    const issues = identifyMoodIssues(filteredGames, moodFilter)
    
    // Get sample games for review
    const sampleGames = filteredGames.slice(0, 5).map(game => game.title)
    
    results.push({
      moodId: moodFilter.id,
      moodName: moodFilter.name,
      totalGames: games.length,
      filteredGames: filteredGames.length,
      overlapCount,
      sampleGames,
      accuracy,
      issues
    })
    
    console.log(`  ✅ ${filteredGames.length} games filtered`)
    console.log(`  📈 Accuracy: ${accuracy.socialGames + accuracy.storyGames + accuracy.adventureGames + accuracy.chillGames + accuracy.competitiveGames + accuracy.creativeGames} correctly categorized`)
    if (issues.length > 0) {
      console.log(`  ⚠️ Issues: ${issues.length}`)
      issues.forEach(issue => console.log(`    - ${issue}`))
    }
  }
  
  // Overall system validation
  const systemValidation = validateMoodSystem(games)
  console.log(`\n🎯 System Validation:`)
  console.log(`  Total Overlap: ${systemValidation.totalOverlap} games`)
  console.log(`  Overlap Percentage: ${((systemValidation.totalOverlap / games.length) * 100).toFixed(1)}%`)
  
  if (systemValidation.totalOverlap === 0) {
    console.log(`  ✅ Perfect! No overlap between mood categories`)
  } else if (systemValidation.totalOverlap < games.length * 0.05) {
    console.log(`  ✅ Good! Less than 5% overlap`)
  } else {
    console.log(`  ⚠️ High overlap detected. Consider adjusting filters.`)
  }
  
  return results
}

/**
 * Analyze accuracy of mood categorization
 */
function analyzeMoodAccuracy(games: Game[], moodId: MoodFilterId) {
  const accuracy = {
    socialGames: 0,
    storyGames: 0,
    adventureGames: 0,
    chillGames: 0,
    competitiveGames: 0,
    creativeGames: 0
  }
  
  games.forEach(game => {
    const genres = game.genres?.map(g => g.name.toLowerCase()) || []
    const tags = game.tags?.map(t => t.toLowerCase()) || []
    // const title = game.title.toLowerCase()
    
    switch (moodId) {
      case 'social':
        if (hasMultiplayerFeatures(game)) accuracy.socialGames++
        break
      case 'competitive':
        if (hasCompetitiveFeatures(game)) accuracy.competitiveGames++
        break
      case 'story':
        if (hasStoryFeatures(game)) accuracy.storyGames++
        break
      case 'adventure':
        if (hasAdventureFeatures(game)) accuracy.adventureGames++
        break
      case 'chill':
        if (hasRelaxingFeatures(game)) accuracy.chillGames++
        break
      case 'creative':
        if (hasCreativeFeatures(game)) accuracy.creativeGames++
        break
    }
  })
  
  return accuracy
}

/**
 * Identify potential issues with mood filtering
 */
function identifyMoodIssues(games: Game[], moodFilter: any): string[] {
  const issues: string[] = []
  
  if (games.length === 0) {
    issues.push('No games found for this mood')
    return issues
  }
  
  // Check for obvious misclassifications
  games.forEach(game => {
    const genres = game.genres?.map(g => g.name.toLowerCase()) || []
    const tags = game.tags?.map(t => t.toLowerCase()) || []
    
    switch (moodFilter.id) {
      case 'social':
        if (!hasMultiplayerFeatures(game)) {
          issues.push(`${game.title} lacks multiplayer features`)
        }
        break
      case 'competitive':
        if (!hasCompetitiveFeatures(game)) {
          issues.push(`${game.title} lacks competitive features`)
        }
        break
      case 'story':
        if (genres.some(g => g.includes('action')) && !hasStoryFeatures(game)) {
          issues.push(`${game.title} appears to be action-focused, not story-focused`)
        }
        break
      case 'adventure':
        if (genres.some(g => g.includes('rpg')) && !hasAdventureFeatures(game)) {
          issues.push(`${game.title} appears to be RPG-focused, not adventure-focused`)
        }
        break
      case 'chill':
        if (hasCompetitiveFeatures(game)) {
          issues.push(`${game.title} has competitive features, shouldn't be in chill mood`)
        }
        break
      case 'creative':
        if (genres.some(g => g.includes('shooter')) && !hasCreativeFeatures(game)) {
          issues.push(`${game.title} appears to be action-focused, not creative`)
        }
        break
    }
  })
  
  // Limit issues to prevent spam
  return issues.slice(0, 10)
}

// Feature detection helpers (copied from moodFilterSystem for validation)
function hasMultiplayerFeatures(game: Game): boolean {
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

function hasCompetitiveFeatures(game: Game): boolean {
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

function hasStoryFeatures(game: Game): boolean {
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

function hasAdventureFeatures(game: Game): boolean {
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

function hasRelaxingFeatures(game: Game): boolean {
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

function hasCreativeFeatures(game: Game): boolean {
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

/**
 * Generate validation report
 */
export function generateValidationReport(results: ValidationResult[]): string {
  let report = '# Mood Filter System Validation Report\n\n'
  
  // Summary
  const totalGames = results[0]?.totalGames || 0
  const totalFiltered = results.reduce((sum, r) => sum + r.filteredGames, 0)
  const totalOverlap = results.reduce((sum, r) => sum + r.overlapCount, 0)
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  
  report += `## Summary\n`
  report += `- **Total Games**: ${totalGames}\n`
  report += `- **Total Filtered**: ${totalFiltered}\n`
  report += `- **Total Overlap**: ${totalOverlap} (${((totalOverlap / totalGames) * 100).toFixed(1)}%)\n`
  report += `- **Total Issues**: ${totalIssues}\n\n`
  
  // Mood breakdown
  report += `## Mood Breakdown\n\n`
  results.forEach(result => {
    report += `### ${result.moodName}\n`
    report += `- **Games**: ${result.filteredGames}\n`
    report += `- **Overlap**: ${result.overlapCount}\n`
    report += `- **Sample**: ${result.sampleGames.slice(0, 3).join(', ')}\n`
    
    if (result.issues.length > 0) {
      report += `- **Issues**: ${result.issues.length}\n`
      result.issues.slice(0, 3).forEach(issue => {
        report += `  - ${issue}\n`
      })
    }
    
    report += `\n`
  })
  
  // Recommendations
  report += `## Recommendations\n\n`
  
  if (totalOverlap === 0) {
    report += `✅ **Perfect**: No overlap detected between mood categories\n\n`
  } else if (totalOverlap < totalGames * 0.05) {
    report += `✅ **Good**: Low overlap (${((totalOverlap / totalGames) * 100).toFixed(1)}%) between mood categories\n\n`
  } else {
    report += `⚠️ **Needs Attention**: High overlap (${((totalOverlap / totalGames) * 100).toFixed(1)}%) detected. Consider adjusting filters.\n\n`
  }
  
  if (totalIssues === 0) {
    report += `✅ **No Issues**: All mood categorizations appear accurate\n\n`
  } else {
    report += `⚠️ **Issues Found**: ${totalIssues} potential categorization issues need review\n\n`
  }
  
  report += `## Status\n\n`
  
  if (totalOverlap < totalGames * 0.05 && totalIssues < 10) {
    report += `🎉 **READY FOR BETA**: The mood filter system is performing well and ready for beta testing.\n`
  } else {
    report += `🔧 **NEEDS REFINEMENT**: Some adjustments needed before beta deployment.\n`
  }
  
  return report
}

/**
 * Run validation and return results
 */
export function runMoodValidation(games: Game[]) {
  console.log('🚀 Starting mood filter system validation...')
  
  const results = validateMoodIntegration(games)
  const report = generateValidationReport(results)
  
  console.log('\n' + report)
  
  return {
    results,
    report,
    isReadyForBeta: results.every(r => r.issues.length < 5) && 
                   results.reduce((sum, r) => sum + r.overlapCount, 0) < games.length * 0.05
  }
}
