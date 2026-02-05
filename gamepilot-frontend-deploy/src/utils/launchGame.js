"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGame = launchGame;
/**
 * Launches a game through Steam using the steam:// protocol
 * @param appId - The Steam application ID to launch
 */
function launchGame(appId) {
    if (!appId || typeof appId !== 'number' || appId <= 0) {
        console.warn('Invalid appId provided for game launch:', appId);
        return;
    }
    try {
        window.location.href = `steam://run/${appId}`;
    }
    catch (error) {
        console.warn('Steam launch failed — is Steam installed?', error);
    }
}
