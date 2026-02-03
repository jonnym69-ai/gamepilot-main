import { Router, Request, Response } from 'express'
import { fetchSteamGames } from '../auth/steam'
import axios from 'axios'

const router = Router()

interface SteamGame {
  appid: number
  name: string
  playtime_forever: number
  img_icon_url: string
  img_logo_url: string
  has_community_visible_stats: boolean
}

interface SteamGamesResponse {
  response: {
    game_count: number
    games: SteamGame[]
  }
}

/**
 * GET /games?steamId=xxx&apiKey=xxx
 * Get Steam games for a user (legacy endpoint for frontend compatibility)
 */
router.get('/games', async (req: Request, res: Response) => {
  try {
    const { steamId, apiKey } = req.query
    
    if (!steamId) {
      return res.status(400).json({
        error: 'Missing steamId parameter'
      })
    }
    
    console.log(`📚 GET /games?steamId=${steamId} - Fetching Steam library using real Steam API`)
    
    // Use real Steam API to get owned games
    const steamGames = await fetchSteamGames(steamId as string)
    
    console.log(`✅ Retrieved ${steamGames.length} games from Steam API`)
    
    res.json({
      steamId,
      games: steamGames,
      gameCount: steamGames.length,
      source: 'real_steam_api'
    })
    
  } catch (error) {
    console.error('❌ Failed to fetch Steam games:', error)
    res.status(500).json({
      error: 'Failed to fetch Steam games',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /games/v2?steamId=xxx&apiKey=xxx
 * New robust Steam games endpoint with enhanced error handling and validation
 */
router.get('/games/v2', async (req: Request, res: Response) => {
  try {
    const { steamId, apiKey } = req.query

    // Validate required parameters
    if (!steamId || !apiKey) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both steamId and apiKey are required'
      })
    }

    // Validate steamId format (should be numeric)
    if (typeof steamId !== 'string' || !/^\d{17}$/.test(steamId)) {
      return res.status(400).json({
        error: 'Invalid steamId format',
        message: 'steamId must be a 17-digit Steam ID'
      })
    }

    // Validate apiKey format
    if (typeof apiKey !== 'string' || apiKey.length < 32) {
      return res.status(400).json({
        error: 'Invalid apiKey format',
        message: 'apiKey must be a valid Steam Web API key'
      })
    }

    console.log('🔄 Fetching Steam games for user:', steamId)

    // Call Steam Web API directly with provided apiKey
    const steamApiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`
    const params = {
      key: apiKey as string,
      steamid: steamId as string,
      format: 'json',
      include_appinfo: true,
      include_played_free_games: true
    }

    const response = await axios.get<SteamGamesResponse>(steamApiUrl, { params })
    const steamData = response.data

    // Validate Steam API response
    if (!steamData.response || !Array.isArray(steamData.response.games)) {
      return res.status(500).json({
        error: 'Invalid Steam API response',
        message: 'Steam API returned unexpected data format'
      })
    }

    // Transform games to match frontend expectations
    const games = steamData.response.games.map(game => ({
      appid: game.appid,
      name: game.name,
      playtime_forever: game.playtime_forever,
      img_icon_url: game.img_icon_url,
      img_logo_url: game.img_logo_url,
      has_community_visible_stats: game.has_community_visible_stats
    }))

    console.log(`✅ Successfully fetched ${games.length} games from Steam`)

    res.json({
      success: true,
      data: {
        game_count: steamData.response.game_count,
        games: games
      }
    })

  } catch (error: any) {
    console.error('❌ Steam API error:', error.message)

    // Handle different types of errors
    if (error.response) {
      // Steam API responded with error status
      const status = error.response.status
      const message = error.response.data?.error?.message || 'Steam API error'

      if (status === 403) {
        return res.status(403).json({
          error: 'Steam API authentication failed',
          message: 'Invalid Steam Web API key or insufficient permissions'
        })
      } else if (status === 401) {
        return res.status(401).json({
          error: 'Steam API authentication failed',
          message: 'Invalid Steam Web API key'
        })
      } else if (status === 400) {
        return res.status(400).json({
          error: 'Invalid request to Steam API',
          message: 'Invalid steamId or malformed request'
        })
      } else {
        return res.status(status).json({
          error: 'Steam API error',
          message: message
        })
      }
    } else if (error.request) {
      // Network error - couldn't reach Steam API
      return res.status(503).json({
        error: 'Steam API unavailable',
        message: 'Unable to connect to Steam servers. Please try again later.'
      })
    } else {
      // Other error (programming error, etc.)
      return res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching Steam games'
      })
    }
  }
})

/**
 * GET /library/:steamId
 * Get Steam library for a user using real Steam API
 */
router.get('/library/:steamId', async (req: Request, res: Response) => {
  try {
    const { steamId } = req.params
    console.log(`📚 GET /library/${steamId} - Fetching Steam library using real Steam API`)
    
    // Use real Steam API to get owned games
    const steamGames = await fetchSteamGames(steamId)
    
    console.log(`✅ Retrieved ${steamGames.length} games from Steam API`)
    
    res.json({
      steamId,
      games: steamGames,
      gameCount: steamGames.length,
      source: 'real_steam_api'
    })
    
  } catch (error) {
    console.error('❌ Failed to fetch Steam library:', error)
    res.status(500).json({
      error: 'Failed to fetch Steam library',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
