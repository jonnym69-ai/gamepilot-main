"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGameDetail = void 0;
const react_1 = require("react");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const useGameDetail = (gameId) => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const [gameData, setGameData] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (games.length > 0 && gameId) {
            setIsLoading(true);
            const foundGame = games.find((g) => g.id === gameId);
            if (foundGame) {
                // Convert Game to GameDetailData
                const gameDetailData = {
                    id: foundGame.id,
                    title: foundGame.title,
                    platforms: foundGame.platforms?.map(p => String(p)) || [],
                    status: foundGame.playStatus || 'backlog',
                    playtime: foundGame.hoursPlayed || 0,
                    coverImage: foundGame.coverImage || '',
                    tags: foundGame.tags
                };
                setGameData(gameDetailData);
            }
            else {
                setGameData(null);
            }
            setIsLoading(false);
        }
    }, [games, gameId]);
    return {
        game: gameData,
        loading: isLoading,
        error: !gameData && !isLoading ? 'Game not found' : null
    };
};
exports.useGameDetail = useGameDetail;
