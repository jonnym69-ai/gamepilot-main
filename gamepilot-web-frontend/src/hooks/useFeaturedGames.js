"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeaturedGames = void 0;
const react_1 = require("react");
const useLibraryStore_1 = require("../stores/useLibraryStore");
const useFeaturedGames = (count = 6) => {
    const games = (0, useLibraryStore_1.useLibraryStore)(state => state.games);
    return (0, react_1.useMemo)(() => {
        if (games.length === 0) {
            return [];
        }
        // Sort by playtime (hoursPlayed) and get top games
        const sortedByPlaytime = [...games]
            .sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0))
            .slice(0, count);
        // If we have games with playtime, use them
        if (sortedByPlaytime.length > 0 && sortedByPlaytime[0].hoursPlayed && sortedByPlaytime[0].hoursPlayed > 0) {
            return sortedByPlaytime;
        }
        // Fallback: random selection if no playtime data
        const shuffled = [...games].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }, [games, count]);
};
exports.useFeaturedGames = useFeaturedGames;
