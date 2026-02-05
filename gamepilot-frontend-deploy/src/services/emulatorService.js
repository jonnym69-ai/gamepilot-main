"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emulatorService = exports.EMULATOR_CONFIGS = void 0;
const types_1 = require("@gamepilot/types");
// Platform to ROM extensions mapping
const PLATFORM_ROM_EXTENSIONS = {
    [types_1.PlatformCode.RETROARCH]: ['.zip', '.7z', '.rar', '.nes', '.snes', '.gb', '.gbc', '.gba', '.nds', '.n64', '.psx', '.ps2', '.iso', '.bin', '.cue'],
    [types_1.PlatformCode.DOLPHIN]: ['.iso', '.gcz', '.gcm', '.wbfs', '.wad', '.rvz'],
    [types_1.PlatformCode.PROJECT64]: ['.z64', '.n64', '.v64', '.rom', '.zip'],
    [types_1.PlatformCode.PCSX2]: ['.iso', '.bin', '.img', '.mds', '.z'],
    [types_1.PlatformCode.RPCS3]: ['.iso', '.bin', '.img', '.ps3'],
    [types_1.PlatformCode.CEMU]: ['.wud', '.wux', '.iso', '.rpx'],
    [types_1.PlatformCode.YUZU]: ['.nsp', '.xci', '.nca'],
    [types_1.PlatformCode.RYUJINX]: ['.nsp', '.xci', '.nca'],
    [types_1.PlatformCode.MAME]: ['.zip', '.7z', '.chd', '.cue', '.bin'],
    [types_1.PlatformCode.DOSBOX]: ['.exe', '.com', '.bat', '.conf'],
    [types_1.PlatformCode.SCUMMVM]: ['.scummvm', '.exe', '.com'],
    [types_1.PlatformCode.VITA3K]: ['.vpk', '.zip'],
    [types_1.PlatformCode.XEMU]: ['.iso', '.xiso', '.cso', '.z'],
    [types_1.PlatformCode.MELONDS]: ['.nds', '.zip', '.7z'],
    [types_1.PlatformCode.PPSSPP]: ['.iso', '.cso', '.pbp', '.elf'],
    [types_1.PlatformCode.CITRA]: ['.3ds', '.3dsx', '.cia', '.cxi'],
    [types_1.PlatformCode.DESMUME]: ['.nds', '.zip'],
    // Default for other platforms
    [types_1.PlatformCode.STEAM]: [],
    [types_1.PlatformCode.XBOX]: [],
    [types_1.PlatformCode.PLAYSTATION]: [],
    [types_1.PlatformCode.NINTENDO]: [],
    [types_1.PlatformCode.EPIC]: [],
    [types_1.PlatformCode.GOG]: [],
    [types_1.PlatformCode.ORIGIN]: [],
    [types_1.PlatformCode.UPLAY]: [],
    [types_1.PlatformCode.BATTLENET]: [],
    [types_1.PlatformCode.DISCORD]: [],
    [types_1.PlatformCode.ITCH]: [],
    [types_1.PlatformCode.HUMBLE]: [],
    [types_1.PlatformCode.CUSTOM]: []
};
// Emulator configurations
exports.EMULATOR_CONFIGS = [
    {
        platform: types_1.PlatformCode.RETROARCH,
        name: 'RetroArch',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.RETROARCH],
        supportedSystems: ['NES', 'SNES', 'GB', 'GBC', 'GBA', 'N64', 'PS1', 'Genesis', 'Arcade'],
        defaultArgs: ['--fullscreen']
    },
    {
        platform: types_1.PlatformCode.DOLPHIN,
        name: 'Dolphin',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.DOLPHIN],
        supportedSystems: ['GameCube', 'Wii'],
        defaultArgs: ['-b', '-e']
    },
    {
        platform: types_1.PlatformCode.PROJECT64,
        name: 'Project64',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.PROJECT64],
        supportedSystems: ['Nintendo 64'],
        defaultArgs: []
    },
    {
        platform: types_1.PlatformCode.PCSX2,
        name: 'PCSX2',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.PCSX2],
        supportedSystems: ['PlayStation 2'],
        defaultArgs: ['--fullscreen']
    },
    {
        platform: types_1.PlatformCode.CEMU,
        name: 'Cemu',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.CEMU],
        supportedSystems: ['Wii U'],
        defaultArgs: ['-f']
    },
    {
        platform: types_1.PlatformCode.YUZU,
        name: 'Yuzu',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.YUZU],
        supportedSystems: ['Nintendo Switch'],
        defaultArgs: []
    },
    {
        platform: types_1.PlatformCode.RYUJINX,
        name: 'Ryujinx',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.RYUJINX],
        supportedSystems: ['Nintendo Switch'],
        defaultArgs: []
    },
    {
        platform: types_1.PlatformCode.MAME,
        name: 'MAME',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.MAME],
        supportedSystems: ['Arcade'],
        defaultArgs: []
    },
    {
        platform: types_1.PlatformCode.DOSBOX,
        name: 'DOSBox',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.DOSBOX],
        supportedSystems: ['DOS'],
        defaultArgs: []
    },
    {
        platform: types_1.PlatformCode.SCUMMVM,
        name: 'ScummVM',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.SCUMMVM],
        supportedSystems: ['Point & Click Adventure'],
        defaultArgs: ['--fullscreen']
    },
    {
        platform: types_1.PlatformCode.PPSSPP,
        name: 'PPSSPP',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.PPSSPP],
        supportedSystems: ['PlayStation Portable'],
        defaultArgs: []
    },
    {
        platform: types_1.PlatformCode.CITRA,
        name: 'Citra',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.CITRA],
        supportedSystems: ['Nintendo 3DS'],
        defaultArgs: []
    },
    {
        platform: types_1.PlatformCode.DESMUME,
        name: 'DeSmuME',
        romExtensions: PLATFORM_ROM_EXTENSIONS[types_1.PlatformCode.DESMUME],
        supportedSystems: ['Nintendo DS'],
        defaultArgs: []
    }
];
class EmulatorService {
    /**
     * Scan a directory for ROM files
     */
    async scanDirectory(directoryPath, platforms) {
        const result = {
            games: [],
            errors: [],
            scannedFiles: 0,
            foundGames: 0
        };
        try {
            // This would need to be implemented with Node.js fs/promises
            // For now, we'll simulate the scanning process
            const files = await this.getFilesInDirectory(directoryPath);
            result.scannedFiles = files.length;
            const platformsToScan = platforms || Object.keys(PLATFORM_ROM_EXTENSIONS);
            for (const file of files) {
                const extension = this.getFileExtension(file.name);
                const platform = this.detectPlatformForExtension(extension, platformsToScan);
                if (platform) {
                    const game = await this.createGameFromRom(file, platform);
                    result.games.push(game);
                    result.foundGames++;
                }
            }
        }
        catch (error) {
            result.errors.push(`Failed to scan directory: ${error}`);
        }
        return result;
    }
    /**
     * Get files in directory (placeholder implementation)
     */
    async getFilesInDirectory(_directoryPath) {
        // Placeholder implementation - in a real app, this would use Node.js fs or Electron APIs
        // For now, return empty FileList
        return new DataTransfer().files;
    }
    /**
     * Get file extension
     */
    getFileExtension(filename) {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex !== -1 ? filename.substring(lastDotIndex).toLowerCase() : '';
    }
    /**
     * Detect platform for file extension
     */
    detectPlatformForExtension(extension, platforms) {
        for (const platform of platforms) {
            const extensions = PLATFORM_ROM_EXTENSIONS[platform];
            if (extensions && extensions.includes(extension)) {
                return platform;
            }
        }
        return null;
    }
    /**
     * Create Game object from ROM file
     */
    async createGameFromRom(romFile, platform) {
        const config = exports.EMULATOR_CONFIGS.find(c => c.platform === platform);
        const nameWithoutExt = romFile.name.replace(/\.[^/.]+$/, '');
        // Try to extract game metadata from filename
        const metadata = this.extractGameMetadata(nameWithoutExt);
        const gameData = {
            id: `${platform}-${romFile.name}`,
            title: metadata.title || nameWithoutExt,
            description: metadata.description || `A ${config?.supportedSystems[0] || platform} game`,
            platforms: [{
                    code: platform,
                    name: config?.name || platform,
                    icon: `/platforms/${platform}.png`
                }],
            genres: metadata.genres || [],
            tags: metadata.tags || ['Retro', config?.supportedSystems[0] || 'Emulated'],
            coverImage: metadata.coverImage || '/assets/default-rom-cover.jpg',
            playStatus: 'unplayed',
            isFavorite: false,
            addedAt: new Date(),
            hoursPlayed: 0,
            userRating: undefined,
            globalRating: undefined,
            releaseYear: metadata.releaseYear,
            subgenres: [],
            emotionalTags: []
        };
        // Add emulator-specific fields as unknown first
        const gameWithEmulator = {
            ...gameData,
            romPath: romFile.path || '',
            emulatorConfig: config,
            fileSize: romFile.size
        };
        return gameWithEmulator;
    }
    /**
     * Extract metadata from ROM filename
     */
    extractGameMetadata(filename) {
        // Simple filename parsing
        // Examples: "Super Mario World (USA).sfc", "The Legend of Zelda - Ocarina of Time.n64"
        // Remove region tags, version info, etc.
        const cleanName = filename
            .replace(/\((USA|EUR|JPN|World|NTSC|PAL)\)/gi, '')
            .replace(/\(Rev\s*[0-9]+\)/gi, '')
            .replace(/\[.*?\]/g, '')
            .replace(/\.(v[0-9]+|Rev\s*[0-9]+|Beta|Alpha|Demo)/gi, '')
            .trim();
        // Extract potential year
        const yearMatch = cleanName.match(/\((19|20)\d{2}\)/);
        const releaseYear = yearMatch ? parseInt(yearMatch[0].slice(1, -1)) : undefined;
        // Extract title (remove year and extra info)
        const title = cleanName.replace(/\(\d{4}\)/g, '').trim();
        return {
            title,
            releaseYear,
            tags: ['Retro', 'Emulated']
        };
    }
    /**
     * Get emulator configuration for platform
     */
    getEmulatorConfig(platform) {
        return exports.EMULATOR_CONFIGS.find(config => config.platform === platform);
    }
    /**
     * Get all supported emulator platforms
     */
    getSupportedPlatforms() {
        return exports.EMULATOR_CONFIGS.map(config => config.platform);
    }
    /**
     * Check if platform is an emulator
     */
    isEmulatorPlatform(platform) {
        return this.getSupportedPlatforms().includes(platform);
    }
}
exports.emulatorService = new EmulatorService();
