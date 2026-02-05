"use strict";
/**
 * Simple test to verify mood filtering is working correctly
 */
Object.defineProperty(exports, "__esModule", { value: true });
const moodFilterSystem_1 = require("./moodFilterSystem");
// Test games with proper Game interface structure
const testGames = [
    {
        id: '1',
        title: 'Call of Duty: Warzone',
        coverImage: '',
        moods: ['multiplayer', 'competitive', 'fps'],
        genres: [{ id: '1', name: 'FPS', description: '', color: '', icon: '', subgenres: [] }],
        platforms: [],
        emotionalTags: [],
        playStatus: 'unplayed',
        hoursPlayed: 0,
        addedAt: new Date(),
        isFavorite: false,
        subgenres: [],
        playHistory: [],
        releaseYear: 2020,
        achievements: { unlocked: 0, total: 0 }
    },
    {
        id: '2',
        title: 'Stardew Valley',
        coverImage: '',
        moods: ['relaxing', 'farming', 'casual'],
        genres: [{ id: '2', name: 'Simulation', description: '', color: '', subgenres: [] }],
        platforms: [],
        emotionalTags: [],
        playStatus: 'unplayed',
        hoursPlayed: 0,
        addedAt: new Date(),
        isFavorite: false,
        subgenres: [],
        playHistory: [],
        releaseYear: 2016,
        achievements: { unlocked: 0, total: 0 }
    },
    {
        id: '3',
        title: 'The Witcher 3',
        coverImage: '',
        moods: ['story-driven', 'rpg', 'narrative'],
        genres: [{ id: '3', name: 'RPG', description: '', color: '', subgenres: [] }],
        platforms: [],
        emotionalTags: [],
        playStatus: 'unplayed',
        hoursPlayed: 0,
        addedAt: new Date(),
        isFavorite: false,
        subgenres: [],
        playHistory: [],
        releaseYear: 2015,
        achievements: { unlocked: 0, total: 0 }
    },
    {
        id: '4',
        title: 'Hollow Knight',
        coverImage: '',
        moods: ['metroidvania', 'exploration', 'platformer'],
        genres: [{ id: '4', name: 'Metroidvania', description: '', color: '', subgenres: [] }],
        platforms: [],
        emotionalTags: [],
        playStatus: 'unplayed',
        hoursPlayed: 0,
        addedAt: new Date(),
        isFavorite: false,
        subgenres: [],
        playHistory: [],
        releaseYear: 2017,
        achievements: { unlocked: 0, total: 0 }
    },
    {
        id: '5',
        title: 'Minecraft',
        coverImage: '',
        moods: ['sandbox', 'creative', 'building'],
        genres: [{ id: '5', name: 'Sandbox', description: '', color: '', subgenres: [] }],
        platforms: [],
        emotionalTags: [],
        playStatus: 'unplayed',
        hoursPlayed: 0,
        addedAt: new Date(),
        isFavorite: false,
        subgenres: [],
        playHistory: [],
        releaseYear: 2011,
        achievements: { unlocked: 0, total: 0 }
    }
];
// Test the filtering
console.log('🧪 Testing Mood Filter System');
console.log(`Total test games: ${testGames.length}`);
// Test each mood
const moods = ['social', 'competitive', 'story', 'adventure', 'chill', 'creative'];
moods.forEach(mood => {
    console.log(`\n📊 Testing ${mood} mood:`);
    const filtered = (0, moodFilterSystem_1.filterGamesByMood)(testGames, mood);
    console.log(`Found ${filtered.length} games:`);
    filtered.forEach(game => {
        console.log(`  ✅ ${game.title} (moods: ${game.moods.join(', ')})`);
    });
});
console.log('\n🎉 Test complete!');
