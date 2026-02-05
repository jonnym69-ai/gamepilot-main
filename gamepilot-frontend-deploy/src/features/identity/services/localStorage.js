"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const STORAGE_KEYS = {
    USER_IDENTITY: 'gamepilot-user-identity',
    USER_PROFILE: 'gamepilot-user-profile',
    USER_PREFERENCES: 'gamepilot-user-preferences',
    USER_PLAYSTYLE: 'gamepilot-user-playstyle',
    USER_GENRES: 'gamepilot-user-genres',
    USER_MOODS: 'gamepilot-user-moods',
    USER_STATS: 'gamepilot-user-stats'
};
class LocalStorageService {
    // Generic methods
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            console.error(`Error reading from localStorage for key ${key}:`, error);
            return null;
        }
    }
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error(`Error writing to localStorage for key ${key}:`, error);
        }
    }
    remove(key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error(`Error removing from localStorage for key ${key}:`, error);
        }
    }
    // User Identity methods
    getUserIdentity() {
        return this.get(STORAGE_KEYS.USER_IDENTITY);
    }
    setUserIdentity(identity) {
        this.set(STORAGE_KEYS.USER_IDENTITY, identity);
    }
    // User Profile methods
    getUserProfile() {
        return this.get(STORAGE_KEYS.USER_PROFILE);
    }
    setUserProfile(profile) {
        this.set(STORAGE_KEYS.USER_PROFILE, profile);
    }
    // User Preferences methods
    getUserPreferences() {
        return this.get(STORAGE_KEYS.USER_PREFERENCES);
    }
    setUserPreferences(preferences) {
        this.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
    }
    // User Playstyle methods
    getUserPlaystyle() {
        return this.get(STORAGE_KEYS.USER_PLAYSTYLE);
    }
    setUserPlaystyle(playstyle) {
        this.set(STORAGE_KEYS.USER_PLAYSTYLE, playstyle);
    }
    // User Genres methods
    getUserGenres() {
        return this.get(STORAGE_KEYS.USER_GENRES) || [];
    }
    setUserGenres(genres) {
        this.set(STORAGE_KEYS.USER_GENRES, genres);
    }
    // User Moods methods
    getUserMoods() {
        return this.get(STORAGE_KEYS.USER_MOODS) || [];
    }
    setUserMoods(moods) {
        this.set(STORAGE_KEYS.USER_MOODS, moods);
    }
    // User Stats methods
    getUserStats() {
        return this.get(STORAGE_KEYS.USER_STATS);
    }
    setUserStats(stats) {
        this.set(STORAGE_KEYS.USER_STATS, stats);
    }
    // Initialize default data for new users
    initializeDefaultData() {
        const defaultIdentity = {
            profile: {
                id: `user-${Date.now()}`,
                username: `gamer_${Math.floor(Math.random() * 10000)}`,
                displayName: 'New Gamer',
                avatar: '',
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                bio: 'Passionate gamer with diverse interests',
                isPublic: false,
                level: 1,
                experience: 0
            },
            preferences: {
                theme: 'dark',
                language: 'en',
                timezone: 'UTC',
                notifications: {
                    email: true,
                    push: true,
                    achievements: true,
                    recommendations: true,
                    friendActivity: false
                },
                privacy: {
                    profileVisibility: 'private',
                    showPlaytime: true,
                    showAchievements: true,
                    showGameLibrary: false
                },
                display: {
                    compactMode: false,
                    showGameCovers: true,
                    animateTransitions: true,
                    showRatings: true
                },
                profileVisibility: 'private',
                showPlaytime: true,
                showAchievements: true,
                showGameLibrary: false
            },
            playstyle: {
                primary: {
                    id: 'casual',
                    name: 'Casual',
                    description: 'Relaxed gaming experience',
                    icon: '🎮',
                    color: '#4CAF50',
                    traits: ['relaxed', 'exploratory']
                },
                traits: ['relaxed', 'exploratory'],
                preferences: {
                    sessionLength: 'short',
                    difficulty: 'casual',
                    socialPreference: 'solo',
                    storyFocus: 50,
                    graphicsFocus: 50,
                    gameplayFocus: 50
                }
            },
            favoriteGenres: [],
            favoriteMoods: [],
            stats: {
                totalPlaytime: 0,
                gamesPlayed: 0,
                gamesCompleted: 0,
                achievementsUnlocked: 0,
                averageRating: 0,
                favoriteGenres: [],
                favoriteMoods: [],
                currentStreak: 0,
                longestStreak: 0
            },
            connectedPlatforms: [],
            customTags: []
        };
        // Save default data if nothing exists
        if (!this.get(STORAGE_KEYS.USER_IDENTITY)) {
            this.set(STORAGE_KEYS.USER_IDENTITY, defaultIdentity);
        }
        return this.get(STORAGE_KEYS.USER_IDENTITY) || defaultIdentity;
    }
    // Utility methods
    clearAllUserData() {
        Object.values(STORAGE_KEYS).forEach(key => {
            this.remove(key);
        });
    }
    // Export/Import functionality
    exportUserData() {
        const identity = this.getUserIdentity();
        if (!identity)
            return null;
        try {
            return JSON.stringify(identity, null, 2);
        }
        catch (error) {
            console.error('Error exporting user data:', error);
            return null;
        }
    }
    importUserData(jsonData) {
        try {
            const identity = JSON.parse(jsonData);
            if (identity && typeof identity === 'object') {
                this.setUserIdentity(identity);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error importing user data:', error);
            return false;
        }
    }
    // Enhanced preference updates
    updateUserPreferences(updates) {
        const currentPrefs = this.getUserPreferences();
        if (!currentPrefs)
            return null;
        const updatedPrefs = {
            ...currentPrefs,
            ...updates
        };
        this.setUserPreferences(updatedPrefs);
        return updatedPrefs;
    }
    // Enhanced playstyle updates
    updateUserPlaystyle(updates) {
        const currentPlaystyle = this.getUserPlaystyle();
        if (!currentPlaystyle)
            return null;
        const updatedPlaystyle = {
            ...currentPlaystyle,
            ...updates
        };
        this.setUserPlaystyle(updatedPlaystyle);
        return updatedPlaystyle;
    }
    // Enhanced genre management
    updateUserGenre(genreId, updates) {
        const currentGenres = this.getUserGenres();
        const genreIndex = currentGenres.findIndex(g => g.id === genreId);
        if (genreIndex >= 0) {
            const updatedGenres = [...currentGenres];
            updatedGenres[genreIndex] = { ...updatedGenres[genreIndex], ...updates };
            this.setUserGenres(updatedGenres);
            return updatedGenres;
        }
        return currentGenres;
    }
    // Enhanced mood management
    updateUserMood(moodId, updates) {
        const currentMoods = this.getUserMoods();
        const moodIndex = currentMoods.findIndex(m => m.id === moodId);
        if (moodIndex >= 0) {
            const updatedMoods = [...currentMoods];
            updatedMoods[moodIndex] = { ...updatedMoods[moodIndex], ...updates };
            this.setUserMoods(updatedMoods);
            return updatedMoods;
        }
        return currentMoods;
    }
    // Enhanced stats management
    updateUserStats(updates) {
        const currentStats = this.getUserStats();
        if (!currentStats)
            return null;
        const updatedStats = {
            ...currentStats,
            ...updates
        };
        this.setUserStats(updatedStats);
        return updatedStats;
    }
}
exports.LocalStorageService = LocalStorageService;
