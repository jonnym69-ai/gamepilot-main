"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLibraryPersona = useLibraryPersona;
const react_1 = require("react");
const persona_1 = require("../../../../../packages/identity-engine/src/persona");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const useCurrentMood_1 = require("../useCurrentMood");
/**
 * Library-scoped persona hook that computes persona snapshot from library context
 * Optimized for LibrarySimple.tsx with richer genre/playtime accuracy
 */
function useLibraryPersona() {
    const { games, intelligence } = (0, useLibraryStore_1.useLibraryStore)();
    const moodEntry = (0, useCurrentMood_1.useCurrentMood)();
    return (0, react_1.useMemo)(() => {
        try {
            // Derive RawPlayerSignals from library data with enhanced accuracy
            const rawSignals = deriveLibraryPlayerSignals(games, intelligence);
            // Build persona snapshot with real mood data
            return (0, persona_1.buildPersonaSnapshot)({
                signals: rawSignals,
                moodEntry
            });
        }
        catch (error) {
            console.warn('Library persona calculation failed, using fallback:', error);
            // Fallback to minimal persona snapshot
            return (0, persona_1.buildPersonaSnapshot)({
                signals: createLibraryFallbackSignals(),
                moodEntry
            });
        }
    }, [games, intelligence, moodEntry]);
}
/**
 * Derives RawPlayerSignals from library data with enhanced accuracy
 */
function deriveLibraryPlayerSignals(games, intelligence) {
    // Calculate playtime by genre with enhanced accuracy
    const playtimeByGenre = games.reduce((acc, game) => {
        const hours = game.hoursPlayed || 0;
        if (hours > 0) {
            // Use all available genre data
            const allGenres = [
                ...(game.genres || []),
                ...(game.subgenres || [])
            ];
            allGenres.forEach((genre) => {
                acc[genre] = (acc[genre] || 0) + hours;
            });
        }
        return acc;
    }, {});
    // Calculate average session length with library intelligence
    const totalHours = games.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
    const totalSessions = games.reduce((sum, game) => sum + (game.localSessionCount || 0), 0);
    // Use intelligence session length preference if available
    let averageSessionLengthMinutes = 60;
    if (intelligence.selectedSessionLength) {
        const sessionLengthMap = {
            'short': 30,
            'medium': 60,
            'long': 120
        };
        averageSessionLengthMinutes = sessionLengthMap[intelligence.selectedSessionLength] || 60;
    }
    else if (totalSessions > 0) {
        averageSessionLengthMinutes = (totalHours * 60) / totalSessions;
    }
    // Calculate sessions per week with library patterns
    const sessionsPerWeek = totalSessions > 0 ? Math.min(7, Math.max(1, Math.round(totalSessions / 4))) : 3;
    // Calculate multiplayer ratio with enhanced detection
    const multiplayerGames = games.filter(game => {
        const hasMultiplayerTags = game.tags?.some((tag) => tag.toLowerCase().includes('multiplayer') ||
            tag.toLowerCase().includes('co-op') ||
            tag.toLowerCase().includes('pvp') ||
            tag.toLowerCase().includes('online'));
        const hasMultiplayerGenres = game.genres?.some((genre) => {
            const genreName = typeof genre === 'string' ? genre : genre?.name || '';
            return genreName.toLowerCase().includes('multiplayer') ||
                genreName.toLowerCase().includes('mmorpg');
        });
        return hasMultiplayerTags || hasMultiplayerGenres;
    }).length;
    const multiplayerRatio = games.length > 0 ? multiplayerGames / games.length : 0.3;
    // Calculate completion rate with library status data
    const completedGames = games.filter(game => game.playStatus === 'completed').length;
    const completionRate = games.length > 0 ? completedGames / games.length : 0.5;
    // Calculate mood distribution from game moods
    const moodDistribution = games.reduce((acc, game) => {
        // Use both moods and emotionalTags for comprehensive mood analysis
        const allMoods = [
            ...(game.moods || []),
            ...(game.emotionalTags || []).map((tag) => typeof tag === 'string' ? tag : tag.name || '')
        ];
        allMoods.forEach(mood => {
            if (mood) {
                acc[mood] = (acc[mood] || 0) + (game.hoursPlayed || 0);
            }
        });
        return acc;
    }, {});
    // Calculate mood affinity scores for persona
    const moodAffinity = Object.entries(moodDistribution).reduce((acc, [mood, playtime]) => {
        const playtimeNum = Number(playtime) || 0;
        acc[mood] = playtimeNum > 0 ? Math.min(100, (playtimeNum / (totalHours || 1)) * 100) : 0;
        return acc;
    }, {});
    return {
        playtimeByGenre,
        averageSessionLengthMinutes,
        sessionsPerWeek,
        difficultyPreference: "Normal", // Default - no difficulty data yet
        multiplayerRatio,
        lateNightRatio: 0.2, // Default - no session timing data yet
        completionRate,
        moodDistribution, // Add mood distribution to persona signals
        moodAffinity // Add mood affinity scores to persona signals
    };
}
/**
 * Creates library-specific fallback signals
 */
function createLibraryFallbackSignals() {
    return {
        playtimeByGenre: {},
        averageSessionLengthMinutes: 75,
        sessionsPerWeek: 3,
        difficultyPreference: 'Normal',
        multiplayerRatio: 0.3,
        lateNightRatio: 0.15,
        completionRate: 0.4
    };
}
