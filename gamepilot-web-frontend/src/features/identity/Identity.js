"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const persona_1 = require("../../hooks/persona");
const useMoodRecommendations_1 = require("../../hooks/useMoodRecommendations");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const UserProfile_1 = require("./components/UserProfile");
const Preferences_1 = require("./components/Preferences");
const GenreSelector_1 = require("./components/GenreSelector");
const MoodSelector_1 = require("./components/MoodSelector");
const PlaystyleIndicator_1 = require("./components/PlaystyleIndicator");
const localStorage_1 = require("./services/localStorage");
const localStorageService = new localStorage_1.LocalStorageService();
const Identity = () => {
    const { intelligence, actions, games } = (0, useLibraryStore_1.useLibraryStore)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('profile');
    const [userProfile, setUserProfile] = (0, react_1.useState)(null);
    const [userPreferences, setUserPreferences] = (0, react_1.useState)(null);
    const [userGenres, setUserGenres] = (0, react_1.useState)([]);
    const [userMoods, setUserMoods] = (0, react_1.useState)([]);
    const [userPlaystyle, setUserPlaystyle] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    // Get persona and mood data
    const persona = (0, persona_1.useLibraryPersona)();
    const { primaryMoodInfo, hasRecommendations } = (0, useMoodRecommendations_1.useMoodRecommendations)({ games });
    (0, react_1.useEffect)(() => {
        const loadUserData = () => {
            // Load profile from localStorage (keep existing behavior)
            const identity = localStorageService.initializeDefaultData();
            setUserProfile(identity.profile);
            setUserPreferences(identity.preferences);
            setUserPlaystyle(identity.playstyle);
            // Load genres and moods from intelligence store
            setUserGenres(intelligence.preferredGenres.map(id => ({
                id,
                name: id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Unknown',
                preference: 75 // Default preference value
            })));
            setUserMoods(intelligence.preferredMoods.map(id => ({
                id,
                name: id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Unknown',
                emoji: '😊', // Default emoji
                color: '#3b82f6', // Default color
                frequency: 3, // Default frequency
                preference: 75, // Default preference value
                associatedGenres: [] // Default associated genres
            })));
            setIsLoading(false);
        };
        loadUserData();
    }, [intelligence.preferredGenres, intelligence.preferredMoods]);
    const handleProfileUpdate = (profile) => {
        setUserProfile(profile);
    };
    const handlePreferencesUpdate = (preferences) => {
        setUserPreferences(preferences);
    };
    const handleGenresUpdate = (genres) => {
        setUserGenres(genres);
        // Update the intelligence store with genre preferences
        actions.setPreferredGenres(genres.map(g => g.id));
    };
    const handleMoodsUpdate = (moods) => {
        setUserMoods(moods);
        // Update the intelligence store with mood preferences
        actions.setPreferredMoods(moods.map(m => m.id));
    };
    const handlePlaystyleUpdate = (playstyle) => {
        setUserPlaystyle(playstyle);
        // Update the intelligence store with session style preference
        actions.setPreferredSessionStyle(playstyle.preferences.sessionLength);
    };
    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'genres', label: 'Genres', icon: '🎭' },
        { id: 'moods', label: 'Moods', icon: '😊' },
        { id: 'playstyle', label: 'Playstyle', icon: '🎯' }
    ];
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83D\uDC64" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Loading your identity..." })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsxs)("header", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold font-gaming bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent mb-2", children: "Gaming Identity" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Your unified profile across all gaming platforms" }), persona && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-bold text-white", children: [persona.traits?.archetypeId, " Persona"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300 text-sm", children: [persona.traits?.intensity, " intensity \u2022 ", persona.traits?.pacing, " pacing \u2022 ", persona.traits?.socialStyle, " social style"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "Confidence" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-purple-400", children: [Math.round((persona.confidence || 0) * 100), "%"] })] })] }), hasRecommendations && primaryMoodInfo && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-purple-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: "Current Mood:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: primaryMoodInfo.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: primaryMoodInfo.name })] })] }) }))] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-8", children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 p-1 glass-morphism rounded-xl", children: tabs.map((tab) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab(tab.id), className: `
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
                `, children: [(0, jsx_runtime_1.jsx)("span", { children: tab.icon }), (0, jsx_runtime_1.jsx)("span", { children: tab.label })] }, tab.id))) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [activeTab === 'profile' && ((0, jsx_runtime_1.jsx)(UserProfile_1.UserProfile, { onProfileUpdate: handleProfileUpdate })), activeTab === 'preferences' && ((0, jsx_runtime_1.jsx)(Preferences_1.Preferences, { onPreferencesUpdate: handlePreferencesUpdate })), activeTab === 'genres' && ((0, jsx_runtime_1.jsx)(GenreSelector_1.GenreSelector, { onGenresUpdate: handleGenresUpdate })), activeTab === 'moods' && ((0, jsx_runtime_1.jsx)(MoodSelector_1.MoodSelector, { onMoodsUpdate: handleMoodsUpdate })), activeTab === 'playstyle' && ((0, jsx_runtime_1.jsx)(PlaystyleIndicator_1.PlaystyleIndicatorComponent, { onPlaystyleUpdate: handlePlaystyleUpdate }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-12 glass-morphism rounded-xl p-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCCA" }), "Identity Summary"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg mx-auto mb-2 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDC64" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: userProfile?.displayName }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: ["@", userProfile?.username] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mx-auto mb-2 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAD" }) }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-white font-medium mb-1", children: [userGenres.length, " Genres"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: userGenres.length > 0 ? userGenres[0].name : 'None selected' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg mx-auto mb-2 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDE0A" }) }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-white font-medium mb-1", children: [userMoods.length, " Moods"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: userMoods.length > 0 ? userMoods[0].name : 'None selected' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mx-auto mb-2 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAF" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: userPlaystyle?.primary.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: userPlaystyle?.secondary?.name || 'No secondary' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 pt-6 border-t border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: "Profile Completion" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-white", children: [Math.round(((userProfile?.displayName ? 20 : 0) +
                                                    (userGenres.length > 0 ? 20 : 0) +
                                                    (userMoods.length > 0 ? 20 : 0) +
                                                    (userPlaystyle?.primary ? 20 : 0) +
                                                    (userPreferences ? 20 : 0))), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-gaming-primary to-gaming-secondary h-2 rounded-full transition-all duration-500", style: {
                                            width: `${(userProfile?.displayName ? 20 : 0) +
                                                (userGenres.length > 0 ? 20 : 0) +
                                                (userMoods.length > 0 ? 20 : 0) +
                                                (userPlaystyle?.primary ? 20 : 0) +
                                                (userPreferences ? 20 : 0)}%`
                                        } }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: "Complete your profile to get better recommendations and a more personalized experience." })] })] })] }) }));
};
exports.Identity = Identity;
