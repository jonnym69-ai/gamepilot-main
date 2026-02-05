"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchGame = launchGame;
exports.generateLauncherUrl = generateLauncherUrl;
exports.getLauncherIcon = getLauncherIcon;
exports.getPlatformName = getPlatformName;
const types_1 = require("@gamepilot/types");
function launchGame(game) {
    if (!game.launcherId) {
        showTooltip('No launcher ID set');
        return;
    }
    if (!game.platforms || game.platforms.length === 0) {
        showTooltip('No platforms configured');
        return;
    }
    // Try to launch on the first available platform
    const platform = game.platforms[0];
    const url = generateLauncherUrl(platform.code, game.launcherId);
    if (url) {
        window.open(url, '_blank');
    }
    else {
        showTooltip(`Unsupported platform: ${platform.name}`);
    }
}
function generateLauncherUrl(platform, launcherId) {
    switch (platform) {
        case types_1.PlatformCode.STEAM:
            return `steam://rungameid/${launcherId}`;
        case types_1.PlatformCode.EPIC:
            return `com.epicgames.launcher://apps/${launcherId}?action=launch`;
        case types_1.PlatformCode.GOG:
            return `goggalaxy://openGame/${launcherId}`;
        case types_1.PlatformCode.XBOX:
            return `xbox://launch/${launcherId}`;
        case types_1.PlatformCode.PLAYSTATION:
            return `psn://launch/${launcherId}`;
        case types_1.PlatformCode.NINTENDO:
            return `nintendo://launch/${launcherId}`;
        default:
            console.warn(`Unsupported platform for launching: ${platform}`);
            return null;
    }
}
function showTooltip(message) {
    // Create a simple tooltip notification
    const tooltip = document.createElement('div');
    tooltip.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
    tooltip.textContent = message;
    document.body.appendChild(tooltip);
    // Remove after 3 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 3000);
}
function getLauncherIcon(platform) {
    switch (platform) {
        case types_1.PlatformCode.STEAM:
            return '🎮';
        case types_1.PlatformCode.EPIC:
            return '🚀';
        case types_1.PlatformCode.GOG:
            return '🎯';
        case types_1.PlatformCode.XBOX:
            return '🎪';
        case types_1.PlatformCode.PLAYSTATION:
            return '🎯';
        case types_1.PlatformCode.NINTENDO:
            return '🎮';
        default:
            return '🎮';
    }
}
function getPlatformName(platform) {
    switch (platform) {
        case types_1.PlatformCode.STEAM:
            return 'Steam';
        case types_1.PlatformCode.EPIC:
            return 'Epic Games';
        case types_1.PlatformCode.GOG:
            return 'GOG';
        case types_1.PlatformCode.XBOX:
            return 'Xbox';
        case types_1.PlatformCode.PLAYSTATION:
            return 'PlayStation';
        case types_1.PlatformCode.NINTENDO:
            return 'Nintendo';
        default:
            return 'Unknown Platform';
    }
}
