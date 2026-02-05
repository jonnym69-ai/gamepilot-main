"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const GameCard_1 = require("../library/components/GameCard");
const components_1 = require("./components");
const components_2 = require("./components");
const components_3 = require("./components");
const components_4 = require("./components");
const components_5 = require("./components");
const GameDetailsModal_1 = require("./components/GameDetailsModal");
// Mood-based game filtering - Uses heuristic genre matching for recommendations
// Future enhancement: Integrate with identity-engine mood analysis
function matchesTemporaryMoodFallback(game, mood) {
    const genreNames = (game.genres || []).map((g) => (g.description || g.name || '').toLowerCase());
    switch (mood.toLowerCase()) {
        case "chill":
            return genreNames.some((g) => ["indie", "casual", "adventure", "simulation", "puzzle"].includes(g));
        case "competitive":
            return genreNames.some((g) => ["action", "shooter", "rpg", "fighting", "racing", "sports"].includes(g));
        case "story":
            return genreNames.some((g) => ["rpg", "adventure", "narrative", "visual novel"].includes(g));
        case "horror":
            return genreNames.includes("horror");
        case "strategic":
            return genreNames.some((g) => ["strategy", "simulation", "turn-based", "management"].includes(g));
        case "creative":
            return genreNames.some((g) => ["sandbox", "building", "design", "modding"].includes(g));
        default:
            return true;
    }
}
// Session length filtering - Uses local playtime data for session recommendations
// Future enhancement: Integrate with gaming analytics for accurate session predictions
function matchesTemporarySessionFallback(game, length) {
    const minutes = game.localSessionMinutes || 0;
    switch (length.toLowerCase()) {
        case "short":
            return minutes < 30;
        case "medium":
            return minutes >= 30 && minutes < 120;
        case "long":
            return minutes >= 120;
        default:
            return true;
    }
}
const Library = () => {
    // Safely access the store with error handling
    let storeData = null;
    let error = null;
    try {
        storeData = (0, useLibraryStore_1.useLibraryStore)();
    }
    catch (err) {
        console.error('LibraryEnhanced store access error:', err);
        error = 'Failed to access library store';
    }
    // Safe destructuring with fallbacks
    const games = storeData?.games || [];
    const currentSession = storeData?.currentSession || null;
    const actions = storeData?.actions || {};
    const intelligence = storeData?.intelligence || {
        selectedMood: '',
        selectedSessionLength: '',
        selectedGenres: [],
        selectedSorting: 'title',
        preferredGenres: [],
        preferredMoods: [],
        preferredSessionStyle: null
    };
    const setIntelligenceState = storeData?.setIntelligenceState || (() => { });
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedGame, setSelectedGame] = (0, react_1.useState)(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = (0, react_1.useState)(false);
    const [selectedGames, setSelectedGames] = (0, react_1.useState)([]);
    const [showBulkOperations, setShowBulkOperations] = (0, react_1.useState)(false);
    const [isAddGameModalOpen, setIsAddGameModalOpen] = (0, react_1.useState)(false);
    const [isSteamImportModalOpen, setIsSteamImportModalOpen] = (0, react_1.useState)(false);
    // Error boundary fallback
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-white text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4", children: "Library Error" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80", children: "Reload Page" })] }) }));
    }
    // Event handlers
    const handleClearSelection = () => {
        setSelectedGames([]);
    };
    const handleSelectAll = () => {
        setSelectedGames(sortedAndFilteredGames.map((game) => game.id));
    };
    const handleCloseDetails = () => {
        setIsDetailsPanelOpen(false);
        setSelectedGame(null);
    };
    const handleGameUpdate = (updatedGame) => {
        actions.updateGameStatus(updatedGame.id, updatedGame.playStatus || 'backlog');
        if (updatedGame.hoursPlayed) {
            actions.updateGamePlaytime(updatedGame.id, updatedGame.hoursPlayed);
        }
    };
    const sortedAndFilteredGames = (0, react_1.useMemo)(() => {
        try {
            let filtered = games;
            // Search filter (optional)
            if (searchTerm.trim() !== "") {
                filtered = filtered.filter((game) => game.title?.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            // Genre filter (optional)
            if (intelligence.selectedGenres.length > 0) {
                const normalizedSelectedGenres = intelligence.selectedGenres.map((g) => g.toLowerCase());
                filtered = filtered.filter((game) => game.genres?.some((g) => {
                    const genreName = (g.description || g.name || '').toLowerCase();
                    return normalizedSelectedGenres.includes(genreName);
                }));
            }
            // Mood filter (optional - temporary fallback)
            if (intelligence.selectedMood) {
                filtered = filtered.filter((game) => matchesTemporaryMoodFallback(game, intelligence.selectedMood));
            }
            // Session length filter (optional - temporary fallback)
            if (intelligence.selectedSessionLength) {
                filtered = filtered.filter((game) => matchesTemporarySessionFallback(game, intelligence.selectedSessionLength));
            }
            // Smart sorting (optional - only reorders, never filters)
            if (intelligence.selectedSorting === 'trending') {
                filtered = (0, useLibraryStore_1.getTrendingGames)(filtered);
            }
            else if (intelligence.selectedSorting === 'recommended') {
                filtered = (0, useLibraryStore_1.getRecommendedGames)(filtered, intelligence.preferredGenres, intelligence.preferredMoods, intelligence.preferredSessionStyle);
            }
            else if (intelligence.selectedSorting === 'hidden-gems') {
                filtered = filtered
                    .filter((g) => (g.globalRating || 0) > 80 && (g.hoursPlayed || 0) < 2)
                    .sort((a, b) => (b.globalRating || 0) - (a.globalRating || 0));
            }
            else {
                // Default sorting (optional)
                filtered = filtered.sort((a, b) => {
                    switch (intelligence.selectedSorting) {
                        case 'title':
                            return a.title.localeCompare(b.title);
                        case 'rating':
                            return (b.userRating || 0) - (a.userRating || 0);
                        case 'playtime':
                            return (b.hoursPlayed || 0) - (a.hoursPlayed || 0);
                        case 'lastPlayed':
                            return new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime();
                        default:
                            return a.title.localeCompare(b.title);
                    }
                });
            }
            // Final safety check - always return filtered, never empty array unless no games
            return filtered;
        }
        catch (err) {
            console.error('Error in sortedAndFilteredGames:', err);
            return games; // Return original games on error, never empty array
        }
    }, [games, searchTerm, intelligence.selectedMood, intelligence.selectedGenres, intelligence.selectedSessionLength, intelligence.selectedSorting]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsx)("header", { className: "mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-gaming bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent mb-2", children: "Game Library" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Your unified collection across all platforms" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                            if (confirm(`Remove duplicates? This will reduce ${games.length} games to unique titles only.`)) {
                                                actions.deduplicateGames();
                                            }
                                        }, className: "px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83E\uDDF9" }), "Remove Duplicates (", games.length, ")"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsSteamImportModalOpen(true), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD17" }), "Import Steam"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsAddGameModalOpen(true), className: "px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "+" }), "Add Game"] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "\uD83E\uDDE0 Intelligence" }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Mood" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: ['competitive', 'chill', 'story', 'strategy', 'horror'].map((mood) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setIntelligenceState({
                                                        selectedMood: intelligence.selectedMood === mood ? '' : mood,
                                                        selectedGenres: intelligence.selectedGenres,
                                                        selectedSessionLength: intelligence.selectedSessionLength,
                                                        selectedSorting: intelligence.selectedSorting
                                                    }), className: `px-3 py-2 rounded-lg text-sm font-medium transition-all ${intelligence.selectedMood === mood
                                                        ? 'bg-gaming-accent text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: mood.charAt(0).toUpperCase() + mood.slice(1) }, mood))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Session Length" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 gap-2", children: ['short', 'medium', 'long'].map((length) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setIntelligenceState({
                                                        selectedMood: intelligence.selectedMood,
                                                        selectedGenres: intelligence.selectedGenres,
                                                        selectedSessionLength: intelligence.selectedSessionLength === length ? '' : length,
                                                        selectedSorting: intelligence.selectedSorting
                                                    }), className: `px-3 py-2 rounded-lg text-sm font-medium transition-all ${intelligence.selectedSessionLength === length
                                                        ? 'bg-gaming-accent text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: length.charAt(0).toUpperCase() + length.slice(1) }, length))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Genre" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: [
                                                    { id: 'action', label: 'Action', icon: '⚔️' },
                                                    { id: 'rpg', label: 'RPG', icon: '🗡️' },
                                                    { id: 'strategy', label: 'Strategy', icon: '🧠' },
                                                    { id: 'adventure', label: 'Adventure', icon: '🧭' },
                                                    { id: 'indie', label: 'Indie', icon: '⭐' }
                                                ].map((genre) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                        setIntelligenceState({
                                                            selectedMood: intelligence.selectedMood,
                                                            selectedGenres: intelligence.selectedGenres.includes(genre.id)
                                                                ? intelligence.selectedGenres.filter((g) => g !== genre.id)
                                                                : [...intelligence.selectedGenres, genre.id],
                                                            selectedSessionLength: intelligence.selectedSessionLength,
                                                            selectedSorting: intelligence.selectedSorting
                                                        });
                                                    }, className: `px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${intelligence.selectedGenres.includes(genre.id)
                                                        ? 'bg-gaming-accent text-white shadow-lg shadow-gaming-accent/25'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-base", children: genre.icon }), genre.label] }, genre.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Smart Sorting" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: [
                                                    { id: 'trending', label: '🔥 Trending' },
                                                    { id: 'recommended', label: '⭐ Recommended' },
                                                    { id: 'hidden-gems', label: '💎 Hidden Gems' }
                                                ].map((sort) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setIntelligenceState({
                                                        selectedMood: intelligence.selectedMood,
                                                        selectedGenres: intelligence.selectedGenres,
                                                        selectedSessionLength: intelligence.selectedSessionLength,
                                                        selectedSorting: intelligence.selectedSorting === sort.id ? 'title' : sort.id
                                                    }), className: `w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${intelligence.selectedSorting === sort.id
                                                        ? 'bg-gaming-accent text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: sort.label }, sort.id))) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                            setIntelligenceState({
                                                selectedMood: '',
                                                selectedGenres: [],
                                                selectedSessionLength: '',
                                                selectedSorting: 'title'
                                            });
                                        }, className: "w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium", children: "Clear Intelligence Filters" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-3", children: (0, jsx_runtime_1.jsx)(components_1.GameSearch, { searchTerm: searchTerm, onSearchChange: setSearchTerm, totalCount: games.length, filteredCount: sortedAndFilteredGames.length, onSortChange: (sort) => setIntelligenceState({ selectedSorting: sort }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedGames.length === sortedAndFilteredGames.length && sortedAndFilteredGames.length > 0, onChange: (e) => {
                                            if (e.target.checked) {
                                                handleSelectAll();
                                            }
                                            else {
                                                handleClearSelection();
                                            }
                                        }, className: "w-4 h-4 accent-gaming-accent" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-300", children: ["Select all (", sortedAndFilteredGames.length, " games)"] })] }), selectedGames.length > 0 && ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowBulkOperations(!showBulkOperations), className: "px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-colors", children: ["\u26A1 Bulk Operations (", selectedGames.length, ")"] }))] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8", children: sortedAndFilteredGames.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "No games found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: intelligence.selectedMood && !searchTerm && !intelligence.selectedGenres.length
                                    ? `No games match "${intelligence.selectedMood}" mood yet — mood intelligence coming soon.`
                                    : searchTerm || intelligence.selectedGenres.length || intelligence.selectedMood
                                        ? 'Try adjusting your filters or search terms.'
                                        : 'Import some games to get started!' }), (searchTerm || intelligence.selectedGenres.length || intelligence.selectedMood) && ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                    setSearchTerm('');
                                    setIntelligenceState({
                                        selectedMood: '',
                                        selectedGenres: [],
                                        selectedSessionLength: intelligence.selectedSessionLength,
                                        selectedSorting: intelligence.selectedSorting
                                    });
                                }, className: "px-4 py-2 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80 transition-colors", children: "Clear Filters" }))] })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: sortedAndFilteredGames.map((game, index) => ((0, jsx_runtime_1.jsx)("div", { className: "animate-fade-in", style: { animationDelay: `${index * 100}ms` }, children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: game, capsuleImage: game.capsuleImage || game.headerImage || game.smallHeaderImage, currentSession: currentSession }) }, game.id))) })) }), showBulkOperations && ((0, jsx_runtime_1.jsx)(components_5.BulkOperations, { selectedGames: selectedGames, onSelectionChange: setSelectedGames })), isDetailsPanelOpen && selectedGame && ((0, jsx_runtime_1.jsx)(components_2.GameDetailsPanel, { game: selectedGame, onClose: handleCloseDetails, onGameUpdate: handleGameUpdate })), isAddGameModalOpen && ((0, jsx_runtime_1.jsx)(components_3.AddGameModal, { isOpen: isAddGameModalOpen, onClose: () => setIsAddGameModalOpen(false), onAddGame: (newGame) => {
                        const gameWithId = {
                            ...newGame,
                            id: crypto.randomUUID(),
                            lastPlayed: new Date(),
                            addedAt: new Date(),
                            releaseYear: new Date().getFullYear(),
                            subgenres: [],
                            emotionalTags: []
                        };
                        actions.setGames([...games, gameWithId]);
                        setIsAddGameModalOpen(false);
                    } })), isSteamImportModalOpen && ((0, jsx_runtime_1.jsx)(components_4.SteamImportModal, { isOpen: isSteamImportModalOpen, onClose: () => setIsSteamImportModalOpen(false), onImportGames: (importedGames) => {
                        const gamesWithIds = importedGames.map(game => ({
                            ...game,
                            id: crypto.randomUUID(),
                            lastPlayed: new Date(),
                            addedAt: new Date(),
                            releaseYear: new Date().getFullYear(),
                            subgenres: [],
                            emotionalTags: []
                        }));
                        actions.setGames([...games, ...gamesWithIds]);
                        setIsSteamImportModalOpen(false);
                    } })), selectedGame && ((0, jsx_runtime_1.jsx)(GameDetailsModal_1.GameDetailsModal, { game: selectedGame, onClose: handleCloseDetails, onLaunchGame: actions.launchGame }))] }) }));
};
exports.Library = Library;
exports.default = exports.Library;
