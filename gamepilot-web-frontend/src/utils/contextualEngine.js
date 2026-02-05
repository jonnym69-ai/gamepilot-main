"use strict";
/**
 * Contextual Recommendation Engine
 *
 * Centralized logic for mood, time, and session-based game recommendations
 * Used across HomeHub, LibrarySimple, and other features
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonaContextualMatches = exports.getTimeSafe = exports.getCurrentTimeOfDay = exports.getContextualMatches = exports.getContextualMatch = exports.matchesPersonaContextualFilters = exports.getPersonaContextualMatch = exports.generatePersonaContext = exports.normalizeGameWithContextualData = exports.inferRecommendedTimes = exports.inferSessionLength = exports.detectTimeOfDay = exports.getTuningSettings = void 0;
// NEW: Default tuning settings
const DEFAULT_TUNING = {
    personaWeight: 0.4,
    moodWeight: 0.3,
    sessionLengthWeight: 0.2,
    timeOfDayWeight: 0.1,
    playPatternWeight: 0.15,
    autoTaggingAggressiveness: 0.5
};
/**
 * Get current tuning settings from localStorage
 */
const getTuningSettings = () => {
    try {
        const stored = localStorage.getItem('tuning_settings');
        return stored ? { ...DEFAULT_TUNING, ...JSON.parse(stored) } : DEFAULT_TUNING;
    }
    catch (error) {
        console.warn('Failed to load tuning settings, using defaults:', error);
        return DEFAULT_TUNING;
    }
};
exports.getTuningSettings = getTuningSettings;
/**
 * Auto-detect current time of day
 */
const detectTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)
        return "morning";
    if (hour >= 12 && hour < 17)
        return "afternoon";
    if (hour >= 17 && hour < 22)
        return "evening";
    return "late-night";
};
exports.detectTimeOfDay = detectTimeOfDay;
/**
 * Infer session length from playtime data
 */
const inferSessionLength = (hoursPlayed = 0) => {
    if (hoursPlayed < 0.5)
        return "short";
    if (hoursPlayed <= 2)
        return "medium";
    return "long";
};
exports.inferSessionLength = inferSessionLength;
/**
 * Infer recommended times from mood and genre characteristics
 */
const inferRecommendedTimes = (moods = [], genres = []) => {
    // Get current tuning settings
    const tuning = (0, exports.getTuningSettings)();
    const aggressiveness = tuning.autoTaggingAggressiveness;
    const times = new Set();
    // Check moods for time preferences
    moods.forEach(mood => {
        const normalizedMood = mood.toLowerCase().trim();
        if (["chill", "cozy", "casual", "puzzle", "relaxed"].includes(normalizedMood)) {
            if (aggressiveness > 0.3)
                times.add("late-night");
        }
        if (["energetic", "competitive", "focused", "intense"].includes(normalizedMood)) {
            if (aggressiveness > 0.2)
                times.add("morning");
        }
        if (["creative", "immersive", "story-driven", "exploration"].includes(normalizedMood)) {
            if (aggressiveness > 0.4) {
                times.add("afternoon");
                times.add("evening");
            }
        }
    });
    // Check genres for time preferences
    genres.forEach(genre => {
        const normalizedGenre = genre.toLowerCase().trim();
        if (["puzzle", "casual", "simulation"].includes(normalizedGenre)) {
            if (aggressiveness > 0.3)
                times.add("late-night");
        }
        if (["action", "fps", "competitive"].includes(normalizedGenre)) {
            if (aggressiveness > 0.2)
                times.add("morning");
        }
        if (["rpg", "adventure", "strategy"].includes(normalizedGenre)) {
            if (aggressiveness > 0.4) {
                times.add("afternoon");
                times.add("evening");
            }
        }
    });
    // Default if no characteristics matched
    if (times.size === 0) {
        times.add("evening");
    }
    return Array.from(times);
};
exports.inferRecommendedTimes = inferRecommendedTimes;
/**
 * Normalize game data with contextual information
 */
const normalizeGameWithContextualData = (game) => {
    // Normalize moods
    const normalizedMoods = (game.moods || [])
        .map((m) => {
        if (typeof m === "string")
            return m.toLowerCase().trim();
        if (typeof m === "object" && m && "name" in m && typeof m.name === "string") {
            return m.name.toLowerCase().trim();
        }
        return null;
    })
        .filter((m) => m !== null);
    // Normalize genres
    const normalizedGenres = (game.genres || [])
        .map((g) => {
        if (typeof g === "string")
            return g.toLowerCase().trim();
        if (typeof g === "object" && g && "name" in g && typeof g.name === "string") {
            return g.name.toLowerCase().trim();
        }
        return null;
    })
        .filter((g) => g !== null);
    // Auto-tag contextual data if not already present
    const existingSessionLength = game.sessionLength;
    const existingRecommendedTimes = game.recommendedTimes;
    let inferredSessionLength = existingSessionLength || (0, exports.inferSessionLength)(game.hoursPlayed);
    let inferredRecommendedTimes = existingRecommendedTimes || (0, exports.inferRecommendedTimes)(normalizedMoods, normalizedGenres);
    return {
        ...game,
        moods: normalizedMoods,
        genres: normalizedGenres,
        sessionLength: inferredSessionLength,
        recommendedTimes: inferredRecommendedTimes
    };
};
exports.normalizeGameWithContextualData = normalizeGameWithContextualData;
/**
 * Generate persona context from persona data
 */
