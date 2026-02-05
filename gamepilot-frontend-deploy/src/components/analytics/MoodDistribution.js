"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodDistribution = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const MoodDistribution = ({ moodDistribution, totalTrends, getMoodEmoji, getMoodColor, onMoodClick }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-cinematic transition-all duration-300 relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gaming-primary/5 blur-[60px] rounded-full" }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-gaming font-semibold text-white mb-8 flex items-center gap-3 uppercase tracking-tight relative z-10", children: ["Mood Distribution", (0, jsx_runtime_1.jsx)("span", { className: "h-[1px] w-12 bg-white/20" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-white/40 font-sans tracking-widest uppercase", children: "Emotional Analysis" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: Object.entries(moodDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([mood, count], index) => {
                    const percentage = (count / totalTrends) * 100;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 group cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all duration-200", style: { animationDelay: `${index * 100}ms` }, onClick: () => onMoodClick?.(mood, count, percentage), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 w-24", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl group-hover:scale-110 transition-transform duration-200", children: getMoodEmoji(mood) }), (0, jsx_runtime_1.jsx)("span", { className: "text-white capitalize group-hover:text-gaming-primary transition-colors duration-200", children: mood })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full bg-gray-700 rounded-full h-4 relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: `h-4 rounded-full ${getMoodColor(mood)} transition-all duration-1000 ease-out`, style: {
                                                width: `${percentage}%`,
                                                animationDelay: `${index * 150}ms`
                                            } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium group-hover:scale-105 transition-transform duration-200 inline-block", children: count }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-sm ml-2", children: ["(", Math.round(percentage), "%)"] })] })] }, mood));
                }) })] }));
};
exports.MoodDistribution = MoodDistribution;
