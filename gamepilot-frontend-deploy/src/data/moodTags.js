"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENRE_TO_MOOD_MAPPING = void 0;
exports.getMoodsForGenre = getMoodsForGenre;
exports.getMoodsForGenres = getMoodsForGenres;
// Static mapping of Steam genres to moods
exports.GENRE_TO_MOOD_MAPPING = {
    // Action & Fast-Paced
    'Action': ['Fast-Paced'],
    'Adventure': ['Story'],
    'FPS': ['Fast-Paced', 'Competitive'],
    'Shooter': ['Fast-Paced', 'Competitive'],
    'Fighting': ['Competitive', 'Fast-Paced'],
    'Platformer': ['Fast-Paced'],
    'Hack and Slash': ['Fast-Paced'],
    'Beat em up': ['Fast-Paced'],
    // RPG & Story
    'RPG': ['Story'],
    'JRPG': ['Story'],
    'CRPG': ['Story'],
    'Action RPG': ['Story', 'Fast-Paced'],
    'Roguelike': ['Fast-Paced'],
    'Roguelite': ['Fast-Paced'],
    'Dungeon Crawler': ['Story'],
    'Open World': ['Story'],
    // Strategy & Competitive
    'Strategy': ['Competitive'],
    'Turn-Based Strategy': ['Competitive'],
    'Real-Time Strategy': ['Competitive', 'Fast-Paced'],
    '4X': ['Competitive'],
    'Grand Strategy': ['Competitive'],
    'Tower Defense': ['Competitive'],
    'Wargame': ['Competitive'],
    // Simulation & Chill
    'Simulation': ['Chill'],
    'Life Sim': ['Chill', 'Creative'],
    'Farming Sim': ['Chill', 'Creative'],
    'City Builder': ['Creative', 'Chill'],
    'Management': ['Creative'],
    'Tycoon': ['Creative'],
    'Vehicle Sim': ['Chill'],
    // Creative
    'Indie': ['Creative'],
    'Puzzle': ['Creative'],
    'Point & Click': ['Story', 'Creative'],
    'Visual Novel': ['Story'],
    'Adventure Game': ['Story', 'Creative'],
    'Sandbox': ['Creative'],
    'Building': ['Creative'],
    // Social
    'Multiplayer': ['Social'],
    'Co-op': ['Social'],
    'MMO': ['Social', 'Competitive'],
    'Party': ['Social'],
    'Family': ['Social'],
    'Casual': ['Chill', 'Social'],
    // Dark
    'Horror': ['Dark'],
    'Survival Horror': ['Dark'],
    'Psychological Horror': ['Dark'],
    'Gore': ['Dark'],
    'Dark Fantasy': ['Dark'],
    'Thriller': ['Dark'],
    // Sports & Competitive
    'Sports': ['Competitive'],
    'Racing': ['Competitive', 'Fast-Paced'],
    'Football': ['Competitive'],
    'Basketball': ['Competitive'],
    'Soccer': ['Competitive'],
    // Mixed categories
    'Card Game': ['Competitive', 'Creative'],
    'Board Game': ['Competitive', 'Social'],
    'Educational': ['Creative'],
    'Music': ['Creative', 'Chill'],
    'Rhythm': ['Fast-Paced', 'Creative']
};
// Helper function to get moods for a genre
function getMoodsForGenre(genre) {
    return exports.GENRE_TO_MOOD_MAPPING[genre] || [];
}
// Helper function to get all moods for multiple genres
function getMoodsForGenres(genres) {
    const allMoods = [];
    genres.forEach(genre => {
        const moods = getMoodsForGenre(genre);
        moods.forEach(mood => {
            if (!allMoods.includes(mood)) {
                allMoods.push(mood);
            }
        });
    });
    return allMoods;
}
