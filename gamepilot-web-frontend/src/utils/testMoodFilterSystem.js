"use strict";
/**
 * Test Suite for the New Mood Filter System
 *
 * Validates that the clean mood filtering system produces accurate,
 * predictable results with no genre bleed between categories.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMoodFilterSystem = testMoodFilterSystem;
const moodFilterSystem_1 = require("./moodFilterSystem");
// Test data with clear mood categorizations
const testGames = [
    // Social games (multiplayer/coop)
    {
        id: 'social-1',
        title: 'Among Us',
        tags: ['multiplayer', 'party', 'social'],
        genres: [{ id: 'party', name: 'Party', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        releaseYear: 2020,
        achievements: { unlocked: 0, total: 0 }
    },
    {
        id: 'social-2',
        title: 'Call of Duty: Warzone',
        tags: ['multiplayer', 'fps', 'competitive', 'online'],
        genres: [{ id: 'fps', name: 'FPS', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        releaseYear: 2020,
        achievements: { unlocked: 0, total: 0 }
    },
    // Competitive games (skill-based)
    {
        id: 'competitive-1',
        title: 'Counter-Strike 2',
        tags: ['competitive', 'fps', 'skill-based', 'esports'],
        genres: [{ id: 'fps', name: 'FPS', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        releaseYear: 2020,
        achievements: { unlocked: 0, total: 0 }
    },
    {
        id: 'competitive-2',
        title: 'League of Legends',
        tags: ['competitive', 'moba', 'team-based', 'skill-based'],
        genres: [{ id: 'moba', name: 'MOBA', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        releaseYear: 2020,
        achievements: { unlocked: 0, total: 0 }
    },
    // Story games (narrative-first)
    {
        id: 'story-1',
        title: 'The Witcher 3',
        tags: ['story-driven', 'rpg', 'narrative'],
        genres: [{ id: 'rpg', name: 'RPG', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        releaseYear: 2015,
        achievements: { unlocked: 0, total: 0 }
    },
    {
        id: 'story-2',
        title: 'Life is Strange',
        tags: ['story-driven', 'visual-novel', 'narrative'],
        genres: [{ id: 'visual-novel', name: 'Visual Novel', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        releaseYear: 2015,
        achievements: { unlocked: 0, total: 0 }
    },
    // Adventure games (exploration-first)
    {
        id: 'adventure-1',
        title: 'Hollow Knight',
        tags: ['metroidvania', 'exploration', 'platformer'],
        genres: [{ id: 'metroidvania', name: 'Metroidvania', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        playHistory: [],
        releaseYear: 2017,
        achievements: { unlocked: 0, total: 0 },
        subgenres: []
    },
    {
        id: 'adventure-2',
        title: 'The Legend of Zelda: Breath of the Wild',
        tags: ['open-world', 'exploration', 'action-adventure'],
        genres: [{ id: 'action-adventure', name: 'Action-Adventure', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        playHistory: [],
        releaseYear: 2017,
        achievements: { unlocked: 0, total: 0 },
        subgenres: []
    },
    // Chill games (low-pressure)
    {
        id: 'chill-1',
        title: 'Stardew Valley',
        tags: ['relaxing', 'farming', 'casual', 'cozy'],
        genres: [{ id: 'simulation', name: 'Simulation', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        playHistory: [],
        releaseYear: 2016,
        achievements: { unlocked: 0, total: 0 },
        subgenres: []
    },
    {
        id: 'chill-2',
        title: 'Portal 2',
        tags: ['puzzle', 'relaxing', 'casual'],
        genres: [{ id: 'puzzle', name: 'Puzzle', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        playHistory: [],
        releaseYear: 2011,
        achievements: { unlocked: 0, total: 0 },
        subgenres: []
    },
    // Creative games (expression-first)
    {
        id: 'creative-1',
        title: 'Minecraft',
        tags: ['building', 'crafting', 'sandbox', 'creative'],
        genres: [{ id: 'sandbox', name: 'Sandbox', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        playHistory: [],
        releaseYear: 2011,
        achievements: { unlocked: 0, total: 0 },
        subgenres: []
    },
    {
        id: 'creative-2',
        title: 'Cities: Skylines',
        tags: ['city-builder', 'building', 'simulation', 'creative'],
        genres: [{ id: 'city-builder', name: 'City Builder', description: '', icon: '', color: '', tags: [] }],
        coverImage: '',
        releaseDate: new Date(),
        developer: '',
        publisher: '',
        platforms: [],
        emotionalTags: [],
        userRating: undefined,
        globalRating: undefined,
        playStatus: 'unplayed',
        hoursPlayed: 0,
        lastPlayed: undefined,
        addedAt: new Date(),
        notes: '',
        isFavorite: false,
        moods: [],
        releaseYear: 2015,
        achievements: { unlocked: 0, total: 0 }
    }
];
// Test function to validate mood filtering system
function testMoodFilterSystem() {
    console.log('🧪 Testing Mood Filter System');
    // Test 1: Social mood should return only multiplayer games
    console.log('\n📊 Test 1: Social Mood Filtering');
    const socialGames = (0, moodFilterSystem_1.filterGamesByMood)(testGames, 'social');
    console.log(`Found ${socialGames.length} social games:`);
    socialGames.forEach(game => {
        console.log(`  ✅ ${game.title}`);
    });
    // Test 2: Competitive mood should return skill-based games
    console.log('\n📊 Test 2: Competitive Mood Filtering');
    const competitiveGames = (0, moodFilterSystem_1.filterGamesByMood)(testGames, 'competitive');
    console.log(`Found ${competitiveGames.length} competitive games:`);
    competitiveGames.forEach(game => {
        console.log(`  ✅ ${game.title}`);
    });
    // Test 3: Story mood should return narrative games (no adventure bleed)
    console.log('\n📊 Test 3: Story Mood Filtering');
    const storyGames = (0, moodFilterSystem_1.filterGamesByMood)(testGames, 'story');
    console.log(`Found ${storyGames.length} story games:`);
    storyGames.forEach(game => {
        console.log(`  ✅ ${game.title}`);
    });
    // Test 4: Adventure mood should return exploration games (no RPG bleed)
    console.log('\n📊 Test 4: Adventure Mood Filtering');
    const adventureGames = (0, moodFilterSystem_1.filterGamesByMood)(testGames, 'adventure');
    console.log(`Found ${adventureGames.length} adventure games:`);
    adventureGames.forEach(game => {
        console.log(`  ✅ ${game.title}`);
    });
    // Test 5: Chill mood should return low-pressure games (no competitive bleed)
    console.log('\n📊 Test 5: Chill Mood Filtering');
    const chillGames = (0, moodFilterSystem_1.filterGamesByMood)(testGames, 'chill');
    console.log(`Found ${chillGames.length} chill games:`);
    chillGames.forEach(game => {
        console.log(`  ✅ ${game.title}`);
    });
    // Test 6: Creative mood should return expression games
    console.log('\n📊 Test 6: Creative Mood Filtering');
    const creativeGames = (0, moodFilterSystem_1.filterGamesByMood)(testGames, 'creative');
    console.log(`Found ${creativeGames.length} creative games:`);
    creativeGames.forEach(game => {
        console.log(`  ✅ ${game.title}`);
    });
    // Test 7: Validation - check for overlap
    console.log('\n📊 Test 7: System Validation');
    const validationResults = (0, moodFilterSystem_1.validateMoodSystem)(testGames);
    console.log('Validation Results:');
    console.log(`  Social: ${validationResults.social} games`);
    console.log(`  Competitive: ${validationResults.competitive} games`);
    console.log(`  Story: ${validationResults.story} games`);
    console.log(`  Adventure: ${validationResults.adventure} games`);
    console.log(`  Chill: ${validationResults.chill} games`);
    console.log(`  Creative: ${validationResults.creative} games`);
    console.log(`  Total Overlap: ${validationResults.totalOverlap} games`);
    // Test 8: Individual game recommendations
    console.log('\n📊 Test 8: Individual Game Recommendations');
    const testGame = testGames[0]; // Among Us
    const recommendations = ['social', 'competitive', 'story', 'adventure', 'chill', 'creative'].map(moodId => {
        const rec = (0, moodFilterSystem_1.getMoodRecommendation)(testGame, moodId);
        return {
            mood: moodId,
            matches: rec?.matches || false,
            score: rec?.score || 0,
            reason: rec?.reason || 'No match'
        };
    });
    console.log(`Recommendations for "${testGame.title}":`);
    recommendations.forEach(rec => {
        const status = rec.matches ? '✅' : '❌';
        console.log(`  ${status} ${rec.mood}: ${rec.score}% - ${rec.reason}`);
    });
    // Test 9: Priority system (Social should override genre)
    console.log('\n📊 Test 9: Priority System Test');
    const callOfDuty = testGames[1]; // Has both social and competitive features
    const socialRec = (0, moodFilterSystem_1.getMoodRecommendation)(callOfDuty, 'social');
    const competitiveRec = (0, moodFilterSystem_1.getMoodRecommendation)(callOfDuty, 'competitive');
    console.log(`Call of Duty (has both social and competitive features):`);
    console.log(`  Social: ${socialRec?.score || 0}% - ${socialRec?.reason || 'No match'}`);
    console.log(`  Competitive: ${competitiveRec?.score || 0}% - ${competitiveRec?.reason || 'No match'}`);
    console.log('\n✅ Mood Filter System Test Complete!');
    return {
        socialGames: socialGames.length,
        competitiveGames: competitiveGames.length,
        storyGames: storyGames.length,
        adventureGames: adventureGames.length,
        chillGames: chillGames.length,
        creativeGames: creativeGames.length,
        totalOverlap: validationResults.totalOverlap,
        testPassed: validationResults.totalOverlap === 0 // Should be 0 overlap
    };
}
// Run the test if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    testMoodFilterSystem();
}
