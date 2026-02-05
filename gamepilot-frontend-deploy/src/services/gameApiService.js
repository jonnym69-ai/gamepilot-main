"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameApiService = void 0;
const api_1 = require("../config/api");
class GameApiService {
    constructor() {
        // No baseUrl needed - using centralized apiFetch
    }
    getAuthHeaders() {
        return {
            'Accept': 'application/json'
        };
    }
    async makeRequest(url, options = {}) {
        const response = await (0, api_1.apiFetch)(url, {
            ...options,
            headers: {
                ...this.getAuthHeaders(),
                ...options.headers
            }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
    async getUserGames() {
        try {
            return await this.makeRequest('api/games/user');
        }
        catch (error) {
            console.error('GameApiService: getUserGames error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async upsertGames(games) {
        try {
            return await this.makeRequest('api/launcher/upsert-games', {
                method: 'POST',
                body: JSON.stringify(games)
            });
        }
        catch (error) {
            console.error('GameApiService: upsertGames error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async launchGame(gameId, platformCode) {
        try {
            return await this.makeRequest('api/launcher/launch', {
                method: 'POST',
                body: JSON.stringify({ gameId, platformCode })
            });
        }
        catch (error) {
            console.error('GameApiService: launchGame error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async endSession(sessionId) {
        try {
            return await this.makeRequest('api/launcher/end-session', {
                method: 'POST',
                body: JSON.stringify({ sessionId })
            });
        }
        catch (error) {
            console.error('GameApiService: endSession error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
exports.gameApiService = new GameApiService();
