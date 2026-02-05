"use strict";
/**
 * Core Mood Mapping System
 * Single source of truth for deriving moods from game data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMoodFromGame = deriveMoodFromGame;
exports.autoAssignFeatures = autoAssignFeatures;
/**
 * Derive primary mood from game data using priority rules
 * First match wins - this encodes our mood philosophy
 */
function deriveMoodFromGame(game) {
    // Get game data
    const genres = game.genres?.map(g => g.name.toLowerCase()) || [];
    const features = game.moods || []; // Using moods as features for now
    const title = game.title.toLowerCase();
    // PRIORITY 1: Creative/Sandbox games (highest priority for sandbox DNA)
    if (genres.includes('sandbox') || genres.includes('city-builder') || genres.includes('simulation') ||
        title.includes('minecraft') || title.includes('terraria') || title.includes('starbound') ||
        title.includes('rimworld') || title.includes('necesse') || title.includes('garry\'s mod') ||
        title.includes('project zomboid') || title.includes('core keeper') || title.includes('forager') ||
        title.includes('cryofall') || title.includes('kenshi') || title.includes('outward')) {
        return 'creative';
    }
    // PRIORITY 2: Story/Narrative games
    if (genres.includes('rpg') || genres.includes('jrpg') || genres.includes('visual-novel') ||
        genres.includes('interactive-fiction') || genres.includes('role-playing') ||
        title.includes('witcher') || title.includes('mass effect') || title.includes('dragon age') ||
        title.includes('skyrim') || title.includes('fallout') || title.includes('bioshock') ||
        title.includes('baldur\'s gate') || title.includes('divinity') || title.includes('god of war') ||
        title.includes('star wars') || title.includes('kingdom come') || title.includes('cyberpunk')) {
        return 'story';
    }
    // PRIORITY 3: Competitive games
    if (features.some(f => f.includes('competitive')) || genres.includes('fighting') || genres.includes('racing') ||
        title.includes('apex legends') || title.includes('pubg') || title.includes('rainbow six') ||
        title.includes('battlebit') || title.includes('rust') || title.includes('counter-strike') ||
        title.includes('valorant') || title.includes('overwatch') || title.includes('crab game') ||
        title.includes('z1 battle royale') || title.includes('efootball') || title.includes('wwe 2k')) {
        return 'competitive';
    }
    // PRIORITY 4: Social/Multiplayer games
    if (features.some(f => f.includes('multiplayer') || f.includes('online') || f.includes('coop')) ||
        genres.includes('multiplayer') ||
        title.includes('left 4 dead') || title.includes('rocket league') || title.includes('helldivers') ||
        title.includes('valheim') || title.includes('squad') || title.includes('arma') ||
        title.includes('don\'t starve together') || title.includes('dayz') || title.includes('humanitz') ||
        title.includes('insurgency') || title.includes('hell let loose') || title.includes('h1z1') ||
        title.includes('the forest') || title.includes('stranded deep') || title.includes('survive the nights') ||
        title.includes('unturned')) {
        return 'social';
    }
    // PRIORITY 5: Exploratory games (open-world, but not sandbox)
    if (genres.includes('adventure') || genres.includes('metroidvania') || genres.includes('open-world') ||
        title.includes('elden ring') || title.includes('dark souls') || title.includes('sekiro') ||
        title.includes('zelda') || title.includes('assassin\'s creed') || title.includes('horizon') ||
        title.includes('resident evil') || title.includes('batman') || title.includes('spider-man') ||
        title.includes('marvel\'s spider-man') || title.includes('days gone') || title.includes('dying light') ||
        title.includes('middle-earth') || title.includes('shadow of mordor') ||
        title.includes('no man\'s sky') || title.includes('subnautica') || title.includes('elite dangerous') ||
        title.includes('the long dark') || title.includes('green hell')) {
        return 'exploratory';
    }
    // PRIORITY 6: Focused/Strategy games
    if (genres.includes('strategy') || genres.includes('tactical') || genres.includes('puzzle') ||
        title.includes('company of heroes') || title.includes('age of empires') || title.includes('command & conquer') ||
        title.includes('starcraft') || title.includes('warcraft') || title.includes('civilization') ||
        title.includes('total war') || title.includes('stronghold') || title.includes('anno') ||
        title.includes('door kickers') || title.includes('shadow tactics') || title.includes('invisible inc') ||
        title.includes('mark of the ninja') || title.includes('hitman') || title.includes('splinter cell')) {
        return 'focused';
    }
    // PRIORITY 7: Energetic games
    if (genres.includes('action') || genres.includes('shooter') ||
        title.includes('doom') || title.includes('quake') || title.includes('serious sam') ||
        title.includes('ultrakill') || title.includes('painkiller') || title.includes('wolfenstein') ||
        title.includes('resident evil') || title.includes('dying light') || title.includes('dead island') ||
        title.includes('doom') || title.includes('quake') || title.includes('serioussam') ||
        title.includes('ultrakill') || title.includes('painkiller') || title.includes('wolfenstein')) {
        return 'energetic';
    }
    // PRIORITY 8: Chill games (fallback)
    if (genres.includes('casual') || genres.includes('puzzle') || genres.includes('sports') ||
        title.includes('stardew valley') || title.includes('animal crossing') || title.includes('simcity') ||
        title.includes('the sims') || title.includes('cities: skylines') || title.includes('powerwash') ||
        title.includes('unpacking') || title.includes('a short hike') || title.includes('flower') ||
        title.includes('pga tour') || title.includes('snooker') || title.includes('wwe 2k') ||
        title.includes('efootball') || title.includes('fifa') || title.includes('nba')) {
        return 'chill';
    }
    return null; // No mood could be derived
}
/**
 * Auto-assign features to games based on title (temporary until proper data source)
 * This populates the moods array with feature data that deriveMoodFromGame can use
 */
function autoAssignFeatures(game) {
    const title = game.title.toLowerCase();
    const features = [...(game.moods || [])];
    // Multiplayer features
    if (title.includes('left 4 dead') || title.includes('rocket league') || title.includes('apex legends') ||
        title.includes('helldivers') || title.includes('rust') || title.includes('valheim') ||
        title.includes('squad') || title.includes('arma') || title.includes('pubg') ||
        title.includes('rainbow six') || title.includes('battlebit') || title.includes('crab game') ||
        title.includes('don\'t starve together') || title.includes('dayz') || title.includes('humanitz') ||
        title.includes('insurgency') || title.includes('hell let loose') || title.includes('h1z1') ||
        title.includes('z1 battle royale') || title.includes('the forest') || title.includes('stranded deep') ||
        title.includes('survive the nights') || title.includes('project zomboid') || title.includes('unturned')) {
        features.push('multiplayer', 'online');
    }
    // Competitive features
    if (title.includes('apex legends') || title.includes('pubg') || title.includes('rainbow six') ||
        title.includes('battlebit') || title.includes('rust') || title.includes('counter-strike') ||
        title.includes('valorant') || title.includes('overwatch') || title.includes('crab game') ||
        title.includes('z1 battle royale') || title.includes('efootball') || title.includes('wwe 2k')) {
        features.push('competitive');
    }
    // Co-op features
    if (title.includes('left 4 dead') || title.includes('helldivers') || title.includes('don\'t starve together') ||
        title.includes('valheim') || title.includes('rust') || title.includes('project zomboid')) {
        features.push('coop');
    }
    return {
        ...game,
        moods: [...new Set(features)]
    };
}
