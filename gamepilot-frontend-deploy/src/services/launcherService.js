"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launcherService = void 0;
const Toast_1 = require("../components/Toast");
const api_1 = require("../config/api");
class LauncherService {
    constructor() {
        // No baseUrl needed - using centralized apiFetch
    }
    getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            ...(token && { Authorization: `Bearer ${token}` })
        };
    }
    async launchGame(gameId, platformCode) {
        try {
            const response = await (0, api_1.apiFetch)('api/launcher/launch', {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ gameId, platformCode })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            // If we have a launch URL, execute it
            if (result.data?.launchUrl) {
                try {
                    window.location.href = result.data.launchUrl;
                    // Check if launch was successful (simple heuristic)
                    setTimeout(() => {
                        const isStillOnPage = document.visibilityState === 'visible';
                        if (isStillOnPage) {
                            Toast_1.toast.warning('Launch Failed', result.data?.launchMethod === 'steam'
                                ? 'Steam may not be installed or running. Please check Steam is available.'
                                : 'Failed to launch game. Please check the game executable path.');
                        }
                    }, 3000);
                }
                catch (error) {
                    console.error('Failed to launch game:', error);
                    Toast_1.toast.error('Launch Failed', 'Could not execute launch command');
                    return { ...result, success: false };
                }
            }
            Toast_1.toast.success(result.message || 'Game launched successfully');
            return result;
        }
        catch (error) {
            console.error('Launch service error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            Toast_1.toast.error('Launch Failed', errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    async endSession(sessionId, gameId) {
        try {
            const response = await (0, api_1.apiFetch)('api/launcher/session/end', {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ sessionId, gameId })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            const durationMinutes = result.data?.durationMinutes || 0;
            const durationHours = result.data?.durationHours || 0;
            let message = 'Session ended successfully';
            if (durationMinutes > 0) {
                if (durationHours >= 1) {
                    message = `Session ended: ${durationHours}h ${durationMinutes % 60}m played`;
                }
                else {
                    message = `Session ended: ${durationMinutes} minutes played`;
                }
            }
            Toast_1.toast.success(message);
            return result;
        }
        catch (error) {
            console.error('End session error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            Toast_1.toast.error('Session Error', errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    async getActiveSessions() {
        try {
            const response = await (0, api_1.apiFetch)('api/launcher/session/active', {
                method: 'GET',
                headers: this.getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            return result;
        }
        catch (error) {
            console.error('Get active sessions error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    async getSessionHistory(gameId, limit = 50) {
        try {
            const params = new URLSearchParams({ limit: limit.toString() });
            if (gameId)
                params.append('gameId', gameId);
            const response = await (0, api_1.apiFetch)(`api/launcher/session/history?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            return result;
        }
        catch (error) {
            console.error('Get session history error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    // Helper method to check if Steam is available
    async checkSteamAvailability() {
        try {
            // Try to launch a minimal Steam URL to check if Steam is installed
            const testUrl = 'steam://';
            const testWindow = window.open(testUrl, '_blank', 'width=1,height=1');
            if (testWindow) {
                testWindow.close();
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    // Helper method to get platform-specific launch info
    getLaunchInfo(game) {
        // Check for Steam game
        const steamPlatform = game.platforms?.find((p) => p.code === 'steam');
        if (steamPlatform && game.appId) {
            return {
                canLaunch: true,
                method: 'steam',
                url: `steam://rungameid/${game.appId}`
            };
        }
        // Check for local game with executable path
        if (game.executablePath) {
            return {
                canLaunch: true,
                method: 'local',
                url: `file://${game.executablePath}`
            };
        }
        // Manual launch only
        return {
            canLaunch: true,
            method: 'manual'
        };
    }
}
exports.launcherService = new LauncherService();
