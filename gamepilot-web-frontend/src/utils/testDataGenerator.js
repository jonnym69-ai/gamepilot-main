"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestGames = generateTestGames;
exports.addTestGamesToLibrary = addTestGamesToLibrary;
const useLibraryStore_1 = require("../stores/useLibraryStore");
const gameTitles = [
    'The Witcher 3: Wild Hunt', 'Elden Ring', 'Cyberpunk 2077', 'Red Dead Redemption 2',
    'God of War', 'Horizon Zero Dawn', 'Marvel\'s Spider-Man', 'The Last of Us Part II',
    'Dark Souls III', 'Bloodborne', 'Sekiro: Shadows Die Twice', 'Nioh 2',
    'Ghost of Tsushima', 'Assassin\'s Creed Valhalla', 'Watch Dogs Legion', 'Far Cry 6',
    'Call of Duty: Warzone', 'Battlefield 2042', 'Apex Legends', 'Fortnite',
    'Valorant', 'Overwatch 2', 'League of Legends', 'Dota 2',
    'CS:GO', 'Team Fortress 2', 'Portal 2', 'Half-Life 2',
    'Minecraft', 'Terraria', 'Stardew Valley', 'Animal Crossing: New Horizons',
    'Among Us', 'Fall Guys', 'Rocket League', 'Genshin Impact',
    'Final Fantasy VII Remake', 'Persona 5 Royal', 'Dragon Quest XI S', 'Octopath Traveler',
    'Hades', 'Dead Cells', 'Hollow Knight', 'Ori and the Will of the Wisps',
    'Cuphead', 'Celeste', 'Hollow Knight: Silksong', 'Sifu',
    'Resident Evil Village', 'The Evil Within 2', 'Amnesia: Rebirth', 'Outlast 2',
    'Detroit: Become Human', 'Heavy Rain', 'Beyond: Two Souls', 'Fahrenheit',
    'Life is Strange', 'The Walking Dead', 'The Wolf Among Us', 'Batman: The Telltale Series',
    'Grand Theft Auto V', 'Bully', 'L.A. Noire', 'Max Payne 3',
    'Saints Row IV', 'Sleeping Dogs', 'Just Cause 4', 'Mad Max',
    'Doom Eternal', 'Wolfenstein II: The New Colossus', 'Rage 2', 'Quake Champions',
    'Street Fighter V', 'Mortal Kombat 11', 'Tekken 7', 'Dragon Ball FighterZ',
    'FIFA 23', 'NBA 2K23', 'Madden NFL 23', 'MLB The Show 23',
    'Forza Horizon 5', 'Gran Turismo 7', 'Need for Speed Unbound', 'The Crew 2',
    'Civilization VI', 'Humankind', 'Age of Empires IV', 'StarCraft II',
    'Total War: Warhammer III', 'Crusader Kings III', 'Europa Universalis IV', 'Stellaris',
    'XCOM 2', 'Phoenix Point', 'Gears Tactics', 'Mario + Rabbids Kingdom Battle',
    'Subnautica', 'No Man\'s Sky', 'The Outer Wilds', 'Kerbal Space Program',
    'Astroneer', 'Space Engineers', 'Empyrion: Galactic Survival', 'Starbound',
    'The Sims 4', 'Cities: Skylines', 'Planet Zoo', 'Jurassic World Evolution',
    'Football Manager 2023', 'NBA 2K23 MyCareer', 'WWE 2K23', 'UFC 4',
    'Deep Rock Galactic', 'Risk of Rain 2', 'Warframe', 'Destiny 2',
    'The Division 2', 'Tom Clancy\'s Ghost Recon Breakpoint', 'Rainbow Six Siege', 'Insurgency: Sandstorm',
    'Monster Hunter: World', 'Dauntless', 'Remnant: From the Ashes', 'Outriders',
    'Borderlands 3', 'The Outer Worlds', 'Wasteland 3', 'Fallout 4',
    'The Elder Scrolls V: Skyrim', 'The Elder Scrolls Online', 'Fallout 76', 'Dragon Age: Inquisition',
    'Mass Effect Legendary Edition', 'Star Wars Jedi: Fallen Order', 'Knights of the Old Republic', 'Jade Empire',
    'Control', 'Quantum Break', 'Alan Wake', 'Max Payne',
    'Bioshock Infinite', 'Bioshock 2', 'Bioshock', 'System Shock 2',
    'Deus Ex: Mankind Divided', 'Deus Ex: Human Revolution', 'Dishonored 2', 'Dishonored',
    'Prey', 'System Shock', 'Shadow Warrior 3', 'Painkiller',
    'Serious Sam 4', 'Duke Nukem Forever', 'Bulletstorm', 'Hard Reset',
    'Vanquish', 'Binary Domain', 'Spec Ops: The Line', 'Homefront',
    'Crysis 3', 'Crysis 2', 'Crysis', 'Far Cry Primal',
    'Far Cry 5', 'Far Cry 4', 'Far Cry 3', 'Far Cry 2',
    'Metro Exodus', 'Metro 2033 Redux', 'Metro: Last Light Redux', 'S.T.A.L.K.E.R.: Call of Pripyat',
    'Escape from Tarkov', 'Hunt: Showdown', 'Scum', 'DayZ',
    'Rust', 'Ark: Survival Evolved', 'Conan Exiles', '7 Days to Die',
    'Valheim', 'Green Hell', 'The Forest', 'Sons of the Forest',
    'Vampire Survivors', 'Brotato', 'Gunfire Reborn', 'Risk of Rain Returns',
    'Hades\' Star', 'FTL: Faster Than Light', 'Into the Breach', 'Battle Brothers',
    'XCOM: Enemy Unknown', 'Phoenix Point', 'Gears Tactics', 'Mario + Rabbids Kingdom Battle'
];
const genres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'FPS', 'TPS', 'Puzzle', 'Platformer', 'Fighting', 'Stealth', 'Horror', 'Survival', 'Open World', 'Fantasy', 'Sci-Fi', 'Historical', 'Modern'];
const platforms = [
    { id: 'steam', name: 'Steam', code: 'steam', isConnected: true },
    { id: 'epic', name: 'Epic Games', code: 'epic', isConnected: false },
    { id: 'gog', name: 'GOG', code: 'gog', isConnected: false },
    { id: 'origin', name: 'Origin', code: 'origin', isConnected: false },
    { id: 'uplay', name: 'Uplay', code: 'uplay', isConnected: false },
    { id: 'psn', name: 'PlayStation Network', code: 'psn', isConnected: false },
    { id: 'xbox', name: 'Xbox Live', code: 'xbox', isConnected: false },
    { id: 'switch', name: 'Nintendo Switch', code: 'switch', isConnected: false }
];
const emotionalTags = ['Competitive', 'Relaxing', 'Intense', 'Strategic', 'Creative', 'Social', 'Cozy', 'Adventurous', 'Mysterious', 'Humorous'];
const playStatuses = ['playing', 'completed', 'backlog', 'abandoned', 'unplayed'];
function generateTestGames(count = 100) {
    const games = [];
    for (let i = 0; i < count; i++) {
        const titleIndex = i % gameTitles.length;
        const baseTitle = gameTitles[titleIndex];
        const title = count > gameTitles.length ? `${baseTitle} #${Math.floor(i / gameTitles.length) + 1}` : baseTitle;
        const gameGenres = [];
        const genreCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < genreCount; j++) {
            const genre = genres[Math.floor(Math.random() * genres.length)];
            if (!gameGenres.includes(genre)) {
                gameGenres.push(genre);
            }
        }
        const gamePlatforms = [];
        const platformCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < platformCount; j++) {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            if (!gamePlatforms.find(p => p.id === platform.id)) {
                gamePlatforms.push(platform);
            }
        }
        const gameEmotionalTags = [];
        const emotionalTagCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < emotionalTagCount; j++) {
            const tag = emotionalTags[Math.floor(Math.random() * emotionalTags.length)];
            if (!gameEmotionalTags.includes(tag)) {
                gameEmotionalTags.push(tag);
            }
        }
        const game = {
            id: `test-game-${i + 1}`,
            title,
            description: `This is a test game for performance testing. ${title} is an amazing ${gameGenres.join('/')} game that offers incredible gameplay and stunning visuals.`,
            genres: gameGenres.map(name => ({
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                subgenres: []
            })),
            platforms: gamePlatforms.map(p => ({ id: p.code, name: p.name, code: p.code, isConnected: false })),
            emotionalTags: gameEmotionalTags.map(tag => ({
                id: tag.toLowerCase().replace(/\s+/g, '-'),
                name: tag,
                description: `${tag} mood`,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                category: 'feeling',
                isCustom: false,
                games: []
            })),
            playStatus: playStatuses[Math.floor(Math.random() * playStatuses.length)],
            hoursPlayed: Math.floor(Math.random() * 500),
            addedAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
            lastPlayed: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) : undefined,
            isFavorite: Math.random() > 0.8,
            releaseYear: 2015 + Math.floor(Math.random() * 9),
            achievements: { unlocked: Math.floor(Math.random() * 100), total: Math.floor(Math.random() * 100) + 1 },
            coverImage: `https://picsum.photos/seed/${title.replace(/\s+/g, '-').toLowerCase()}/400/600.jpg`
        };
        games.push(game);
    }
    return games;
}
// Function to add test games to the library
function addTestGamesToLibrary(count = 100) {
    const games = generateTestGames(count);
    const { actions } = useLibraryStore_1.useLibraryStore.getState();
    games.forEach(game => {
        actions.addGame(game);
    });
    return games.length;
}
