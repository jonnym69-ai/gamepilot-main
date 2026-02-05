"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentMood = useCurrentMood;
exports.useMoodProfile = useMoodProfile;
exports.useMoodRecommendations = useMoodRecommendations;
const react_1 = require("react");
const moodService_1 = require("../services/moodService");
const realMoodEngine_1 = require("../services/realMoodEngine");
const useLibraryStore_1 = require("../stores/useLibraryStore");
/**
 * Hook to get current mood data for persona integration
 * Uses real Steam data when available, falls back to API service
 */
function useCurrentMood() {
    const [currentMood, setCurrentMood] = (0, react_1.useState)(null);
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    (0, react_1.useEffect)(() => {
        const computeCurrentMood = async () => {
            try {
                // Try to compute mood from Steam library data first
                if (games && games.length > 0) {
                    const moodProfile = realMoodEngine_1.realMoodEngine.computeMoodProfile(games);
                    const moodEntry = {
                        moodId: moodProfile.primaryMood,
                        intensity: Math.round(moodProfile.moodScores[moodProfile.primaryMood] * 10),
                        timestamp: moodProfile.lastComputed,
                        confidence: 0.85, // High confidence with real data
                        source: 'steam-data'
                    };
                    setCurrentMood(moodEntry);
                    return;
                }
                // Fallback to API service if no Steam data
                const userId = 'current-user'; // In real app, this would come from auth
                const forecast = await moodService_1.moodService.getMoodForecast(userId);
                if (forecast?.primaryForecast?.predictedMood) {
                    const moodEntry = {
                        moodId: forecast.primaryForecast.predictedMood,
                        intensity: Math.round(forecast.primaryForecast.confidence * 10),
                        timestamp: new Date(forecast.generatedAt || Date.now()),
                        confidence: forecast.primaryForecast.confidence,
                        source: 'api'
                    };
                    setCurrentMood(moodEntry);
                }
                else {
                    // Final fallback
                    setCurrentMood({
                        moodId: 'chill',
                        intensity: 5,
                        timestamp: new Date(),
                        confidence: 0.5,
                        source: 'fallback'
                    });
                }
            }
            catch (error) {
                // Silent error handling to avoid console spam
                // Fallback to chill mood
                setCurrentMood({
                    moodId: 'chill',
                    intensity: 5,
                    timestamp: new Date(),
                    confidence: 0.5,
                    source: 'fallback'
                });
            }
        };
        computeCurrentMood();
        // Set up periodic refresh (every 5 minutes)
        const interval = setInterval(computeCurrentMood, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [games]); // Recompute when games change
    return currentMood;
}
/**
 * Hook to get full mood profile from Steam data
 */
function useMoodProfile() {
    const [moodProfile, setMoodProfile] = (0, react_1.useState)(null);
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    (0, react_1.useEffect)(() => {
        if (games && games.length > 0) {
            const profile = realMoodEngine_1.realMoodEngine.computeMoodProfile(games);
            setMoodProfile(profile);
        }
    }, [games]);
    return moodProfile;
}
/**
 * Hook to get mood-based recommendations
 */
function useMoodRecommendations(count = 10) {
    const [recommendations, setRecommendations] = (0, react_1.useState)([]);
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const moodProfile = useMoodProfile();
    (0, react_1.useEffect)(() => {
        if (games && games.length > 0 && moodProfile) {
            const recs = realMoodEngine_1.realMoodEngine.getMoodRecommendations(games, moodProfile, count);
            setRecommendations(recs);
        }
    }, [games, moodProfile, count]);
    return recommendations;
}
