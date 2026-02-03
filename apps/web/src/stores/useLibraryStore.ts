import { create } from 'zustand'
import { Game } from '../types'
// import { toast } from '../components/Toast'
import { processSteamGameData } from '../utils/steamGenreMapping'
import { SteamService } from '../services/steamService'
import { launcherService } from '../services/launcherService'
import { personaEngineService } from '../services/personaEngineService'
import { gameApiService } from '../services/gameApiService'
// import { SteamGame } from '@gamepilot/shared/models/gameExtensions'

// LocalStorage backup utilities
const LIBRARY_STORAGE_KEY = 'gamepilot_library'

const saveToLocalStorage = (games: Game[]) => {
  try {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(games))
    console.log('💾 Library saved to localStorage as backup')
  } catch (error) {
    console.warn('Failed to save library to localStorage:', error)
  }
}

const loadFromLocalStorage = (): Game[] | null => {
  try {
    const stored = localStorage.getItem(LIBRARY_STORAGE_KEY)
    if (stored) {
      const games = JSON.parse(stored)
      console.log('📂 Library loaded from localStorage backup:', games.length)
      return games
    }
  } catch (error) {
    console.warn('Failed to load library from localStorage:', error)
  }
  return null
}

const importSteamLibrary = async (steamId: string, apiKey: string) => {
  const { setIsLoading } = useLibraryStore.getState()
  const { setGames } = useLibraryStore.getState().actions
  let games: Game[] = []

  try {
    setIsLoading(true)
    console.log('🔍 useLibraryStore: Calling SteamService.fetchOwnedGames with:', { steamId, apiKey })
    const steamGames = await SteamService.fetchOwnedGames(steamId, apiKey)
    console.log('🔍 useLibraryStore: SteamService returned:', steamGames)
    console.log('🔍 useLibraryStore: Number of games from Steam API:', steamGames.length)

    // Process games with enhanced metadata using our mapping
    const gamesForUpsert = steamGames.map((game: any) => {
      const processedGame = processSteamGameData(game)
      console.log('🔍 Steam Import - Game:', processedGame.title)
      console.log('🔍 Steam Import - Assigned moods:', processedGame.moods)
      console.log('🔍 Steam Import - Genres:', processedGame.genres?.map(g => typeof g === 'string' ? g : g.name))
      return {
        ...processedGame,
        id: undefined // Let database generate ID
      }
    })

    console.log('🔍 useLibraryStore: Upserting games to database:', gamesForUpsert.length)
    
    // Upsert games to database
    const upsertResult = await gameApiService.upsertGames(gamesForUpsert)
    
    if (upsertResult.success && upsertResult.data) {
      // Use database games with proper IDs
      games = upsertResult.data.games.map(dbGame => ({
        ...dbGame,
        appId: dbGame.appId || (dbGame as any).appId // Ensure appId is preserved
      }))
      
      console.log('🔍 useLibraryStore: Successfully upserted games:', games.length)
      console.log('🔍 useLibraryStore: First database game example:', games[0])
    } else {
      throw new Error(upsertResult.error || 'Failed to upsert games to database')
    }

    return {
      success: games.length > 0,
      gameCount: games.length,
      games
    }
  } catch (error) {
    console.error('🔍 useLibraryStore: Steam import failed:', error)
    
    // Enhanced error logging for debugging
    if (error instanceof Error) {
      console.error('🔍 useLibraryStore: Error message:', error.message)
      console.error('🔍 useLibraryStore: Error stack:', error.stack)
    } else if (typeof error === 'object' && error !== null) {
      console.error('🔍 useLibraryStore: Error object details:', JSON.stringify(error, null, 2))
    } else {
      console.error('🔍 useLibraryStore: Error type:', typeof error, 'value:', error)
    }
    
    // Re-throw the error with more context for the UI to handle
    throw new Error(
      error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : 'Steam import failed: Unknown error'
    )
  } finally {
    setIsLoading(false)
    if (games.length > 0) {
      console.log('🔍 useLibraryStore: Setting games in store:', games.length)
      setGames(games)
    }
  }
}

