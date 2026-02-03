import React, { useState, useMemo, useEffect } from 'react'
import { useLibraryStore } from "../../stores/useLibraryStore"
import { useToast } from "../../components/ui/ToastProvider"
import { launchGame } from "../../utils/launchGame"
import { GameCard } from './components/GameCard'
import { VirtualizedGameList } from '../../components/VirtualizedGameList'
import { AddGameModal } from './components/AddGameModal'
import { EditGameModal } from './components/EditGameModal'
import { DeleteGameModal } from './components/DeleteGameModal'
import { SteamImportModal } from './components/SteamImportModal'
import { Loading } from '../../components/Loading'
import { EmptyLibraryState } from '../../components/EmptyLibraryState'
import { useDebounce } from '../../hooks/useDebounce'
import type { Game } from '@gamepilot/types'
import { MOODS, GENRES, type MoodId } from '@gamepilot/static-data'
import { SimpleMoodSelector } from '../../components/SimpleMoodSelector'
// NEW: Import contextual engine
import { 
  detectTimeOfDay, 
  getContextualMatches, 
  type ContextualFilters,
  type SessionLength,
  type TimeOfDay
} from '../../utils/contextualEngine';

// NEW: Import analytics
import { 
  trackRecommendationInteraction,
  trackFilterInteraction,
  trackContextualInsights
} from '../../utils/analytics';
import { useNewMoodRecommendations } from '../../hooks/useNewMoodRecommendations'
import { useLibraryPersona } from '../../hooks/persona'
import { WhatToPlayNow } from '../../components/WhatToPlayNow'
import { filterGamesByMood } from '../../utils/moodFilterSystem'
import { deriveMoodFromGame, autoAssignFeatures } from '../../utils/moodMapping'