const generatePersonaContext = (personaData) => {
    // Extract dominant moods from mood affinity
    const moodAffinity = personaData.moodAffinity || {};
    const moodEntries = Object.entries(moodAffinity);
    const dominantMoods = moodEntries
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([mood]) => mood.toLowerCase());
    // Infer preferred session length from average session length
    const avgMinutes = personaData.averageSessionLengthMinutes || 75;
    let preferredSessionLength = "medium";
    if (avgMinutes < 45)
        preferredSessionLength = "short";
    else if (avgMinutes > 90)
        preferredSessionLength = "long";
    // Infer preferred times of day from play patterns
    const preferredTimesOfDay = [];
    if (personaData.lateNightRatio > 0.3)
        preferredTimesOfDay.push("late-night");
    if (personaData.multiplayerRatio > 0.5)
        preferredTimesOfDay.push("afternoon", "evening");
    if (preferredTimesOfDay.length === 0) {
        preferredTimesOfDay.push("evening"); // Default
    }
    // Generate recent play patterns
    const recentPlayPatterns = [];
    if (personaData.completionRate > 0.7)
        recentPlayPatterns.push("completionist");
    if (personaData.multiplayerRatio > 0.5)
        recentPlayPatterns.push("social");
    if (personaData.lateNightRatio > 0.3)
        recentPlayPatterns.push("night_owl");
    return {
        dominantMoods,
        preferredSessionLength,
        preferredTimesOfDay,
        recentPlayPatterns,
        moodAffinity,
        averageSessionLengthMinutes: avgMinutes,
        lateNightRatio: personaData.lateNightRatio || 0,
        completionRate: personaData.completionRate || 0,
        multiplayerRatio: personaData.multiplayerRatio || 0
    };
};
exports.generatePersonaContext = generatePersonaContext;
/**
 * Enhanced contextual matching with persona integration
 */
const getPersonaContextualMatch = (game, filters) => {
    const { selectedMoods, selectedSessionLength, timeOfDay, personaContext, personaWeight = 0.3 } = filters;
    // Get current tuning settings
    const tuning = (0, exports.getTuningSettings)();
    // Basic contextual matching
    const matchesMood = selectedMoods.length === 0 ||
        selectedMoods.some(mood => game.moods.includes(mood));
    const matchesSession = !selectedSessionLength ||
        game.sessionLength === selectedSessionLength;
    const matchesTimeOfDay = !game.recommendedTimes ||
        game.recommendedTimes.includes(timeOfDay);
    // Persona-based scoring with tuning
    let personaScore = 0;
    if (personaContext) {
        // Mood affinity scoring
        personaContext.dominantMoods.forEach(mood => {
            if (game.moods.includes(mood)) {
                personaScore += (personaContext.moodAffinity[mood] || 0) * tuning.moodWeight;
            }
        });
        // Session length preference
        if (game.sessionLength === personaContext.preferredSessionLength) {
            personaScore += 25 * tuning.sessionLengthWeight;
        }
        // Time of day preference
        if (game.recommendedTimes?.some(time => personaContext.preferredTimesOfDay.includes(time))) {
            personaScore += 20 * tuning.timeOfDayWeight;
        }
        // Play pattern matching
        personaContext.recentPlayPatterns.forEach((pattern) => {
            if (pattern === "completionist" && game.playStatus === 'completed') {
                personaScore += 15 * tuning.playPatternWeight;
            }
            if (pattern === "social" && game.genres?.some(g => g.toLowerCase().includes('multiplayer') || g.toLowerCase().includes('co-op'))) {
                personaScore += 15 * tuning.playPatternWeight;
            }
        });
    }
    // Combined score: basic matching + weighted persona score
    const baseScore = [matchesMood, matchesSession, matchesTimeOfDay].filter(Boolean).length * 25;
    const finalScore = baseScore + (personaScore * (personaWeight || tuning.personaWeight));
    return {
        game,
        matchesMood,
        matchesSession,
        matchesTimeOfDay,
        sessionLength: game.sessionLength || "medium",
        recommendedTimes: game.recommendedTimes || ["evening"],
        score: finalScore
    };
};
exports.getPersonaContextualMatch = getPersonaContextualMatch;
/**
 * Enhanced filtering with persona integration
 */
const matchesPersonaContextualFilters = (game, filters) => {
    const match = (0, exports.getPersonaContextualMatch)(game, filters);
    return match.score > 0; // Any positive score means it's a match
};
exports.matchesPersonaContextualFilters = matchesPersonaContextualFilters;
/**
 * Get detailed match information for a game
 */
