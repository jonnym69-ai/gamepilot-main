"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGamePersona = useGamePersona;
const react_1 = require("react");
const persona_1 = require("../../../../../packages/identity-engine/src/persona");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const useCurrentMood_1 = require("../useCurrentMood");
/**
 * Game-specific persona hook that computes persona snapshot for a single game
 * Provides game-specific persona insights and recommendations
 */
function useGamePersona(gameId) {
    const { games, intelligence } = (0, useLibraryStore_1.useLibraryStore)();
    const moodEntry = (0, useCurrentMood_1.useCurrentMood)();
    return (0, react_1.useMemo)(() => {
        try {
            // Find the specific game
            const game = games.find(g => g.id === gameId);
            if (!game) {
                console.warn(`Game ${gameId} not found in library`);
                return (0, persona_1.buildPersonaSnapshot)({
                    signals: createGameFallbackSignals(),
                    moodEntry
                });
            }
            // Derive RawPlayerSignals from single game data
            const rawSignals = deriveGamePlayerSignals(game);
            // Build persona snapshot with real mood data
            return (0, persona_1.buildPersonaSnapshot)({
                signals: rawSignals,
                moodEntry
            });
        }
        catch (error) {
            console.warn(`Game persona calculation failed for ${gameId}, using fallback:`, error);
            // Fallback to minimal persona snapshot
            return (0, persona_1.buildPersonaSnapshot)({
                signals: createGameFallbackSignals(),
                moodEntry
            });
        }
    }, [games, intelligence, gameId, moodEntry]);
}
/**
 * Derives RawPlayerSignals from single game data
 */
function deriveGamePlayerSignals(game) {
    // Calculate playtime by genre for this specific game
    const playtimeByGenre = {};
    const hours = game.hoursPlayed || 0;
    if (hours > 0) {
        // Use all available genre data for this game
        const allGenres = [
            ...(game.genres || []),
            ...(game.subgenres || [])
        ];
        allGenres.forEach((genre) => {
            playtimeByGenre[genre] = hours;
        });
    }
    // Game-specific session length (shorter for single game focus)
    const averageSessionLengthMinutes = 45;
    // Game-specific sessions per week (lower for single game)
    const sessionsPerWeek = 1;
    // Determine if this specific game is multiplayer
    const isMultiplayer = game.tags?.some((tag) => tag.toLowerCase().includes('multiplayer') ||
        tag.toLowerCase().includes('co-op') ||
        tag.toLowerCase().includes('pvp') ||
        tag.toLowerCase().includes('online')) || game.genres?.some((genre) => genre.toLowerCase().includes('multiplayer') ||
        genre.toLowerCase().includes('mmorpg'));
    const multiplayerRatio = isMultiplayer ? 1.0 : 0.0;
    // Game-specific completion rate based on game status
    let completionRate = 0.3; // Default for single game
    if (game.playStatus === 'completed') {
        completionRate = 1.0;
    }
    else if (game.playStatus === 'playing') {
        completionRate = 0.5;
    }
    else if (game.playStatus === 'backlog') {
        completionRate = 0.1;
    }
    // Estimate difficulty from game tags and genres
    let difficultyPreference = "Normal";
    const difficultTags = game.tags?.filter((tag) => tag.toLowerCase().includes('hard') ||
        tag.toLowerCase().includes('difficult') ||
        tag.toLowerCase().includes('challenging') ||
        tag.toLowerCase().includes('brutal'));
    const difficultGenres = game.genres?.filter((genre) => genre.toLowerCase().includes('roguelike') ||
        genre.toLowerCase().includes('souls') ||
        genre.toLowerCase().includes('hardcore'));
    if (difficultTags.length > 0 || difficultGenres.length > 0) {
        difficultyPreference = "Hard";
    }
    const casualTags = game.tags?.filter((tag) => tag.toLowerCase().includes('casual') ||
        tag.toLowerCase().includes('relaxed') ||
        tag.toLowerCase().includes('easy'));
    const casualGenres = game.genres?.filter((genre) => genre.toLowerCase().includes('casual') ||
        genre.toLowerCase().includes('puzzle') ||
        genre.toLowerCase().includes('simulation'));
    if (casualTags.length > 0 || casualGenres.length > 0) {
        difficultyPreference = "Relaxed";
    }
    return {
        playtimeByGenre,
        averageSessionLengthMinutes,
        sessionsPerWeek,
        difficultyPreference,
        multiplayerRatio,
        lateNightRatio: 0.2, // Default - no session timing data yet
        completionRate
    };
}
/**
 * Creates game-specific fallback signals
 */
function createGameFallbackSignals() {
    return {
        playtimeByGenre: {},
        averageSessionLengthMinutes: 60,
        sessionsPerWeek: 1,
        difficultyPreference: 'Normal',
        multiplayerRatio: 0.5,
        lateNightRatio: 0.2,
        completionRate: 0.5
    };
}
