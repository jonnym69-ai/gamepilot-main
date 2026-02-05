"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodBasedRecommendationsFixed = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Fixed Mood-Based Recommendations Component
 *
 * Uses the new clean mood filtering system with accurate, predictable results
 * and non-overlapping mood categories.
 */
const react_1 = require("react");
const LazyImage_1 = require("../LazyImage");
const Loading_1 = require("../Loading");
const Toast_1 = require("../Toast");
const moodFilterSystem_1 = require("../../utils/moodFilterSystem");
const MoodBasedRecommendationsFixed = ({ games, primaryMood, secondaryMood, onGameSelect, onQuickPlay, isLoading = false }) => {
    const [sortBy, setSortBy] = (0, react_1.useState)('score');
    const [showReasons, setShowReasons] = (0, react_1.useState)(true);
    const [showValidation, setShowValidation] = (0, react_1.useState)(false);
    // Generate recommendations using the new clean filtering system
    const recommendations = (0, react_1.useMemo)(() => {
        if (!primaryMood || games.length === 0)
            return [];
        // Get primary mood recommendations
        const primaryRecommendations = (0, moodFilterSystem_1.filterGamesByMood)(games, primaryMood, 20);
        // Score each recommendation
        const scored = primaryRecommendations.map(game => {
            const recommendation = (0, moodFilterSystem_1.getMoodRecommendation)(game, primaryMood);
            if (!recommendation) {
                return {
                    game,
                    score: 50,
                    reason: 'General mood match',
                    moodAlignment: 50,
                    confidence: 0.5
                };
            }
            // Add secondary mood bonus if applicable
            let finalScore = recommendation.score;
            let finalReason = recommendation.reason;
            if (secondaryMood && secondaryMood !== primaryMood) {
                const secondaryRec = (0, moodFilterSystem_1.getMoodRecommendation)(game, secondaryMood);
                if (secondaryRec) {
                    finalScore = Math.min(100, finalScore + 15); // Bonus for matching both moods
                    finalReason += ` + ${secondaryMood} mood`;
                }
            }
            return {
                game,
                score: finalScore,
                reason: finalReason,
                moodAlignment: recommendation.score,
                confidence: recommendation.score / 100
            };
        });
        // Sort and filter
        return scored
            .filter(rec => rec.score > 60) // Only show good matches
            .sort((a, b) => {
            switch (sortBy) {
                case 'score': return b.score - a.score;
                case 'confidence': return b.confidence - a.confidence;
                default: return b.score - a.score;
            }
        })
            .slice(0, 12); // Top 12 recommendations
    }, [games, primaryMood, secondaryMood, sortBy]);
    // Validate mood system (for debugging)
    const validationResults = (0, react_1.useMemo)(() => {
        if (!showValidation || games.length === 0)
            return null;
        return (0, moodFilterSystem_1.validateMoodSystem)(games);
    }, [showValidation, games]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-800/50 border border-gray-700 rounded-xl p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)(Loading_1.Loading, { size: "md" }) }) }));
    }
    if (!primaryMood) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-800/50 border border-gray-700 rounded-xl p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-400", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl mb-2 block", children: "\uD83C\uDFAD" }), (0, jsx_runtime_1.jsx)("p", { children: "Select a mood to see personalized recommendations" })] }) }));
    }
    const primaryMoodData = moodFilterSystem_1.MOOD_FILTERS.find(m => m.id === primaryMood);
    const secondaryMoodData = secondaryMood ? moodFilterSystem_1.MOOD_FILTERS.find(m => m.id === secondaryMood) : null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 border border-gray-700 rounded-xl p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-white mb-1", children: "Mood-Based Recommendations" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: `px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${primaryMoodData?.color || 'bg-gray-600'}`, children: [primaryMoodData?.icon, " ", primaryMoodData?.name] }), secondaryMoodData && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "+" }), (0, jsx_runtime_1.jsxs)("span", { className: `px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${secondaryMoodData.color || 'bg-gray-600'}`, children: [secondaryMoodData.icon, " ", secondaryMoodData.name] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowReasons(!showReasons), className: "text-sm text-gray-400 hover:text-white transition-colors", children: [showReasons ? 'Hide' : 'Show', " Reasons"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowValidation(!showValidation), className: "text-sm text-gray-400 hover:text-white transition-colors", children: [showValidation ? 'Hide' : 'Show', " Validation"] }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "text-sm bg-gray-700 text-white border border-gray-600 rounded px-3 py-1", "aria-label": "Sort recommendations by", title: "Sort recommendations by", children: [(0, jsx_runtime_1.jsx)("option", { value: "score", children: "Best Match" }), (0, jsx_runtime_1.jsx)("option", { value: "confidence", children: "Confidence" })] })] })] }), showValidation && validationResults && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-900/50 border border-gray-600 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-bold text-white mb-2", children: "Mood System Validation" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-blue-400 font-bold", children: validationResults.social }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Social" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-400 font-bold", children: validationResults.competitive }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Competitive" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-purple-400 font-bold", children: validationResults.story }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Story" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-green-400 font-bold", children: validationResults.adventure }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Adventure" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-cyan-400 font-bold", children: validationResults.chill }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Chill" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-emerald-400 font-bold", children: validationResults.creative }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Creative" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Overlap: " }), (0, jsx_runtime_1.jsxs)("span", { className: validationResults.totalOverlap > 0 ? 'text-yellow-400' : 'text-green-400', children: [validationResults.totalOverlap, " games"] })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: recommendations.map((rec) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all cursor-pointer group", onClick: () => onGameSelect?.(rec.game), children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden", children: rec.game.coverImage ? ((0, jsx_runtime_1.jsx)(LazyImage_1.LazyImage, { src: rec.game.coverImage, alt: rec.game.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl opacity-50", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-white", children: [Math.round(rec.score), "%"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-white text-sm truncate group-hover:text-blue-400 transition-colors", children: rec.game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400", children: [Math.round(rec.moodAlignment), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400", children: [Math.round(rec.confidence * 100), "%"] })] })] }), showReasons && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400 line-clamp-2", children: ["\u2022 ", rec.reason] }) })), rec.game.genres && rec.game.genres.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: rec.game.genres.slice(0, 2).map(genre => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300", children: genre.name }, genre.id))) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 pt-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                onGameSelect?.(rec.game);
                                            }, className: "flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors", children: "Details" }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                onQuickPlay?.(rec.game);
                                            }, className: "flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors", children: "Play" })] })] })] }, rec.game.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-4 border-t border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-400", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Found ", recommendations.length, " matching games"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => Toast_1.toast.info('Recommendations', 'Using clean mood filtering system with non-overlapping categories'), className: "text-blue-400 hover:text-blue-300 transition-colors", children: "Learn more about recommendations \u2192" })] }) })] }));
};
exports.MoodBasedRecommendationsFixed = MoodBasedRecommendationsFixed;