interface LibraryStore {
  games: Game[]
  currentSession: { gameId: string; startedAt: number } | null
  isLoading: boolean
  hasLoaded: boolean
  filters: {
    genre: string | null
    platform: string | null
    status: string | null
    search: string
  }
  intelligence: {
    selectedMood: string
    selectedSessionLength: string
    selectedGenres: string[]
    selectedSorting: string
    preferredGenres: string[]
    preferredMoods: string[]
    preferredSessionStyle: string | null
  }
  actions: any
  setIntelligenceState: (partial: Partial<LibraryStore['intelligence']>) => void
  setIsLoading: (loading: boolean) => void
  setHasLoaded: (hasLoaded: boolean) => void
  setGames: (games: Game[]) => void
}

export const useLibraryStore = create<LibraryStore>()((set, get) => ({
  games: [],
  currentSession: null,
  isLoading: false,
  hasLoaded: false,

  filters: {
    genre: null,
    platform: null,
    status: null,
    search: ''
  },

  intelligence: {
    selectedMood: '',
    selectedSessionLength: '',
    selectedGenres: [],
    selectedSorting: '',
    preferredGenres: [],
    preferredMoods: [],
    preferredSessionStyle: null
  },

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setHasLoaded: (hasLoaded: boolean) => set({ hasLoaded }),
  setGames: (games: Game[]) => set({ games, hasLoaded: true }),

  actions: {
    addGame: (game: Game) => {
      set(state => {
        // Check if game already exists by ID or appId
        const existingById = state.games.find(g => g.id === game.id)
        const existingByAppId = state.games.find(g => (g as any).appId === (game as any).appId)
        
        if (existingById || existingByAppId) {
          // Game already exists, don't add duplicate
          return state
        }
        
        const newGames = [...state.games, game]
        // Save to localStorage as backup
        saveToLocalStorage(newGames)
        return { games: newGames }
      })
      // toast.success(`Added ${game.title} to your library`) // Moved to component
    },

    removeGame: (gameId: string) => {
      set(state => {
        const newGames = state.games.filter(g => g.id !== gameId)
        // Save to localStorage as backup
        saveToLocalStorage(newGames)
        return { games: newGames }
      })
      // toast.info('Game removed from library')
    },

    updateGame: (gameId: string, updates: Partial<Game>) => {
      set(state => {
        const newGames = state.games.map(g => (g.id === gameId ? { ...g, ...updates } : g))
        // Save to localStorage as backup
        saveToLocalStorage(newGames)
        return { games: newGames }
      })
    },

    bulkUpdateStatus: (gameIds: string[], status: string) => {
      set(state => ({
        games: state.games.map(g =>
          gameIds.includes(g.id) ? { ...g, playStatus: status as any } : g
        )
      }))
      // toast.success(`Updated ${gameIds.length} games`)
    },

    bulkExport: () => {
      const data = JSON.stringify(get().games, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'game-library.json'
      a.click()
      URL.revokeObjectURL(url)
      // toast.success('Library exported successfully')
    },

    bulkImport: (games: Omit<Game, 'id'>[]) => {
      const newGames = games.map(g => ({
        ...g,
        id: crypto.randomUUID(),
        addedAt: new Date()
      }))

      set(state => ({ games: [...state.games, ...newGames] }))
      // toast.success(`Imported ${games.length} games from Steam`)
    },

    importSteamLibrary,

    bulkAddToCategory: (gameIds: string[], category: string) => {
      set(state => ({
        games: state.games.map(g =>
          gameIds.includes(g.id)
            ? { ...g, tags: Array.from(new Set([...(g.tags || []), category])) }
            : g
        )
      }))
      // toast.success(`Added ${gameIds.length} games to ${category}`) // Moved to component
    },

    deduplicateGames: () => {
      set(state => {
        const unique = state.games.filter(
          (g, i, arr) =>
            i === arr.findIndex(x => x.title.toLowerCase() === g.title.toLowerCase())
        )
        return { games: unique }
      })
    },

    bulkDelete: (gameIds: string[]) => {
      set(state => ({ games: state.games.filter(g => !gameIds.includes(g.id)) }))
      // toast.success(`Deleted ${gameIds.length} games`) // Moved to component
    },

    launchGame: async (gameId: string) => {
      console.log('🔧 Frontend Store - launchGame called with gameId:', gameId)
      
      let game = get().games.find(g => g.id === gameId)
      if (!game) {
        console.log('🔧 Frontend Store - Game not found by ID, trying appId lookup')
        // Try to find by appId
        game = get().games.find(g => g.appId?.toString() === gameId)
        if (!game) {
          console.error('🔧 Frontend Store - Game not found at all!')
          return
        }
      }

      // Get platform code for the game
      const steamPlatform = game.platforms.find(p => p.code === 'steam')
      const platformCode = steamPlatform ? 'steam' : undefined

      console.log('🔧 Frontend Store - About to call personaEngineService.launchGameWithPersonaTracking')
      console.log('🔧 Frontend Store - Game data:', game.title, game.appId)

      try {
        // Use persona engine service for enhanced tracking
        const result = await personaEngineService.launchGameWithPersonaTracking(gameId, game!)
        console.log('🔧 Frontend Store - Persona engine result:', result)
        
        if (result.success && result.data) {
          set({
            currentSession: {
              gameId: game.id,
              startedAt: Date.now()
            }
          })
        }
      } catch (error) {
        console.error('🔧 Frontend Store - Persona engine failed:', error)
        
        // Fallback to basic launcher service
        try {
          console.log('🔧 Frontend Store - Trying fallback launcher service')
          const result = await launcherService.launchGame(gameId, platformCode)
          console.log('🔧 Frontend Store - Launcher service result:', result)
          
          if (result.success && result.data) {
            set({
              currentSession: {
                gameId: game.id,
                startedAt: Date.now()
              }
            })
          }
        } catch (fallbackError) {
          console.error('🔧 Frontend Store - Fallback launch also failed:', fallbackError)
        }
      }
    },

    endCurrentSession: async () => {
      const state = get()
      if (!state.currentSession) return

      try {
        // Use persona engine service for enhanced tracking
        await personaEngineService.endSessionWithPersonaTracking(undefined, state.currentSession.gameId)
        
        // Update local playtime (fallback if backend sync fails)
        const durationMs = Date.now() - state.currentSession.startedAt
        const minutes = Math.floor(durationMs / 60000)

        set(prev => ({
          games: prev.games.map(g =>
            g.id === prev.currentSession?.gameId
              ? {
                  ...g,
                  hoursPlayed: (g.hoursPlayed || 0) + minutes / 60,
                  lastPlayed: new Date()
                }
              : g
          ),
          currentSession: null
        }))
      } catch (error) {
        console.error('Failed to end session with persona tracking:', error)
        
        // Fallback to basic launcher service
        try {
          await launcherService.endSession(undefined, state.currentSession.gameId)
          
          const durationMs = Date.now() - state.currentSession.startedAt
          const minutes = Math.floor(durationMs / 60000)

          set(prev => ({
            games: prev.games.map(g =>
              g.id === prev.currentSession?.gameId
                ? {
                    ...g,
                    hoursPlayed: (g.hoursPlayed || 0) + minutes / 60,
                    lastPlayed: new Date()
                  }
                : g
            ),
            currentSession: null
          }))
        } catch (fallbackError) {
          console.error('Fallback session end also failed:', fallbackError)
          
          // Last resort: just clear the session locally
          set({ currentSession: null })
        }
      }
    },

    setFilter: (filter: keyof LibraryStore['filters'], value: any) => {
      set(state => ({
        filters: { ...state.filters, [filter]: value }
      }))
    },

    clearFilters: () => {
      set({
        filters: {
          genre: null,
          platform: null,
          status: null,
          search: ''
        }
      })
    },

    setGames: (games: Game[]) => {
      // Ensure all games have a tags field
      const gamesWithTags = games.map(game => ({
        ...game,
        tags: game.tags || []
      }))
      set({ games: gamesWithTags, hasLoaded: true })
      // Save to localStorage as backup
      saveToLocalStorage(gamesWithTags)
    },

    updateGameStatus: (gameId: string, status: string) => {
      set(state => ({
        games: state.games.map(g =>
          g.id === gameId ? { ...g, playStatus: status as any } : g
        )
      }))
    },

    updateGamePlaytime: (gameId: string, playtime: number) => {
      set(state => ({
        games: state.games.map(g =>
          g.id === gameId ? { ...g, hoursPlayed: playtime } : g
        )
      }))
    },

    setHasLoaded: (hasLoaded: boolean) => set({ hasLoaded }),

    loadGames: async () => {
      // Prevent multiple loads
      if (get().hasLoaded) {
        console.log('🎮 Library already loaded, skipping...')
        return
      }

      try {
        get().setIsLoading(true)
        
        // Load games for authenticated user
        console.log('🔍 Store: Calling getUserGames API...')
        const response = await gameApiService.getUserGames()
        console.log('🔍 Store: API response:', response)
        
        if (response.success && response.data) {
          get().actions.setGames(response.data.games)
          console.log('🎮 Loaded user games from database:', response.data.games.length)
        } else {
          console.error('Failed to load user games:', response.error)
          
          // Fallback to localStorage
          const localGames = loadFromLocalStorage()
          if (localGames && localGames.length > 0) {
            get().actions.setGames(localGames)
            console.log('🎮 Loaded games from localStorage fallback:', localGames.length)
          } else {
            get().actions.setGames([])
          }
        }
        
        get().setHasLoaded(true)
      } catch (error) {
        console.error('Failed to load games:', error)
        
        // Fallback to localStorage on error
        const localGames = loadFromLocalStorage()
        if (localGames && localGames.length > 0) {
          get().actions.setGames(localGames)
          console.log('🎮 Loaded games from localStorage fallback after error:', localGames.length)
        } else {
          get().actions.setGames([])
        }
        
        get().setHasLoaded(true)
      } finally {
        get().setIsLoading(false)
      }
    }
  },

  setIntelligenceState: (partial: Partial<LibraryStore['intelligence']>) => {
    set(state => ({
      intelligence: { ...state.intelligence, ...partial }
    }))
  }
}))


// ------------------------------------------------------------
// Utility Functions (outside the store)
// ------------------------------------------------------------

export const filterByGenre = (games: Game[], genre: string): Game[] =>
  games.filter(game =>
    game.genres.some(g => g.name.toLowerCase() === genre.toLowerCase())
  )

export const filterByPlatform = (games: Game[], platform: string): Game[] =>
  games.filter(game =>
    game.platforms.some(p => p.name.toLowerCase() === platform.toLowerCase())
  )

export const filterByStatus = (games: Game[], status: string): Game[] =>
  games.filter(game => game.playStatus === status)

export const searchGames = (games: Game[], query: string): Game[] => {
  const q = query.toLowerCase()
  return games.filter(
    game =>
      game.title.toLowerCase().includes(q) ||
      game.description?.toLowerCase().includes(q) ||
      game.tags?.some(tag => tag.toLowerCase().includes(q))
  )
}

export const getRecommendedGames = (
  games: Game[],
  preferredGenres: string[],
  preferredMoods: string[],
  preferredSessionStyle: string | null
): Game[] => {
  const scoreGame = (game: Game) => {
    let score = 0

    // Genre match
    if (preferredGenres.length > 0) {
      const match = preferredGenres.some(pg =>
        game.genres.some(g => g.name.toLowerCase() === pg.toLowerCase())
      )
      if (match) score += 20
    }

    // Mood match
    if (preferredMoods.length > 0) {
      const match = preferredMoods.some(pm =>
        game.emotionalTags?.some(t => t.name.toLowerCase() === pm.toLowerCase())
      )
      if (match) score += 10
    }

    // Session style match
    if (preferredSessionStyle) {
      if (game.tags?.includes(preferredSessionStyle)) score += 10
    }

    // Rating
    score += (game.globalRating || 0) * 2

    // Freshness bonus
    if (game.releaseYear) {
      const age = new Date().getFullYear() - game.releaseYear
      score += Math.max(0, 5 - age)
    }

    // Less played = higher priority
    score -= (game.hoursPlayed || 0) * 0.5

    return score
  }

  return games
    .map(g => ({ game: g, score: scoreGame(g) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(x => x.game)
}

export const getTrendingGames = (games: Game[]): Game[] => {
  return games
    .filter(game => game.globalRating && game.globalRating >= 4)
    .sort((a, b) => (b.globalRating || 0) - (a.globalRating || 0))
    .slice(0, 10)
}
