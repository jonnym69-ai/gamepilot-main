"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const react_1 = require("@testing-library/react");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
// Mock game data
const mockGames = [
    {
        id: 'game-1',
        title: 'Test Game 1',
        coverImage: '/test-cover-1.jpg',
        genres: [{ id: 'action', name: 'Action', color: 'red', subgenres: [] }],
        subgenres: [],
        platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
        emotionalTags: [],
        playStatus: 'unplayed',
        addedAt: new Date('2023-01-01'),
        isFavorite: false,
        releaseYear: 2023,
        tags: ['action', 'adventure'],
        hoursPlayed: 0,
        moods: [],
        playHistory: []
    },
    {
        id: 'game-2',
        title: 'Test Game 2',
        coverImage: '/test-cover-2.jpg',
        genres: [{ id: 'rpg', name: 'RPG', color: 'blue', subgenres: [] }],
        subgenres: [],
        platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
        emotionalTags: [],
        playStatus: 'playing',
        addedAt: new Date('2023-01-02'),
        isFavorite: true,
        releaseYear: 2022,
        tags: ['rpg', 'story'],
        hoursPlayed: 25,
        moods: [],
        playHistory: []
    }
];
(0, vitest_1.describe)('useLibraryStore', () => {
    (0, vitest_1.beforeEach)(() => {
        // Reset store before each test
        const { actions } = useLibraryStore_1.useLibraryStore.getState();
        actions.clearGames();
    });
    (0, vitest_1.describe)('Game Management', () => {
        (0, vitest_1.it)('should add a new game', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.addGame(mockGames[0]);
            });
            const games = result.current.games;
            (0, vitest_1.expect)(games).toHaveLength(1);
            (0, vitest_1.expect)(games[0]).toEqual(mockGames[0]);
        });
        (0, vitest_1.it)('should update an existing game', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            // Add a game first
            (0, react_1.act)(() => {
                result.current.actions.addGame(mockGames[0]);
            });
            // Update the game
            (0, react_1.act)(() => {
                result.current.actions.updateGame(mockGames[0].id, {
                    title: 'Updated Game Title',
                    hoursPlayed: 10
                });
            });
            const games = result.current.games;
            (0, vitest_1.expect)(games[0].title).toBe('Updated Game Title');
            (0, vitest_1.expect)(games[0].hoursPlayed).toBe(10);
        });
        (0, vitest_1.it)('should remove a game', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            // Add games first
            (0, react_1.act)(() => {
                result.current.actions.addGame(mockGames[0]);
                result.current.actions.addGame(mockGames[1]);
            });
            (0, vitest_1.expect)(result.current.games).toHaveLength(2);
            // Remove one game
            (0, react_1.act)(() => {
                result.current.actions.removeGame(mockGames[0].id);
            });
            const games = result.current.games;
            (0, vitest_1.expect)(games).toHaveLength(1);
            (0, vitest_1.expect)(games[0].id).toBe(mockGames[1].id);
        });
        (0, vitest_1.it)('should clear all games', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            // Add games first
            (0, react_1.act)(() => {
                result.current.actions.addGame(mockGames[0]);
                result.current.actions.addGame(mockGames[1]);
            });
            (0, vitest_1.expect)(result.current.games).toHaveLength(2);
            // Clear all games
            (0, react_1.act)(() => {
                result.current.actions.clearGames();
            });
            (0, vitest_1.expect)(result.current.games).toHaveLength(0);
        });
    });
    (0, vitest_1.describe)('Game Status Management', () => {
        (0, vitest_1.it)('should update game status', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.addGame(mockGames[0]);
            });
            (0, react_1.act)(() => {
                result.current.actions.updateGameStatus(mockGames[0].id, 'completed');
            });
            const games = result.current.games;
            (0, vitest_1.expect)(games[0].playStatus).toBe('completed');
        });
        (0, vitest_1.it)('should update game playtime', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.addGame(mockGames[0]);
            });
            (0, react_1.act)(() => {
                result.current.actions.updateGamePlaytime(mockGames[0].id, 15);
            });
            const games = result.current.games;
            (0, vitest_1.expect)(games[0].hoursPlayed).toBe(15);
        });
        (0, vitest_1.it)('should toggle favorite status', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.addGame(mockGames[0]);
            });
            (0, vitest_1.expect)(result.current.games[0].isFavorite).toBe(false);
            (0, react_1.act)(() => {
                result.current.actions.toggleFavorite(mockGames[0].id);
            });
            (0, vitest_1.expect)(result.current.games[0].isFavorite).toBe(true);
            (0, react_1.act)(() => {
                result.current.actions.toggleFavorite(mockGames[0].id);
            });
            (0, vitest_1.expect)(result.current.games[0].isFavorite).toBe(false);
        });
    });
    (0, vitest_1.describe)('Game Search and Filtering', () => {
        (0, vitest_1.beforeEach)(() => {
            const { actions } = useLibraryStore_1.useLibraryStore.getState();
            mockGames.forEach(game => actions.addGame(game));
        });
        (0, vitest_1.it)('should search games by title', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.searchGames('Test Game 1');
            });
            const searchResults = result.current.searchResults;
            (0, vitest_1.expect)(searchResults).toHaveLength(1);
            (0, vitest_1.expect)(searchResults[0].title).toBe('Test Game 1');
        });
        (0, vitest_1.it)('should filter games by genre', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.filterByGenres(['action']);
            });
            const filteredGames = result.current.filteredGames;
            (0, vitest_1.expect)(filteredGames).toHaveLength(1);
            (0, vitest_1.expect)(filteredGames[0].genres[0].name).toBe('Action');
        });
        (0, vitest_1.it)('should filter games by status', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.filterByStatus(['playing']);
            });
            const filteredGames = result.current.filteredGames;
            (0, vitest_1.expect)(filteredGames).toHaveLength(1);
            (0, vitest_1.expect)(filteredGames[0].playStatus).toBe('playing');
        });
        (0, vitest_1.it)('should filter games by favorite status', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.filterByFavorites(true);
            });
            const filteredGames = result.current.filteredGames;
            (0, vitest_1.expect)(filteredGames).toHaveLength(1);
            (0, vitest_1.expect)(filteredGames[0].isFavorite).toBe(true);
        });
    });
    (0, vitest_1.describe)('Statistics and Analytics', () => {
        (0, vitest_1.beforeEach)(() => {
            const { actions } = useLibraryStore_1.useLibraryStore.getState();
            mockGames.forEach(game => actions.addGame(game));
        });
        (0, vitest_1.it)('should calculate total games count', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            const stats = result.current.getStatistics();
            (0, vitest_1.expect)(stats.totalGames).toBe(2);
        });
        (0, vitest_1.it)('should calculate total playtime', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            const stats = result.current.getStatistics();
            (0, vitest_1.expect)(stats.totalPlaytime).toBe(25); // 0 + 25
        });
        (0, vitest_1.it)('should calculate completion rate', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            const stats = result.current.getStatistics();
            (0, vitest_1.expect)(stats.completionRate).toBe(0); // 0 completed out of 2
        });
        (0, vitest_1.it)('should calculate favorite count', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            const stats = result.current.getStatistics();
            (0, vitest_1.expect)(stats.favoriteCount).toBe(1);
        });
        (0, vitest_1.it)('should get genre distribution', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            const genreDistribution = result.current.getGenreDistribution();
            (0, vitest_1.expect)(genreDistribution['Action']).toBe(1);
            (0, vitest_1.expect)(genreDistribution['RPG']).toBe(1);
        });
        (0, vitest_1.it)('should get status distribution', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            const statusDistribution = result.current.getStatusDistribution();
            (0, vitest_1.expect)(statusDistribution['unplayed']).toBe(1);
            (0, vitest_1.expect)(statusDistribution['playing']).toBe(1);
        });
    });
    (0, vitest_1.describe)('Bulk Operations', () => {
        (0, vitest_1.beforeEach)(() => {
            const { actions } = useLibraryStore_1.useLibraryStore.getState();
            mockGames.forEach(game => actions.addGame(game));
        });
        (0, vitest_1.it)('should update multiple games', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.updateMultipleGames([mockGames[0].id, mockGames[1].id], { isFavorite: true });
            });
            const games = result.current.games;
            (0, vitest_1.expect)(games[0].isFavorite).toBe(true);
            (0, vitest_1.expect)(games[1].isFavorite).toBe(true);
        });
        (0, vitest_1.it)('should remove multiple games', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result.current.actions.removeMultipleGames([mockGames[0].id]);
            });
            const games = result.current.games;
            (0, vitest_1.expect)(games).toHaveLength(1);
            (0, vitest_1.expect)(games[0].id).toBe(mockGames[1].id);
        });
    });
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should handle invalid game ID gracefully', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            // Try to update non-existent game
            (0, vitest_1.expect)(() => {
                result.current.actions.updateGame('invalid-id', { title: 'Updated' });
            }).not.toThrow();
            // Try to remove non-existent game
            (0, vitest_1.expect)(() => {
                result.current.actions.removeGame('invalid-id');
            }).not.toThrow();
            // Try to toggle favorite on non-existent game
            (0, vitest_1.expect)(() => {
                result.current.actions.toggleFavorite('invalid-id');
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle empty game list operations', () => {
            const { result } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            // Operations on empty list should not throw
            (0, vitest_1.expect)(() => {
                result.current.actions.searchGames('test');
                result.current.actions.filterByGenres(['action']);
                result.current.actions.filterByStatus(['playing']);
                result.current.actions.filterByFavorites(true);
            }).not.toThrow();
            (0, vitest_1.expect)(result.current.searchResults).toHaveLength(0);
            (0, vitest_1.expect)(result.current.filteredGames).toHaveLength(0);
        });
    });
    (0, vitest_1.describe)('Store Persistence', () => {
        (0, vitest_1.it)('should persist games across hook instances', () => {
            // Add games in first instance
            const { result: result1 } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, react_1.act)(() => {
                result1.current.actions.addGame(mockGames[0]);
            });
            // Create second instance and check if games are still there
            const { result: result2 } = (0, react_1.renderHook)(() => (0, useLibraryStore_1.useLibraryStore)());
            (0, vitest_1.expect)(result2.current.games).toHaveLength(1);
            (0, vitest_1.expect)(result2.current.games[0].id).toBe(mockGames[0].id);
        });
    });
});
