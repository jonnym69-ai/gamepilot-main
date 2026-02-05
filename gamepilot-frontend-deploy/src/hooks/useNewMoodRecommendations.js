"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNewMoodRecommendations = useNewMoodRecommendations;
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
const moodMapping_1 = require("../utils/moodMapping");
function useNewMoodRecommendations({ games, onRecommendationsChange }) {
    const [state, setState] = (0, react_1.useState)({
        intensity: 0.8,
        recommendations: [],
        isLoading: false
    });
    // Simple mood scoring using the new deriveMoodFromGame system
    const calculateMoodScore = (0, react_1.useCallback)((game, moodId, intensity) => {
        let score = 50;
        // Use the new mood system - deriveMoodFromGame returns single mood assignment
        const derivedMood = (0, moodMapping_1.deriveMoodFromGame)(game);
        // Perfect match if derived mood matches selected mood
        if (derivedMood === moodId) {
            score += 100; // Perfect match
        }
        else {
            // Check if moods are compatible
            const selectedMood = static_data_1.MOODS.find(m => m.id === moodId);
            const derivedMoodObj = static_data_1.MOODS.find(m => m.id === derivedMood);
            if (selectedMood && derivedMoodObj && selectedMood.compatibleMoods?.includes(derivedMood)) {
                score += 75; // Compatible mood
            }
            else {
                score += 25; // Some compatibility
            }
        }
        // Apply intensity modifier
        score = score * intensity;
        return score;
    }, []);
    const selectMood = (0, react_1.useCallback)(async (primaryMood, secondaryMood) => {
        setState(prev => ({ ...prev, isLoading: true, error: undefined }));
        try {
            const primary = static_data_1.MOODS.find(m => m.id === primaryMood);
            if (!primary) {
                throw new Error(`Primary mood not found: ${primaryMood}`);
            }
            // Calculate scores for all games
            const gameScores = games.map(game => {
                let score = calculateMoodScore(game, primaryMood, state.intensity);
                let reasoning = `Matches ${primary.name.toLowerCase()} mood`;
                if (secondaryMood) {
                    const secondary = static_data_1.MOODS.find(m => m.id === secondaryMood);
                    if (secondary) {
                        const secondaryScore = calculateMoodScore(game, secondaryMood, state.intensity);
                        score = (score + secondaryScore) / 2;
                        reasoning += ` and ${secondary.name.toLowerCase()} mood`;
                    }
                }
                return {
                    ...game,
                    moodScore: score,
                    reasoning
                };
            });
            // Sort by score and filter
            const recommendations = gameScores
                .filter(game => game.moodScore > 40)
                .sort((a, b) => b.moodScore - a.moodScore)
                .slice(0, 10);
            setState(prev => ({
                ...prev,
                primaryMood,
                secondaryMood,
                recommendations,
                isLoading: false
            }));
            onRecommendationsChange?.(recommendations);
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to generate recommendations',
                isLoading: false,
                recommendations: []
            }));
        }
    }, [games, state.intensity, calculateMoodScore, onRecommendationsChange]);
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
