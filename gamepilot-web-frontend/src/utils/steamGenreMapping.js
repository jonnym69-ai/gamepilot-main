"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSteamGameData = exports.getGameMoods = exports.mapGenreToMoods = exports.mapSteamGenre = exports.GENRE_TO_MOOD_MAPPING = void 0;
const static_data_1 = require("@gamepilot/static-data");
// Steam genre to our genre mapping
const STEAM_GENRE_MAPPING = {
    'Action': 'action',
    'Adventure': 'adventure',
    'RPG': 'rpg',
    'Strategy': 'strategy',
    'Simulation': 'simulation',
    'Sports': 'sports',
    'Racing': 'racing',
    'Indie': 'indie',
    'Casual': 'casual',
    'Massively Multiplayer': 'multiplayer',
    'Family': 'family',
    'Board Games': 'board-games',
    'Educational': 'educational',
    'Free to Play': 'free-to-play',
    'Early Access': 'early-access',
    'Animation & Modeling': 'animation',
    'Design & Illustration': 'design',
    'Accounting': 'accounting',
    'Audio Production': 'audio-production',
    'Video Production': 'video-production',
    'Utilities': 'utilities',
    'Web Publishing': 'web-publishing',
    'Game Development': 'game-development',
    'Movie': 'movie',
    'Documentary': 'documentary',
    'Software': 'software',
    'Tutorial': 'tutorial'
};
// Core Genre to Mood Mapping - uses real GenreId and MoodId values from static data
exports.GENRE_TO_MOOD_MAPPING = {
    'action': ['competitive', 'energetic', 'focused'],
    'adventure': ['exploratory', 'story', 'creative'],
    'rpg': ['story', 'focused', 'creative'],
    'strategy': ['focused', 'competitive'],
    'simulation': ['creative', 'chill'],
    'sports': ['competitive', 'energetic', 'social'],
    'racing': ['energetic', 'competitive'],
    'puzzle': ['focused', 'creative'],
    'platformer': ['energetic', 'focused'],
    'fps': ['competitive', 'energetic', 'focused'],
    'moba': ['competitive', 'social', 'focused'],
    'roguelike': ['focused', 'competitive', 'creative'],
    'horror': ['focused', 'chill'],
    'indie': ['creative', 'chill'],
    'casual': ['chill', 'creative', 'social'],
    'multiplayer': ['social', 'competitive']
};
// Steam tags to mood mapping
const STEAM_TAG_TO_MOOD_MAPPING = {
    // Competitive tags
    'competitive': ['competitive'],
    'pvp': ['competitive'],
    'multiplayer': ['competitive', 'social'],
    'team-based': ['competitive', 'social'],
    'esports': ['competitive'],
    'fps': ['competitive', 'energetic'],
    'shooter': ['competitive', 'energetic'],
    'battle royale': ['competitive'],
    'fighting': ['competitive'],
    'rts': ['competitive', 'focused'],
    // Energetic tags
    'fast-paced': ['energetic'],
    'action': ['energetic', 'competitive'],
    'intense': ['energetic', 'competitive'],
    'arcade': ['energetic'],
    'racing': ['energetic'],
    'sports': ['energetic', 'competitive'],
    // Creative tags
    'creative': ['creative'],
    'building': ['creative'],
    'sandbox': ['creative'],
    'crafting': ['creative'],
    'moddable': ['creative'],
    'level editor': ['creative'],
    'design & illustration': ['creative'],
    'game development': ['creative'],
    // Story tags
    'story rich': ['story'],
    'narrative': ['story'],
    'rpg': ['story', 'creative'],
    'adventure': ['story', 'exploratory'],
    'atmospheric': ['story', 'chill'],
    'exploration': ['exploratory'],
    'open world': ['exploratory', 'creative'],
    // Focused tags
    'strategy': ['focused'],
    'tactical': ['focused'],
    'puzzle': ['focused'],
    'turn-based': ['focused'],
    'simulation': ['focused', 'creative'],
    'management': ['focused'],
    // Chill tags
    'casual': ['chill'],
    'relaxing': ['chill'],
    'family friendly': ['chill', 'social'],
    'educational': ['chill', 'creative'],
    'hidden object': ['chill'],
    'match 3': ['chill'],
    // Social tags
    'co-op': ['social'],
    'cooperative': ['social'],
    'local co-op': ['social'],
    'mmorpg': ['social'],
    'online co-op': ['social'],
    'local multiplayer': ['social']
};
// Steam categories to mood mapping
const STEAM_CATEGORY_TO_MOOD_MAPPING = {
    'Single-player': ['focused', 'chill'],
    'Multi-player': ['social', 'competitive'],
    'Co-op': ['social'],
    'MMO': ['social', 'competitive'],
    'In-App Purchases': ['competitive'],
    'Captions available': ['chill'],
    'Commentary available': ['creative'],
    'Steam Workshop': ['creative'],
    'Steam Cloud': ['chill'],
    'Stats': ['competitive'],
    'Achievements': ['competitive'],
    'Steam Leaderboards': ['competitive'],
    'Trading Cards': ['social'],
    'Partial Controller Support': ['casual'],
    'Full controller support': ['chill'],
    'VR Support': ['energetic', 'creative']
};
// Map Steam genres to our standardized genres
const mapSteamGenre = (steamGenre) => {
    return STEAM_GENRE_MAPPING[steamGenre] || 'unknown';
};
exports.mapSteamGenre = mapSteamGenre;
// Map our genres to appropriate moods using core mapping
const mapGenreToMoods = (genreId) => {
    return exports.GENRE_TO_MOOD_MAPPING[genreId] || ['chill'];
};
exports.mapGenreToMoods = mapGenreToMoods;
// Get mood for a game based on comprehensive metadata analysis
const getGameMoods = (genreIds, steamTags, steamCategories, playtime) => {
    const allMoods = [];
    // 1. Get moods from genres (primary source) - use core mapping
    genreIds.forEach(genreId => {
        const genreMoods = exports.GENRE_TO_MOOD_MAPPING[genreId] || [];
        allMoods.push(...genreMoods);
    });
    // 2. Get moods from Steam tags (secondary source)
    if (steamTags) {
        steamTags.forEach(tag => {
            const tagMoods = STEAM_TAG_TO_MOOD_MAPPING[tag.toLowerCase()] || [];
            allMoods.push(...tagMoods);
        });
    }
    // 3. Get moods from Steam categories (tertiary source)
    if (steamCategories) {
        steamCategories.forEach(category => {
            const categoryMoods = STEAM_CATEGORY_TO_MOOD_MAPPING[category] || [];
            allMoods.push(...categoryMoods);
        });
    }
    // 4. Infer moods from playtime patterns
    if (playtime) {
        if (playtime > 100) {
            allMoods.push('focused'); // High playtime suggests focused engagement
        }
        else if (playtime < 10) {
            allMoods.push('chill'); // Low playtime suggests chill engagement (not casual)
        }
    }
    // Remove duplicates and prioritize
    const uniqueMoods = [...new Set(allMoods)];
    // Prioritize the 8 real moods and limit to 3 per game
    const moodPriority = ['chill', 'competitive', 'creative', 'energetic', 'story', 'social', 'focused', 'exploratory'];
    const prioritizedMoods = uniqueMoods.filter(mood => moodPriority.includes(mood));
    // Ensure every game gets at least one mood
    const finalMoods = prioritizedMoods.length > 0 ? prioritizedMoods.slice(0, 3) : ['chill'];
    return finalMoods;
};
exports.getGameMoods = getGameMoods;
// Enhanced Steam game data processing
const processSteamGameData = (steamGame, steamDetails) => {
    // Map Steam genres to our genres
    const steamGenres = steamDetails?.genres?.map((g) => g.description) || [];
    const mappedGenres = steamGenres.map(exports.mapSteamGenre).filter((g) => g !== 'unknown');
    // If no genres mapped, use basic detection from name
    const finalGenres = mappedGenres.length > 0 ? mappedGenres : detectGenreFromName(steamGame.name);
    // Extract Steam metadata for mood analysis
    const steamTags = steamDetails?.tags?.map((t) => t.description) || [];
    const steamCategories = steamDetails?.categories?.map((c) => c.description) || [];
    const playtime = steamGame.playtime_forever;
    // Get comprehensive moods based on all metadata
    const moods = (0, exports.getGameMoods)(finalGenres, steamTags, steamCategories, playtime);
    // Generate tags from genres, moods, and Steam metadata
    const tags = [
        ...finalGenres,
        ...moods,
        ...steamTags.slice(0, 5), // Limit Steam tags to avoid tag spam
        'steam-imported'
    ];
    return {
        appId: steamGame.appid,
        title: steamGame.name,
        description: steamDetails?.short_description || steamDetails?.about_the_game || undefined,
        coverImage: `https://cdn.akamai.steamstatic.com/steam/apps/${steamGame.appid}/library_600x900.jpg`,
        genres: finalGenres.map((genreId) => {
            // Find the full genre object from static data
            const genre = static_data_1.GENRES.find(g => g.id === genreId);
            return genre || {
                id: genreId,
                name: genreId.charAt(0).toUpperCase() + genreId.slice(1),
                description: `${genreId} games`,
                icon: '🎮',
                color: 'from-gray-500 to-gray-600',
                tags: [genreId]
            };
        }),
        platforms: [{ id: 'steam', name: 'Steam', code: 'steam', isConnected: true }],
        emotionalTags: moods,
        moods: moods, // Add moods field with MoodId[] for filtering and recommendations
        playStatus: 'backlog',
        hoursPlayed: Math.floor(steamGame.playtime_forever / 60),
        addedAt: new Date().toISOString(),
        isFavorite: false,
        tags: tags,
        releaseYear: steamDetails?.release_date?.date ? new Date(steamDetails.release_date.date).getFullYear() : new Date().getFullYear(),
        // Additional Steam metadata for enhanced recommendations
        steamData: {
            appid: steamGame.appid,
            steamGenres: steamGenres,
            steamTags: steamTags,
            steamCategories: steamCategories,
            categories: steamDetails?.categories?.map((c) => c.description) || [],
            developers: steamDetails?.developers || [],
            publishers: steamDetails?.publishers || [],
            releaseDate: steamDetails?.release_date?.date,
            screenshots: steamDetails?.screenshots || [],
            movies: steamDetails?.movies || [],
            recommendations: steamDetails?.recommendations || 0,
            price_overview: steamDetails?.price_overview || {},
            platforms: steamDetails?.platforms || [],
            metacritic: steamDetails?.metacritic || {},
            reviews: steamDetails?.reviews || {},
            dlcs: steamDetails?.dlcs || [],
            metacriticScore: steamDetails?.metacritic?.score,
            isFree: steamDetails?.is_free || false,
            supportedLanguages: steamDetails?.supported_languages || []
        }
    };
};
exports.processSteamGameData = processSteamGameData;
// Basic genre detection from game name (fallback)
const detectGenreFromName = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('racing') || lowerName.includes('drive') || lowerName.includes('speed')) {
        return ['racing'];
    }
    if (lowerName.includes('football') || lowerName.includes('soccer') || lowerName.includes('basketball')) {
        return ['sports'];
    }
    if (lowerName.includes('puzzle') || lowerName.includes('match')) {
        return ['puzzle'];
    }
    if (lowerName.includes('strategy') || lowerName.includes('tactics')) {
        return ['strategy'];
    }
    return ['indie']; // Default fallback
};
