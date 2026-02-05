"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMoodRecommendations = useMoodRecommendations;
const react_1 = require("react");
/**
 * @deprecated Old mood recommendation system
 * This is kept for backward compatibility but should not be used
 * Use useNewMoodRecommendations instead
 */
function useMoodRecommendations({ games, onRecommendationsChange }) {
    const [state, setState] = (0, react_1.useState)({
        intensity: 0.8,
        recommendations: [],
        isLoading: false
    });
    const selectMood = (0, react_1.useCallback)(async (primaryMood, secondaryMood) => {
        console.warn('useMoodRecommendations is deprecated. Use useNewMoodRecommendations instead.');
        // Return empty recommendations for backward compatibility
        setState(prev => ({
            ...prev,
            primaryMood,
            secondaryMood,
            recommendations: [],
            isLoading: false
        }));
        onRecommendationsChange?.([]);
    }, [onRecommendationsChange]);
    const clearMood = (0, react_1.useCallback)(() => {
        setState(prev => ({
            ...prev,
            primaryMood: undefined,
            secondaryMood: undefined,
            recommendations: []
        }));
        onRecommendationsChange?.([]);
    }, [onRecommendationsChange]);
    const setIntensity = (0, react_1.useCallback)((intensity) => {
        setState(prev => ({ ...prev, intensity }));
    }, []);
    return {
        // State
        primaryMood: state.primaryMood,
        secondaryMood: state.secondaryMood,
        intensity: state.intensity,
        recommendations: state.recommendations,
        isLoading: state.isLoading,
        error: state.error,
        // Actions
        selectMood,
        clearMood,
        setIntensity,
        // Computed
        hasRecommendations: state.recommendations.length > 0
    };
}
