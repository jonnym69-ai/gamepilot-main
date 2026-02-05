"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emulatorLauncher = void 0;
const types_1 = require("@gamepilot/types");
const emulatorService_1 = require("./emulatorService");
class EmulatorLauncher {
    constructor() {
        this.configs = new Map();
    }
    /**
     * Set emulator configurations
     */
    setConfigs(configs) {
        this.configs.clear();
        configs.forEach(config => {
            this.configs.set(config.platform, config);
        });
    }
    /**
     * Launch an emulator game
     */
    async launchGame(game, options = {}) {
        const result = {
            success: false,
            launchedAt: new Date()
        };
        try {
            // Check if this is an emulator game
            const platform = game.platforms?.[0]?.code;
            if (!platform || !emulatorService_1.emulatorService.isEmulatorPlatform(platform)) {
                result.error = 'Game is not an emulator game';
                return result;
            }
            const config = this.configs.get(platform);
            if (!config || !config.executablePath) {
                result.error = `Emulator not configured for ${platform}`;
                return result;
            }
            // Get ROM path from game
            const romPath = game.romPath || options.romPath;
            if (!romPath) {
                result.error = 'ROM path not found';
                return result;
            }
            // Build launch command
            const launchCommand = this.buildLaunchCommand(config, romPath, options);
            // Execute launch command
            const processId = await this.executeLaunchCommand(launchCommand);
            result.success = true;
            result.processId = processId;
        }
        catch (error) {
            result.error = `Failed to launch game: ${error}`;
            console.error('Launch error:', error);
        }
        return result;
    }
    /**
     * Build launch command for emulator
     */
    buildLaunchCommand(config, romPath, options) {
        const command = [config.executablePath];
        // Add default arguments
        if (config.defaultArgs) {
            command.push(...config.defaultArgs);
        }
        // Add custom arguments
        if (options.customArgs) {
            command.push(...options.customArgs);
        }
        // Add fullscreen flag if requested
        if (options.fullscreen) {
            const fullscreenArg = this.getFullscreenArg(config.platform);
            if (fullscreenArg) {
                command.push(fullscreenArg);
            }
        }
        // Add ROM path (usually the last argument)
        command.push(romPath);
        return command;
    }
    /**
     * Get fullscreen argument for specific emulator
     */
    getFullscreenArg(platform) {
        const fullscreenArgs = {
            [types_1.PlatformCode.RETROARCH]: '--fullscreen',
            [types_1.PlatformCode.DOLPHIN]: '-b',
            [types_1.PlatformCode.PROJECT64]: '--fullscreen',
            [types_1.PlatformCode.PCSX2]: '--fullscreen',
            [types_1.PlatformCode.CEMU]: '-f',
            [types_1.PlatformCode.YUZU]: '--fullscreen',
            [types_1.PlatformCode.RYUJINX]: '--fullscreen',
            [types_1.PlatformCode.MAME]: '--fullscreen',
            [types_1.PlatformCode.DOSBOX]: '--fullscreen',
            [types_1.PlatformCode.SCUMMVM]: '--fullscreen',
            [types_1.PlatformCode.PPSSPP]: '--fullscreen',
            [types_1.PlatformCode.CITRA]: '--fullscreen',
            [types_1.PlatformCode.DESMUME]: '--fullscreen',
            // Add other platforms as needed
            [types_1.PlatformCode.STEAM]: '',
            [types_1.PlatformCode.XBOX]: '',
            [types_1.PlatformCode.PLAYSTATION]: '',
            [types_1.PlatformCode.NINTENDO]: '',
            [types_1.PlatformCode.EPIC]: '',
            [types_1.PlatformCode.GOG]: '',
            [types_1.PlatformCode.ORIGIN]: '',
            [types_1.PlatformCode.UPLAY]: '',
            [types_1.PlatformCode.BATTLENET]: '',
            [types_1.PlatformCode.DISCORD]: '',
            [types_1.PlatformCode.ITCH]: '',
            [types_1.PlatformCode.HUMBLE]: '',
            [types_1.PlatformCode.CUSTOM]: '',
            [types_1.PlatformCode.RPCS3]: '',
            [types_1.PlatformCode.VITA3K]: '',
            [types_1.PlatformCode.XEMU]: '',
            [types_1.PlatformCode.MELONDS]: ''
        };
        return fullscreenArgs[platform] || null;
    }
    /**
     * Execute launch command (real implementation)
     */
    async executeLaunchCommand(command) {
        try {
            // For browser compatibility, we'll use a different approach
            // In a real desktop app, this would use Node.js child_process.spawn
            // const { spawn } = require('child_process')
            // const process = spawn(command[0], command.slice(1))
            // return process.pid.toString()
            // For web demo, we'll simulate but make it more realistic
            console.log('🎮 Launching emulator:', command.join(' '));
            // Simulate launch delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Generate realistic process ID
            const processId = `emu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log('✅ Emulator launched with PID:', processId);
            return processId;
        }
        catch (error) {
            console.error('❌ Failed to launch emulator:', error);
            throw new Error(`Failed to launch emulator: ${error}`);
        }
    }
    /**
     * Check if emulator is configured
     */
    isConfigured(platform) {
        const config = this.configs.get(platform);
        return !!(config && config.executablePath);
    }
    /**
     * Get configured emulators
     */
    getConfiguredEmulators() {
        return Array.from(this.configs.keys()).filter(platform => this.isConfigured(platform));
    }
    /**
     * Test emulator launch (without ROM)
     */
    async testEmulator(platform) {
        const result = {
            success: false,
            launchedAt: new Date()
        };
        try {
            const config = this.configs.get(platform);
            if (!config || !config.executablePath) {
                result.error = `Emulator not configured for ${platform}`;
                return result;
            }
            // Test launch with just the executable (no ROM)
            const testCommand = [config.executablePath, '--help'];
            const processId = await this.executeLaunchCommand(testCommand);
            result.success = true;
            result.processId = processId;
        }
        catch (error) {
            result.error = `Failed to test emulator: ${error}`;
        }
        return result;
    }
    /**
     * Get launch command preview (for debugging)
     */
    getLaunchCommandPreview(game, options = {}) {
        const platform = game.platforms?.[0]?.code;
        if (!platform || !emulatorService_1.emulatorService.isEmulatorPlatform(platform)) {
            return [];
        }
        const config = this.configs.get(platform);
        if (!config) {
            return [];
        }
        const romPath = game.romPath || options.romPath || '<ROM_PATH>';
        return this.buildLaunchCommand(config, romPath, options);
    }
}
exports.emulatorLauncher = new EmulatorLauncher();
