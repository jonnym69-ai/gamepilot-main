"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodHistoryCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useCurrentMood_1 = require("../../../hooks/useCurrentMood");
const usePersonaSnapshot_1 = require("../../../hooks/persona/usePersonaSnapshot");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
// Simple Card component to replace UI package dependency
const Card = ({ children, className = '' }) => ((0, jsx_runtime_1.jsx)("div", { className: `glass-morphism rounded-xl p-6 cursor-pointer hover:bg-white/15 transition-colors ${className}`, children: children }));
const MoodHistoryCard = () => {
    const currentMood = (0, useCurrentMood_1.useCurrentMood)();
    const personaSnapshot = (0, usePersonaSnapshot_1.usePersonaSnapshot)();
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // Generate mood history from persona engine and game data
    const getMoodHistory = () => {
        const recentGames = games
            .filter(game => game.lastPlayed)
            .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
            .slice(0, 7);
        // Map games to mood states using persona engine insights
        return recentGames.map((game, index) => {
            // Determine mood based on game genre and tags
            let mood = 'Neutral';
            // Helper function to extract genre names
            const getGenreName = (genre) => {
                if (typeof genre === 'string')
                    return genre.toLowerCase();
                if (genre && typeof genre === 'object' && genre.name)
                    return genre.name.toLowerCase();
                return '';
            };
            // Helper function to extract tag names
            const getTagName = (tag) => {
                if (typeof tag === 'string')
                    return tag.toLowerCase();
                if (tag && typeof tag === 'object' && tag.name)
                    return tag.name.toLowerCase();
                return '';
            };
            const genreNames = game.genres?.map(getGenreName) || [];
            const tagNames = game.tags?.map(getTagName) || [];
            if (genreNames.some(g => g.includes('action')) || tagNames.some(t => t.includes('competitive'))) {
                mood = 'Competitive';
            }
            else if (genreNames.some(g => g.includes('puzzle')) || tagNames.some(t => t.includes('relaxing'))) {
                mood = 'Relaxed';
            }
            else if (genreNames.some(g => g.includes('sandbox')) || tagNames.some(t => t.includes('creative'))) {
                mood = 'Creative';
            }
            else if (genreNames.some(g => g.includes('rpg'))) {
                mood = 'Immersive';
            }
            // Calculate intensity based on playtime and completion
            const intensity = game.hoursPlayed ? Math.min(5, Math.max(1, Math.floor(game.hoursPlayed / 10) + 1)) : 3;
            return {
                id: `mood-${index}`,
                mood,
                intensity,
                timestamp: game.lastPlayed,
                gameTitle: game.title,
                confidence: personaSnapshot?.confidence || 0.7
            };
        });
    };
    const moodHistory = getMoodHistory();
    const getMoodEmoji = (mood) => {
        switch (mood.toLowerCase()) {
            case 'competitive': return '🏆';
            case 'relaxed': return '😌';
            case 'creative': return '🎨';
            case 'immersive': return '�';
            case 'neutral': return '😐';
            default: return '😊';
        }
    };
    const formatDate = (date) => {
        if (!date)
            return 'Unknown time';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) {
                return 'Invalid date';
            }
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(dateObj);
        }
        catch (error) {
            console.warn('Date formatting error:', error, 'Input:', date);
            return 'Invalid date';
        }
    };
    return ((0, jsx_runtime_1.jsx)(Card, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDE0A" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white", children: "Mood History" })] }), currentMood && ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gradient-to-r from-gaming-primary to-gaming-secondary/20 rounded-lg border border-gaming-primary/30", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Current Mood" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold capitalize", children: currentMood.moodId })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: getMoodEmoji(currentMood.moodId) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "Intensity" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: `h-2 flex-1 rounded-full ${i < currentMood.intensity ? 'bg-gaming-accent' : 'bg-gray-700'}` }, i))) })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-300 text-sm", children: "Recent Moods" }), moodHistory.length > 0 ? (moodHistory.map((entry) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: getMoodEmoji(entry.mood) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-white capitalize", children: entry.mood }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: entry.gameTitle })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: formatDate(entry.timestamp) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gaming-accent", children: ["Intensity ", entry.intensity, "/5"] })] })] }, entry.id)))) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-400 py-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCCA" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mt-2", children: "No mood history available" })] }))] })] }) }));
};
exports.MoodHistoryCard = MoodHistoryCard;
