"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedWhatToBuy = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useSteamRecommendations_1 = require("../../hooks/useSteamRecommendations");
const EnhancedWhatToBuy = ({ userMood, personaTraits, className = '' }) => {
    const { recommendations, isLoading, error, lastRefresh, refreshRecommendations, clearRecommendations, hasRecommendations, recommendationCount } = (0, useSteamRecommendations_1.useSteamRecommendations)(25);
    const [selectedGame, setSelectedGame] = (0, react_1.useState)(null);
    // Auto-select first game when recommendations load
    (0, react_1.useEffect)(() => {
        if (recommendations.games.length > 0 && !selectedGame) {
            setSelectedGame(recommendations.games[0]);
        }
    }, [recommendations.games, selectedGame]);
    const handleRefresh = async () => {
        await refreshRecommendations();
        // Select a random game from new recommendations
        if (recommendations.games.length > 0) {
            const randomIndex = Math.floor(Math.random() * recommendations.games.length);
            setSelectedGame(recommendations.games[randomIndex]);
        }
    };
    const handleGameSelect = (game) => {
        setSelectedGame(game);
    };
    const handleBuyGame = (game) => {
        const steamUrl = `https://store.steampowered.com/app/${game.id}`;
        window.open(steamUrl, '_blank');
    };
    const handleImageError = (e) => {
        const img = e.currentTarget;
        // Try different Steam image URLs as fallbacks in order of preference
        const fallbackUrls = [
            // Try capsule image first (better quality for recommendations)
            `https://cdn.akamai.steamstatic.com/steam/apps/${img.dataset.appId}/capsule_616x353.jpg`,
            // Then header image
            `https://cdn.akamai.steamstatic.com/steam/apps/${img.dataset.appId}/header.jpg`,
            // Finally small image
            `https://cdn.akamai.steamstatic.com/steam/apps/${img.dataset.appId}/capsule_184x69.jpg`
        ];
        const currentSrc = img.getAttribute('src');
        const currentIndex = fallbackUrls.findIndex(url => url === currentSrc);
        if (currentIndex < fallbackUrls.length - 1) {
            img.src = fallbackUrls[currentIndex + 1];
        }
        else {
            // Final fallback - show emoji placeholder
            img.style.display = 'none';
            if (img.parentElement) {
                img.parentElement.innerHTML = '<span class="text-3xl">🎮</span>';
            }
        }
    };
    const getGenreColor = (genre) => {
        const colors = {
            'Action': 'text-red-400',
            'Adventure': 'text-green-400',
            'RPG': 'text-purple-400',
            'Strategy': 'text-blue-400',
            'Simulation': 'text-yellow-400',
            'Sports': 'text-orange-400',
            'Racing': 'text-pink-400',
            'Puzzle': 'text-indigo-400',
            'Platformer': 'text-teal-400',
            'FPS': 'text-red-500'
        };
        return colors[genre] || 'text-gray-400';
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return 'text-green-400';
        if (score >= 60)
            return 'text-yellow-400';
        if (score >= 40)
            return 'text-orange-400';
        return 'text-red-400';
    };
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl p-8 ${className}`, children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDED2" }), "What Should I Buy Next?"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xl mb-4", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: "Unable to load Steam recommendations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mb-4", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: handleRefresh, className: "px-4 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors", children: "Try Again" })] })] }));
    }
    if (!hasRecommendations && !isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl p-8 ${className}`, children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDED2" }), "What Should I Buy Next?"] }), (userMood || personaTraits) && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-white/5 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: "Current Context:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [userMood && ((0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary text-sm capitalize", children: userMood })), personaTraits && ((0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary text-sm", children: personaTraits.archetypeId }))] })] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: "No Steam recommendations available" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mb-4", children: "Add more games to your library to get personalized recommendations" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleRefresh, className: "px-4 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors", children: "Load Recommendations" })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl p-8 ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDED2" }), "What Should I Buy Next?"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [lastRefresh && ((0, jsx_runtime_1.jsxs)("span", { className: "text-white/40 text-xs", children: [recommendationCount, " games \u2022 ", new Date(lastRefresh).toLocaleTimeString()] })), (0, jsx_runtime_1.jsxs)("button", { onClick: handleRefresh, disabled: isLoading, className: "px-3 py-1 bg-gaming-primary/20 text-gaming-primary rounded-lg hover:bg-gaming-primary/30 transition-colors disabled:opacity-50 text-sm", children: [isLoading ? '🔄' : '🔄', " Refresh"] })] })] }), (userMood || personaTraits) && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-white/5 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: "Recommendations based on:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: recommendations.genresSearched.map(genre => ((0, jsx_runtime_1.jsx)("span", { className: `text-sm ${getGenreColor(genre)}`, children: genre }, genre))) })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-white/60 text-xs", children: ["Found ", recommendations.totalFound, " games \u2022 Excluded ", recommendations.excludedCount, " already owned"] })] })), isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xl mb-4 animate-spin", children: "\uD83D\uDD04" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Finding Steam recommendations..." })] })) : selectedGame ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-6 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 bg-gaming-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden", children: selectedGame.capsuleImage ? ((0, jsx_runtime_1.jsx)("img", { src: selectedGame.capsuleImage, alt: selectedGame.name, className: "w-full h-full object-cover", "data-app-id": selectedGame.id, onError: handleImageError })) : selectedGame.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: selectedGame.coverImage, alt: selectedGame.name, className: "w-full h-full object-cover", "data-app-id": selectedGame.id, onError: handleImageError })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAE" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white mb-2", children: selectedGame.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: `font-bold ${getScoreColor(selectedGame.recommendationScore)}`, children: [Math.round(selectedGame.recommendationScore), "% Match"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/40", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: selectedGame.genres?.slice(0, 2).join(', ') || 'Various' })] }), selectedGame.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm leading-relaxed mb-3 line-clamp-3", children: selectedGame.description })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm text-white/60 mb-3", children: [selectedGame.price && ((0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold", children: selectedGame.price })), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: "Steam" }), selectedGame.releaseDate && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: new Date(selectedGame.releaseDate).getFullYear() })] }))] })] })] }) }), recommendations.games.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white/60 text-sm mb-3", children: "Other suggestions:" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: recommendations.games
                                    .filter(game => game.id !== selectedGame.id)
                                    .slice(0, 4)
                                    .map(game => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleGameSelect(game), className: "bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsxs)("span", { className: `text-xs font-bold ${getScoreColor(game.recommendationScore)}`, children: [Math.round(game.recommendationScore), "%"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-xs truncate", children: game.genres[0] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-medium truncate", children: game.name })] }, game.id))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => handleBuyGame(selectedGame), className: "flex-1 px-4 py-3 bg-gaming-accent hover:bg-gaming-primary text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDED2" }), "Buy on Steam"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleRefresh, disabled: isLoading, className: "px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors disabled:opacity-50", children: [isLoading ? '🔄' : '🔄', " New Suggestion"] })] })] })) : null] }));
};
exports.EnhancedWhatToBuy = EnhancedWhatToBuy;
