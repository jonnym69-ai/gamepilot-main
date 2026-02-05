"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodRecommendationEngine = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
const MoodRecommendationEngine = ({ games, currentMood }) => {
    const [isLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const generateRecommendations = (0, react_1.useMemo)(() => {
        if (!games || games.length === 0)
            return [];
        const recommendations = [];
        if (currentMood) {
            const moodData = static_data_1.MOODS.find(m => m.id === currentMood);
            if (moodData) {
                const moodBasedGames = games.filter(game => {
                    const gameMoods = moodData.associatedGenres || [];
                    return game.genres?.some(genre => gameMoods.some(moodGenre => genre.name.toLowerCase().includes(moodGenre.toLowerCase())));
                });
                moodBasedGames.slice(0, 5).forEach(game => {
                    recommendations.push({
                        game,
                        score: 85,
                        reason: `Matches your ${currentMood} mood`,
                        type: 'mood-based',
                        confidence: 0.8
                    });
                });
            }
        }
        return recommendations;
    }, [games, currentMood]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "text-white text-xl", children: "Generating personalized recommendations..." }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 max-w-md w-full border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83E\uDD16" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Recommendation Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setError(null), className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80", children: "Try Again" })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Mood-Based Recommendations" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400 mb-6", children: ["Games that match your current mood: ", currentMood || 'No mood selected'] }), generateRecommendations.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "No recommendations available" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-2", children: "Select a mood to get personalized game suggestions" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: generateRecommendations.map((rec) => ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10 hover:border-gaming-primary/50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0", children: rec.game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: rec.game.coverImage, alt: rec.game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: rec.game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mb-2", children: rec.reason }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: rec.type }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-medium text-gaming-primary", children: [Math.round(rec.confidence * 100), "% match"] })] })] })] }) }, rec.game.id))) }))] }) }));
};
exports.MoodRecommendationEngine = MoodRecommendationEngine;
