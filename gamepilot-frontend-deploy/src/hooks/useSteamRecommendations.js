"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSteamRecommendations = useSteamRecommendations;
const react_1 = require("react");
const useLibraryStore_1 = require("../stores/useLibraryStore");
const steamRecommendations_1 = require("../services/steamRecommendations");
/**
 * Steam recommendations hook
 * SAFE: Only uses library data, no mood system interaction
 */
function useSteamRecommendations(limit = 10) {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const [state, setState] = (0, react_1.useState)({
        recommendations: {
            games: [],
            totalFound: 0,
            genresSearched: [],
            excludedCount: 0
        },
        isLoading: false,
        error: null,
        lastRefresh: null
    });
    // Debouncing ref to prevent rapid API calls
    const lastRefreshTime = (0, react_1.useRef)(0);
    const DEBOUNCE_DELAY = 2000; // 2 seconds between refreshes
    const refreshRecommendations = (0, react_1.useCallback)(async () => {
        const now = Date.now();
        if (now - lastRefreshTime.current < DEBOUNCE_DELAY) {
            console.log('🔄 Refresh throttled - please wait');
            return;
        }
        lastRefreshTime.current = now;
        console.log('🔄 Refreshing Steam recommendations...');
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const recommendations = await (0, steamRecommendations_1.getSteamRecommendations)(games || [], limit);
            setState({
                recommendations,
                isLoading: false,
                error: null,
                lastRefresh: new Date()
            });
            console.log('✅ Steam recommendations refreshed:', {
                count: recommendations.games.length,
                totalFound: recommendations.totalFound,
                genresSearched: recommendations.genresSearched
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load Steam recommendations';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));
            console.error('❌ Error refreshing Steam recommendations:', error);
        }
    }, [games, limit]);
    // Initialize recommendations only once when games are available
    (0, react_1.useEffect)(() => {
        if (games && games.length > 0 && !state.lastRefresh && !state.isLoading) {
            refreshRecommendations();
        }
    }, [games, refreshRecommendations, state.lastRefresh, state.isLoading]);
    const clearRecommendations = (0, react_1.useCallback)(() => {
        setState({
            recommendations: {
                games: [],
                totalFound: 0,
                genresSearched: [],
                excludedCount: 0
            },
            isLoading: false,
            error: null,
            lastRefresh: null
        });
    }, []);
    const hasRecommendations = state.recommendations.games.length > 0;
    const recommendationCount = state.recommendations.games.length;
    return {
        ...state,
        refreshRecommendations,
        clearRecommendations,
        hasRecommendations,
        recommendationCount
    };
}
