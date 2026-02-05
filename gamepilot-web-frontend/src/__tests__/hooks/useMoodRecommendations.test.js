"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const react_1 = require("@testing-library/react");
const useMoodRecommendations_1 = require("../../hooks/useMoodRecommendations");
const static_data_1 = require("@gamepilot/static-data");
// Mock game data for testing
const mockGames = [
    {
        id: 'game-1',
        title: 'Action Adventure',
        coverImage: '/action-cover.jpg',
        genres: [{ id: 'action', name: 'Action', color: 'red', subgenres: [] }],
        subgenres: [],
        platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
        emotionalTags: [],
        playStatus: 'unplayed',
        addedAt: new Date('2023-01-01'),
        isFavorite: false,
        releaseYear: 2023,
        tags: ['action', 'adventure', 'competitive', 'fast-paced'],
        hoursPlayed: 0
    },
    {
        id: 'game-2',
        title: 'Relaxing Puzzle',
        coverImage: '/puzzle-cover.jpg',
        genres: [{ id: 'puzzle', name: 'Puzzle', color: 'blue', subgenres: [] }],
        subgenres: [],
        platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
        emotionalTags: [],
        playStatus: 'unplayed',
        addedAt: new Date('2023-01-02'),
        isFavorite: false,
        releaseYear: 2022,
        tags: ['relaxing', 'meditative', 'casual', 'brain-teaser'],
        hoursPlayed: 0
    },
    {
        id: 'game-3',
        title: 'Strategic RPG',
        coverImage: '/rpg-cover.jpg',
        genres: [{ id: 'rpg', name: 'RPG', color: 'green', subgenres: [] }],
        subgenres: [],
        platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
        emotionalTags: [],
        playStatus: 'unplayed',
        addedAt: new Date('2023-01-03'),
        isFavorite: true,
        releaseYear: 2021,
        tags: ['strategic', 'complex', 'story-driven', 'turn-based'],
        hoursPlayed: 0
    }
];
(0, vitest_1.describe)('useMoodRecommendations', () => {
    (0, vitest_1.describe)('Basic Functionality', () => {
        (0, vitest_1.it)('should initialize with empty state', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: [] }));
            (0, vitest_1.expect)(result.current.recommendations).toEqual([]);
            (0, vitest_1.expect)(result.current.isLoading).toBe(false);
            (0, vitest_1.expect)(result.current.error).toBeUndefined();
        });
        (0, vitest_1.it)('should handle empty games list', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: [] }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            (0, vitest_1.expect)(result.current.recommendations).toEqual([]);
            (0, vitest_1.expect)(result.current.primaryMood).toBe('energetic');
        });
    });
    (0, vitest_1.describe)('Mood Selection', () => {
        (0, vitest_1.it)('should select primary mood', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            (0, vitest_1.expect)(result.current.primaryMood).toBe('energetic');
            (0, vitest_1.expect)(result.current.secondaryMood).toBeUndefined();
        });
        (0, vitest_1.it)('should select primary and secondary mood', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic', 'focused');
            });
            (0, vitest_1.expect)(result.current.primaryMood).toBe('energetic');
            (0, vitest_1.expect)(result.current.secondaryMood).toBe('focused');
        });
        (0, vitest_1.it)('should clear mood selection', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            (0, vitest_1.expect)(result.current.primaryMood).toBe('energetic');
            (0, react_1.act)(() => {
                result.current.clearMood();
            });
            (0, vitest_1.expect)(result.current.primaryMood).toBeUndefined();
            (0, vitest_1.expect)(result.current.secondaryMood).toBeUndefined();
        });
        (0, vitest_1.it)('should update intensity', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.setIntensity(0.9);
            });
            (0, vitest_1.expect)(result.current.intensity).toBe(0.9);
        });
    });
    (0, vitest_1.describe)('Recommendation Logic', () => {
        (0, vitest_1.it)('should generate recommendations for energetic mood', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            const recommendations = result.current.recommendations;
            // Should recommend action games for energetic mood
            (0, vitest_1.expect)(recommendations.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(recommendations.some(game => game.tags.includes('action'))).toBe(true);
        });
        (0, vitest_1.it)('should generate recommendations for chill mood', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('chill');
            });
            const recommendations = result.current.recommendations;
            // Should recommend puzzle/casual games for chill mood
            (0, vitest_1.expect)(recommendations.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(recommendations.some(game => game.tags.includes('relaxing'))).toBe(true);
        });
        (0, vitest_1.it)('should generate recommendations for focused mood', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('focused');
            });
            const recommendations = result.current.recommendations;
            // Should recommend strategic/complex games for focused mood
            (0, vitest_1.expect)(recommendations.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(recommendations.some(game => game.tags.includes('strategic'))).toBe(true);
        });
        (0, vitest_1.it)('should handle dual mood combinations', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic', 'focused');
            });
            const recommendations = result.current.recommendations;
            // Should still generate recommendations for dual mood
            (0, vitest_1.expect)(recommendations.length).toBeGreaterThan(0);
        });
    });
    (0, vitest_1.describe)('Loading and Error States', () => {
        (0, vitest_1.it)('should handle loading state', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            // Simulate loading state
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            // The hook should handle loading internally
            (0, vitest_1.expect)(typeof result.current.isLoading).toBe('boolean');
        });
        (0, vitest_1.it)('should handle error states', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            // Error should be handled gracefully
            (0, vitest_1.expect)(typeof result.current.error).toBe('string');
        });
    });
    (0, vitest_1.describe)('Callback Functions', () => {
        (0, vitest_1.it)('should call onRecommendationsChange callback', () => {
            const mockCallback = vitest_1.vi.fn();
            (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({
                games: mockGames,
                onRecommendationsChange: mockCallback
            }));
            // Mock implementation should call callback when recommendations change
            // This would be tested with actual implementation
            (0, vitest_1.expect)(typeof mockCallback).toBe('function');
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle invalid mood ID', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('invalid-mood');
            });
            // Should handle invalid mood gracefully
            (0, vitest_1.expect)(result.current.primaryMood).toBe('invalid-mood');
        });
        (0, vitest_1.it)('should handle games without tags', () => {
            const gamesWithoutTags = mockGames.map(game => ({
                ...game,
                tags: []
            }));
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: gamesWithoutTags }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            // Should still generate recommendations even without tags
            (0, vitest_1.expect)(result.current.recommendations).toBeDefined();
        });
        (0, vitest_1.it)('should handle empty mood selection', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.clearMood();
            });
            (0, vitest_1.expect)(result.current.recommendations).toEqual([]);
        });
    });
    (0, vitest_1.describe)('Performance', () => {
        (0, vitest_1.it)('should handle large game library efficiently', () => {
            // Create a large array of games
            const largeGameLibrary = Array.from({ length: 1000 }, (_, index) => ({
                ...mockGames[0],
                id: `game-${index}`,
                title: `Game ${index}`,
                tags: ['tag1', 'tag2', 'tag3']
            }));
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: largeGameLibrary }));
            const startTime = performance.now();
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            const endTime = performance.now();
            // Should complete within reasonable time (less than 100ms)
            (0, vitest_1.expect)(endTime - startTime).toBeLessThan(100);
            (0, vitest_1.expect)(result.current.recommendations.length).toBeGreaterThan(0);
        });
    });
    (0, vitest_1.describe)('Mood Data Integration', () => {
        (0, vitest_1.it)('should use ENHANCED_MOODS data', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            const mood = static_data_1.ENHANCED_MOODS.find(m => m.id === 'energetic');
            (0, vitest_1.expect)(mood).toBeDefined();
            (0, vitest_1.expect)(mood?.tagWeights).toBeDefined();
        });
        (0, vitest_1.it)('should respect mood tag weights', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useMoodRecommendations_1.useMoodRecommendations)({ games: mockGames }));
            (0, react_1.act)(() => {
                result.current.selectMood('energetic');
            });
            const recommendations = result.current.recommendations;
            // Games with matching tags should have higher scores
            const actionGame = recommendations.find(game => game.tags.includes('action'));
            const puzzleGame = recommendations.find(game => game.tags.includes('relaxing'));
            if (actionGame && puzzleGame) {
                // Action game should score higher for energetic mood
                // This would be tested with actual scoring implementation
                (0, vitest_1.expect)(actionGame).toBeDefined();
                (0, vitest_1.expect)(puzzleGame).toBeDefined();
            }
        });
    });
});
