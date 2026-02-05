"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSteamProfile = getSteamProfile;
exports.getSteamLibrary = getSteamLibrary;
exports.getFeaturedGames = getFeaturedGames;
exports.transformSteamLibrary = transformSteamLibrary;
const api_1 = require("../config/api");
async function getSteamProfile() {
    const response = await (0, api_1.apiFetch)('api/steam/profile');
    if (!response.ok) {
        throw new Error(`Failed to fetch Steam profile: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
async function getSteamLibrary(steamId) {
    const response = await (0, api_1.apiFetch)(`api/steam/library/${steamId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch Steam library: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
async function getFeaturedGames() {
    const response = await (0, api_1.apiFetch)('api/steam/featured');
    if (!response.ok) {
        throw new Error(`Failed to fetch featured games: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
// Transform Steam library data to our Game interface
function transformSteamLibrary(steamLibrary) {
    return steamLibrary.games.map(game => ({
        id: game.appId,
        title: game.name,
        platforms: ['Steam'],
        status: game.playtimeForever > 0 ? 'playing' : 'unplayed',
        playtime: Math.floor(game.playtimeForever / 60), // Convert minutes to hours
        coverImage: game.imgLogoUrl,
        launcherId: game.appId,
        tags: [], // Steam doesn't provide tags in library API
        description: '',
        developer: '',
        publisher: '',
        releaseYear: new Date().getFullYear(),
        userRating: 0,
        globalRating: 0,
        lastPlayed: game.lastPlayed ? new Date(game.lastPlayed) : undefined
    }));
}