const getContextualMatch = (game, filters) => {
    const { selectedMoods, selectedSessionLength, timeOfDay } = filters;
    const matchesMood = selectedMoods.length === 0 ||
        selectedMoods.some(mood => game.moods.includes(mood));
    const matchesSession = !selectedSessionLength ||
        game.sessionLength === selectedSessionLength;
    const matchesTimeOfDay = !game.recommendedTimes ||
        game.recommendedTimes.includes(timeOfDay);
    return {
        game,
        matchesMood,
        matchesSession,
        matchesTimeOfDay,
        sessionLength: game.sessionLength || "medium",
        recommendedTimes: game.recommendedTimes || ["evening"],
        score: 0 // Default score for basic contextual matching
    };
};
exports.getContextualMatch = getContextualMatch;
/**
 * Main function: Get contextual matches from a game library
 */
const getContextualMatches = (library, filters, options = {}) => {
    const { limit = 10, includeDetails = false } = options;
    // Normalize all games with contextual data
    const normalizedGames = library.map(exports.normalizeGameWithContextualData);
    // Filter games based on contextual criteria
    const filteredGames = normalizedGames.filter(game => (0, exports.matchesPersonaContextualFilters)(game, filters));
    // Sort by relevance (games matching more criteria first)
    filteredGames.sort((a, b) => {
        const aMatch = (0, exports.getContextualMatch)(a, filters);
        const bMatch = (0, exports.getContextualMatch)(b, filters);
        const aScore = [aMatch.matchesMood, aMatch.matchesSession, aMatch.matchesTimeOfDay]
            .filter(Boolean).length;
        const bScore = [bMatch.matchesMood, bMatch.matchesSession, bMatch.matchesTimeOfDay]
            .filter(Boolean).length;
        return bScore - aScore;
    });
    // Limit results
    const limitedResults = filteredGames.slice(0, limit);
    // Return with or without details
    if (includeDetails) {
        return limitedResults.map(game => (0, exports.getContextualMatch)(game, filters));
    }
    return limitedResults;
};
exports.getContextualMatches = getContextualMatches;
/**
 * Get current time of day with auto-detection
 */
const getCurrentTimeOfDay = () => {
    return (0, exports.detectTimeOfDay)();
};
exports.getCurrentTimeOfDay = getCurrentTimeOfDay;
/**
 * Utility: Safe date handling for sorting
 */
const getTimeSafe = (date) => {
    if (!date)
        return 0;
    if (date instanceof Date)
        return date.getTime();
    if (typeof date === 'string')
        return new Date(date).getTime();
    return 0;
};
exports.getTimeSafe = getTimeSafe;
/**
 * Main function: Get persona-enhanced contextual matches from a game library
 */
const getPersonaContextualMatches = (library, personaContext, userFilters, options = {}) => {
    const { limit = 10, includeDetails = false, personaWeight = 0.3 } = options;
    // Combine persona context with user filters
    const enhancedFilters = {
        ...userFilters,
        personaContext,
        personaWeight
    };
    // Normalize all games with contextual data
    const normalizedGames = library.map(exports.normalizeGameWithContextualData);
    // Filter games based on enhanced contextual criteria
    const filteredGames = normalizedGames.filter(game => (0, exports.matchesPersonaContextualFilters)(game, enhancedFilters));
    // Sort by persona-enhanced relevance score
    filteredGames.sort((a, b) => {
        const aMatch = (0, exports.getPersonaContextualMatch)(a, enhancedFilters);
        const bMatch = (0, exports.getPersonaContextualMatch)(b, enhancedFilters);
        return bMatch.score - aMatch.score;
    });
    // Limit results
    const limitedResults = filteredGames.slice(0, limit);
    // Return with or without details
    if (includeDetails) {
        return limitedResults.map(game => (0, exports.getPersonaContextualMatch)(game, enhancedFilters));
    }
    return limitedResults;
};
exports.getPersonaContextualMatches = getPersonaContextualMatches;
// Export all functions for easy importing
exports.default = {
    detectTimeOfDay: exports.detectTimeOfDay,
    inferSessionLength: exports.inferSessionLength,
    inferRecommendedTimes: exports.inferRecommendedTimes,
    normalizeGameWithContextualData: exports.normalizeGameWithContextualData,
    matchesPersonaContextualFilters: exports.matchesPersonaContextualFilters,
    getContextualMatch: exports.getContextualMatch,
    getContextualMatches: exports.getContextualMatches,
    getPersonaContextualMatches: exports.getPersonaContextualMatches,
    getCurrentTimeOfDay: exports.getCurrentTimeOfDay,
    getTimeSafe: exports.getTimeSafe,
    generatePersonaContext: exports.generatePersonaContext,
    getPersonaContextualMatch: exports.getPersonaContextualMatch
};
