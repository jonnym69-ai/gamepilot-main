"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.useAuthStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const personaEngineService_1 = require("../services/personaEngineService");
const api_1 = require("../config/api");
exports.useAuthStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    persona: null, // Add persona state to store
    // Email/Password login
    login: async (username, password) => {
        // Prevent multiple simultaneous login attempts
        const currentState = get();
        if (currentState.isLoading) {
            return;
        }
        // Prevent login with empty credentials
        if (!username || !password) {
            return;
        }
        try {
            set({ isLoading: true, error: null });
            console.log('🔍 Sending login request:', { username, passwordLength: password.length });
            const response = await (0, api_1.apiFetch)('api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            console.log('🔍 Login response status:', response.status);
            const result = await response.json();
            console.log('🔍 Login response data:', result);
            if (response.ok && result.success) {
                // Use user data directly from login response instead of calling fetchCurrentUser
                const canonicalUser = {
                    id: result.user.id,
                    username: result.user.username,
                    email: result.user.email,
                    displayName: result.user.displayName || result.user.username,
                    avatar: result.user.avatar || '',
                    bio: result.user.bio || '',
                    location: result.user.location || '',
                    website: result.user.website || '',
                    birthday: result.user.birthday || '',
                    discordTag: result.user.discordTag || '',
                    steamProfile: result.user.steamProfile || '',
                    timezone: result.user.timezone || 'UTC',
                    createdAt: new Date(result.user.createdAt),
                    updatedAt: new Date(),
                    lastActive: new Date(result.user.lastActive),
                    gamingProfile: {
                        primaryPlatforms: result.user.gamingProfile?.primaryPlatforms || [],
                        genreAffinities: {},
                        playstyleArchetypes: [],
                        moodProfile: {
                            currentMood: result.user.gamingProfile?.moodProfile?.currentMood || 'neutral',
                            moodHistory: [],
                            moodTriggers: [],
                            moodPreferences: {}
                        },
                        totalPlaytime: result.user.gamingProfile?.totalPlaytime || 0,
                        gamesPlayed: result.user.gamingProfile?.gamesPlayed || 0,
                        gamesCompleted: result.user.gamingProfile?.gamesCompleted || 0,
                        achievementsCount: result.user.gamingProfile?.achievementsCount || 0,
                        averageRating: result.user.gamingProfile?.averageRating || 0,
                        currentStreak: result.user.gamingProfile?.currentStreak || 0,
                        longestStreak: result.user.gamingProfile?.longestStreak || 0,
                        favoriteGames: result.user.gamingProfile?.favoriteGames || []
                    },
                    integrations: result.user.integrations || [],
                    privacy: {
                        profileVisibility: 'public',
                        sharePlaytime: true,
                        shareAchievements: true,
                        shareGameLibrary: true,
                        allowFriendRequests: true,
                        showOnlineStatus: true
                    },
                    preferences: {
                        theme: 'dark',
                        language: 'en',
                        notifications: {
                            email: true,
                            push: true,
                            achievements: true,
                            recommendations: true,
                            friendActivity: true,
                            platformUpdates: true
                        },
                        display: {
                            compactMode: false,
                            showGameCovers: true,
                            animateTransitions: true,
                            showRatings: true
                        }
                    },
                    social: {
                        friends: [],
                        blockedUsers: [],
                        favoriteGenres: [],
                        customTags: []
                    }
                };
                set({
                    user: canonicalUser,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                // Load persona for existing user
                if (canonicalUser.id) {
                    await personaEngineService_1.personaEngineService.load(canonicalUser.id);
                    const persona = personaEngineService_1.personaEngineService.getCurrentPersona();
                    set({ persona });
                }
                // Reset loading state on success
                set({ isLoading: false, error: null });
            }
            else {
                throw new Error(result.message || 'Invalid username or password');
            }
        }
        catch (error) {
            console.error('❌ Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            set({
                error: errorMessage,
                isLoading: false,
            });
            // Don't throw error to prevent infinite loops in calling components
            // Return a resolved promise to prevent unhandled promise rejections
            return Promise.resolve();
        }
    },
    // Email/Password registration
    register: async (username, email, password, displayName) => {
        // Prevent multiple simultaneous registration attempts
        const currentState = get();
        if (currentState.isLoading) {
            return;
        }
        try {
            set({ isLoading: true, error: null });
            const response = await (0, api_1.apiFetch)('api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    displayName: displayName || username
                }),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                // Get token from cookie and fetch user profile
                await get().fetchCurrentUser();
                // Initialize persona for new user
                if (get().user?.id) {
                    await personaEngineService_1.personaEngineService.initializeNewUser(get().user.id);
                    const persona = personaEngineService_1.personaEngineService.getCurrentPersona();
                    set({ persona });
                }
                // Reset loading state on success
                set({ isLoading: false, error: null });
            }
            else {
                throw new Error(result.message || 'Registration failed');
            }
        }
        catch (error) {
            console.error('❌ Registration error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            set({
                error: errorMessage,
                isLoading: false,
            });
            // Don't throw error to prevent infinite loops in calling components
            // Return a resolved promise to prevent unhandled promise rejections
            return Promise.resolve();
        }
    },
    // Steam login
    loginWithSteam: () => {
        // Redirect to Steam authentication endpoint
        window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/auth/steam`;
    },
    logout: async () => {
        try {
            set({ isLoading: true, error: null });
            // Call logout endpoint
            const response = await (0, api_1.apiFetch)('api/auth/logout', {
                method: 'GET',
            });
            if (response.ok) {
                // Reset persona state before clearing auth state
                await personaEngineService_1.personaEngineService.reset();
                // Clear local state
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                    persona: null, // Clear persona state
                });
            }
            else {
                throw new Error(`Logout failed: ${response.status} ${response.statusText}`);
            }
        }
        catch (error) {
            console.error('❌ Logout error:', error);
            set({
                error: error instanceof Error ? error.message : 'Logout failed',
                isLoading: false,
            });
        }
    },
    fetchCurrentUser: async () => {
        try {
            set({ isLoading: true, error: null });
            console.log('🔍 Fetching current user...');
            // Don't check localStorage for sessionToken since we're using HTTP-only cookies
            const response = await (0, api_1.apiFetch)('api/auth/me', {
                method: 'GET',
            });
            console.log('🔍 Fetch user response status:', response.status);
            const result = await response.json();
            console.log('🔍 Fetch user response data:', result);
            if (response.ok) {
                if (result.success && result.data) {
                    // Convert enhanced user data to canonical User format
                    const canonicalUser = {
                        id: result.data.id,
                        username: result.data.username,
                        email: result.data.email,
                        displayName: result.data.displayName || result.data.username,
                        avatar: result.data.avatar || '',
                        bio: result.data.bio || '',
                        location: result.data.location || '',
                        timezone: result.data.timezone || 'UTC',
                        createdAt: new Date(result.data.createdAt),
                        updatedAt: new Date(),
                        lastActive: new Date(result.data.lastActive),
                        gamingProfile: {
                            primaryPlatforms: result.data.gamingProfile?.primaryPlatforms || [],
                            genreAffinities: {},
                            playstyleArchetypes: [],
                            moodProfile: {
                                currentMood: result.data.gamingProfile?.currentMood || 'neutral',
                                moodHistory: [],
                                moodTriggers: [],
                                moodPreferences: {}
                            },
                            totalPlaytime: result.data.gamingProfile?.totalPlaytime || 0,
                            gamesPlayed: result.data.gamingProfile?.gamesPlayed || 0,
                            gamesCompleted: 0,
                            achievementsCount: result.data.gamingProfile?.achievementsCount || 0,
                            averageRating: 0,
                            currentStreak: 0,
                            longestStreak: 0,
                            favoriteGames: []
                        },
                        integrations: result.data.integrations || [],
                        privacy: {
                            profileVisibility: 'public',
                            sharePlaytime: true,
                            shareAchievements: true,
                            shareGameLibrary: true,
                            allowFriendRequests: true,
                            showOnlineStatus: true
                        },
                        preferences: {
                            theme: 'dark',
                            language: 'en',
                            notifications: {
                                email: true,
                                push: true,
                                achievements: true,
                                recommendations: true,
                                friendActivity: true,
                                platformUpdates: true
                            },
                            display: {
                                compactMode: false,
                                showGameCovers: true,
                                animateTransitions: true,
                                showRatings: true
                            }
                        },
                        social: {
                            friends: [],
                            blockedUsers: [],
                            favoriteGenres: [],
                            customTags: []
                        }
                    };
                    set({
                        user: canonicalUser,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                }
                else {
                    // Clear auth state if no user data
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                }
            }
            else if (response.status === 401) {
                // User is not authenticated - this is normal, not an error
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
            else {
                throw new Error(`Failed to fetch current user: ${response.status} ${response.statusText}`);
            }
        }
        catch (error) {
            console.error('❌ Fetch current user error:', error);
            // Don't set error state for network issues, just clear loading state
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null, // Clear error to prevent infinite loops
            });
        }
    },
    clearError: () => {
        set({ error: null });
    },
    setUser: (user) => {
        set({ user });
    },
    setAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
    },
    initializeAuth: () => {
        get().fetchCurrentUser();
    },
    updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            set({ user: updatedUser });
        }
    },
    // Persona management methods
    getPersona: () => {
        return personaEngineService_1.personaEngineService.getCurrentPersona();
    },
    refreshPersona: async () => {
        try {
            if (get().user?.id) {
                await personaEngineService_1.personaEngineService.load(get().user.id);
                const persona = personaEngineService_1.personaEngineService.getCurrentPersona();
                set({ persona });
            }
        }
        catch (error) {
            console.error('❌ Failed to refresh persona:', error);
        }
    },
}), {
    name: 'auth-storage',
    partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
    }),
}));
// Selectors
const useAuth = () => {
    const auth = (0, exports.useAuthStore)();
    return {
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        login: auth.login,
        register: auth.register,
        loginWithSteam: auth.loginWithSteam,
        logout: auth.logout,
        fetchCurrentUser: auth.fetchCurrentUser,
        clearError: auth.clearError,
        setUser: auth.setUser,
        setAuthenticated: auth.setAuthenticated,
        initializeAuth: auth.initializeAuth,
        updateProfile: auth.updateProfile,
    };
};
exports.useAuth = useAuth;
