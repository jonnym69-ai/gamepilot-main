"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickGenreFix = quickGenreFix;
const useLibraryStore_1 = require("../stores/useLibraryStore");
const static_data_1 = require("@gamepilot/static-data");
function quickGenreFix() {
    const { games, setGames } = useLibraryStore_1.useLibraryStore.getState();
    console.log('🔄 Quick Genre Fix for Steam Games');
    console.log('='.repeat(50));
    if (!games || games.length === 0) {
        console.log('❌ No games found in library');
        return;
    }
    console.log(`📊 Processing ${games.length} games...`);
    let updatedCount = 0;
    const updatedGames = games.map(game => {
        // Check if this game has "unknown" genre and needs fixing
        const hasUnknownGenre = game.genres.length === 1 &&
            (typeof game.genres[0] === 'string' && game.genres[0] === 'unknown' ||
                typeof game.genres[0] === 'object' && game.genres[0].name === 'unknown');
        if (hasUnknownGenre) {
            updatedCount++;
            const title = game.title.toLowerCase();
            const newGenres = [];
            // Title-based genre detection
            if (title.includes('rpg') || title.includes('final fantasy') || title.includes('witcher') ||
                title.includes('elder scrolls') || title.includes('dragon age') || title.includes('mass effect')) {
                const rpgGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'rpg');
                if (rpgGenre) {
                    newGenres.push({
                        id: rpgGenre.id,
                        name: rpgGenre.name,
                        description: rpgGenre.description,
                        color: rpgGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            if (title.includes('shooter') || title.includes('fps') || title.includes('call of duty') ||
                title.includes('counter strike') || title.includes('overwatch') || title.includes('apex') ||
                title.includes('valorant') || title.includes('halo') || title.includes('doom')) {
                const shooterGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'shooter');
                if (shooterGenre) {
                    newGenres.push({
                        id: shooterGenre.id,
                        name: shooterGenre.name,
                        description: shooterGenre.description,
                        color: shooterGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            if (title.includes('strategy') || title.includes('rts') || title.includes('civilization') ||
                title.includes('starcraft') || title.includes('age of empires')) {
                const strategyGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'strategy');
                if (strategyGenre) {
                    newGenres.push({
                        id: strategyGenre.id,
                        name: strategyGenre.name,
                        description: strategyGenre.description,
                        color: strategyGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            if (title.includes('action') || title.includes('devil may cry') || title.includes('bayonetta') ||
                title.includes('god of war')) {
                const actionGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'action');
                if (actionGenre) {
                    newGenres.push({
                        id: actionGenre.id,
                        name: actionGenre.name,
                        description: actionGenre.description,
                        color: actionGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            if (title.includes('adventure') || title.includes('zelda') || title.includes('tomb raider') ||
                title.includes('uncharted') || title.includes('resident evil')) {
                const adventureGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'adventure');
                if (adventureGenre) {
                    newGenres.push({
                        id: adventureGenre.id,
                        name: adventureGenre.name,
                        description: adventureGenre.description,
                        color: adventureGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            if (title.includes('racing') || title.includes('need for speed') || title.includes('gran turismo') ||
                title.includes('forza') || title.includes('mario kart')) {
                const racingGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'racing');
                if (racingGenre) {
                    newGenres.push({
                        id: racingGenre.id,
                        name: racingGenre.name,
                        description: racingGenre.description,
                        color: racingGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            if (title.includes('sports') || title.includes('fifa') || title.includes('nba') ||
                title.includes('nfl') || title.includes('football') || title.includes('basketball')) {
                const sportsGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'sports');
                if (sportsGenre) {
                    newGenres.push({
                        id: sportsGenre.id,
                        name: sportsGenre.name,
                        description: sportsGenre.description,
                        color: sportsGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            // Default to Action if no genres found
            if (newGenres.length === 0) {
                const actionGenre = static_data_1.GENRES.find(g => g.name.toLowerCase() === 'action');
                if (actionGenre) {
                    newGenres.push({
                        id: actionGenre.id,
                        name: actionGenre.name,
                        description: actionGenre.description,
                        color: actionGenre.color,
                        icon: undefined,
                        subgenres: []
                    });
                }
            }
            console.log(`✅ Updated: ${game.title}`);
            console.log(`   New genres: [${newGenres.map(g => g.name).join(', ')}]`);
            return {
                ...game,
                genres: newGenres.slice(0, 3) // Limit to 3 genres
            };
        }
        return game;
    });
    // Update the store
    setGames(updatedGames);
    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Genre fix complete!`);
    console.log(`✅ Updated ${updatedCount} games`);
    console.log(`📊 Total games: ${updatedGames.length}`);
    console.log('\n🚀 Now run: testPersona() to see the improvements!');
}
// Initialize
if (typeof window !== 'undefined') {
    window.quickGenreFix = quickGenreFix;
    console.log('🔧 Quick genre fix command available: quickGenreFix()');
}
