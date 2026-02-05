"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodFilterDebug = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Debug component to test mood filtering with real data
 */
const react_1 = require("react");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const moodFilterSystem_1 = require("../../utils/moodFilterSystem");
const MoodFilterDebug = () => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const [selectedMood, setSelectedMood] = (0, react_1.useState)('social');
    const [filteredGames, setFilteredGames] = (0, react_1.useState)([]);
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (games.length > 0) {
            const filtered = (0, moodFilterSystem_1.filterGamesByMood)(games, selectedMood, 20);
            setFilteredGames(filtered);
        }
    }, [games, selectedMood]);
    if (!isExpanded) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-4 right-4 z-50", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsExpanded(true), className: "bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700", children: "\uD83D\uDD0D Debug Mood Filter" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-bold", children: "Mood Filter Debug" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsExpanded(false), className: "text-gray-400 hover:text-white", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-white text-sm block mb-2", children: "Select Mood:" }), (0, jsx_runtime_1.jsx)("select", { value: selectedMood, onChange: (e) => setSelectedMood(e.target.value), className: "w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2", children: moodFilterSystem_1.MOOD_FILTERS.map(mood => ((0, jsx_runtime_1.jsxs)("option", { value: mood.id, children: [mood.icon, " ", mood.name] }, mood.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-white text-sm mb-2", children: ["Total Games: ", games.length, " | Filtered: ", filteredGames.length] }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xs", children: filteredGames.length === 0 && 'No games match this mood. Check game moods and genres.' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-semibold", children: "Filtered Games:" }), filteredGames.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "No games found" })) : (filteredGames.map(game => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-medium", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-400 text-xs", children: ["Moods: ", (game.moods || []).join(', ') || 'None'] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-400 text-xs", children: ["Genres: ", (game.genres || []).map((g) => g.name).join(', ') || 'None'] })] }, game.id))))] }), games.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-semibold mb-2", children: "Sample Game Data:" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-sm font-medium", children: games[0].title }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-400 text-xs", children: ["Moods: ", (games[0].moods || []).join(', ') || 'None'] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-400 text-xs", children: ["Genres: ", (games[0].genres || []).map((g) => g.name).join(', ') || 'None'] })] })] }))] }));
};
exports.MoodFilterDebug = MoodFilterDebug;
