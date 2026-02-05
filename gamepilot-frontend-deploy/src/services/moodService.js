"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodService = exports.MoodService = void 0;
const axios_1 = __importDefault(require("axios"));
// API service class
class MoodService {
    constructor() {
        // Use different URLs for development vs production
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            this.baseUrl = 'http://localhost:3000/api'; // Development
        }
        else {
            this.baseUrl = import.meta.env.VITE_API_URL || 'https://api.gamepilot.app/api'; // Production
        }
        // Development mode flag
        this.isDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
    // Get mood forecast for a user
    async getMoodForecast(userId) {
        // In development mode, use fallback data directly to avoid network errors
        if (this.isDevelopment) {
            return {
                primaryForecast: {
                    predictedMood: 'chill',
                    confidence: 0.85,
                    reasoning: 'Development mode fallback forecast'
                },
                alternativeForecasts: [
                    { mood: 'creative', confidence: 0.75, reasoning: 'Alternative based on genre preferences' },
                    { mood: 'focused', confidence: 0.65, reasoning: 'Alternative based on session patterns' }
                ],
                forecastPeriod: 'next_week',
                generatedAt: new Date().toISOString()
            };
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/mood/forecast`, {
                params: { userId }
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch mood forecast:', error);
            // Return fallback data
            return {
                primaryForecast: {
                    predictedMood: 'chill',
                    confidence: 0.7,
                    reasoning: 'Fallback forecast due to API error'
                },
                alternativeForecasts: [],
                forecastPeriod: 'next_week',
                generatedAt: new Date().toISOString()
            };
        }
    }
    // Get mood resonance data for a user
    async getMoodResonance(userId) {
        // In development mode, use fallback data directly to avoid network errors
        if (this.isDevelopment) {
            return {
                moodAccuracy: {
                    chill: 0.9,
                    energetic: 0.7,
                    competitive: 0.8,
                    social: 0.6,
                    creative: 0.95,
                    focused: 0.75,
                    story: 0.8,
                    exploratory: 0.85
                },
                confidenceAdjustments: {
                    chill: 0.9,
                    energetic: 0.7,
                    competitive: 0.8,
                    social: 0.6,
                    creative: 0.95,
                    focused: 0.75,
                    story: 0.8,
                    exploratory: 0.85
                },
                sessionPatterns: {
                    chill: { avgDuration: 45, avgEngagement: 80 },
                    energetic: { avgDuration: 60, avgEngagement: 90 },
                    competitive: { avgDuration: 75, avgEngagement: 95 },
                    social: { avgDuration: 90, avgEngagement: 85 },
                    creative: { avgDuration: 120, avgEngagement: 75 },
                    focused: { avgDuration: 90, avgEngagement: 88 },
                    story: { avgDuration: 150, avgEngagement: 82 },
                    exploratory: { avgDuration: 120, avgEngagement: 78 }
                },
                insights: {
                    strongestPredictions: ['creative', 'chill', 'exploratory'],
                    weakestPredictions: ['social', 'energetic', 'focused'],
                    optimalSessionLength: {
                        chill: 45,
                        energetic: 60,
                        competitive: 75,
                        social: 90,
                        creative: 120,
                        focused: 90,
                        story: 150,
                        exploratory: 120
                    },
                    engagementPatterns: {
                        chill: 80,
                        energetic: 90,
                        competitive: 95,
                        social: 85,
                        creative: 75,
                        focused: 88,
                        story: 82,
                        exploratory: 78
                    }
                }
            };
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/mood/resonance`, {
                params: { userId }
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch mood resonance:', error);
            // Return fallback data
            return {
                moodAccuracy: {
                    chill: 0.8,
                    energetic: 0.6,
                    competitive: 0.7,
                    social: 0.5,
                    creative: 0.9,
                    focused: 0.6,
                    story: 0.7,
                    exploratory: 0.8
                },
                confidenceAdjustments: {
                    chill: 0.8,
                    energetic: 0.6,
                    competitive: 0.7,
                    social: 0.5,
                    creative: 0.9,
                    focused: 0.6,
                    story: 0.7,
                    exploratory: 0.8
                },
                sessionPatterns: {
                    chill: { avgDuration: 45, avgEngagement: 75 },
                    energetic: { avgDuration: 60, avgEngagement: 85 },
                    competitive: { avgDuration: 75, avgEngagement: 90 },
                    social: { avgDuration: 90, avgEngagement: 80 },
                    creative: { avgDuration: 120, avgEngagement: 70 },
                    focused: { avgDuration: 90, avgEngagement: 85 },
                    story: { avgDuration: 150, avgEngagement: 80 },
                    exploratory: { avgDuration: 120, avgEngagement: 75 }
                },
                insights: {
                    strongestPredictions: ['creative', 'chill', 'exploratory'],
                    weakestPredictions: ['social', 'energetic', 'focused'],
                    optimalSessionLength: {
                        chill: 45,
                        energetic: 60,
                        competitive: 75,
                        social: 90,
                        creative: 120,
                        focused: 90,
                        story: 150,
                        exploratory: 120
                    },
                    engagementPatterns: {
                        chill: 75,
                        energetic: 85,
                        competitive: 90,
                        social: 80,
                        creative: 70,
                        focused: 85,
                        story: 80,
                        exploratory: 75
                    }
                }
            };
        }
    }
    // Get mood-based recommendations for a user
    async getMoodRecommendations(userId) {
        // In development mode, use fallback data directly to avoid network errors
        if (this.isDevelopment) {
            return {
                recommendations: [
                    {
                        gameId: 'game1',
                        gameTitle: 'Zen Puzzle Master',
                        score: 0.95,
                        reasoning: 'Perfect match for current chill mood',
                        moodAlignment: 0.9,
                        genreMatch: 0.95,
                        confidence: 0.85
                    }
                ],
                moodToGenreMapping: {
                    chill: ['puzzle', 'casual', 'simulation', 'strategy', 'adventure'],
                    energetic: ['action', 'shooter', 'racing', 'sports', 'platformer'],
                    competitive: ['action', 'shooter', 'strategy', 'fighting', 'racing'],
                    social: ['multiplayer', 'party', 'mmorpg', 'co-op', 'simulation'],
                    creative: ['sandbox', 'building', 'puzzle', 'simulation', 'adventure'],
                    focused: ['strategy', 'puzzle', 'rpg', 'turn-based', 'card'],
                    story: ['rpg', 'adventure', 'visual-novel', 'interactive-movie', 'simulation'],
                    exploratory: ['adventure', 'open-world', 'sandbox', 'survival', 'simulation']
                },
                trendingMoods: ['competitive', 'social', 'creative'],
                generatedAt: new Date().toISOString()
            };
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/mood/recommendations`, {
                params: { userId }
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch mood recommendations:', error);
            // Return fallback data
            return {
                recommendations: [],
                moodToGenreMapping: {
                    chill: ['puzzle', 'casual', 'simulation', 'strategy'],
                    energetic: ['action', 'shooter', 'racing', 'sports'],
                    competitive: ['action', 'shooter', 'strategy', 'fighting'],
                    social: ['multiplayer', 'party', 'mmorpg', 'co-op'],
                    creative: ['sandbox', 'building', 'puzzle', 'simulation'],
                    focused: ['strategy', 'puzzle', 'rpg', 'turn-based'],
                    story: ['rpg', 'adventure', 'visual-novel', 'interactive-movie'],
                    exploratory: ['adventure', 'open-world', 'sandbox', 'survival']
                },
                trendingMoods: ['competitive', 'social', 'creative'],
                generatedAt: new Date().toISOString()
            };
        }
    }
}
exports.MoodService = MoodService;
// Export singleton instance
exports.moodService = new MoodService();
