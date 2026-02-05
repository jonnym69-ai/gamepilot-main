"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByLastPlayed = exports.sortByPlayStatus = exports.filterByPlatform = exports.filterByMood = exports.filterByGenre = void 0;
const filterByGenre = (games, genre) => {
    if (!genre)
        return games;
    return games.filter(game => game.genres?.includes(genre));
};
exports.filterByGenre = filterByGenre;
const filterByMood = (games, mood) => {
    if (!mood)
        return games;
    return games.filter(game => game.mood?.includes(mood));
};
exports.filterByMood = filterByMood;
const filterByPlatform = (games, platform) => {
    if (!platform)
        return games;
    return games.filter(game => game.platforms?.some((p) => p === platform));
};
exports.filterByPlatform = filterByPlatform;
const sortByPlayStatus = (games) => {
    const statusOrder = ['playing', 'completed', 'paused', 'abandoned'];
    return [...games].sort((a, b) => {
        const statusA = statusOrder.indexOf(a.status || '');
        const statusB = statusOrder.indexOf(b.status || '');
        return statusA - statusB;
    });
};
exports.sortByPlayStatus = sortByPlayStatus;
const sortByLastPlayed = (games) => {
    return [...games].sort((a, b) => {
        const dateA = a.lastPlayed ? new Date(a.lastPlayed) : new Date(0);
        const dateB = b.lastPlayed ? new Date(b.lastPlayed) : new Date(0);
        return dateB.getTime() - dateA.getTime();
    });
};
exports.sortByLastPlayed = sortByLastPlayed;
