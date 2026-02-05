"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUserGenrePreferences = analyzeUserGenrePreferences;
exports.getRecommendedGenres = getRecommendedGenres;
exports.debugGenreAnalysis = debugGenreAnalysis;
/**
 * Analyzes user's library to determine genre preferences
 * SAFE: Only reads existing data, no modifications
 */
function analyzeUserGenrePreferences(games) {
    if (!games || games.length === 0) {
        return {
            totalGames: 0,
            preferences: [],
            topGenres: [],
            favoriteGenre: null
        };
    }
    // Count genres across all games
    const genreCounts = {};
    games.forEach(game => {
        if (game.genres && Array.isArray(game.genres)) {
            game.genres.forEach(genre => {
                const genreName = typeof genre === 'string' ? genre : genre.name;
                if (genreName) {
                    genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
                }
            });
        }
    });
    // Calculate preferences
    const totalGames = games.length;
    const preferences = Object.entries(genreCounts)
        .map(([genre, count]) => ({
        genre,
        count,
        percentage: (count / totalGames) * 100,
        weight: count / totalGames // Simple weight based on frequency
    }))
        .sort((a, b) => b.count - a.count); // Sort by popularity
    const topGenres = preferences.slice(0, 5).map(p => p.genre);
    const favoriteGenre = preferences.length > 0 ? preferences[0].genre : null;
    return {
        totalGames,
        preferences,
        topGenres,
        favoriteGenre
    };
}
/**
 * Gets recommended genres for Steam suggestions
 * SAFE: Only uses calculated preferences
 */
function getRecommendedGenres(profile, limit = 3) {
    return profile.topGenres.slice(0, limit);
}
/**
 * DEBUG: Log genre analysis (safe, no modifications)
 */
function debugGenreAnalysis(games) {
    const profile = analyzeUserGenrePreferences(games);
    console.log('🎮 Genre Analysis Results:');
    console.log(`  Total Games: ${profile.totalGames}`);
    console.log(`  Favorite Genre: ${profile.favoriteGenre}`);
    console.log(`  Top 5 Genres:`, profile.topGenres);
    console.log(`  All Preferences:`, profile.preferences);
}
