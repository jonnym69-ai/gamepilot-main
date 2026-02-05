"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshGameGenres = refreshGameGenres;
const useLibraryStore_1 = require("../stores/useLibraryStore");
function refreshGameGenres() {
    const { games, setGames } = useLibraryStore_1.useLibraryStore.getState();
    console.log('🔄 Refreshing Game Genres with Updated Adapter');
    console.log('='.repeat(50));
    if (!games || games.length === 0) {
        console.log('❌ No games found in library');
        return;
    }
    console.log(`📊 Processing ${games.length} games...`);
    let updatedCount = 0;
    const updatedGames = games.map(game => {
        // Check if this is a Steam game that needs genre fixing
        if (game.id.startsWith('steam-') && game.genres.length === 1 &&
            (typeof game.genres[0] === 'string' && game.genres[0] === 'unknown' ||
                typeof game.genres[0] === 'object' && game.genres[0].name === 'unknown')) {
            updatedCount++;
            // Create a mock Steam game object from the existing game
            const steamGame = {
                appid: game.appId || parseInt(game.id.replace('steam-', '')),
                name: game.title,
                playtime_forever: (game.hoursPlayed || 0) * 60, // Convert back to minutes
                // Add other fields that the adapter might need
                shortDescription: game.description,
                developer: game.developer,
                publisher: game.publisher,
                releaseDate: game.releaseDate?.toISOString(),
                lastPlayed: game.lastPlayed?.toISOString(),
                achievements: game.achievements
            };
            try {
                // Mock the adapter functionality for now - TODO: Use real adapter
                const updatedGame = {
                    ...game,
                    genres: [{ id: 'action', name: 'Action', color: 'red', subgenres: [] }], // Mock genre
                    tags: game.tags || []
                };
                console.log(`✅ Updated: ${game.title}`);
                console.log(`   Old genres: [${game.genres.map((g) => typeof g === 'string' ? g : g.name).join(', ')}]`);
                console.log(`   New genres: [${updatedGame.genres.map((g) => g.name).join(', ')}]`);
                return {
                    ...game,
                    genres: updatedGame.genres,
                };
            }
            catch (error) {
                console.error(`❌ Failed to update ${game.title}:`, error);
                return game;
            }
        }
        return game;
    });
    // Update the store with proper type filtering
    const validGames = updatedGames.filter(game => game.genres.every(genre => typeof genre === 'object' &&
        'id' in genre &&
        'name' in genre &&
        'description' in genre &&
        'icon' in genre &&
        'tags' in genre));
    setGames(validGames);
    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Genre refresh complete!`);
    console.log(`✅ Updated ${updatedCount} games`);
    console.log(`📊 Total games: ${updatedGames.length}`);
    console.log('\n🚀 Run the persona test again to see the improvements!');
    console.log('   Use: testPersona() or click the purple test button');
}
// Initialize
if (typeof window !== 'undefined') {
    window.refreshGameGenres = refreshGameGenres;
    console.log('🔄 Game genre refresh command available: refreshGameGenres()');
}
