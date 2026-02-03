import type { PersonaSnapshot } from '../../../../../packages/identity-engine/src/persona'
import type { RawPlayerSignals } from '../../../../../packages/identity-engine/src/persona'
import type { Game } from '@gamepilot/types'

// Helper function to convert library games to recommendation engine format
function convertLibraryGamesToRecommendationFormat(libraryGames: Game[]): typeof GAME_METADATA {
  if (!libraryGames || libraryGames.length === 0) {
    return GAME_METADATA // Fallback to static metadata
  }

  return libraryGames.map(game => ({
    id: game.id,
    name: game.title,
    coverImage: game.coverImage,
    steamUrl: game.appId ? `https://store.steampowered.com/app/${game.appId}` : '',
    price: "Owned", // Since it's in the library
    genres: game.genres?.map(g => g.name) || [],
    moodTags: game.moods || [],
    difficulty: "Normal",
    playstyleTags: game.tags || [],
    narrativeStyle: "medium",
    sessionSuitability: "flexible"
  }))
}

// Static game metadata for recommendation pool (fallback when library is empty)
const GAME_METADATA = [
  {
    id: 'bg3',
    name: "Baldur's Gate 3",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/1086940",
    price: "$59.99",
    genres: ["RPG", "Adventure", "Strategy"],
    moodTags: ["immersive", "strategic", "social", "creative"],
    difficulty: "Normal",
    playstyleTags: ["story-driven", "strategic", "social"],
    narrativeStyle: "deep",
    sessionSuitability: "long"
  },
  {
    id: 'cyberpunk',
    name: "Cyberpunk 2077",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/1091500",
    price: "$29.99",
    genres: ["RPG", "Action", "Open World"],
    moodTags: ["energetic", "immersive", "competitive", "creative"],
    difficulty: "Normal",
    playstyleTags: ["explorer", "competitive", "story-driven"],
    narrativeStyle: "deep",
    sessionSuitability: "medium"
  },
  {
    id: 'stardew',
    name: "Stardew Valley",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/413150/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/413150",
    price: "$14.99",
    genres: ["Simulation", "RPG", "Farming"],
    moodTags: ["chill", "creative", "social", "relaxed"],
    difficulty: "Relaxed",
    playstyleTags: ["casual", "creative", "social"],
    narrativeStyle: "light",
    sessionSuitability: "short"
  },
  {
    id: 'hades',
    name: "Hades",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/1145360",
    price: "$24.99",
    genres: ["Roguelike", "Action", "Indie"],
    moodTags: ["energetic", "competitive", "focused", "challenging"],
    difficulty: "Hard",
    playstyleTags: ["competitive", "achiever", "focused"],
    narrativeStyle: "moderate",
    sessionSuitability: "short"
  },
  {
    id: 'disco',
    name: "Disco Elysium",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/646920/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/646920",
    price: "$19.99",
    genres: ["RPG", "Indie", "Turn-Based"],
    moodTags: ["creative", "immersive", "thoughtful", "relaxed"],
    difficulty: "Normal",
    playstyleTags: ["story-driven", "explorer", "creative"],
    narrativeStyle: "deep",
    sessionSuitability: "medium"
  },
  {
    id: 'vampire',
    name: "Vampire Survivors",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1794680/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/1794680",
    price: "$4.99",
    genres: ["Action", "Roguelike", "Survival"],
    moodTags: ["energetic", "competitive", "focused", "addictive"],
    difficulty: "Normal",
    playstyleTags: ["competitive", "achiever", "focused"],
    narrativeStyle: "minimal",
    sessionSuitability: "short"
  },
  {
    id: 'elden',
    name: "Elden Ring",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/1245620",
    price: "$59.99",
    genres: ["RPG", "Action", "Open World"],
    moodTags: ["challenging", "immersive", "focused", "competitive"],
    difficulty: "Brutal",
    playstyleTags: ["explorer", "achiever", "competitive"],
    narrativeStyle: "moderate",
    sessionSuitability: "long"
  },
  {
    id: 'hollow',
    name: "Hollow Knight",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/367520/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/367520",
    price: "$14.99",
    genres: ["Metroidvania", "Action", "Indie"],
    moodTags: ["challenging", "focused", "immersive", "exploratory"],
    difficulty: "Hard",
    playstyleTags: ["explorer", "achiever", "focused"],
    narrativeStyle: "light",
    sessionSuitability: "medium"
  },
  {
    id: 'slay',
    name: "Slay the Spire",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/646570/library_600x900.jpg",
    steamUrl: "https://store.steampowered.com/app/646570",
    price: "$16.99",
    genres: ["Roguelike", "Strategy", "Card Game"],
    moodTags: ["strategic", "thoughtful", "competitive", "challenging"],
    difficulty: "Hard",
    playstyleTags: ["strategic", "competitive", "focused"],
    narrativeStyle: "minimal",
    sessionSuitability: "short"
  },
  {
    id: 'minecraft',
    name: "Minecraft",
    coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/239140/library_600x900.jpg",
    steamUrl: "https://www.minecraft.net",
    price: "$29.99",
    genres: ["Sandbox", "Survival", "Creative"],
    moodTags: ["creative", "relaxed", "social", "exploratory"],
    difficulty: "Relaxed",
    playstyleTags: ["creative", "explorer", "social", "casual"],
    narrativeStyle: "minimal",
    sessionSuitability: "flexible"
  }
]

