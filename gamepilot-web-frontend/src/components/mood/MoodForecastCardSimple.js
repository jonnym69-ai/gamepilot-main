"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodForecastCardSimple = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const MoodForecastCardSimple = ({ predictedMood = 'neutral', confidence = 0.5, trend = 'stable', reasoning = 'Mood analysis based on your gaming patterns', onMoodClick }) => {
    try {
        // Defensive checks
        if (!predictedMood || typeof predictedMood !== 'string') {
            return null;
        }
        const getTrendIcon = () => {
            try {
                switch (trend) {
                    case 'rising': return '📈';
                    case 'stable': return '➡️';
                    case 'declining': return '📉';
                    default: return '➡️';
                }
            }
            catch (error) {
                return '➡️';
            }
        };
        const getConfidenceColor = () => {
            try {
                const conf = typeof confidence === 'number' ? confidence : 0.5;
                if (conf >= 0.8)
                    return 'text-green-400';
                if (conf >= 0.6)
                    return 'text-yellow-400';
                return 'text-red-400';
            }
            catch (error) {
                return 'text-gray-400';
            }
        };
        const handleMoodClick = () => {
            try {
                if (onMoodClick && typeof onMoodClick === 'function' && predictedMood) {
                    onMoodClick(predictedMood);
                }
                else if (predictedMood) {
                    // Navigate to library with mood filter
                    window.location.href = `/library?mood=${encodeURIComponent(predictedMood)}`;
                }
            }
            catch (error) {
                console.error('Error in mood click handler:', error);
            }
        };
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: "Mood Forecast" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: getTrendIcon() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleMoodClick, className: "text-2xl font-bold text-white capitalize hover:text-gaming-primary transition-colors cursor-pointer group", title: `Filter library by ${predictedMood} mood`, children: [predictedMood, (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity", children: "\uD83D\uDD0D" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: `text-sm font-medium ${getConfidenceColor()}`, children: [Math.round(confidence * 100), "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "confidence" })] })] }), reasoning && ((0, jsx_runtime_1.jsx)("div", { className: "pt-3 border-t border-white/10", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300", children: reasoning }) })), (0, jsx_runtime_1.jsx)("div", { className: "pt-3 border-t border-white/10", children: (0, jsx_runtime_1.jsxs)("button", { onClick: handleMoodClick, className: "w-full px-3 py-2 bg-gaming-primary/20 text-gaming-primary rounded-lg hover:bg-gaming-primary/30 transition-colors text-sm font-medium", children: ["View ", predictedMood || 'Neutral', " Games \u2192"] }) })] })] }));
    }
    catch (error) {
        console.error('Error in MoodForecastCardSimple:', error);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Mood Forecast" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Unable to display mood forecast" })] }));
    }
};
exports.MoodForecastCardSimple = MoodForecastCardSimple;
