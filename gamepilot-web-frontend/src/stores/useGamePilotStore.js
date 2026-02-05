"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecentlyPlayed = exports.useTotalPlaytime = exports.useGamesByStatus = exports.useSteamId = exports.useUserPreferences = exports.useIntegrations = exports.useGames = exports.useGamePilotStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
// Create the store
exports.useGamePilotStore = (0, zustand_1.create)()((0, middleware_1.devtools)((0, middleware_1.persist)((set, get) => ({
    // Initial state
    games: [],
    libraryLoading: false,
    libraryError: null,
    integrations: {
        steam: { connected: false },
        discord: { connected: false },
        youtube: { connected: false }
    },
    integrationLoading: false,
    userPreferences: {
        theme: 'dark',
        animations: true,
        reducedMotion: false,
        language: 'en',
        notifications: {
            achievements: true,
            friendActivity: true,
            gameRecommendations: true
        }
    },
    // Game library actions
    setGames: (games) => set({ games }),
    addGame: (game) => set((state) => ({
        games: [...state.games, game]
    })),
    updateGame: (id, updates) => set((state) => ({
        games: state.games.map(game => game.id === id ? { ...game, ...updates } : game)
    })),
    removeGame: (id) => set((state) => ({
        games: state.games.filter(game => game.id !== id)
    })),
    // Integration actions
    setIntegrationStatus: (platform, status) => set((state) => ({
        integrations: {
            ...state.integrations,
            [platform]: { ...state.integrations[platform], ...status }
        }
    })),
    setSteamId: (steamId) => set({ currentSteamId: steamId }),
    // User preferences actions
    updateUserPreferences: (preferences) => set((state) => ({
        userPreferences: { ...state.userPreferences, ...preferences }
    })),
    // Computed values
    getGamesByStatus: (status) => {
        const { games } = get();
        return games.filter(game => game.playStatus === status);
    },
    getTotalPlaytime: () => {
        const { games } = get();
        return games.reduce((total, game) => total + (game.hoursPlayed || 0), 0);
    },
    getRecentlyPlayed: (limit = 5) => {
        const { games } = get();
        return games
            .filter(game => game.lastPlayed)
            .sort((a, b) => (b.lastPlayed?.getTime() || 0) - (a.lastPlayed?.getTime() || 0))
            .slice(0, limit);
    }
}), {
    name: 'gamepilot-store',
    partialize: (state) => ({
        games: state.games,
        userPreferences: state.userPreferences,
        integrations: state.integrations,
        currentSteamId: state.currentSteamId
    })
}), {
    name: 'GamePilotStore'
}));
// Selectors for common use cases
const useGames = () => (0, exports.useGamePilotStore)(state => state.games);
exports.useGames = useGames;
const useIntegrations = () => (0, exports.useGamePilotStore)(state => state.integrations);
exports.useIntegrations = useIntegrations;
const useUserPreferences = () => (0, exports.useGamePilotStore)(state => state.userPreferences);
exports.useUserPreferences = useUserPreferences;
const useSteamId = () => (0, exports.useGamePilotStore)(state => state.currentSteamId);
exports.useSteamId = useSteamId;
// Computed selectors
const useGamesByStatus = (status) => {
    const getGamesByStatus = (0, exports.useGamePilotStore)(state => state.getGamesByStatus);
    return getGamesByStatus(status);
};
exports.useGamesByStatus = useGamesByStatus;
const useTotalPlaytime = () => {
    const getTotalPlaytime = (0, exports.useGamePilotStore)(state => state.getTotalPlaytime);
    return getTotalPlaytime();
};
exports.useTotalPlaytime = useTotalPlaytime;
const useRecentlyPlayed = (limit) => {
    const getRecentlyPlayed = (0, exports.useGamePilotStore)(state => state.getRecentlyPlayed);
    return getRecentlyPlayed(limit);
};
exports.useRecentlyPlayed = useRecentlyPlayed;
