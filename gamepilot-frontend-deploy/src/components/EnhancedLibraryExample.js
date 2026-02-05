"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedLibraryExample = EnhancedLibraryExample;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SimpleMoodSelector_1 = require("../components/SimpleMoodSelector");
const useMoodRecommendations_1 = require("../hooks/useMoodRecommendations");
/**
 * Example: Enhanced Library with Mood Integration
 * Shows how to add the mood system to the existing library view
 */
function EnhancedLibraryExample({ games }) {
    const [showMoodSelector, setShowMoodSelector] = (0, react_1.useState)(false);
    const [currentView, setCurrentView] = (0, react_1.useState)('all');
    const { selectMood, clearMood, primaryMoodInfo, secondaryMoodInfo, recommendations, isLoading, hasRecommendations, recommendationCount } = (0, useMoodRecommendations_1.useMoodRecommendations)({
        games,
        onRecommendationsChange: (recs) => {
            console.log('Mood recommendations updated:', recs.length);
        }
    });
    const handleMoodSelect = (primaryMood, secondaryMood) => {
        selectMood(primaryMood, secondaryMood);
        setCurrentView('mood');
        setShowMoodSelector(false);
    };
    const displayGames = currentView === 'mood' ? recommendations : games;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: currentView === 'mood' ? 'Mood-Based Recommendations' : 'Game Library' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: currentView === 'mood'
                                    ? `${recommendationCount} games matching your mood`
                                    : `${games.length} games in your library` })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setShowMoodSelector(!showMoodSelector), className: `px-4 py-2 rounded-lg font-medium transition-colors ${currentView === 'mood'
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-600 hover:bg-gray-700'}`, children: showMoodSelector ? 'Hide Mood' : 'Select Mood' }), currentView === 'mood' && ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                    clearMood();
                                    setCurrentView('all');
                                }, className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors", children: "Show All Games" }))] })] }), currentView === 'mood' && (primaryMoodInfo || secondaryMoodInfo) && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [primaryMoodInfo && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: primaryMoodInfo.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: primaryMoodInfo.name })] })), secondaryMoodInfo && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "+" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: secondaryMoodInfo.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: secondaryMoodInfo.name })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-auto text-sm text-gray-400", children: [recommendationCount, " recommendations"] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400 mt-2", children: [primaryMoodInfo?.description, secondaryMoodInfo && ` + ${secondaryMoodInfo.description}`] })] })), showMoodSelector && ((0, jsx_runtime_1.jsx)(SimpleMoodSelector_1.SimpleMoodSelector, { onMoodChange: handleMoodSelect, variant: "full" })), isLoading && currentView === 'mood' && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Finding games that match your mood..." }) })), !isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: displayGames.map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 hover:scale-105 transition-transform", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: game.title }), currentView === 'mood' && game.moodScore && ((0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-xl font-bold text-blue-400", children: [Math.round(game.moodScore), "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "match" })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 mb-2", children: game.genres?.slice(0, 2).map((genre) => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-700 rounded text-xs", children: typeof genre === 'string' ? genre : genre.name }, typeof genre === 'string' ? genre : genre.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 mb-3", children: game.tags?.slice(0, 3).map((tag) => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-600 rounded text-xs", children: typeof tag === 'string' ? tag : tag.name }, typeof tag === 'string' ? tag : tag.id))) }), currentView === 'mood' && game.moodReasoning && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300 italic", children: game.moodReasoning })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-400", children: [(0, jsx_runtime_1.jsxs)("span", { children: [game.hoursPlayed || 0, " hours played"] }), (0, jsx_runtime_1.jsxs)("span", { children: [game.platforms?.length || 0, " platforms"] })] })] }, game.id))) })), !isLoading && displayGames.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-lg mb-4", children: currentView === 'mood'
                            ? 'No games match your mood selection'
                            : 'No games in your library' }), currentView === 'mood' && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setShowMoodSelector(true), className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium", children: "Try a Different Mood" }))] }))] }));
}
