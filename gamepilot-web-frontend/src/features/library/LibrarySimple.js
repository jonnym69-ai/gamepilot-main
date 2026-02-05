"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrarySimple = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const ToastProvider_1 = require("../../components/ui/ToastProvider");
const launchGame_1 = require("../../utils/launchGame");
const GameCard_1 = require("./components/GameCard");
const VirtualizedGameList_1 = require("../../components/VirtualizedGameList");
const AddGameModal_1 = require("./components/AddGameModal");
const EditGameModal_1 = require("./components/EditGameModal");
const DeleteGameModal_1 = require("./components/DeleteGameModal");
const SteamImportModal_1 = require("./components/SteamImportModal");
const Loading_1 = require("../../components/Loading");
const EmptyLibraryState_1 = require("../../components/EmptyLibraryState");
const useDebounce_1 = require("../../hooks/useDebounce");
const static_data_1 = require("@gamepilot/static-data");
const SimpleMoodSelector_1 = require("../../components/SimpleMoodSelector");
// NEW: Import contextual engine
const contextualEngine_1 = require("../../utils/contextualEngine");
// NEW: Import analytics
const analytics_1 = require("../../utils/analytics");
const useNewMoodRecommendations_1 = require("../../hooks/useNewMoodRecommendations");
const persona_1 = require("../../hooks/persona");
const WhatToPlayNow_1 = require("../../components/WhatToPlayNow");
const moodFilterSystem_1 = require("../../utils/moodFilterSystem");
const moodMapping_1 = require("../../utils/moodMapping");
const LibrarySimple = () => {
    const { games, isLoading, actions } = (0, useLibraryStore_1.useLibraryStore)();
    const { showSuccess, showError } = (0, ToastProvider_1.useToast)();
    // User preference for virtual scrolling (default: off for better UX)
    const [useVirtualScrolling, setUseVirtualScrolling] = (0, react_1.useState)(false);
    // Get persona for library context
    const persona = (0, persona_1.useLibraryPersona)();
    // Mood System State
    const [showMoodSelector, setShowMoodSelector] = (0, react_1.useState)(false);
    const [viewMode, setViewMode] = (0, react_1.useState)('all');
    // NEW: What To Play state
    const [showWhatToPlay, setShowWhatToPlay] = (0, react_1.useState)(false);
    const { primaryMood, secondaryMood, intensity, recommendations: moodRecommendations, isLoading: moodRecommendationsLoading, error: moodRecommendationsError, selectMood, clearMood, setIntensity, hasRecommendations: hasMoodRecommendations } = (0, useNewMoodRecommendations_1.useNewMoodRecommendations)({
        games: games || [],
        onRecommendationsChange: (recs) => {
            console.log('Library mood recommendations updated:', recs.length);
        }
    });
    const handleMoodSelect = (primaryMood, secondaryMood) => {
        selectMood(primaryMood, secondaryMood);
        setViewMode('mood');
        setShowMoodSelector(false);
    };
    // Computed mood info objects for display
    const primaryMoodInfo = primaryMood ? static_data_1.MOODS.find(m => m.id === primaryMood) : undefined;
    const secondaryMoodInfo = secondaryMood ? static_data_1.MOODS.find(m => m.id === secondaryMood) : undefined;
    // Basic state
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const debouncedSearchTerm = (0, useDebounce_1.useDebounce)(searchTerm, 300);
    const [selectedGenre, setSelectedGenre] = (0, react_1.useState)('all');
    const [selectedSort, setSelectedSort] = (0, react_1.useState)('title-asc');
    // EXPERIMENTAL: Multi-mood state
    const [selectedMoods, setSelectedMoods] = (0, react_1.useState)([]);
    // NEW: Contextual filtering state using centralized types
    const [selectedSessionLength, setSelectedSessionLength] = (0, react_1.useState)(null);
    const [timeOfDay, setTimeOfDay] = (0, react_1.useState)((0, contextualEngine_1.detectTimeOfDay)());
    // Auto-detect time of day using centralized function
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setTimeOfDay((0, contextualEngine_1.detectTimeOfDay)());
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);
    // OLD: Single mood dropdown (commented out for comparison)
    // const [selectedMood, setSelectedMood] = useState('all')
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = (0, react_1.useState)(false);
    const [isEditModalOpen, setIsEditModalOpen] = (0, react_1.useState)(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = (0, react_1.useState)(false);
    const [isSteamImportOpen, setIsSteamImportOpen] = (0, react_1.useState)(false);
    const [selectedGame, setSelectedGame] = (0, react_1.useState)(null);
    // Bulk selection states
    const [selectedGames, setSelectedGames] = (0, react_1.useState)(new Set());
    const [isBulkSelectMode, setIsBulkSelectMode] = (0, react_1.useState)(false);
    // Get available genres from static data and game data
    const availableGenres = (0, react_1.useMemo)(() => {
        // Start with all genres from static data
        const staticGenres = static_data_1.GENRES.map(g => g.name);
        // Add any genres found in games (for backward compatibility)
        const gameGenres = new Set();
        games.forEach(game => {
            if (game.genres) {
                game.genres.forEach(genre => {
                    if (typeof genre === 'string') {
                        gameGenres.add(genre);
                    }
                    else if (genre?.name) {
                        gameGenres.add(genre.name);
                    }
                });
            }
        });
        // Combine and sort, remove duplicates
        const allGenres = new Set([...staticGenres, ...gameGenres]);
        const sortedGenres = Array.from(allGenres).sort();
        return sortedGenres;
    }, [games]);
    // SANITY TEST: Test mood filtering logic with controlled data
    (0, react_1.useMemo)(() => {
        const testGames = [
            { title: 'Test Energetic', moods: ['energetic'], genres: ['Action'], hoursPlayed: 0.5, addedAt: new Date().toISOString() },
            { title: 'Test Chill', moods: ['chill'], genres: ['Puzzle'], hoursPlayed: 3, addedAt: new Date().toISOString() },
            { title: 'Test Creative', moods: ['creative'], genres: ['RPG'], hoursPlayed: 1.5, addedAt: new Date().toISOString() },
            { title: 'Test No Moods', moods: [], genres: ['Strategy'], hoursPlayed: 0, addedAt: new Date().toISOString() },
        ];
        // NEW: Test contextual auto-tagging
        console.log('🧪 CONTEXTUAL TAGGING TEST:');
        testGames.forEach(game => {
            // Simulate the tagging logic
            const playtime = game.hoursPlayed || 0;
            let sessionLength = "medium";
            if (playtime < 0.5)
                sessionLength = "short";
            else if (playtime <= 2)
                sessionLength = "medium";
            else
                sessionLength = "long";
            const times = new Set();
            game.moods.forEach((mood) => {
                if (["chill", "cozy", "casual", "puzzle", "relaxed"].includes(mood))
                    times.add("late-night");
                if (["energetic", "competitive", "focused", "intense"].includes(mood))
                    times.add("morning");
                if (["creative", "immersive", "story-driven", "exploration"].includes(mood)) {
                    times.add("afternoon");
                    times.add("evening");
                }
            });
            if (times.size === 0)
                times.add("evening");
            console.log(`  ${game.title}:`, {
                playtime,
                sessionLength,
                recommendedTimes: Array.from(times),
                moods: game.moods,
                genres: game.genres
            });
        });
        // Test Case A: selectedMoods = [] (all)
        const resultA = testGames.filter(game => {
            const matchesMood = selectedMoods.length === 0 ||
                selectedMoods.every(mood => game.moods.includes(mood));
            return matchesMood;
        });
        console.log('🧪 TEST A (all):', resultA.map(g => g.title));
        // Test Case B: selectedMoods = ['energetic']
        const resultB = testGames.filter(game => {
            const testMoods = ['energetic'];
            const matchesMood = testMoods.length === 0 ||
                testMoods.every(mood => game.moods.includes(mood));
            return matchesMood;
        });
        console.log('🧪 TEST B (energetic):', resultB.map(g => g.title));
        // Test Case C: selectedMoods = ['chill']
        const resultC = testGames.filter(game => {
            const testMoods = ['chill'];
            const matchesMood = testMoods.length === 0 ||
                testMoods.every(mood => game.moods.includes(mood));
            return matchesMood;
        });
        console.log('🧪 TEST C (chill):', resultC.map(g => g.title));
        // Test Case D: selectedMoods = ['creative']
        const resultD = testGames.filter(game => {
            const testMoods = ['creative'];
            const matchesMood = testMoods.length === 0 ||
                testMoods.every(mood => game.moods.includes(mood));
            return matchesMood;
        });
        console.log('🧪 TEST D (creative):', resultD.map(g => g.title));
        // Test Case E: selectedMoods = ['competitive'] (should be empty)
        const resultE = testGames.filter(game => {
            const testMoods = ['competitive'];
            const matchesMood = testMoods.length === 0 ||
                testMoods.every(mood => game.moods.includes(mood));
            return matchesMood;
        });
        console.log('🧪 TEST E (competitive - should be empty):', resultE.map(g => g.title));
        // Test Case F: selectedMoods = ['chill', 'creative'] (multi-mood)
        const resultF = testGames.filter(game => {
            const testMoods = ['chill', 'creative'];
            const matchesMood = testMoods.length === 0 ||
                testMoods.every(mood => game.moods.includes(mood));
            return matchesMood;
        });
        console.log('🧪 TEST F (chill + creative):', resultF.map(g => g.title));
    }, []);
    // Fix incorrect genres with overrides (MOOD LOGIC UNTOUCHED!)
    const fixGenreOverrides = (game) => {
        // Genre overrides for popular games that are incorrectly labeled as "Indie"
        const genreOverrides = {
            // FPS Games
            'DOOM': ['FPS'],
            'Resident Evil': ['Horror', 'FPS'],
            'Dying Light': ['Horror', 'FPS'],
            'Dead Island': ['Horror', 'FPS'],
            'PUBG: BATTLEGROUNDS': ['FPS', 'Multiplayer'],
            'Tom Clancy\'s Rainbow Six': ['FPS', 'Tactical'],
            'BattleBit Remastered': ['FPS', 'Multiplayer'],
            'HELLDIVERS': ['FPS', 'Multiplayer'],
            'Squad': ['FPS', 'Tactical'],
            'Insurgency: Sandstorm': ['FPS', 'Tactical'],
            // RPG Games
            'The Witcher 3': ['RPG', 'Adventure'],
            'Baldur\'s Gate': ['RPG', 'Strategy'],
            'Divinity: Original Sin': ['RPG', 'Strategy'],
            'Fallout': ['RPG', 'Adventure'],
            'STAR WARS Knights of the Old Republic': ['RPG', 'Story'],
            'Kingdom Come: Deliverance': ['RPG', 'Adventure'],
            'Elden Ring': ['RPG', 'Adventure'],
            'DARK SOULS': ['RPG', 'Adventure'],
            'Sekiro': ['RPG', 'Adventure'],
            // Sports Games
            'Rocket League': ['Sports', 'Racing'],
            'WWE 2K': ['Sports'],
            'PGA TOUR': ['Sports'],
            'eFootball': ['Sports'],
            // Racing Games
            'Wreckfest': ['Racing'],
            'Mad Max': ['Racing', 'Adventure'],
            // Strategy Games
            'Company of Heroes': ['Strategy'],
            'Age of Empires': ['Strategy'],
            'Door Kickers': ['Strategy', 'Tactical'],
            'Shadow Tactics': ['Strategy', 'Tactical'],
            // Action/Adventure
            'God of War': ['Action', 'Adventure'],
            'Marvel\'s Spider-Man': ['Action', 'Adventure'],
            'Batman': ['Action', 'Adventure'],
            'Assassin\'s Creed': ['Action', 'Adventure'],
            'Mafia': ['Action', 'Adventure'],
            'METAL GEAR SOLID': ['Action', 'Stealth'],
            // Survival/Crafting
            'Rust': ['Survival', 'Multiplayer'],
            'DayZ': ['Survival', 'Multiplayer'],
            '7 Days to Die': ['Survival'],
            'The Forest': ['Survival', 'Horror'],
            'Project Zomboid': ['Survival', 'Horror'],
            'Don\'t Starve Together': ['Survival', 'Multiplayer'],
            'Stranded Deep': ['Survival'],
            'Green Hell': ['Survival'],
            // Creative/Sandbox
            'Terraria': ['Creative', 'Sandbox'],
            'Starbound': ['Creative', 'Sandbox'],
            'Minecraft': ['Creative', 'Sandbox'],
            'RimWorld': ['Creative', 'Strategy'],
            'Garry\'s Mod': ['Creative', 'Sandbox'],
            // Multiplayer/Social
            'Left 4 Dead 2': ['Multiplayer', 'Co-op'],
            'Apex Legends': ['Multiplayer', 'FPS'],
            'Crab Game': ['Multiplayer'],
            'Valheim': ['Multiplayer', 'Survival'],
            'Pummel Party': ['Multiplayer', 'Party'],
            // Simulation
            'Cities: Skylines': ['Simulation'],
            'Dawn of Man': ['Simulation', 'Strategy'],
            'Kenshi': ['Simulation', 'RPG'],
        };
        // Check if game title matches any override
        const gameTitle = game.title.toLowerCase();
        for (const [title, genres] of Object.entries(genreOverrides)) {
            if (gameTitle.includes(title.toLowerCase())) {
                return {
                    ...game,
                    genres: genres.map(name => ({
                        id: name.toLowerCase().replace(/\s+/g, '-'),
                        name,
                        description: `${name} games`,
                        icon: '🎮',
                        color: 'from-blue-500 to-purple-600',
                        tags: [name.toLowerCase()]
                    }))
                };
            }
        }
        // Return original game if no override matches
        return game;
    };
    // Process games with mood mapping system (single source of truth)
    const processedGames = (0, react_1.useMemo)(() => {
        return games.map(game => {
            // Step 1: Auto-assign features based on title (temporary until proper data source)
            const gameWithFeatures = (0, moodMapping_1.autoAssignFeatures)(game);
            // Step 2: Fix incorrect genres with overrides (MOOD LOGIC UNTOUCHED!)
            const gameWithCorrectGenres = fixGenreOverrides(gameWithFeatures);
            // Step 3: Derive mood using the centralized logic (UNCHANGED!)
            const derivedMood = (0, moodMapping_1.deriveMoodFromGame)(gameWithCorrectGenres);
            // Step 4: Store the derived mood as the primary mood
            return {
                ...gameWithCorrectGenres,
                primaryMood: derivedMood
            };
        });
    }, [games]);
    // EXPERIMENTAL: Multi-mood toggle handler
    const handleMoodToggle = (moodId) => {
        setSelectedMoods(prev => {
            const newMoods = prev.includes(moodId)
                ? prev.filter(m => m !== moodId)
                : [...prev, moodId];
            // NEW: Track mood filter changes
            try {
                (0, analytics_1.trackFilterInteraction)('moods', 'changed', {
                    selectedMoodsCount: newMoods.length,
                    selectedMoods: newMoods
                });
            }
            catch (error) {
                // Fail silently
            }
            return newMoods;
        });
    };
    // Filter and sort games using centralized contextual engine
    const filteredGames = (0, react_1.useMemo)(() => {
        // DEBUG: Log first few games to see their actual data
        if (processedGames.length > 0) {
            console.log('🔍 DEBUG: First 3 games in library:');
            processedGames.slice(0, 3).forEach((game, index) => {
                console.log(`Game ${index + 1}: ${game.title}`);
                console.log(`  Primary Mood: ${game.primaryMood}`);
                console.log(`  Moods: ${JSON.stringify(game.moods)}`);
                console.log(`  Genres: ${JSON.stringify(game.genres?.map(g => g.name))}`);
            });
        }
        // DEBUG: Test mood filtering on first game
        if (processedGames.length > 0 && selectedMoods.length > 0) {
            const testGame = processedGames[0];
            console.log(`🧪 Testing mood filtering on: ${testGame.title}`);
            console.log(`Selected moods: ${selectedMoods}`);
            selectedMoods.forEach(moodId => {
                const moodFilteredGames = (0, moodFilterSystem_1.filterGamesByMood)([testGame], moodId, 1);
                console.log(`  Mood "${moodId}": ${moodFilteredGames.length > 0 ? '✅ MATCH' : '❌ NO MATCH'}`);
            });
        }
        // DEBUG: Test genre filtering
        if (processedGames.length > 0 && selectedGenre !== 'all') {
            const genreFilteredGames = processedGames.filter(game => {
                const matchesGenre = game.genres?.some(genre => {
                    const genreName = typeof genre === 'string' ? genre : genre?.name || '';
                    return genreName.toLowerCase() === selectedGenre.toLowerCase();
                });
                return matchesGenre;
            });
            console.log(`🧪 Found ${genreFilteredGames.length} games for genre "${selectedGenre}"`);
        }
        let filtered = processedGames.filter(game => {
            // Search filter
            const matchesSearch = !debouncedSearchTerm ||
                game.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            // Genre filter
            const matchesGenre = selectedGenre === 'all' ||
                game.genres?.some(genre => {
                    const genreName = typeof genre === 'string' ? genre : genre?.name || '';
                    return genreName.toLowerCase() === selectedGenre.toLowerCase();
                });
            // NEW: Use primary mood for filtering (single source of truth)
            let matchesMood = selectedMoods.length === 0;
            if (selectedMoods.length > 0) {
                // Check if game's primary mood matches any selected moods
                matchesMood = selectedMoods.some(moodId => {
                    const matches = game.primaryMood === moodId;
                    if (matches && game.title.includes('Call of Duty')) {
                        console.log(`🎯 ${game.title} matches mood ${moodId}:`, {
                            gamePrimaryMood: game.primaryMood,
                            gameMoods: game.moods,
                            moodId,
                            matches
                        });
                    }
                    return matches;
                });
            }
            // NEW: Use centralized contextual engine for session and time filtering
            const contextualFilters = {
                selectedMoods,
                selectedSessionLength,
                timeOfDay
            };
            // Get contextual match using the engine
            const contextualMatches = (0, contextualEngine_1.getContextualMatches)([game], contextualFilters, { limit: 1 });
            const matchesContextual = contextualMatches.length > 0;
            return matchesSearch && matchesGenre && matchesMood && matchesContextual;
        });
        // Sort games
        filtered.sort((a, b) => {
            switch (selectedSort) {
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'recently-added':
                    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
                case 'playtime-desc':
                    return (b.hoursPlayed || 0) - (a.hoursPlayed || 0);
                case 'playtime-asc':
                    return (a.hoursPlayed || 0) - (b.hoursPlayed || 0);
                case 'last-played':
                    return new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime();
                case 'release-date-desc':
                    return new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime();
                case 'release-date-asc':
                    return new Date(a.releaseDate || 0).getTime() - new Date(b.releaseDate || 0).getTime();
                case 'genre':
                    const genreA = a.genres?.[0]?.name || '';
                    const genreB = b.genres?.[0]?.name || '';
                    return genreA.localeCompare(genreB);
                default:
                    return 0;
            }
        });
        return filtered;
    }, [processedGames, debouncedSearchTerm, selectedGenre, selectedMoods, selectedSort, selectedSessionLength, timeOfDay]);
    // Game handlers
    const handleGameSelect = (game) => {
        if (isBulkSelectMode) {
            handleGameSelectToggle(game.id);
        }
        else {
            setSelectedGame(game);
            setIsEditModalOpen(true);
        }
    };
    const handleGameLaunch = async (game) => {
        try {
            if (game.appId) {
                await (0, launchGame_1.launchGame)(game.appId);
                showSuccess(`Launching ${game.title}...`);
            }
            else {
                showError(`No launch ID available for ${game.title}`);
            }
        }
        catch (error) {
            showError(`Failed to launch ${game.title}`);
            console.error('Launch error:', error);
        }
    };
    const handleGameDelete = (game) => {
        setSelectedGame(game);
        setIsDeleteModalOpen(true);
    };
    // Bulk selection handlers
    const handleGameSelectToggle = (gameId) => {
        const newSelected = new Set(selectedGames);
        if (newSelected.has(gameId)) {
            newSelected.delete(gameId);
        }
        else {
            newSelected.add(gameId);
        }
        setSelectedGames(newSelected);
    };
    const handleSelectAll = () => {
        if (selectedGames.size === filteredGames.length) {
            setSelectedGames(new Set());
        }
        else {
            setSelectedGames(new Set(filteredGames.map(game => game.id)));
        }
    };
    const handleBulkDelete = () => {
        if (selectedGames.size === 0)
            return;
        if (confirm(`Are you sure you want to delete ${selectedGames.size} game(s)?`)) {
            actions.deleteGames(Array.from(selectedGames));
            setSelectedGames(new Set());
            setIsBulkSelectMode(false);
            showSuccess(`Deleted ${selectedGames.size} game(s)`);
        }
    };
    // Modal handlers
    const handleAddGame = (gameData) => {
        actions.addGame(gameData);
        setIsAddModalOpen(false);
        showSuccess('Game added successfully!');
    };
    const handleEditGame = (gameId, updates) => {
        actions.updateGame(gameId, updates);
        setIsEditModalOpen(false);
        setSelectedGame(null);
        showSuccess('Game updated successfully!');
    };
    const handleDeleteGame = () => {
        if (selectedGame) {
            actions.deleteGame(selectedGame.id);
            setIsDeleteModalOpen(false);
            setSelectedGame(null);
            showSuccess('Game deleted successfully!');
        }
    };
    const handleSteamImport = (importedGames) => {
        setIsSteamImportOpen(false);
        showSuccess(`Successfully imported ${importedGames.length} games from Steam!`);
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-screen", children: (0, jsx_runtime_1.jsx)(Loading_1.Loading, { size: "lg" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-6 py-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-white mb-2", children: "Game Library" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400", children: [games.length, " ", games.length === 1 ? 'game' : 'games', " in your library"] }), persona?.traits?.archetypeId && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-purple-300 text-sm font-medium", children: ["\uD83C\uDFAE ", persona.traits.archetypeId] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-xs", children: [Math.round((persona.confidence || 0) * 100), "% match"] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsSteamImportOpen(true), className: "px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAE" }), "Import Steam"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowMoodSelector(true), className: "px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAD" }), primaryMoodInfo ? primaryMoodInfo.name : 'Select Mood'] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsAddModalOpen(true), className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors", children: "Add Game" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowWhatToPlay(true), className: "px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAF" }), "I'm Not Sure What To Play"] }), games.length >= 30 && ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setUseVirtualScrolling(!useVirtualScrolling), className: `px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${useVirtualScrolling
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'}`, title: `Virtual scrolling ${useVirtualScrolling ? 'ON' : 'OFF'} - Better performance for large libraries`, children: [(0, jsx_runtime_1.jsx)("span", { children: useVirtualScrolling ? '⚡' : '📱' }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: useVirtualScrolling ? 'Virtual ON' : 'Virtual OFF' })] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-800 rounded-lg p-6 mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Search Games" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by title...", className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Moods (Multi-Select)" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: static_data_1.MOODS.map(mood => {
                                        const isSelected = selectedMoods.includes(mood.id);
                                        return ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleMoodToggle(mood.id), className: `px-3 py-1 rounded-full text-sm font-medium transition-all ${isSelected
                                                ? 'bg-purple-600 text-white border-purple-600'
                                                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'} border`, children: mood.name }, mood.id));
                                    }) }), selectedMoods.length > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedMoods([]), className: "mt-2 text-xs text-gray-400 hover:text-white transition-colors", children: "Clear all moods" })), (0, jsx_runtime_1.jsxs)("div", { className: "session-length-filter mt-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "block text-sm font-medium text-gray-300 mb-2", children: "How long do you have?" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [["short", "medium", "long"].map(length => ((0, jsx_runtime_1.jsxs)("button", { className: `px-3 py-1 rounded-lg text-sm transition-all ${selectedSessionLength === length
                                                        ? "bg-blue-600 text-white border border-blue-500"
                                                        : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"}`, onClick: () => {
                                                        setSelectedSessionLength(length);
                                                        // NEW: Track session length filter changes
                                                        try {
                                                            (0, analytics_1.trackFilterInteraction)('session_length', 'changed', {
                                                                selectedSessionLength: length
                                                            });
                                                        }
                                                        catch (error) {
                                                            // Fail silently
                                                        }
                                                    }, children: [length === "short" && "15–30 min", length === "medium" && "1–2 hours", length === "long" && "2+ hours"] }, length))), selectedSessionLength && ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                                        setSelectedSessionLength(null);
                                                        // NEW: Track session length filter cleared
                                                        try {
                                                            (0, analytics_1.trackFilterInteraction)('session_length', 'cleared', {
                                                                selectedSessionLength: undefined
                                                            });
                                                        }
                                                        catch (error) {
                                                            // Fail silently
                                                        }
                                                    }, className: "px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition-colors", children: "Clear" }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "time-of-day-display mt-3", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-400", children: ["Current time: ", (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: timeOfDay })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Genre" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedGenre, onChange: (e) => setSelectedGenre(e.target.value), className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none", "aria-label": "Filter by genre", title: "Filter by genre", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Genres" }), availableGenres.map(genre => ((0, jsx_runtime_1.jsx)("option", { value: genre, children: genre }, genre)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Sort By" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedSort, onChange: (e) => setSelectedSort(e.target.value), className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none", "aria-label": "Sort games", title: "Sort games", children: [(0, jsx_runtime_1.jsx)("option", { value: "title-asc", children: "Title (A-Z)" }), (0, jsx_runtime_1.jsx)("option", { value: "title-desc", children: "Title (Z-A)" }), (0, jsx_runtime_1.jsx)("option", { value: "recently-added", children: "Recently Added" }), (0, jsx_runtime_1.jsx)("option", { value: "playtime-desc", children: "Most Played" }), (0, jsx_runtime_1.jsx)("option", { value: "playtime-asc", children: "Least Played" }), (0, jsx_runtime_1.jsx)("option", { value: "last-played", children: "Last Played" }), (0, jsx_runtime_1.jsx)("option", { value: "release-date-desc", children: "Newest First" }), (0, jsx_runtime_1.jsx)("option", { value: "release-date-asc", children: "Oldest First" }), (0, jsx_runtime_1.jsx)("option", { value: "genre", children: "Genre (A-Z)" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                    setSearchTerm('');
                                    setSelectedGenre('all');
                                    setSelectedMoods([]);
                                    setSelectedSessionLength(null);
                                    setSelectedSort('title-asc');
                                }, className: "w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors", children: "Clear Filters" }) })] }) }), hasMoodRecommendations && primaryMoodInfo && selectedMoods.length === 0 && selectedGenre === 'all' && !debouncedSearchTerm && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white mb-2 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: primaryMoodInfo.emoji }), primaryMoodInfo.name, " Recommendations", secondaryMoodInfo && ((0, jsx_runtime_1.jsxs)("span", { className: "text-purple-400", children: ["+ ", secondaryMoodInfo.emoji, " ", secondaryMoodInfo.name] })), persona && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs bg-purple-600/50 px-2 py-1 rounded-full ml-2", children: [persona.traits?.archetypeId, " Match"] }))] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300 text-sm", children: [moodRecommendations.length, " games matching your current mood", persona && ` • Personalized for ${persona.traits?.archetypeId} playstyle`] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => clearMood(), className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors", children: "Clear Mood" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: moodRecommendations.slice(0, 8).map(game => ((0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: game, onSelect: () => handleGameSelect(game), onLaunch: () => handleGameLaunch(game), onDelete: () => handleGameDelete(game), isSelectable: isBulkSelectMode, isSelected: selectedGames.has(game.id) }, game.id))) })] })), persona && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-bold text-lg", children: persona.traits?.archetypeId || 'Gaming Persona' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm", children: "Your personalized gaming profile" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400 mb-1", children: "Confidence" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-bold text-purple-400", children: [Math.round((persona.confidence || 0) * 100), "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Archetype" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium capitalize", children: persona.traits?.archetypeId || 'Balanced' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Intensity" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: persona.traits?.intensity || 'Medium' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Pacing" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: persona.traits?.pacing || 'Flow' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Social Style" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: persona.traits?.socialStyle || 'Solo' })] })] })] })), showMoodSelector && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Select Your Mood" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowMoodSelector(false), className: "text-gray-400 hover:text-white transition-colors", title: "Close mood selector", "aria-label": "Close mood selector", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)(SimpleMoodSelector_1.SimpleMoodSelector, { onMoodChange: handleMoodSelect }) })] }) })), isBulkSelectMode && ((0, jsx_runtime_1.jsx)("div", { className: "bg-gray-800 rounded-lg p-4 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-white", children: [selectedGames.size, " game", selectedGames.size !== 1 ? 's' : '', " selected"] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSelectAll, className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors", children: selectedGames.size === filteredGames.length ? 'Deselect All' : 'Select All' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleBulkDelete, disabled: selectedGames.size === 0, className: "px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors", children: "Delete Selected" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                        setIsBulkSelectMode(false);
                                        setSelectedGames(new Set());
                                    }, className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors", children: "Cancel" })] })] }) })), games.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyLibraryState_1.EmptyLibraryState, { isSearchResult: false, onImportSteam: () => { } })) : filteredGames.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-lg", children: "No games found matching your filters" }) })) : (useVirtualScrolling ? ((0, jsx_runtime_1.jsx)(VirtualizedGameList_1.VirtualizedGameList, { games: filteredGames, onGameLaunch: handleGameLaunch, onGameEdit: (gameId, updates) => handleGameEdit(gameId, updates), onGameDelete: handleGameDelete, selectedGames: selectedGames, onGameSelectToggle: handleGameSelectToggle, isBulkSelectMode: isBulkSelectMode })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6", children: filteredGames.map(game => ((0, jsx_runtime_1.jsx)("div", { className: "group", children: (0, jsx_runtime_1.jsx)("div", { className: "transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50 shadow-lg group-hover:shadow-xl group-hover:border-gray-600/50 transition-all duration-300", children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: game, onSelect: () => handleGameSelect(game), onLaunch: () => handleGameLaunch(game), onEdit: () => handleGameSelect(game), onDelete: () => handleGameDelete(game), isSelectable: isBulkSelectMode, isSelected: selectedGames.has(game.id) }) }) }) }, game.id))) }))), games.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-6 right-6", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                        if (isBulkSelectMode) {
                            setIsBulkSelectMode(false);
                            setSelectedGames(new Set());
                        }
                        else {
                            setIsBulkSelectMode(true);
                        }
                    }, className: `px-4 py-3 rounded-lg font-medium transition-colors ${isBulkSelectMode
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`, children: isBulkSelectMode ? 'Exit Selection' : 'Select Games' }) })), (0, jsx_runtime_1.jsx)(AddGameModal_1.AddGameModal, { isOpen: isAddModalOpen, onClose: () => setIsAddModalOpen(false), onAddGame: handleAddGame }), (0, jsx_runtime_1.jsx)(EditGameModal_1.EditGameModal, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), onUpdateGame: handleEditGame, game: selectedGame }), (0, jsx_runtime_1.jsx)(DeleteGameModal_1.DeleteGameModal, { isOpen: isDeleteModalOpen, onClose: () => setIsDeleteModalOpen(false), onDeleteGame: handleDeleteGame, game: selectedGame }), (0, jsx_runtime_1.jsx)(SteamImportModal_1.SteamImportModal, { isOpen: isSteamImportOpen, onClose: () => setIsSteamImportOpen(false), onImportGames: handleSteamImport }), showWhatToPlay && games && games.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-4xl", children: (0, jsx_runtime_1.jsx)(WhatToPlayNow_1.WhatToPlayNow, { onClose: () => setShowWhatToPlay(false) }) }) }))] }));
};
exports.LibrarySimple = LibrarySimple;