export const LibrarySimple: React.FC = () => {
  const { games, isLoading, actions } = useLibraryStore()
  const { showSuccess, showError } = useToast()
  
  // User preference for virtual scrolling (default: off for better UX)
  const [useVirtualScrolling, setUseVirtualScrolling] = useState(false)
  
  // Get persona for library context
  const persona = useLibraryPersona()
  
  // Mood System State
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'mood'>('all')
  
  // NEW: What To Play state
  const [showWhatToPlay, setShowWhatToPlay] = useState(false)
  const {
    primaryMood,
    secondaryMood,
    intensity,
    recommendations: moodRecommendations,
    isLoading: moodRecommendationsLoading,
    error: moodRecommendationsError,
    selectMood,
    clearMood,
    setIntensity,
    hasRecommendations: hasMoodRecommendations
  } = useNewMoodRecommendations({
    games: games || [],
    onRecommendationsChange: (recs) => {
      console.log('Library mood recommendations updated:', recs.length);
    }
  });

  const handleMoodSelect = (primaryMood: string, secondaryMood?: string) => {
    selectMood(primaryMood, secondaryMood)
    setViewMode('mood')
    setShowMoodSelector(false)
  }

  // Computed mood info objects for display
  const primaryMoodInfo = primaryMood ? MOODS.find(m => m.id === primaryMood) : undefined
  const secondaryMoodInfo = secondaryMood ? MOODS.find(m => m.id === secondaryMood) : undefined
  // Basic state
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedSort, setSelectedSort] = useState('title-asc')
  
  // EXPERIMENTAL: Multi-mood state
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  // NEW: Contextual filtering state using centralized types
  const [selectedSessionLength, setSelectedSessionLength] = useState<SessionLength | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(detectTimeOfDay());

  // Auto-detect time of day using centralized function
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(detectTimeOfDay());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  
  // OLD: Single mood dropdown (commented out for comparison)
  // const [selectedMood, setSelectedMood] = useState('all')
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSteamImportOpen, setIsSteamImportOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  
  // Bulk selection states
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set())
  const [isBulkSelectMode, setIsBulkSelectMode] = useState(false)

  // Get available genres from static data and game data
  const availableGenres = useMemo(() => {
    // Start with all genres from static data
    const staticGenres = GENRES.map(g => g.name)
    
    // Add any genres found in games (for backward compatibility)
    const gameGenres = new Set<string>()
    games.forEach(game => {
      if (game.genres) {
        game.genres.forEach(genre => {
          if (typeof genre === 'string') {
            gameGenres.add(genre)
          } else if (genre?.name) {
            gameGenres.add(genre.name)
          }
        })
      }
    })
    
    // Combine and sort, remove duplicates
    const allGenres = new Set([...staticGenres, ...gameGenres])
    const sortedGenres = Array.from(allGenres).sort()
    
    return sortedGenres
  }, [games])

  // SANITY TEST: Test mood filtering logic with controlled data
  useMemo(() => {
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
      if (playtime < 0.5) sessionLength = "short";
      else if (playtime <= 2) sessionLength = "medium";
      else sessionLength = "long";
      
      const times = new Set<string>();
      game.moods.forEach((mood: string) => {
        if (["chill", "cozy", "casual", "puzzle", "relaxed"].includes(mood)) times.add("late-night");
        if (["energetic", "competitive", "focused", "intense"].includes(mood)) times.add("morning");
        if (["creative", "immersive", "story-driven", "exploration"].includes(mood)) {
          times.add("afternoon");
          times.add("evening");
        }
      });
      if (times.size === 0) times.add("evening");
      
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
        selectedMoods.every(mood => game.moods.includes(mood))
      return matchesMood
    })
    console.log('🧪 TEST A (all):', resultA.map(g => g.title))

    // Test Case B: selectedMoods = ['energetic']
    const resultB = testGames.filter(game => {
      const testMoods = ['energetic']
      const matchesMood = testMoods.length === 0 || 
        testMoods.every(mood => game.moods.includes(mood))
      return matchesMood
    })
    console.log('🧪 TEST B (energetic):', resultB.map(g => g.title))

    // Test Case C: selectedMoods = ['chill']
    const resultC = testGames.filter(game => {
      const testMoods = ['chill']
      const matchesMood = testMoods.length === 0 || 
        testMoods.every(mood => game.moods.includes(mood))
      return matchesMood
    })
    console.log('🧪 TEST C (chill):', resultC.map(g => g.title))

    // Test Case D: selectedMoods = ['creative']
    const resultD = testGames.filter(game => {
      const testMoods = ['creative']
      const matchesMood = testMoods.length === 0 || 
        testMoods.every(mood => game.moods.includes(mood))
      return matchesMood
    })
    console.log('🧪 TEST D (creative):', resultD.map(g => g.title))

    // Test Case E: selectedMoods = ['competitive'] (should be empty)
    const resultE = testGames.filter(game => {
      const testMoods = ['competitive']
      const matchesMood = testMoods.length === 0 || 
        testMoods.every(mood => game.moods.includes(mood))
      return matchesMood
    })
    console.log('🧪 TEST E (competitive - should be empty):', resultE.map(g => g.title))

    // Test Case F: selectedMoods = ['chill', 'creative'] (multi-mood)
    const resultF = testGames.filter(game => {
      const testMoods = ['chill', 'creative']
      const matchesMood = testMoods.length === 0 || 
        testMoods.every(mood => game.moods.includes(mood))
      return matchesMood
    })
    console.log('🧪 TEST F (chill + creative):', resultF.map(g => g.title))
  }, [])

  // Fix incorrect genres with overrides (MOOD LOGIC UNTOUCHED!)
  const fixGenreOverrides = (game: Game) => {
    // Genre overrides for popular games that are incorrectly labeled as "Indie"
    const genreOverrides: Record<string, string[]> = {
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
    }
    
    // Check if game title matches any override
    const gameTitle = game.title.toLowerCase()
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
        }
      }
    }
    
    // Return original game if no override matches
    return game
  }

  // Process games with mood mapping system (single source of truth)
  const processedGames = useMemo(() => {
    return games.map(game => {
      // Step 1: Auto-assign features based on title (temporary until proper data source)
      const gameWithFeatures = autoAssignFeatures(game)
      
      // Step 2: Fix incorrect genres with overrides (MOOD LOGIC UNTOUCHED!)
      const gameWithCorrectGenres = fixGenreOverrides(gameWithFeatures)
      
      // Step 3: Derive mood using the centralized logic (UNCHANGED!)
      const derivedMood = deriveMoodFromGame(gameWithCorrectGenres)
      
      // Step 4: Store the derived mood as the primary mood
      return {
        ...gameWithCorrectGenres,
        primaryMood: derivedMood
      }
    })
  }, [games])

  // EXPERIMENTAL: Multi-mood toggle handler
  const handleMoodToggle = (moodId: string) => {
    setSelectedMoods(prev => {
      const newMoods = prev.includes(moodId) 
        ? prev.filter(m => m !== moodId)
        : [...prev, moodId];
      
      // NEW: Track mood filter changes
      try {
        trackFilterInteraction('moods', 'changed', {
          selectedMoodsCount: newMoods.length,
          selectedMoods: newMoods
        });
      } catch (error) {
        // Fail silently
      }
      
      return newMoods;
    });
  }

  // Filter and sort games using centralized contextual engine
  const filteredGames = useMemo(() => {
    // DEBUG: Log first few games to see their actual data
    if (processedGames.length > 0) {
      console.log('🔍 DEBUG: First 3 games in library:')
      processedGames.slice(0, 3).forEach((game, index) => {
        console.log(`Game ${index + 1}: ${game.title}`)
        console.log(`  Primary Mood: ${game.primaryMood}`)
        console.log(`  Moods: ${JSON.stringify(game.moods)}`)
        console.log(`  Genres: ${JSON.stringify(game.genres?.map(g => g.name))}`)
      })
    }

    // DEBUG: Test mood filtering on first game
    if (processedGames.length > 0 && selectedMoods.length > 0) {
      const testGame = processedGames[0]
      console.log(`🧪 Testing mood filtering on: ${testGame.title}`)
      console.log(`Selected moods: ${selectedMoods}`)
      
      selectedMoods.forEach(moodId => {
        const moodFilteredGames = filterGamesByMood([testGame], moodId as any, 1)
        console.log(`  Mood "${moodId}": ${moodFilteredGames.length > 0 ? '✅ MATCH' : '❌ NO MATCH'}`)
      })
    }

    // DEBUG: Test genre filtering
    if (processedGames.length > 0 && selectedGenre !== 'all') {
      const genreFilteredGames = processedGames.filter(game => {
        const matchesGenre = game.genres?.some(genre => {
          const genreName = typeof genre === 'string' ? genre : genre?.name || ''
          return genreName.toLowerCase() === selectedGenre.toLowerCase()
        })
        return matchesGenre
      })
      console.log(`🧪 Found ${genreFilteredGames.length} games for genre "${selectedGenre}"`)
    }

    let filtered = processedGames.filter(game => {
      // Search filter
      const matchesSearch = !debouncedSearchTerm || 
        game.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      // Genre filter
      const matchesGenre = selectedGenre === 'all' || 
        game.genres?.some(genre => {
          const genreName = typeof genre === 'string' ? genre : genre?.name || ''
          return genreName.toLowerCase() === selectedGenre.toLowerCase()
        })

      // NEW: Use primary mood for filtering (single source of truth)
      let matchesMood = selectedMoods.length === 0
      if (selectedMoods.length > 0) {
        // Check if game's primary mood matches any selected moods
        matchesMood = selectedMoods.some(moodId => {
          const matches = game.primaryMood === moodId
          if (matches && game.title.includes('Call of Duty')) {
            console.log(`🎯 ${game.title} matches mood ${moodId}:`, {
              gamePrimaryMood: game.primaryMood,
              gameMoods: game.moods,
              moodId,
              matches
            })
          }
          return matches
        })
      }

      // NEW: Use centralized contextual engine for session and time filtering
      const contextualFilters: ContextualFilters = {
        selectedMoods,
        selectedSessionLength,
        timeOfDay
      };
      
      // Get contextual match using the engine
      const contextualMatches = getContextualMatches([game], contextualFilters, { limit: 1 });
      const matchesContextual = contextualMatches.length > 0;

      return matchesSearch && matchesGenre && matchesMood && matchesContextual
    })

    // Sort games
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        case 'recently-added':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        case 'playtime-desc':
          return (b.hoursPlayed || 0) - (a.hoursPlayed || 0)
        case 'playtime-asc':
          return (a.hoursPlayed || 0) - (b.hoursPlayed || 0)
        case 'last-played':
          return new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime()
        case 'release-date-desc':
          return new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()
        case 'release-date-asc':
          return new Date(a.releaseDate || 0).getTime() - new Date(b.releaseDate || 0).getTime()
        case 'genre':
          const genreA = a.genres?.[0]?.name || ''
          const genreB = b.genres?.[0]?.name || ''
          return genreA.localeCompare(genreB)
        default:
          return 0
      }
    })

    return filtered
  }, [processedGames, debouncedSearchTerm, selectedGenre, selectedMoods, selectedSort, selectedSessionLength, timeOfDay])

  // Game handlers
  const handleGameSelect = (game: Game) => {
    if (isBulkSelectMode) {
      handleGameSelectToggle(game.id)
    } else {
      setSelectedGame(game)
      setIsEditModalOpen(true)
    }
  }

  const handleGameLaunch = async (game: Game) => {
    try {
      if (game.appId) {
        await launchGame(game.appId)
        showSuccess(`Launching ${game.title}...`)
      } else {
        showError(`No launch ID available for ${game.title}`)
      }
    } catch (error) {
      showError(`Failed to launch ${game.title}`)
      console.error('Launch error:', error)
    }
  }

  const handleGameDelete = (game: Game) => {
    setSelectedGame(game)
    setIsDeleteModalOpen(true)
  }

  // Bulk selection handlers
  const handleGameSelectToggle = (gameId: string) => {
    const newSelected = new Set(selectedGames)
    if (newSelected.has(gameId)) {
      newSelected.delete(gameId)
    } else {
      newSelected.add(gameId)
    }
    setSelectedGames(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedGames.size === filteredGames.length) {
      setSelectedGames(new Set())
    } else {
      setSelectedGames(new Set(filteredGames.map(game => game.id)))
    }
  }

  const handleBulkDelete = () => {
    if (selectedGames.size === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedGames.size} game(s)?`)) {
      actions.deleteGames(Array.from(selectedGames))
      setSelectedGames(new Set())
      setIsBulkSelectMode(false)
      showSuccess(`Deleted ${selectedGames.size} game(s)`)
    }
  }

  // Modal handlers
  const handleAddGame = (gameData: Partial<Game>) => {
    actions.addGame(gameData as Game)
    setIsAddModalOpen(false)
    showSuccess('Game added successfully!')
  }

  const handleEditGame = (gameId: string, updates: Partial<Game>) => {
    actions.updateGame(gameId, updates)
    setIsEditModalOpen(false)
    setSelectedGame(null)
    showSuccess('Game updated successfully!')
  }

  const handleDeleteGame = () => {
    if (selectedGame) {
      actions.deleteGame(selectedGame.id)
      setIsDeleteModalOpen(false)
      setSelectedGame(null)
      showSuccess('Game deleted successfully!')
    }
  }

  const handleSteamImport = (importedGames: Game[]) => {
    setIsSteamImportOpen(false)
    showSuccess(`Successfully imported ${importedGames.length} games from Steam!`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Library</h1>
          <p className="text-gray-400">
            {games.length} {games.length === 1 ? 'game' : 'games'} in your library
          </p>
          {/* NEW: Persona Badge - Very Safe Display Only */}
          {persona?.traits?.archetypeId && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full">
              <span className="text-purple-300 text-sm font-medium">
                🎮 {persona.traits.archetypeId}
              </span>
              <span className="text-gray-400 text-xs">
                {Math.round((persona.confidence || 0) * 100)}% match
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          {/* Steam Import Button */}
          <button
            onClick={() => setIsSteamImportOpen(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>🎮</span>
            Import Steam
          </button>
          
          {/* Mood Selector Button */}
          <button
            onClick={() => setShowMoodSelector(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>🎭</span>
            {primaryMoodInfo ? primaryMoodInfo.name : 'Select Mood'}
          </button>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Add Game
          </button>
          
          {/* NEW: I'm Not Sure What To Play */}
          <button
            onClick={() => setShowWhatToPlay(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>🎯</span>
            I'm Not Sure What To Play
          </button>

          {/* Virtual Scrolling Toggle */}
          {games.length >= 30 && (
            <button
              onClick={() => setUseVirtualScrolling(!useVirtualScrolling)}
              className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                useVirtualScrolling 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
              title={`Virtual scrolling ${useVirtualScrolling ? 'ON' : 'OFF'} - Better performance for large libraries`}
            >
              <span>{useVirtualScrolling ? '⚡' : '📱'}</span>
              <span className="hidden sm:inline">
                {useVirtualScrolling ? 'Virtual ON' : 'Virtual OFF'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Games
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* EXPERIMENTAL: Multi-Mood Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Moods (Multi-Select)
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(mood => {
                const isSelected = selectedMoods.includes(mood.id)
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodToggle(mood.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    } border`}
                  >
                    {mood.name}
                  </button>
                )
              })}
            </div>
            {selectedMoods.length > 0 && (
              <button
                onClick={() => setSelectedMoods([])}
                className="mt-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear all moods
              </button>
            )}

            {/* NEW: Contextual Filtering Controls */}
            <div className="session-length-filter mt-4">
              <h4 className="block text-sm font-medium text-gray-300 mb-2">How long do you have?</h4>
              <div className="flex flex-wrap gap-2">
                {["short", "medium", "long"].map(length => (
                  <button
                    key={length}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedSessionLength === length 
                        ? "bg-blue-600 text-white border border-blue-500" 
                        : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                    }`}
                    onClick={() => {
                      setSelectedSessionLength(length as SessionLength);
                      // NEW: Track session length filter changes
                      try {
                        trackFilterInteraction('session_length', 'changed', {
                          selectedSessionLength: length
                        });
                      } catch (error) {
                        // Fail silently
                      }
                    }}
                  >
                    {length === "short" && "15–30 min"}
                    {length === "medium" && "1–2 hours"}
                    {length === "long" && "2+ hours"}
                  </button>
                ))}
                {selectedSessionLength && (
                  <button
                    onClick={() => {
                      setSelectedSessionLength(null);
                      // NEW: Track session length filter cleared
                      try {
                        trackFilterInteraction('session_length', 'cleared', {
                          selectedSessionLength: undefined
                        });
                      } catch (error) {
                        // Fail silently
                      }
                    }}
                    className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="time-of-day-display mt-3">
              <span className="text-xs text-gray-400">
                Current time: <span className="text-white font-medium">{timeOfDay}</span>
              </span>
            </div>
          </div>

          {/* OLD: Single Mood Dropdown (commented out for comparison) */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mood
            </label>
            <select
              value={'all'}
              onChange={() => {}}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              aria-label="Filter by mood"
              title="Filter by mood"
            >
              <option value="all">All Moods</option>
              {MOODS.map(mood => (
                <option key={mood.id} value={mood.id}>
                  {mood.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              aria-label="Filter by genre"
              title="Filter by genre"
            >
              <option value="all">All Genres</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              aria-label="Sort games"
              title="Sort games"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="recently-added">Recently Added</option>
              <option value="playtime-desc">Most Played</option>
              <option value="playtime-asc">Least Played</option>
              <option value="last-played">Last Played</option>
              <option value="release-date-desc">Newest First</option>
              <option value="release-date-asc">Oldest First</option>
              <option value="genre">Genre (A-Z)</option>
            </select>
          </div>
          
          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedGenre('all')
                setSelectedMoods([])
                setSelectedSessionLength(null)
                setSelectedSort('title-asc')
              }}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mood Recommendations Section - only show when no filters are applied */}
      {hasMoodRecommendations && primaryMoodInfo && selectedMoods.length === 0 && selectedGenre === 'all' && !debouncedSearchTerm && (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span>{primaryMoodInfo.emoji}</span>
                {primaryMoodInfo.name} Recommendations
                {secondaryMoodInfo && (
                  <span className="text-purple-400">+ {secondaryMoodInfo.emoji} {secondaryMoodInfo.name}</span>
                )}
                {persona && (
                  <span className="text-xs bg-purple-600/50 px-2 py-1 rounded-full ml-2">
                    {persona.traits?.archetypeId} Match
                  </span>
                )}
              </h3>
              <p className="text-gray-300 text-sm">
                {moodRecommendations.length} games matching your current mood
                {persona && ` • Personalized for ${persona.traits?.archetypeId} playstyle`}
              </p>
            </div>
            <button
              onClick={() => clearMood()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Clear Mood
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {moodRecommendations.slice(0, 8).map(game => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={() => handleGameSelect(game)}
                onLaunch={() => handleGameLaunch(game)}
                onDelete={() => handleGameDelete(game)}
                isSelectable={isBulkSelectMode}
                isSelected={selectedGames.has(game.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Persona Display */}
      {persona && (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎮</div>
              <div>
                <h4 className="text-white font-bold text-lg">{persona.traits?.archetypeId || 'Gaming Persona'}</h4>
                <p className="text-gray-300 text-sm">Your personalized gaming profile</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Confidence</div>
              <div className="text-lg font-bold text-purple-400">
                {Math.round((persona.confidence || 0) * 100)}%
              </div>
            </div>
          </div>
          
          {/* Persona Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">Archetype</div>
              <div className="text-white font-medium capitalize">
                {persona.traits?.archetypeId || 'Balanced'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Intensity</div>
              <div className="text-white font-medium">
                {persona.traits?.intensity || 'Medium'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Pacing</div>
              <div className="text-white font-medium">
                {persona.traits?.pacing || 'Flow'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Social Style</div>
              <div className="text-white font-medium">
                {persona.traits?.socialStyle || 'Solo'}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mood Selector Modal */}
      {showMoodSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Select Your Mood</h2>
                <button
                  onClick={() => setShowMoodSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close mood selector"
                  aria-label="Close mood selector"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <SimpleMoodSelector
                onMoodChange={handleMoodSelect}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {isBulkSelectMode && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white">
                {selectedGames.size} game{selectedGames.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                {selectedGames.size === filteredGames.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={selectedGames.size === 0}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => {
                  setIsBulkSelectMode(false)
                  setSelectedGames(new Set())
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Games Grid */}
      {games.length === 0 ? (
        <EmptyLibraryState 
          isSearchResult={false}
          onImportSteam={() => {}}
        />
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No games found matching your filters</p>
        </div>
      ) : (
        useVirtualScrolling ? (
          <VirtualizedGameList
            games={filteredGames}
            onGameLaunch={handleGameLaunch}
            onGameEdit={(gameId, updates) => handleGameEdit(gameId, updates)}
            onGameDelete={handleGameDelete}
            selectedGames={selectedGames}
            onGameSelectToggle={handleGameSelectToggle}
            isBulkSelectMode={isBulkSelectMode}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
            {filteredGames.map(game => (
              <div key={game.id} className="group">
                <div className="transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50 shadow-lg group-hover:shadow-xl group-hover:border-gray-600/50 transition-all duration-300">
                    <GameCard
                      game={game}
                      onSelect={() => handleGameSelect(game)}
                      onLaunch={() => handleGameLaunch(game)}
                      onEdit={() => handleGameSelect(game)} // Use select to open edit modal
                      onDelete={() => handleGameDelete(game)}
                      isSelectable={isBulkSelectMode}
                      isSelected={selectedGames.has(game.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Bulk Selection Toggle */}
      {games.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              if (isBulkSelectMode) {
                setIsBulkSelectMode(false)
                setSelectedGames(new Set())
              } else {
                setIsBulkSelectMode(true)
              }
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              isBulkSelectMode
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isBulkSelectMode ? 'Exit Selection' : 'Select Games'}
          </button>
        </div>
      )}

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <EditGameModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateGame={handleEditGame}
        game={selectedGame}
      />

      <DeleteGameModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteGame={handleDeleteGame}
        game={selectedGame}
      />
      
      <SteamImportModal
        isOpen={isSteamImportOpen}
        onClose={() => setIsSteamImportOpen(false)}
        onImportGames={handleSteamImport}
      />
      
      {/* NEW: What To Play Modal */}
      {showWhatToPlay && games && games.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <WhatToPlayNow onClose={() => setShowWhatToPlay(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
