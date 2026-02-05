"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTestEnhancedMoodSystem = useTestEnhancedMoodSystem;
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
const identity_engine_1 = require("@gamepilot/identity-engine");
function useTestEnhancedMoodSystem() {
    const [state, setState] = (0, react_1.useState)({
        intensity: 0.8,
        recommendations: [],
        isLoading: false
    });
    // Mock game data for testing
    const mockGames = [
        {
            id: 'game-1',
            title: 'Stardew Valley',
            coverImage: '/covers/stardew-valley.jpg',
            genres: [{ id: 'casual', name: 'Casual', color: 'green', subgenres: [] }, { id: 'simulation', name: 'Simulation', color: 'blue', subgenres: [] }],
            subgenres: [],
            platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
            emotionalTags: [],
            playStatus: 'playing',
            addedAt: new Date(),
            isFavorite: false,
            releaseYear: 2016,
            tags: ['relaxing', 'creative', 'building'],
            hoursPlayed: 45
        },
        {
            id: 'game-2',
            title: 'Counter-Strike 2',
            coverImage: '/covers/cs2.jpg',
            genres: [{ id: 'action', name: 'Action', color: 'red', subgenres: [] }, { id: 'multiplayer', name: 'Multiplayer', color: 'blue', subgenres: [] }],
            subgenres: [],
            platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
            emotionalTags: [],
            playStatus: 'playing',
            addedAt: new Date(),
            isFavorite: false,
            releaseYear: 2023,
            tags: ['competitive', 'intense', 'team-based'],
            hoursPlayed: 120
        },
        {
            id: 'game-3',
            title: 'Civilization VI',
            coverImage: '/covers/civ6.jpg',
            genres: [{ id: 'strategy', name: 'Strategy', color: 'purple', subgenres: [] }],
            subgenres: [],
            platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }],
            emotionalTags: [],
            playStatus: 'playing',
            addedAt: new Date(),
            isFavorite: false,
            releaseYear: 2016,
            tags: ['strategic', 'complex', 'challenging'],
            hoursPlayed: 200
        },
        {
            id: 'game-4',
            title: 'The Witcher 3',
            coverImage: '/covers/witcher3.jpg',
            genres: [{ id: 'rpg', name: 'RPG', color: 'blue', subgenres: [] }, { id: 'adventure', name: 'Adventure', color: 'green', subgenres: [] }],
            subgenres: [],
            platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }, { id: 'console', name: 'Console', code: 'console', isConnected: false }],
            emotionalTags: [],
            playStatus: 'playing',
            addedAt: new Date(),
            isFavorite: false,
            releaseYear: 2015,
            tags: ['story-driven', 'immersive', 'exploration'],
            hoursPlayed: 80
        },
        {
            id: 'game-5',
            title: 'Minecraft',
            coverImage: '/covers/minecraft.jpg',
            genres: [{ id: 'creative', name: 'Creative', color: 'orange', subgenres: [] }, { id: 'adventure', name: 'Adventure', color: 'green', subgenres: [] }],
            subgenres: [],
            platforms: [{ id: 'pc', name: 'PC', code: 'pc', isConnected: false }, { id: 'console', name: 'Console', code: 'console', isConnected: false }, { id: 'mobile', name: 'Mobile', code: 'mobile', isConnected: false }],
            emotionalTags: [],
            playStatus: 'playing',
            addedAt: new Date(),
            isFavorite: false,
            releaseYear: 2011,
            tags: ['creative', 'building', 'exploration'],
            hoursPlayed: 150
        }
    ];
    const selectMood = (0, react_1.useCallback)((primaryMood, secondaryMood) => {
        setState(prev => ({ ...prev, primaryMood, secondaryMood, isLoading: true, error: undefined }));
        try {
            // Create mood context
            const moodContext = {
                primaryMood,
                secondaryMood,
                intensity: state.intensity,
                userGenreAffinity: {
                    'casual': 0.8,
                    'strategy': 0.7,
                    'rpg': 0.6,
                    'action': 0.5
                },
                timeAvailable: 60,
                socialContext: 'any',
                platform: 'pc'
            };
            // Get mood-filtered recommendations
            const moodResults = identity_engine_1.EnhancedMoodFilter.filterByMood(mockGames, moodContext);
            setState(prev => ({
                ...prev,
                recommendations: moodResults.games.map(game => ({
                    ...game,
                    moodScore: moodResults.scores[game.id],
                    reasoning: moodResults.reasoning[game.id],
                    moodInfluence: moodResults.moodInfluence[game.id]
                })),
                isLoading: false
            }));
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                isLoading: false
            }));
        }
    }, [state.intensity, mockGames]);
    const setIntensity = (0, react_1.useCallback)((intensity) => {
        setState(prev => ({ ...prev, intensity }));
        // Re-run recommendations if mood is selected
        if (state.primaryMood) {
            selectMood(state.primaryMood, state.secondaryMood);
        }
    }, [state.primaryMood, state.secondaryMood, selectMood]);
    const clearMood = (0, react_1.useCallback)(() => {
        setState({
            intensity: 0.8,
            recommendations: [],
            isLoading: false
        });
    }, []);
    // Get mood info for display
    const getPrimaryMoodInfo = () => {
        return state.primaryMood ? static_data_1.ENHANCED_MOODS.find(m => m.id === state.primaryMood) : undefined;
    };
    const getSecondaryMoodInfo = () => {
        return state.secondaryMood ? static_data_1.ENHANCED_MOODS.find(m => m.id === state.secondaryMood) : undefined;
    };
    // Test specific mood combinations
    const testPresetCombination = (0, react_1.useCallback)((preset) => {
        const presets = {
            'relaxed-creative': { primary: 'low-energy', secondary: 'creative' },
            'intense-competitive': { primary: 'high-energy', secondary: 'competitive' },
            'strategic-immersive': { primary: 'deep-focus', secondary: 'immersive' },
            'social-energetic': { primary: 'social', secondary: 'high-energy' }
        };
        const combination = presets[preset];
        if (combination) {
            selectMood(combination.primary, combination.secondary);
        }
    }, [selectMood]);
    return {
        // State
        ...state,
        // Actions
        selectMood,
        setIntensity,
        clearMood,
        testPresetCombination,
        // Computed
        primaryMoodInfo: getPrimaryMoodInfo(),
        secondaryMoodInfo: getSecondaryMoodInfo(),
        availableMoods: static_data_1.ENHANCED_MOODS,
        totalGames: mockGames.length
    };
}
// Initialize test function
if (typeof window !== 'undefined') {
    window.testEnhancedMoodSystem = () => {
        console.log('🧪 Enhanced Mood System Test Initialized');
        console.log('Available commands:');
        console.log('- moodSystemTest.selectMood("low-energy", "creative")');
        console.log('- moodSystemTest.testPresetCombination("relaxed-creative")');
        console.log('- moodSystemTest.setIntensity(0.9)');
        console.log('- moodSystemTest.clearMood()');
        console.log('- moodSystemTest.primaryMoodInfo');
        console.log('- moodSystemTest.recommendations');
    };
}
