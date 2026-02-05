"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlaceholderRecommendations = exports.Recommendations = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Recommendations = ({ recommendations, onGameClick, maxItems = 6 }) => {
    const [selectedType, setSelectedType] = (0, react_1.useState)('all');
    const [hoveredRecommendation, setHoveredRecommendation] = (0, react_1.useState)(null);
    const filteredRecommendations = selectedType === 'all'
        ? recommendations
        : recommendations.filter(rec => rec.type === selectedType);
    const displayRecommendations = filteredRecommendations.slice(0, maxItems);
    const getTypeIcon = (type) => {
        switch (type) {
            case 'genre': return '🎭';
            case 'mood': return '😊';
            case 'similar': return '🔄';
            case 'trending': return '🔥';
            default: return '✨';
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'genre': return 'from-purple-500 to-pink-500';
            case 'mood': return 'from-green-500 to-teal-500';
            case 'similar': return 'from-blue-500 to-cyan-500';
            case 'trending': return 'from-orange-500 to-red-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };
    const getConfidenceLabel = (confidence) => {
        if (confidence >= 0.9)
            return 'Perfect Match';
        if (confidence >= 0.75)
            return 'Great Match';
        if (confidence >= 0.6)
            return 'Good Match';
        if (confidence >= 0.4)
            return 'Decent Match';
        return 'Maybe Try';
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.9)
            return 'text-green-400';
        if (confidence >= 0.75)
            return 'text-blue-400';
        if (confidence >= 0.6)
            return 'text-yellow-400';
        if (confidence >= 0.4)
            return 'text-orange-400';
        return 'text-gray-400';
    };
    if (recommendations.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\u2728" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "No Recommendations Yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Start playing and rating games to get personalized recommendations." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u2728" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "Recommended for You" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Personalized game suggestions" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: "Powered by:" }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300", children: "Genre Analysis" }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-700 rounded text-xs text-gray-300", children: "Mood Matching" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mb-6 overflow-x-auto pb-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedType('all'), className: `
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${selectedType === 'all'
                            ? 'bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'}
          `, children: ["All (", recommendations.length, ")"] }), ['genre', 'mood', 'similar', 'trending'].map((type) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedType(type), className: `
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2
              ${selectedType === type
                            ? 'bg-gradient-to-r text-white'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'}
            `, style: {
                            background: selectedType === type
                                ? `linear-gradient(to right, ${getTypeColor(type).split(' ')[0].replace('from-', '')}, ${getTypeColor(type).split(' ')[1].replace('to-', '')})`
                                : undefined
                        }, children: [(0, jsx_runtime_1.jsx)("span", { children: getTypeIcon(type) }), type.charAt(0).toUpperCase() + type.slice(1), (0, jsx_runtime_1.jsxs)("span", { className: "opacity-70", children: ["(", recommendations.filter(rec => rec.type === type).length, ")"] })] }, type)))] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: displayRecommendations.map((recommendation) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => onGameClick?.(recommendation.game), onMouseEnter: () => setHoveredRecommendation(recommendation.id), onMouseLeave: () => setHoveredRecommendation(null), className: `
              group cursor-pointer transition-all duration-300 transform
              ${hoveredRecommendation === recommendation.id ? 'scale-105 -translate-y-1' : 'scale-100 translate-y-0'}
            `, children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg overflow-hidden border border-gray-700 hover:border-gaming-accent/50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900", children: [recommendation.game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: recommendation.game.coverImage, alt: recommendation.game.title, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }) }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 left-2", children: (0, jsx_runtime_1.jsxs)("div", { className: `
                    px-2 py-1 rounded-full text-xs font-semibold text-white
                    bg-gradient-to-r ${getTypeColor(recommendation.type)}
                  `, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-1", children: getTypeIcon(recommendation.type) }), recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)] }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2", children: (0, jsx_runtime_1.jsx)("div", { className: "px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs", children: (0, jsx_runtime_1.jsxs)("span", { className: getConfidenceColor(recommendation.confidence), children: [Math.round(recommendation.confidence * 100), "%"] }) }) }), hoveredRecommendation === recommendation.id && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent", children: (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 p-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-white text-sm font-medium mb-1", children: getConfidenceLabel(recommendation.confidence) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-200 text-xs line-clamp-2", children: recommendation.reason })] }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium text-sm truncate mb-1 group-hover:text-gaming-accent transition-colors", children: recommendation.game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-xs truncate mb-2", children: recommendation.game.developer || 'Unknown Developer' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-xs line-clamp-2 mb-2", children: recommendation.reason }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-gray-500", children: [recommendation.game.userRating && ((0, jsx_runtime_1.jsxs)("span", { children: ["\u2B50 ", recommendation.game.userRating] })), recommendation.game.genres && ((0, jsx_runtime_1.jsx)("span", { children: recommendation.game.genres[0]?.name }))] }), (0, jsx_runtime_1.jsx)("span", { className: getConfidenceColor(recommendation.confidence), children: getConfidenceLabel(recommendation.confidence) })] })] })] }), hoveredRecommendation === recommendation.id && ((0, jsx_runtime_1.jsx)("div", { className: `
                absolute inset-0 rounded-lg bg-gradient-to-r ${getTypeColor(recommendation.type)}
                opacity-20 blur-xl -z-10
              ` }))] }, recommendation.id))) }), filteredRecommendations.length > maxItems && ((0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-center", children: (0, jsx_runtime_1.jsxs)("button", { className: "text-accent-400 hover:text-accent-300 transition-colors font-medium", children: ["View More Recommendations (", filteredRecommendations.length - maxItems, " more)"] }) })), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-6 border-t border-gray-700", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 text-center", children: "Recommendations are based on your gaming preferences, play history, and emotional tags. AI-powered recommendations coming soon!" }) })] }));
};
exports.Recommendations = Recommendations;
// Placeholder recommendation logic
const generatePlaceholderRecommendations = (allGames, userPreferences) => {
    const recommendations = [];
    const usedGameIds = new Set();
    // Genre-based recommendations
    if (userPreferences?.favoriteGenres) {
        userPreferences.favoriteGenres.forEach(genre => {
            const genreGames = allGames.filter(game => game.genres?.some(g => g.name === genre) && !usedGameIds.has(game.id));
            if (genreGames.length > 0) {
                const game = genreGames[Math.floor(Math.random() * genreGames.length)];
                usedGameIds.add(game.id);
                recommendations.push({
                    id: `genre-${genre}-${game.id}`,
                    game,
                    reason: `You love ${genre} games`,
                    confidence: 0.7 + Math.random() * 0.2,
                    type: 'genre'
                });
            }
        });
    }
    // Mood-based recommendations
    if (userPreferences?.favoriteMoods) {
        userPreferences.favoriteMoods.forEach(mood => {
            const moodGames = allGames.filter(game => game.tags?.includes(mood) && !usedGameIds.has(game.id));
            if (moodGames.length > 0) {
                const game = moodGames[Math.floor(Math.random() * moodGames.length)];
                usedGameIds.add(game.id);
                recommendations.push({
                    id: `mood-${mood}-${game.id}`,
                    game,
                    reason: `Perfect for when you're feeling ${mood}`,
                    confidence: 0.6 + Math.random() * 0.3,
                    type: 'mood'
                });
            }
        });
    }
    // Similar games based on recently played
    if (userPreferences?.recentlyPlayed) {
        userPreferences.recentlyPlayed.forEach(recentGame => {
            const similarGames = allGames.filter(game => game.id !== recentGame.id &&
                (game.genres?.some(genre => recentGame.genres?.includes(genre)) ||
                    game.developer === recentGame.developer) &&
                !usedGameIds.has(game.id));
            if (similarGames.length > 0) {
                const game = similarGames[Math.floor(Math.random() * similarGames.length)];
                usedGameIds.add(game.id);
                recommendations.push({
                    id: `similar-${recentGame.id}-${game.id}`,
                    game,
                    reason: `Similar to ${recentGame.title}`,
                    confidence: 0.5 + Math.random() * 0.3,
                    type: 'similar'
                });
            }
        });
    }
    // Trending games (placeholder)
    const trendingGames = allGames.filter(game => !usedGameIds.has(game.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    trendingGames.forEach(game => {
        usedGameIds.add(game.id);
        recommendations.push({
            id: `trending-${game.id}`,
            game,
            reason: 'Trending in the GamePilot community',
            confidence: 0.4 + Math.random() * 0.3,
            type: 'trending'
        });
    });
    return recommendations.sort((a, b) => b.confidence - a.confidence);
};
exports.generatePlaceholderRecommendations = generatePlaceholderRecommendations;
