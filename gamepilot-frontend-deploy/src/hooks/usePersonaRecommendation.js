"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersonaRecommendation = usePersonaRecommendation;
const react_1 = require("react");
const persona_1 = require("./persona");
const useLibraryStore_1 = require("../stores/useLibraryStore");
const recommendationEngine_1 = require("../features/recommendation/recommendationEngine");
/**
 * Hook for persona-driven game recommendations
 * Integrates with the Persona Engine and library to provide personalized purchase recommendations
 */
function usePersonaRecommendation() {
    const persona = (0, persona_1.usePersonaSnapshot)();
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const [refreshTrigger, setRefreshTrigger] = (0, react_1.useState)(0);
    // Listen for refresh events
    (0, react_1.useEffect)(() => {
        const handleRefresh = () => {
            setRefreshTrigger(prev => prev + 1);
        };
        window.addEventListener('persona-refreshed', handleRefresh);
        // Also check for localStorage refresh key
        const refreshKey = localStorage.getItem('persona_refresh_key');
        if (refreshKey) {
            handleRefresh();
            localStorage.removeItem('persona_refresh_key');
        }
        return () => {
            window.removeEventListener('persona-refreshed', handleRefresh);
        };
    }, []);
    // Memoize recommendation to prevent unnecessary recalculations
    const recommendation = (0, react_1.useMemo)(() => {
        try {
            // Get recommendation from persona-driven engine with library games
            const baseRecommendation = (0, recommendationEngine_1.getPersonalisedRecommendation)(persona, games || [], undefined, refreshTrigger);
            // If we have a refresh trigger, add some randomness to get different games
            if (refreshTrigger > 0) {
                // Create a seed based on the refresh trigger for consistent but varied results
                const seed = refreshTrigger % 10;
                // If we have a good recommendation, occasionally return a different game from the pool
                if (baseRecommendation && Math.random() > 0.3) {
                    // For now, return the base recommendation with updated explanation
                    const updatedRec = {
                        ...baseRecommendation,
                        explanation: `${baseRecommendation.explanation} • Fresh recommendation #${refreshTrigger}`,
                        score: Math.min(baseRecommendation.score + (Math.random() * 10 - 5), 100) // Slight score variation
                    };
                    return updatedRec;
                }
            }
            return baseRecommendation;
        }
        catch (error) {
            console.error('Failed to generate persona recommendation:', error);
            return null;
        }
    }, [persona, refreshTrigger]);
    // Return recommendation
    return recommendation;
}
