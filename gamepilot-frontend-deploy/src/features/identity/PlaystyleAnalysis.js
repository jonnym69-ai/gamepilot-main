"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaystyleAnalysis = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PlaystyleAnalysis = ({ games }) => {
    const [isLoading] = (0, react_1.useState)(false);
    // Mock playstyle scores
    const playstyleScores = (0, react_1.useMemo)(() => ({
        explorer: Math.floor(Math.random() * 100),
        achiever: Math.floor(Math.random() * 100),
        social: Math.floor(Math.random() * 100),
        strategist: Math.floor(Math.random() * 100),
        casual: Math.floor(Math.random() * 100),
        competitive: Math.floor(Math.random() * 100)
    }), [games]);
    // Get dominant playstyle
    const dominantPlaystyle = (0, react_1.useMemo)(() => {
        const entries = Object.entries(playstyleScores);
        const maxEntry = entries.reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: 0 });
        return maxEntry.key;
    }, [playstyleScores]);
    // Mock insights
    const insights = [
        'You prefer exploration and discovery',
        'Achievement hunting motivates your gameplay',
        'Social gaming enhances your experience',
        'Strategic thinking is your strength'
    ];
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-6", children: "Playstyle Analysis" }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-4", children: "Your Playstyle" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-4xl", children: [dominantPlaystyle === 'explorer' && '🗺️', dominantPlaystyle === 'achiever' && '🏆', dominantPlaystyle === 'social' && '👥', dominantPlaystyle === 'strategist' && '🧠', dominantPlaystyle === 'casual' && '🌟', dominantPlaystyle === 'competitive' && '⚔️'] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold text-white capitalize", children: dominantPlaystyle }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [playstyleScores[dominantPlaystyle], "% match"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-4", children: "All Playstyles" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: Object.entries(playstyleScores).map(([playstyle, score]) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl", children: [playstyle === 'explorer' && '🗺️', playstyle === 'achiever' && '🏆', playstyle === 'social' && '👥', playstyle === 'strategist' && '🧠', playstyle === 'casual' && '🌟', playstyle === 'competitive' && '⚔️'] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 min-w-[80px] capitalize", children: playstyle })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right text-sm text-gray-400", children: typeof score === 'number' ? `${score}%` : score })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300", style: { width: `${typeof score === 'number' ? score : 0}%` } }) })] }, playstyle))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-4", children: "Insights" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: insights.map((insight, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-blue-400 mt-1", children: "\uD83D\uDCA1" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-300", children: insight })] }, index))) })] })] }) }));
};
exports.PlaystyleAnalysis = PlaystyleAnalysis;
exports.default = exports.PlaystyleAnalysis;
