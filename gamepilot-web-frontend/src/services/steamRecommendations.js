"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSteamRecommendations = getSteamRecommendations;
const api_1 = require("../config/api");
const genreAnalysis_1 = require("../utils/genreAnalysis");
/**
 * Fetches Steam games by genre (safe, no mood system interaction)
 */
async function fetchSteamGamesByGenre(genre, limit = 20) {
    try {
        // Use existing Steam API endpoint
        const response = await fetch((0, api_1.createApiUrl)(`/api/steam/genre/${encodeURIComponent(genre.toLowerCase())}?limit=${limit}`));
        if (!response.ok) {
            console.warn(`Failed to fetch Steam games for genre: ${genre}`);
            return [];
        }
        const data = await response.json();
        if (!data.success || !data.data) {
            return [];
        }
        // Transform Steam data to our format
        return data.data.map((game) => ({
            id: game.id || game.steamId,
            name: game.name || game.title,
            genres: game.genres || [],
            coverImage: game.coverImage || game.header_image || game.image,
            headerImage: game.headerImage || game.header_image,
            capsuleImage: game.capsuleImage || `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/capsule_616x353.jpg`,
            smallImage: game.smallImage || `https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/capsule_184x69.jpg`,
            description: game.description || game.short_description,
            releaseDate: game.releaseDate || game.release_date,
            price: game.price,
            recommendationScore: game.recommendationScore || 0 // Will be calculated later
        }));
    }
    catch (error) {
        console.error(`Error fetching Steam games for genre ${genre}:`, error);
        return [];
    }
}
/**
 * Filters out games already in user's library
 * SAFE: Only compares IDs, no modifications
 */
function filterOwnedGames(steamGames, userLibrary) {
    const ownedAppIds = new Set(userLibrary
        .map(game => String(game.appId))
        .filter(appId => appId) // Only valid appIds
    );
    return steamGames.filter(steamGame => !ownedAppIds.has(String(steamGame.id)));
}
/**
 * Calculates recommendation scores based on user preferences
 * SAFE: Only uses calculated preferences, no mood system
 */
function calculateRecommendationScores(games, userPreferences) {
    const genreWeights = {};
    // Create weight map from user preferences
    userPreferences.forEach(pref => {
        genreWeights[pref.genre.toLowerCase()] = pref.weight;
    });
    return games.map(game => {
        let score = 0;
        // Calculate score based on genre matches
        game.genres.forEach(genre => {
            const weight = genreWeights[genre.toLowerCase()] || 0;
            score += weight * 100;
        });
        // Normalize score
        score = Math.min(100, score);
        return {
            ...game,
            recommendationScore: score
        };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
}
/**
 * Main function to get Steam recommendations
 * SAFE: Complete isolation from mood system
 */
async function getSteamRecommendations(userLibrary, limit = 10) {
    try {
        console.log('🎮 Starting Steam recommendations analysis...');
        // Step 1: Analyze user preferences (SAFE)
        const genreProfile = (0, genreAnalysis_1.analyzeUserGenrePreferences)(userLibrary);
        const recommendedGenres = (0, genreAnalysis_1.getRecommendedGenres)(genreProfile, 8);
        console.log('📊 User genre preferences:', {
            totalGames: genreProfile.totalGames,
            favoriteGenre: genreProfile.favoriteGenre,
            topGenres: genreProfile.topGenres,
            recommendedGenres
        });
        if (recommendedGenres.length === 0) {
            console.log('⚠️ No genre preferences found, using fallback genres');
            // Fallback to popular genres
            recommendedGenres.push('Action', 'Adventure', 'RPG');
        }
        // Step 2: Fetch Steam games for each genre
        const allSteamGames = [];
        for (const genre of recommendedGenres) {
            const games = await fetchSteamGamesByGenre(genre, 15);
            allSteamGames.push(...games);
            console.log(`🎮 Fetched ${games.length} games for genre: ${genre}`);
        }
        // Step 3: Remove duplicates and owned games
        const uniqueGames = Array.from(new Map(allSteamGames.map(game => [game.id, game])).values());
        const filteredGames = filterOwnedGames(uniqueGames, userLibrary);
        console.log(`🔍 Filtered results:`, {
            totalFound: uniqueGames.length,
            excludedCount: uniqueGames.length - filteredGames.length,
            finalCount: filteredGames.length
        });
        // Step 4: Score and rank games
        const scoredGames = calculateRecommendationScores(filteredGames, genreProfile.preferences);
        const finalGames = scoredGames.slice(0, limit);
        console.log(`🎯 Final recommendations: ${finalGames.length} games`);
        return {
            games: finalGames,
            totalFound: uniqueGames.length,
            genresSearched: recommendedGenres,
            excludedCount: uniqueGames.length - filteredGames.length
        };
    }
    catch (error) {
        console.error('❌ Error getting Steam recommendations:', error);
        return {
            games: [],
            totalFound: 0,
            genresSearched: [],
            excludedCount: 0
        };
    }
}
