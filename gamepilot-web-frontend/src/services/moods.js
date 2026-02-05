"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoodRecommendations = exports.mapGamesToMoods = exports.getMoods = exports.GAMING_MOODS = void 0;
// Simple moods export for build compatibility
exports.GAMING_MOODS = [
    {
        id: 'neutral',
        name: 'Neutral',
        description: 'Balanced gaming mood',
        color: '#6B7280',
        icon: '😊',
        energyLevel: 5,
        socialPreference: 'flexible',
        timeOfDay: ['morning', 'afternoon', 'evening', 'night'],
        genreAffinities: [],
        category: 'vibe'
    }
];
// Legacy exports for backward compatibility
const getMoods = () => exports.GAMING_MOODS;
exports.getMoods = getMoods;
const mapGamesToMoods = (games) => {
    // Simple mapping logic - in a real implementation this would be more sophisticated
    return games.map(game => ({
        ...game,
        moods: ['neutral'] // Default mood for now
    }));
};
exports.mapGamesToMoods = mapGamesToMoods;
const getMoodRecommendations = (games, _targetMoodId, limit) => games.slice(0, limit || 10); // Simple fallback
exports.getMoodRecommendations = getMoodRecommendations;
