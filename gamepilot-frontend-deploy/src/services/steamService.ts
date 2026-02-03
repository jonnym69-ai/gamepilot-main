import type { Game } from '@gamepilot/types'
import { apiFetch } from '../config/api'
import { processSteamGameData } from '../utils/steamGenreMapping'

// Steam Web API interfaces
interface SteamOwnedGamesResponse {
  response: {
    game_count: number
    games: SteamApiGame[]
  }
}

interface SteamApiGame {
  appid: number
  name: string
  playtime_forever: number
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
  img_icon_url: string
  img_logo_url: string
  has_community_visible_stats: boolean
  rtime_last_played?: number
}

interface SteamAppDetails {
  success: boolean
  data?: {
    type: string
    name: string
    steam_appid: number
    required_age: number
    is_free: boolean
    controller_support: string
    dlc?: any[]
    detailed_description: string
    about_the_game: string
    short_description: string
    supported_languages: string
    header_image: string
    website: string
    pc_requirements?: any
    mac_requirements?: any
    linux_requirements?: any
    developers?: string[]
    publishers?: string[]
    price_overview?: {
      currency: string
      initial: number
      final: number
      discount_percent: number
      initial_formatted: string
      final_formatted: string
    }
    packages?: number[]
    package_groups?: any[]
    platforms?: {
      windows: boolean
      mac: boolean
      linux: boolean
    }
    metacritic?: {
      score: number
      url: string
    }
    categories?: Array<{
      id: number
      description: string
    }>
    genres?: Array<{
      id: string
      description: string
    }>
    release_date?: {
      coming_soon: boolean
      date: string
    }
    recommendations?: {
      total: number
    }
    achievements?: {
      total: number
      highlighted: Array<{
        name: string
        path: string
      }>
    }
  }
}

export interface SteamImportError {
  type: 'INVALID_API_KEY' | 'INVALID_STEAM_ID' | 'PRIVATE_PROFILE' | 'NETWORK_ERROR' | 'STEAM_API_ERROR' | 'INVALID_RESPONSE' | 'UNKNOWN_ERROR'
  message: string
  details?: string
}

export class SteamImportErrorClass extends Error {
  constructor(
    public type: SteamImportError['type'],
    message: string,
    public details?: string
  ) {
    super(message)
    this.name = 'SteamImportError'
  }
}

export class SteamService {
  private static readonly STEAM_API_BASE = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/'
  private static readonly STEAM_STORE_BASE = 'https://store.steampowered.com/api/appdetails/'
  private static readonly BACKUP_API_BASE = '/api/steam' // Fallback to our backend