export interface RecommendationResult {
  game: typeof GAME_METADATA[0]
  explanation: string
  score: number
}

/**
 * Extract raw signals from persona snapshot for recommendation scoring
 */
function extractRawSignals(_persona: PersonaSnapshot): RawPlayerSignals {
  // Since PersonaSnapshot doesn't directly expose raw signals, we need to 
  // reconstruct them from the traits or use a different approach
  // For now, we'll create a fallback signals object based on available data
  
  // This is a simplified approach - in a real implementation, 
  // we'd want to either store the raw signals in the snapshot
  // or have a way to reconstruct them from the traits
  
  return {
    playtimeByGenre: {}, // Would need to be passed separately or stored
    averageSessionLengthMinutes: 60, // Default fallback
    sessionsPerWeek: 3, // Default fallback
    difficultyPreference: "Normal", // Default fallback
    multiplayerRatio: 0.4, // Default fallback
    lateNightRatio: 0.2, // Default fallback
    completionRate: 0.5 // Default fallback
  }
}

/**
 * Persona-Driven Recommendation Engine
 * Uses persona profile and game metadata to generate personalized recommendations
 */
export function getPersonalisedRecommendation(
  personaProfile: PersonaSnapshot | null,
  libraryGames: Game[] = [],
  rawSignals?: RawPlayerSignals,
  refreshIndex: number = 0
): RecommendationResult {
  // Convert library games to recommendation engine format
  const gameMetadata = convertLibraryGamesToRecommendationFormat(libraryGames)
  
  // Fallback if no persona profile
  if (!personaProfile) {
    const popularGame = gameMetadata[Math.floor(Math.random() * Math.min(3, gameMetadata.length))] // Top 3 popular games or available games
    return {
      game: popularGame,
      explanation: "Based on general trends and popularity",
      score: 50
    }
  }

  // Use provided raw signals or extract from persona
  const signals = rawSignals || extractRawSignals(personaProfile)

  // Score each game based on persona factors
  const scoredGames = gameMetadata.map(game => {
    let score = 0
    const reasons: string[] = []

    // 1. Genre affinity match (30 points)
    const genreMatch = calculateGenreAffinity(game.genres, signals.playtimeByGenre)
    score += genreMatch.points
    if (genreMatch.points > 0) {
      reasons.push(genreMatch.reason)
    }

    // 2. Mood match (25 points)
    const moodMatch = calculateMoodMatch(game.moodTags, signals)
    score += moodMatch.points
    if (moodMatch.points > 0) {
      reasons.push(moodMatch.reason)
    }

    // 3. Archetype match (20 points)
    const archetypeMatch = calculateArchetypeMatch(game.playstyleTags, personaProfile.traits.archetypeId)
    score += archetypeMatch.points
    if (archetypeMatch.points > 0) {
      reasons.push(archetypeMatch.reason)
    }

    // 4. Challenge tolerance match (15 points)
    const challengeMatch = calculateChallengeMatch(game.difficulty, signals.difficultyPreference)
    score += challengeMatch.points
    if (challengeMatch.points > 0) {
      reasons.push(challengeMatch.reason)
    }

    // 5. Session pattern match (10 points)
    const sessionMatch = calculateSessionMatch(game.sessionSuitability, signals.averageSessionLengthMinutes)
    score += sessionMatch.points
    if (sessionMatch.points > 0) {
      reasons.push(sessionMatch.reason)
    }

    return {
      ...game,
      score,
      reasons
    }
  })

  // Sort by score and return different games based on refreshIndex
  scoredGames.sort((a, b) => b.score - a.score)
  
  // Use refreshIndex to get different games from the top recommendations
  const gameIndex = Math.min(refreshIndex, scoredGames.length - 1)
  const selectedGame = scoredGames[gameIndex]

  if (!selectedGame || selectedGame.score === 0) {
    // No good matches, return popular game with variety
    const fallbackIndex = refreshIndex % gameMetadata.length
    const fallbackGame = gameMetadata[fallbackIndex]
    return {
      game: fallbackGame,
      explanation: "Based on general trends and popularity",
      score: 50
    }
  }

  // Generate explanation from reasons
  const explanation = selectedGame.reasons.length > 0 
    ? selectedGame.reasons.slice(0, 3).join(" • ")
    : "This game matches your gaming preferences"

  return {
    game: {
      id: selectedGame.id,
      name: selectedGame.name,
      coverImage: selectedGame.coverImage,
      steamUrl: selectedGame.steamUrl,
      price: selectedGame.price,
      genres: selectedGame.genres,
      moodTags: selectedGame.moodTags,
      difficulty: selectedGame.difficulty,
      playstyleTags: selectedGame.playstyleTags,
      narrativeStyle: selectedGame.narrativeStyle,
      sessionSuitability: selectedGame.sessionSuitability
    },
    explanation,
    score: selectedGame.score
  }
}

