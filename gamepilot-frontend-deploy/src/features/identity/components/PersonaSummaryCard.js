"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaSummaryCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const usePersonaSnapshot_1 = require("../../../hooks/persona/usePersonaSnapshot");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
// Simple Card component to replace UI package dependency
const Card = ({ children, className = '' }) => ((0, jsx_runtime_1.jsx)("div", { className: `glass-morphism rounded-xl p-6 cursor-pointer hover:bg-white/15 transition-colors ${className}`, children: children }));
const PersonaSummaryCard = () => {
    const personaSnapshot = (0, usePersonaSnapshot_1.usePersonaSnapshot)();
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // Extract top genres from games
    const getTopGenres = () => {
        const genreCount = {};
        games.forEach(game => {
            game.genres?.forEach(genre => {
                const genreName = typeof genre === 'string' ? genre : genre.name || genre.description || 'Unknown';
                genreCount[genreName] = (genreCount[genreName] || 0) + 1;
            });
        });
        return Object.entries(genreCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name]) => name);
    };
    if (!personaSnapshot) {
        return ((0, jsx_runtime_1.jsx)(Card, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-400", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: "\uD83D\uDC64" }), (0, jsx_runtime_1.jsx)("p", { children: "Loading persona data..." })] }) }));
    }
    const topGenres = getTopGenres();
    return ((0, jsx_runtime_1.jsx)(Card, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white", children: "Persona Summary" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Current Mood" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold capitalize", children: personaSnapshot.mood?.moodId || 'Unknown' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Archetype" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold capitalize", children: personaSnapshot.traits.archetypeId })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-300 mb-2", children: "Top Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: topGenres.map((genre, index) => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gaming-accent/20 rounded-full text-xs text-gaming-accent border border-gaming-accent/30", children: genre }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-300 mb-2", children: "Key Traits" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-200", children: [personaSnapshot.traits.intensity, " Intensity"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary", children: "\u23F1\uFE0F" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-200", children: [personaSnapshot.traits.pacing, " Pacing"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary", children: "\uD83D\uDC65" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-200", children: [personaSnapshot.traits.socialStyle, " Style"] })] })] })] })] }) }));
};
exports.PersonaSummaryCard = PersonaSummaryCard;