  /**
   * Retry helper with exponential backoff
   */
  private static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }
        
        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt - 1)
        const jitter = Math.random() * 0.1 * delay // Add 10% jitter
        const totalDelay = delay + jitter
        
        console.warn(`Steam API attempt ${attempt} failed, retrying in ${Math.round(totalDelay)}ms:`, error)
        await new Promise(resolve => setTimeout(resolve, totalDelay))
      }
    }
    
    throw new Error('Max retries exceeded')
  }

  /**
   * Fetch owned games from Steam API with retry logic
   */
  static async fetchOwnedGames(steamId: string, apiKey: string): Promise<SteamApiGame[]> {
    return this.retryWithBackoff(async () => {
      try {
        // Use backend proxy instead of direct Steam API to avoid CSP issues
        const proxyUrl = `${this.BACKUP_API_BASE}/games?steamId=${encodeURIComponent(steamId)}&apiKey=${encodeURIComponent(apiKey)}`
        
        console.log('🔍 Using backend Steam proxy:', proxyUrl)
        
        const response = await fetch(proxyUrl, {
          signal: AbortSignal.timeout(15000) // 15 second timeout for proxy
        })
        
        if (!response.ok) {
          if (response.status === 400) {
            throw new SteamImportErrorClass('INVALID_STEAM_ID', 'Invalid Steam ID', 'Please check your Steam ID')
          } else if (response.status === 500) {
            throw new SteamImportErrorClass('STEAM_API_ERROR', 'Steam API error', 'Steam API is temporarily unavailable')
          }
          throw new Error(`Backend proxy error: ${response.status}`)
        }

        const data = await response.json()
        console.log('🔍 Backend proxy returned:', data)
        
        if (!data.games || !Array.isArray(data.games)) {
          throw new SteamImportErrorClass('INVALID_RESPONSE', 'Invalid response from backend', 'Please try again')
        }

        return data.games.filter((game: any) => game.name && game.appid)
      } catch (error) {
        if (error instanceof SteamImportErrorClass) {
          throw error
        }
        
        console.error('🔍 Steam proxy error:', error)
        throw new SteamImportErrorClass('NETWORK_ERROR', 'Failed to connect to Steam API', 'Please check your internet connection and try again')
      }
    }, 3, 1000)
  }

  /**
   * Fetch detailed game information for richer metadata with retry logic
   */
  static async fetchGameDetails(appId: number): Promise<SteamAppDetails['data'] | null> {
    return this.retryWithBackoff(async () => {
      try {
        const url = `${this.STEAM_STORE_BASE}?appids=${appId}&format=json`
        const response = await fetch(url, {
          signal: AbortSignal.timeout(8000) // 8 second timeout
        })
        const data: { [appid: string]: SteamAppDetails } = await response.json()
        
        const appData = data[appId]
        if (appData && appData.success && appData.data) {
          return appData.data
        }
        return null
      } catch (error) {
        console.warn(`Failed to fetch details for app ${appId}:`, error)
        return null
      }
    }, 2, 500) // Fewer retries for game details since they're less critical
  }

  /**
   * Normalize Steam API game to our Game interface
   */
  static normalizeSteamGame(steamGame: SteamApiGame, details: SteamAppDetails['data'] | null): Omit<Game, 'id'> {
    const now = new Date()
    const playtimeHours = Math.floor(steamGame.playtime_forever / 60)
    const lastPlayed = steamGame.rtime_last_played ? new Date(steamGame.rtime_last_played * 1000) : undefined

    // Determine play status based on playtime
    let playStatus: Game['playStatus'] = 'unplayed'
    if (playtimeHours > 0) {
      if (playtimeHours < 2) {
        playStatus = 'playing'
      } else if (playtimeHours < 20) {
        playStatus = 'completed'
      } else {
        playStatus = 'playing' // Use 'playing' instead of 'replaying' since it's not in the PlayStatus type
      }
    }

    // Extract genres from details if available
    const genres = details?.genres?.map((genre: any) => ({
      id: genre.id.toLowerCase(),
      name: genre.description,
      color: '#8b5cf6',
      subgenres: []
    })) || []

    // Extract platforms from details if available
    const platforms = details?.platforms ? [
      ...(details.platforms.windows ? [{ id: 'pc', name: 'PC', code: 'pc' as any, isConnected: false }] : []),
      ...(details.platforms.mac ? [{ id: 'mac', name: 'Mac', code: 'mac' as any, isConnected: false }] : []),
      ...(details.platforms.linux ? [{ id: 'linux', name: 'Linux', code: 'linux' as any, isConnected: false }] : [])
    ] : [{ id: 'pc', name: 'PC', code: 'pc' as any, isConnected: false }]

    return {
      title: steamGame.name,
      description: details?.short_description || details?.about_the_game || '',
      backgroundImages: details?.header_image ? [details.header_image] : [],
      coverImage: `https://cdn.akamai.steamstatic.com/steam/apps/${steamGame.appid}/header.jpg`,
      releaseDate: details?.release_date?.date ? new Date(details.release_date.date) as any : now as any,
      developer: details?.developers?.[0] || '',
      publisher: details?.publishers?.[0] || '',
      genres,
      subgenres: [],
      platforms,
      emotionalTags: [],
      userRating: 0,
      globalRating: details?.metacritic?.score || 0,
      playStatus,
      hoursPlayed: playtimeHours,
      lastPlayed,
      addedAt: now,
      notes: '',
      isFavorite: false,
      tags: this.extractTagsFromDetails(details),
      releaseYear: details?.release_date?.date ? new Date(details.release_date.date).getFullYear() : now.getFullYear(),
      achievements: details?.achievements ? {
        unlocked: 0, // Would need separate API call
        total: details.achievements.total
      } : undefined,
      totalPlaytime: playtimeHours,
      appId: steamGame.appid // Store the Steam App ID for launching
    }
  }

  /**
   * Extract tags from game details for emotional/mood analysis
   */
  private static extractTagsFromDetails(details: SteamAppDetails['data'] | null): string[] {
    if (!details) return []

    const tags: string[] = []
    
    // Extract from categories
    if (details.categories) {
      details.categories.forEach((category: any) => {
        const desc = category.description.toLowerCase()
        if (desc.includes('multiplayer') || desc.includes('co-op')) tags.push('multiplayer')
        if (desc.includes('single-player')) tags.push('single-player')
        if (desc.includes('steam')) tags.push('steam')
        if (desc.includes('achievement')) tags.push('achievements')
        if (desc.includes('trading cards')) tags.push('trading')
      })
    }

    // Extract from genres
    if (details.genres) {
      details.genres.forEach((genre: any) => {
        const desc = genre.description.toLowerCase()
        if (desc.includes('action')) tags.push('action')
        if (desc.includes('adventure')) tags.push('adventure')
        if (desc.includes('rpg')) tags.push('rpg')
        if (desc.includes('strategy')) tags.push('strategy')
        if (desc.includes('simulation')) tags.push('simulation')
        if (desc.includes('sports')) tags.push('sports')
        if (desc.includes('racing')) tags.push('racing')
      })
    }

    // Add free tag if applicable
    if (details.is_free) {
      tags.push('free-to-play')
    }

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Import Steam library using backend API with enhanced metadata
   */
  static async importSteamLibrary(steamId: string, _apiKey: string): Promise<Omit<Game, 'id'>[]> {
    try {
      // Use backend library endpoint through Vite proxy
      const response = await apiFetch(`api/steam/library/${encodeURIComponent(steamId)}`)
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Convert library data to Game objects with enhanced metadata
      if (data.games && Array.isArray(data.games)) {
        return data.games.map((steamGame: any) => {
          // Generate Steam cover image URL with debugging and multiple fallbacks
          const appId = steamGame.appid || steamGame.appId || steamGame.steamAppId
          const coverImage = steamGame.imgLogoUrl || 
            steamGame.imgHeaderUrl || 
            steamGame.coverImage ||
            `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg` ||
            `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900.jpg` ||
            `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_184x69.jpg`
          
          // Extract genres from Steam categories and convert to tags
          const categories = steamGame.categories || []
          let tags = categories.map((cat: any) => cat.description).filter(Boolean)
          
          // Add some common Steam tags based on categories
          if (categories.some((cat: any) => cat.description.toLowerCase().includes('multiplayer'))) {
            tags.push('Multiplayer')
          }
          if (categories.some((cat: any) => cat.description.toLowerCase().includes('single-player'))) {
            tags.push('Single Player')
          }
          if (categories.some((cat: any) => cat.description.toLowerCase().includes('co-op'))) {
            tags.push('Co-op')
          }
          
          // If no categories, add basic genre tags based on game name
          if (tags.length === 0) {
            const gameName = steamGame.name.toLowerCase()
            if (gameName.includes('zombie') || gameName.includes('dead') || gameName.includes('resident evil')) {
              tags.push('Horror', 'Survival')
            }
            if (gameName.includes('rpg') || gameName.includes('witcher') || gameName.includes('elder scrolls')) {
              tags.push('RPG')
            }
            if (gameName.includes('shooter') || gameName.includes('counter-strike') || gameName.includes('call of duty')) {
              tags.push('Shooter')
            }
            if (gameName.includes('strategy') || gameName.includes('command') || gameName.includes('company of heroes')) {
              tags.push('Strategy')
            }
            if (gameName.includes('racing') || gameName.includes('rocket league')) {
              tags.push('Racing')
            }
            if (gameName.includes('sports') || gameName.includes('football') || gameName.includes('wwe')) {
              tags.push('Sports')
            }
            if (gameName.includes('adventure') || gameName.includes('tomb') || gameName.includes('assassin')) {
              tags.push('Adventure')
            }
            if (gameName.includes('puzzle') || gameName.includes('portal')) {
              tags.push('Puzzle')
            }
            if (gameName.includes('simulation') || gameName.includes('simulator')) {
              tags.push('Simulation')
            }
            
            // Add default tags if still none
            if (tags.length === 0) {
              tags.push('Action')
            }
          }
          
          // Create genres from categories (for details page)
          const genres = categories.slice(0, 3).map((cat: any) => ({
            id: cat.id.toLowerCase(),
            name: cat.description,
            color: '#8b5cf6',
            subgenres: []
          }))
          
          // Determine play status based on playtime
          const playtimeHours = Math.floor((steamGame.playtimeForever || 0) / 60)
          let playStatus: Game['playStatus'] = 'unplayed'
          
          if (playtimeHours > 0) {
            if (playtimeHours < 2) {
              playStatus = 'playing'
            } else if (playtimeHours < 20) {
              playStatus = 'completed'
            } else {
              playStatus = 'playing'
            }
          }
          
          return {
            title: steamGame.name,
            description: steamGame.shortDescription || '',
            backgroundImages: steamGame.backgroundImages || [],
            coverImage,
            releaseDate: steamGame.releaseDate ? new Date(steamGame.releaseDate) : new Date(),
            developer: steamGame.developer || '',
            publisher: steamGame.publisher || '',
            genres,
            subgenres: [],
            platforms: [{ id: 'steam', name: 'Steam', code: 'steam' as any, isConnected: true }],
            emotionalTags: [],
            userRating: undefined,
            globalRating: steamGame.metacriticScore ? steamGame.metacriticScore : undefined,
            playStatus,
            hoursPlayed: playtimeHours,
            lastPlayed: steamGame.lastPlayed ? new Date(steamGame.lastPlayed) : undefined,
            addedAt: new Date(),
            notes: '',
            isFavorite: false,
            tags: tags,
            releaseYear: steamGame.releaseYear ? steamGame.releaseYear : new Date().getFullYear(),
            achievements: steamGame.achievements ? {
              unlocked: steamGame.achievements.unlocked || 0,
              total: steamGame.achievements.total || 0
            } : undefined,
            totalPlaytime: playtimeHours,
            averageRating: undefined,
            completionPercentage: undefined,
            appId: appId
          }
        })
      }
      
      return []
    } catch (error) {
      console.error('Failed to import Steam library via backend:', error)
      return []
    }
  }
}