// Scoring helper functions
function calculateGenreAffinity(gameGenres: string[], playtimeByGenre: Record<string, number>) {
  let points = 0
  let bestMatch = ""

  gameGenres.forEach(genre => {
    const normalizedGenre = genre.toLowerCase()
    if (playtimeByGenre[normalizedGenre]) {
      const playtime = playtimeByGenre[normalizedGenre]
      if (playtime > 50) {
        points += 30
        bestMatch = genre
      } else if (playtime > 20) {
        points += 20
        bestMatch = genre
      } else if (playtime > 5) {
        points += 10
        bestMatch = genre
      }
    }
  })

  return {
    points,
    reason: points > 0 ? `You love ${bestMatch} games` : ""
  }
}

function calculateMoodMatch(gameMoods: string[], signals: RawPlayerSignals) {
  let points = 0
  let reason = ""

  // Match based on play patterns
  if (gameMoods.includes("energetic") && signals.sessionsPerWeek > 5) {
    points += 15
    reason = "Matches your energetic gaming style"
  }
  
  if (gameMoods.includes("relaxed") && signals.sessionsPerWeek <= 3) {
    points += 15
    reason = "Perfect for your relaxed gaming pace"
  }

  if (gameMoods.includes("focused") && signals.averageSessionLengthMinutes > 90) {
    points += 10
    reason = "Great for your focused gaming sessions"
  }

  if (gameMoods.includes("social") && signals.multiplayerRatio > 0.5) {
    points += 10
    reason = "Matches your social gaming preferences"
  }

  return { points, reason }
}

function calculateArchetypeMatch(gamePlaystyles: string[], archetypeId: string) {
  let points = 0
  let reason = ""

  // Match playstyles with archetype
  if (archetypeId === "Specialist" && gamePlaystyles.includes("achiever")) {
    points += 20
    reason = "Perfect for your achievement-oriented playstyle"
  }

  if (archetypeId === "Socialite" && gamePlaystyles.includes("social")) {
    points += 20
    reason = "Great for your social gaming preferences"
  }

  if (archetypeId === "Casual" && gamePlaystyles.includes("casual")) {
    points += 15
    reason = "Matches your casual gaming style"
  }

  return { points, reason }
}

function calculateChallengeMatch(gameDifficulty: string, personaDifficulty: string) {
  const difficultyLevels = ["Relaxed", "Normal", "Hard", "Brutal"]
  const gameIndex = difficultyLevels.indexOf(gameDifficulty)
  const personaIndex = difficultyLevels.indexOf(personaDifficulty)

  const difference = Math.abs(gameIndex - personaIndex)
  
  if (difference === 0) {
    return { points: 15, reason: "Perfect difficulty match for your skill level" }
  } else if (difference === 1) {
    return { points: 8, reason: "Good difficulty match for you" }
  } else {
    return { points: 0, reason: "" }
  }
}

function calculateSessionMatch(gameSession: string, averageMinutes: number) {
  let points = 0
  let reason = ""

  if (gameSession === "short" && averageMinutes <= 60) {
    points = 10
    reason = "Perfect for your quick gaming sessions"
  } else if (gameSession === "medium" && averageMinutes > 60 && averageMinutes <= 120) {
    points = 10
    reason = "Great for your medium gaming sessions"
  } else if (gameSession === "long" && averageMinutes > 120) {
    points = 10
    reason = "Perfect for your long gaming sessions"
  } else if (gameSession === "flexible") {
    points = 5
    reason = "Flexible gaming that fits your schedule"
  }

  return { points, reason }
}
