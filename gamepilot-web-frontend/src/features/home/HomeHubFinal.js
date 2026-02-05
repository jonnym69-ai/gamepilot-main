"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeHubFinal = HomeHubFinal;
const jsx_runtime_1 = require("react/jsx-runtime");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const useGamePilotStore_1 = require("../../stores/useGamePilotStore");
const authStore_1 = require("../../store/authStore");
const react_router_dom_1 = require("react-router-dom");
const ErrorBoundary_1 = require("../../components/ErrorBoundary");
const WhatToPlayNow_1 = require("../../components/WhatToPlayNow");
const EnhancedWhatToBuy_1 = require("../../components/home/EnhancedWhatToBuy");
const usePersonaRecommendation_1 = require("../../hooks/usePersonaRecommendation");
const SurpriseMeSection_1 = require("./components/SurpriseMeSection");
const SimpleMoodSelector_1 = require("../../components/SimpleMoodSelector");
const useNewMoodRecommendations_1 = require("../../hooks/useNewMoodRecommendations");
const moodService_1 = require("../../services/moodService");
const react_1 = require("react");
const api_1 = require("../../config/api");
const EnhancedHeroSection_1 = require("../../components/home/EnhancedHeroSection");
const launchGame_1 = require("../../utils/launchGame");
const ToastProvider_1 = require("../../components/ui/ToastProvider");
// NEW: Import contextual engine
const contextualEngine_1 = require("../../utils/contextualEngine");
// NEW: Import analytics
const analytics_1 = require("../../utils/analytics");
// Import persona components
const persona_1 = require("../../hooks/persona");
const usePersonaRealtime_1 = require("../../hooks/usePersonaRealtime");
const MoodFilterDebug_1 = require("../../components/debug/MoodFilterDebug");
// Import Enhanced Persona Preview (optional component)
const EnhancedPersonaPreview_1 = require("../../components/persona/EnhancedPersonaPreview");
// Import IdentityCard and Persona Engine
const IdentityCard_1 = __importDefault(require("../../components/persona/IdentityCard"));
const synthesis_1 = require("@shared/persona/synthesis");
const moodEngine_1 = require("@shared/persona/moodEngine");
const reflection_1 = require("@shared/persona/reflection");
// Import customisation components
const EditModePanel_1 = require("../../features/customisation/EditModePanel");
const customisationStore_1 = require("../../features/customisation/customisationStore");
function HomeHubFinal() {
    const { user, persona, refreshPersona } = (0, authStore_1.useAuthStore)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { games, actions } = (0, useLibraryStore_1.useLibraryStore)();
    const { integrations } = (0, useGamePilotStore_1.useGamePilotStore)();
    const toast = (0, ToastProvider_1.useToast)();
    // Get customisation settings for animation control
    const customisation = (0, customisationStore_1.useCustomisation)('home');
    const animationLevel = customisation?.animationLevel || 'medium';
    const backgroundMode = customisation?.backgroundMode || 'gradient';
    const accentColor = customisation?.accentColor || '#3b82f6';
    const density = customisation?.density || 'comfortable';
    const lightingMode = customisation?.lightingMode || 'none';
    // Animation configuration based on level
    const getAnimationConfig = () => {
        // Background animations are always disabled for accessibility and comfort
        return {
            enabled: false, // Always disabled - too hard on eyes
            duration: 0,
            repeat: 0,
            ease: "easeInOut"
        };
    };
    const animationConfig = getAnimationConfig();
    // Enhanced Mood System State
    const [showMoodSelector, setShowMoodSelector] = (0, react_1.useState)(false);
    const { primaryMood, secondaryMood, intensity, recommendations: moodRecommendations, isLoading: moodRecommendationsLoading, error: moodRecommendationsError, selectMood, clearMood, setIntensity, hasRecommendations: hasMoodRecommendations } = (0, useNewMoodRecommendations_1.useNewMoodRecommendations)({
        games: games || [],
        onRecommendationsChange: (recs) => {
            console.log('🎯 Enhanced mood recommendations updated:', recs.length);
        }
    });
    // Computed values
    const moodRecommendationCount = moodRecommendations.length;
    const handleMoodSelect = (primaryMood, secondaryMood) => {
        selectMood(primaryMood, secondaryMood);
        setShowMoodSelector(false);
    };
    // Listen for mood changes from navigation
    (0, react_1.useEffect)(() => {
        const handleMoodChange = (event) => {
            const { primaryMood, secondaryMood } = event.detail;
            handleMoodSelect(primaryMood, secondaryMood);
        };
        window.addEventListener('moodChanged', handleMoodChange);
        return () => window.removeEventListener('moodChanged', handleMoodChange);
    }, []);
    // Performance optimized loading state
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    // Set loading to false after component mounts
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    // Surprise Me state
    const [showSurpriseSection, setShowSurpriseSection] = (0, react_1.useState)(false);
    // NEW: What To Play state
    const [showWhatToPlay, setShowWhatToPlay] = (0, react_1.useState)(false);
    // Get real-time persona updates
    const realtimePersona = (0, usePersonaRealtime_1.usePersonaRealtime)();
    // Get persona snapshot for fallback/computed data
    const personaSnapshot = (0, persona_1.usePersonaSnapshot)();
    // Get persona-driven recommendation
    const personaRecommendation = (0, usePersonaRecommendation_1.usePersonaRecommendation)();
    // Use real-time persona as primary source, fallback to auth store, then snapshot
    const currentPersona = realtimePersona.persona || persona || personaSnapshot;
    // NEW: Game handlers
    const handlePlayGame = (game) => {
        console.log(`Playing game: ${game.title}`);
        // TODO: Implement actual game launching logic
    };
    const handleStatusChange = (gameId, newStatus) => {
        actions.updateGameStatus(gameId, newStatus);
    };
    const handleEditGame = (game) => {
        navigate(`/library/game/${game.id}`);
    };
    const handleDeleteGame = (gameId) => {
        actions.deleteGame(gameId);
    };
    const handleQuickLaunch = (game) => {
        handlePlayGame(game);
    };
    // NEW: Generate persona context for enhanced recommendations
    const personaContext = (0, react_1.useMemo)(() => {
        if (!currentPersona || !currentPersona.signals)
            return null;
        try {
            return (0, contextualEngine_1.generatePersonaContext)(currentPersona.signals);
        }
        catch (error) {
            console.warn('Failed to generate persona context:', error);
            return null;
        }
    }, [currentPersona]);
    // NEW: Generate persona-enhanced recommendations
    const personaEnhancedRecommendations = (0, react_1.useMemo)(() => {
        if (!personaContext || !games || games.length === 0)
            return [];
        try {
            const userFilters = {
                selectedMoods: [], // No mood filter for persona recommendations
                selectedSessionLength: null, // Use persona preference
                timeOfDay: (0, contextualEngine_1.detectTimeOfDay)() // Current time
            };
            const recommendations = (0, contextualEngine_1.getPersonaContextualMatches)(games, personaContext, userFilters, {
                personaWeight: 0.4, // Moderate persona influence
                limit: 10
            });
            console.log('🎯 Persona-enhanced recommendations:', {
                personaContext: {
                    dominantMoods: personaContext.dominantMoods,
                    preferredSessionLength: personaContext.preferredSessionLength,
                    preferredTimesOfDay: personaContext.preferredTimesOfDay
                },
                recommendationCount: recommendations.length,
                topGames: recommendations.slice(0, 3).map(rec => 'game' in rec ? rec.game.title : rec.title)
            });
            // NEW: Track persona insights when recommendations are generated
            (0, analytics_1.trackPersonaInsights)(personaContext, recommendations.length);
            return recommendations;
        }
        catch (error) {
            console.warn('Failed to generate persona-enhanced recommendations:', error);
            return [];
        }
    }, [personaContext, games]);
    // Mock persona pipeline for demonstration
    const mockRaw = {
        steam: {
            games: (games || []), // Cast to shared Game type
            playtime: {},
            genres: {},
            achievements: {},
            sessions: []
        }
    };
    // Create real persona data using the Persona Engine
    const signals = (0, synthesis_1.buildPersonaSignals)(mockRaw);
    const traits = (0, synthesis_1.buildPersonaTraits)(signals);
    const mood = (0, moodEngine_1.buildMoodState)({
        sessionPattern: 0,
        genreShift: 0,
        playtimeSpike: 0,
        returnFrequency: 0,
        abandonmentRate: 0
    });
    const reflection = (0, reflection_1.buildReflection)(traits, mood);
    // Edit mode state
    const [isEditMode, setIsEditMode] = (0, react_1.useState)(false);
    // Mood Intelligence Dashboard state
    const [moodData, setMoodData] = (0, react_1.useState)({
        forecast: null,
        recommendations: [],
        resonance: null,
        loading: true
    });
    // Fetch mood data for the dashboard - reactive to persona changes
    (0, react_1.useEffect)(() => {
        const fetchMoodData = async () => {
            try {
                const userId = 'current-user';
                const [forecast, resonance, recommendations] = await Promise.all([
                    moodService_1.moodService.getMoodForecast(userId),
                    moodService_1.moodService.getMoodResonance(userId),
                    moodService_1.moodService.getMoodRecommendations(userId)
                ]);
                setMoodData({
                    forecast,
                    resonance,
                    recommendations: recommendations.recommendations.slice(0, 5),
                    loading: false
                });
            }
            catch (error) {
                console.error('Failed to fetch mood data:', error);
                setMoodData(prev => ({ ...prev, loading: false }));
            }
        };
        fetchMoodData();
    }, [currentPersona]); // Re-fetch when persona changes
    // Refresh persona data when auth store persona changes
    (0, react_1.useEffect)(() => {
        if (persona && !personaSnapshot) {
            // Auth store has persona but snapshot doesn't, refresh to sync
            refreshPersona();
        }
    }, [persona, personaSnapshot, refreshPersona]);
    // Mock recently played data using games from library
    const recentlyPlayed = (games || [])?.slice(0, 5).map(game => ({
        appId: game?.id || '',
        name: game?.title || 'Unknown Game',
        headerImage: game?.coverImage || (0, api_1.createApiUrl)('/placeholder/cover/default.jpg'),
        playtimeRecent: Math.floor(Math.random() * 120), // Mock playtime
    }));
    // Helper functions that are still used
    const getRecentActivityItems = () => {
        return [
            { icon: '🎮', title: 'Played Hades', time: '2 hours ago' },
            { icon: '⭐', title: 'Unlocked achievement in Portal 2', time: '5 hours ago' },
            { icon: '📚', title: 'Added The Witcher 3 to library', time: '1 day ago' },
            { icon: '🏆', title: 'Completed Celeste', time: '2 days ago' },
            { icon: '🎯', title: 'New high score in Apex Legends', time: '3 days ago' }
        ];
    };
    const getContinuePlayingGames = () => {
        return games?.filter(game => game.playStatus === 'playing' ||
            (game.hoursPlayed && game.hoursPlayed > 0 && game.hoursPlayed < 50)).sort((a, b) => (0, contextualEngine_1.getTimeSafe)(b.lastPlayed) - (0, contextualEngine_1.getTimeSafe)(a.lastPlayed)) || [];
    };
    const LoadingSkeleton = ({ className = "" }) => ((0, jsx_runtime_1.jsx)("div", { className: `bg-gray-800/50 rounded-lg ${className}` }));
    // Helper function to extract mood string from persona
    const getCurrentMoodString = () => {
        const mood = currentPersona?.mood;
        if (typeof mood === 'string') {
            return mood;
        }
        return mood?.moodId || 'neutral';
    };
    // Handle refresh for persona recommendation
    const handleRefreshRecommendation = () => {
        // Generate new recommendation with variety
        const moods = ['competitive', 'creative', 'relaxed', 'focused', 'social', 'adventurous'];
        const currentMood = getCurrentMoodString();
        // Create variation by temporarily modifying persona signals for refresh
        const alternativeMood = moods[Math.floor(Math.random() * moods.length)];
        const randomMultiplier = Math.random() * 0.3 + 0.7; // 0.7-1.0 for variation
        // Refresh mood data with new variations
        setMoodData(prev => ({
            ...prev,
            recommendations: prev.recommendations.map((rec, index) => ({
                ...rec,
                gameId: rec.gameId + '_refreshed_' + Date.now() + '_' + index,
                reasoning: `Updated recommendation based on ${Math.random() > 0.5 ? alternativeMood : currentMood} mood and your gaming patterns`,
                moodAlignment: Math.random() * 0.3 + 0.7 * randomMultiplier, // Add variation
                genreMatch: Math.random() * 0.4 + 0.6 * randomMultiplier // Add variation
            }))
        }));
        // Add a refresh timestamp to force persona recommendation recalculation
        const refreshKey = `refresh_${Date.now()}`;
        localStorage.setItem('persona_refresh_key', refreshKey);
        // Trigger persona refresh to get new recommendation
        refreshPersona();
        // Force re-render of WhatToBuy component by updating a state
        setTimeout(() => {
            // This will trigger the usePersonaRecommendation hook to recalculate
            window.dispatchEvent(new CustomEvent('persona-refreshed', { detail: { timestamp: Date.now() } }));
        }, 100);
    };
    // Handle launching games from Surprise Me
    const handleLaunchGame = async (gameId) => {
        console.log('🎮 Launching game:', gameId);
        try {
            // Find the game in the library
            const game = games?.find(g => g.id === gameId);
            if (!game) {
                console.error('Game not found:', gameId);
                alert('Game not found in library');
                return;
            }
            console.log(`🚀 Launching ${game.title}...`);
            // Try to extract Steam App ID from various sources
            let steamAppId = null;
            // Check if game has appId property
            if (game.appId && typeof game.appId === 'number') {
                steamAppId = game.appId;
            }
            // Check if game has steamUrl with app ID
            else if (game.steamUrl) {
                const match = game.steamUrl.match(/\/app\/(\d+)/);
                if (match) {
                    steamAppId = parseInt(match[1]);
                }
            }
            // Check if game ID looks like a Steam app ID
            else if (/^\d+$/.test(gameId)) {
                steamAppId = parseInt(gameId);
            }
            if (steamAppId) {
                console.log(`🎮 Launching Steam game with App ID: ${steamAppId}`);
                (0, launchGame_1.launchGame)(steamAppId);
                console.log('✅ Steam launch command sent');
            }
            else {
                // Fallback for non-Steam games
                console.log('📋 Non-Steam game detected, showing game info');
                alert(`Would launch: ${game.title}\n\nThis game doesn't have a Steam App ID configured.\n\nGame ID: ${gameId}\nSteam URL: ${game.steamUrl || 'Not configured'}`);
            }
        }
        catch (error) {
            console.error('❌ Error launching game:', error);
            alert('Failed to launch game. Please check console for details.');
        }
    };
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: `min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker relative overflow-hidden transition-all duration-1000 ease-in-out ${density === 'compact' ? 'py-4' : 'py-8'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 overflow-hidden pointer-events-none" }), (0, jsx_runtime_1.jsxs)("div", { className: `relative z-10 ${density === 'compact' ? 'px-4' : 'px-8'}`, children: [(0, jsx_runtime_1.jsx)(EnhancedHeroSection_1.EnhancedHeroSection, { user: user, games: games, currentPersona: currentPersona }), (0, jsx_runtime_1.jsxs)("section", { className: `mb-6 ${density === 'compact' ? 'mb-4' : 'mb-6'}`, children: [(0, jsx_runtime_1.jsx)(IdentityCard_1.default, { persona: reflection }), (0, jsx_runtime_1.jsx)(EnhancedPersonaPreview_1.EnhancedPersonaPreview, { enhancedInsights: undefined })] }), (0, jsx_runtime_1.jsxs)("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10 relative overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-gaming font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-gaming-primary rounded-full" }), "Quick Actions"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => window.location.href = '/library', className: "w-full px-6 py-3 bg-gradient-to-r from-gaming-primary/90 to-gaming-primary/80 text-white rounded-xl hover:from-gaming-primary hover:to-gaming-primary/90 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAE" }), "Add Games"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity", children: "\u2192" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => window.location.href = '/analytics', className: "w-full px-6 py-3 bg-gradient-to-r from-gaming-secondary/90 to-gaming-secondary/80 text-white rounded-xl hover:from-gaming-secondary hover:to-gaming-secondary/90 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full" }), "View Stats"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity", children: "\u2192" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsEditMode(true), className: "w-full px-6 py-3 bg-gradient-to-r from-purple-600/90 to-purple-500/80 text-white rounded-xl hover:from-purple-600 hover:to-purple-500/90 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u270F\uFE0F" }), "Customise Page"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity", children: "\u2192" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => window.location.href = '/settings', className: "w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-current rounded" }), "Settings"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity", children: "\u2192" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-green-500/30 relative overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-gaming font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }), "Surprise Me"] }), showSurpriseSection ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(SurpriseMeSection_1.SurpriseMeSection, { games: games || [], onLaunchGame: handleLaunchGame }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowSurpriseSection(false), className: "w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-gaming", children: "\u2190 Back" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl animate-bounce", children: "\uD83C\uDFB2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-gaming font-semibold mb-2", children: "Feeling adventurous?" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/60 text-sm mb-4", children: "Discover something new based on your gaming patterns and current mood" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowSurpriseSection(true), className: "w-full px-6 py-3 bg-gradient-to-r from-green-500/90 to-emerald-500/80 text-white rounded-xl font-gaming font-semibold hover:from-green-500 hover:to-emerald-500/90 transition-all duration-300 relative overflow-hidden group/btn", children: [(0, jsx_runtime_1.jsxs)("span", { className: "relative z-10 flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFB2" }), "Surprise Me Now"] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10 relative overflow-hidden group", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-gaming font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-gaming-secondary rounded-full" }), "Recent Activity"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [getRecentActivityItems().slice(0, 3).map((activity, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer group/item", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: activity.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-white text-sm font-medium", children: activity.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/40 text-xs", children: activity.time })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-gaming-secondary rounded-full opacity-0 group-hover/item:opacity-100" })] }, index))), (0, jsx_runtime_1.jsxs)("button", { onClick: () => window.location.href = '/analytics', className: "w-full mt-4 p-2 text-gaming-secondary hover:text-gaming-secondary/80 text-xs font-gaming uppercase tracking-wider transition-colors flex items-center justify-center gap-2", children: ["View All Activity", (0, jsx_runtime_1.jsx)("span", { children: "\u2192" })] })] })] })] }), personaContext && personaEnhancedRecommendations.length > 0 && ((0, jsx_runtime_1.jsx)("section", { className: "mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-2 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAF" }), "Games Chosen For You"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Based on your gaming habits, moods, and play patterns" })] }) }), (() => {
                                        try {
                                            (0, analytics_1.trackRecommendationInteraction)('persona', 'shown', {
                                                count: personaEnhancedRecommendations.length,
                                                dominantMoods: personaContext.dominantMoods,
                                                preferredSessionLength: personaContext.preferredSessionLength,
                                                preferredTimesOfDay: personaContext.preferredTimesOfDay
                                            });
                                        }
                                        catch (error) {
                                            // Fail silently
                                        }
                                        return null;
                                    })(), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-black/20 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Dominant moods:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white ml-2 font-medium", children: [personaContext.dominantMoods.slice(0, 3).join(", "), personaContext.dominantMoods.length > 3 && "..."] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Preferred session:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2 font-medium capitalize", children: personaContext.preferredSessionLength })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Preferred times:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2 font-medium", children: personaContext.preferredTimesOfDay.join(", ") })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: personaEnhancedRecommendations.map((rec, index) => {
                                            const game = 'game' in rec ? rec.game : rec;
                                            return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => {
                                                    // NEW: Track persona recommendation click
                                                    (0, analytics_1.trackRecommendationInteraction)('persona', 'clicked', {
                                                        gameId: game.id,
                                                        dominantMoods: personaContext.dominantMoods,
                                                        personaWeight: 0.4
                                                    });
                                                    handleLaunchGame(game.id);
                                                }, className: "group cursor-pointer transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900", children: [game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }) }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 p-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium text-sm truncate mb-1", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-300", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAF Personalized" }), game.hoursPlayed && ((0, jsx_runtime_1.jsxs)("span", { children: ["\uD83D\uDCCA ", game.hoursPlayed, "h"] }))] })] }) })] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white text-sm font-medium mt-2 truncate group-hover:text-purple-400 transition-colors", children: game.title })] }, game.id || index));
                                        }) })] }) })), (0, jsx_runtime_1.jsxs)("section", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-6", children: (0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-gaming font-bold text-white uppercase tracking-tight flex items-center gap-4", children: ["\uD83C\uDFAD Enhanced Mood System", (0, jsx_runtime_1.jsx)("span", { className: "h-[2px] flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-gaming font-semibold text-white mb-4 uppercase tracking-wider", children: "Select Your Mood" }), (0, jsx_runtime_1.jsx)(SimpleMoodSelector_1.SimpleMoodSelector, { onMoodChange: handleMoodSelect, variant: "compact" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6", children: (0, jsx_runtime_1.jsx)(EnhancedWhatToBuy_1.EnhancedWhatToBuy, { userMood: primaryMood, personaTraits: persona?.traits }) }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-gaming font-semibold text-white mb-4 uppercase tracking-wider", children: "Mood Matches" }), hasMoodRecommendations ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: moodRecommendations.slice(0, 3).map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group", onClick: () => navigate(`/library/game/${game.id}`), children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gaming-primary/20 rounded-lg flex items-center justify-center group-hover:bg-gaming-primary/30 transition-colors", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-white text-sm font-medium group-hover:text-gaming-accent transition-colors", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/40 text-xs", children: typeof game.genres?.[0] === 'string'
                                                                            ? game.genres[0]
                                                                            : game.genres?.[0]?.name || 'Unknown' })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/20 group-hover:text-white/40 transition-colors", children: "\u2192" })] }, game.id))) })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-white/60 text-sm", children: "Select a mood to see recommendations" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-gaming font-semibold text-white mb-4 uppercase tracking-wider", children: "Mood Analytics" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: "Current Mood" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-gaming text-sm", children: getCurrentMoodString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: "Recommendations" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-secondary font-gaming text-sm", children: moodRecommendationCount })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "mb-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-gaming font-bold text-white mb-8 uppercase tracking-tight flex items-center gap-4", children: ["Continue Playing", (0, jsx_runtime_1.jsx)("span", { className: "h-[2px] flex-1 bg-gradient-to-r from-gaming-primary/40 to-transparent" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: games
                                        .filter(game => game.playStatus === 'playing')
                                        .slice(0, 3)
                                        .map((game) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handlePlayGame(game), className: "glass-morphism rounded-lg p-4 border border-white/10 hover:scale-105 transition-transform cursor-pointer", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full h-32 rounded-lg overflow-hidden mb-3", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold", children: game.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-white/60 text-sm", children: [game.hoursPlayed, "h played"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent text-sm font-gaming", children: game.playStatus === 'playing' ? 'Playing' : 'Continue' }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/40 text-xs", children: game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : 'Never' })] })] }, game.id))) })] }), (0, jsx_runtime_1.jsx)("section", { className: "mb-8", children: (0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowWhatToPlay(true), className: "group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-left", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold", children: "I'm Not Sure What To Play" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm opacity-90", children: "Let GamePilot pick based on your mood, time, and play style" })] })] }) }) }), showWhatToPlay && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-4xl", children: (0, jsx_runtime_1.jsx)(WhatToPlayNow_1.WhatToPlayNow, { onClose: () => setShowWhatToPlay(false) }) }) })), (0, jsx_runtime_1.jsx)(MoodFilterDebug_1.MoodFilterDebug, {}), isEditMode && ((0, jsx_runtime_1.jsx)(EditModePanel_1.EditModePanel, { pageId: "home", isOpen: isEditMode, onClose: () => setIsEditMode(false) }))] })] }) }));
}
;
exports.default = HomeHubFinal;
