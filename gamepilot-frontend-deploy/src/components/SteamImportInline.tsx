import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLibraryStore } from '../stores/useLibraryStore'
import type { Game } from '@gamepilot/types'

interface SteamImportInlineProps {
  onComplete?: (importedCount: number) => void
  onError?: (error: Error) => void
}

export function SteamImportInline({ onComplete, onError }: SteamImportInlineProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState('')
  const { actions } = useLibraryStore()

  const handleDemoImport = async () => {
    setIsImporting(true)
    setImportProgress(0)
    setImportStatus('Creating demo library...')

    try {
      // Create demo Steam games data
      const demoGames: Game[] = [
        {
          id: 'steam-730',
          title: 'Counter-Strike 2',
          description: 'The world\'s #1 online action game. Experience the thrill of competitive tactical shooter gameplay.',
          backgroundImages: ['https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg'],
          coverImage: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
          releaseDate: new Date('2023-09-27'),
          developer: 'Valve',
          publisher: 'Valve',
          genres: [
            {
              id: 'action',
              name: 'Action',
              description: 'Fast-paced games emphasizing physical challenges',
              color: 'from-red-500 to-orange-600',
              icon: undefined,
              subgenres: []
            }
          ],
          subgenres: [],
          platforms: [{ id: 'steam', name: 'Steam', code: 'steam' as any, isConnected: true }],
          emotionalTags: [],
          userRating: undefined,
          globalRating: 85,
          playStatus: 'playing',
          hoursPlayed: 20,
          lastPlayed: new Date(Date.now() - 86400000), // Yesterday
          addedAt: new Date(),
          notes: '',
          isFavorite: false,
          tags: ['multiplayer', 'competitive', 'fps', 'esports'],
          releaseYear: 2023,
          achievements: { unlocked: 15, total: 50 },
          totalPlaytime: 20,
          averageRating: undefined,
          completionPercentage: undefined,
          launcherId: 'steam',
          appId: 730,
          lastLocalPlayedAt: new Date(Date.now() - 86400000).toISOString(),
          localSessionMinutes: 1200,
          localSessionCount: 5
        },
        {
          id: 'steam-440',
          title: 'Team Fortress 2',
          description: 'Nine distinct classes provide a broad range of tactical abilities and personalities.',
          backgroundImages: ['https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg'],
          coverImage: 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg',
          releaseDate: new Date('2007-10-10'),
          developer: 'Valve',
          publisher: 'Valve',
          genres: [
            {
              id: 'action',
              name: 'Action',
              description: 'Fast-paced games emphasizing physical challenges',
              color: 'from-red-500 to-orange-600',
              icon: undefined,
              subgenres: []
            }
          ],
          subgenres: [],
          platforms: [{ id: 'steam', name: 'Steam', code: 'steam' as any, isConnected: true }],
          emotionalTags: [],
          userRating: undefined,
          globalRating: 92,
          playStatus: 'playing',
          hoursPlayed: 50,
          lastPlayed: new Date(Date.now() - 172800000), // 2 days ago
          addedAt: new Date(),
          notes: '',
          isFavorite: true,
          tags: ['multiplayer', 'free-to-play', 'competitive', 'team-based'],
          releaseYear: 2007,
          achievements: { unlocked: 200, total: 500 },
          totalPlaytime: 50,
          averageRating: undefined,
          completionPercentage: undefined,
          launcherId: 'steam',
          appId: 440,
          lastLocalPlayedAt: new Date(Date.now() - 172800000).toISOString(),
          localSessionMinutes: 3000,
          localSessionCount: 25
        },
        {
          id: 'steam-570',
          title: 'Dota 2',
          description: 'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes.',
          backgroundImages: ['https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg'],
          coverImage: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
          releaseDate: new Date('2013-07-09'),
          developer: 'Valve',
          publisher: 'Valve',
          genres: [
            {
              id: 'strategy',
              name: 'Strategy',
              description: 'Games that require tactical thinking and planning',
              color: 'from-blue-500 to-purple-600',
              icon: undefined,
              subgenres: []
            }
          ],
          subgenres: [],
          platforms: [{ id: 'steam', name: 'Steam', code: 'steam' as any, isConnected: true }],
          emotionalTags: [],
          userRating: undefined,
          globalRating: 90,
          playStatus: 'playing',
          hoursPlayed: 100,
          lastPlayed: new Date(Date.now() - 3600000), // 1 hour ago
          addedAt: new Date(),
          notes: '',
          isFavorite: false,
          tags: ['multiplayer', 'moba', 'competitive', 'complex'],
          releaseYear: 2013,
          achievements: { unlocked: 50, total: 200 },
          totalPlaytime: 100,
          averageRating: undefined,
          completionPercentage: undefined,
          launcherId: 'steam',
          appId: 570,
          lastLocalPlayedAt: new Date(Date.now() - 3600000).toISOString(),
          localSessionMinutes: 6000,
          localSessionCount: 50
        },
        {
          id: 'steam-271590',
          title: 'Grand Theft Auto V',
          description: 'When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld.',
          backgroundImages: ['https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg'],
          coverImage: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
          releaseDate: new Date('2015-04-14'),
          developer: 'Rockstar North',
          publisher: 'Rockstar Games',
          genres: [
            {
              id: 'action',
              name: 'Action',
              description: 'Fast-paced games emphasizing physical challenges',
              color: 'from-red-500 to-orange-600',
              icon: undefined,
              subgenres: []
            },
            {
              id: 'adventure',
              name: 'Adventure',
              description: 'Games focused on exploration and storytelling',
              color: 'from-green-500 to-blue-600',
              icon: undefined,
              subgenres: []
            }
          ],
          subgenres: [],
          platforms: [{ id: 'steam', name: 'Steam', code: 'steam' as any, isConnected: true }],
          emotionalTags: [],
          userRating: undefined,
          globalRating: 92,
          playStatus: 'completed',
          hoursPlayed: 45,
          lastPlayed: new Date(Date.now() - 604800000), // 1 week ago
          addedAt: new Date(),
          notes: 'Amazing story and open world',
          isFavorite: true,
          tags: ['open-world', 'single-player', 'story', 'action'],
          releaseYear: 2015,
          achievements: { unlocked: 40, total: 77 },
          totalPlaytime: 45,
          averageRating: undefined,
          completionPercentage: undefined,
          launcherId: 'steam',
          appId: 271590,
          lastLocalPlayedAt: new Date(Date.now() - 604800000).toISOString(),
          localSessionMinutes: 2700,
          localSessionCount: 15
        }
      ]

      setImportProgress(30)
      setImportStatus('Adding games to your library...')

      // Add games with delay for effect
      for (let i = 0; i < demoGames.length; i++) {
        actions.addGame(demoGames[i])
        setImportProgress(30 + (i / demoGames.length) * 65)
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setImportProgress(100)
      setImportStatus(`Successfully added ${demoGames.length} demo games!`)

      setTimeout(() => {
        setIsImporting(false)
        onComplete?.(demoGames.length)
      }, 1500)

    } catch (error) {
      console.error('Demo import failed:', error)
      setIsImporting(false)
      setImportProgress(0)
      setImportStatus('')
      onError?.(error instanceof Error ? error : new Error('Demo import failed'))
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Import Steam Library</h3>
        <p className="text-white/70 text-sm">
          Add demo games to test the recommendation engine and library features.
        </p>
      </div>

      {!isImporting ? (
        <div className="space-y-4">
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">🎮 Demo Mode</h4>
            <p className="text-blue-100/80 text-sm mb-4">
              Try our Steam import feature with demo data. This will add 4 popular games to your library with realistic playtime and achievement data.
            </p>
            <ul className="text-blue-100/60 text-xs space-y-1 mb-4">
              <li>• Counter-Strike 2 (Competitive FPS)</li>
              <li>• Team Fortress 2 (Free-to-play multiplayer)</li>
              <li>• Dota 2 (Strategy MOBA)</li>
              <li>• Grand Theft Auto V (Open-world action)</li>
            </ul>
          </div>

          <button
            onClick={handleDemoImport}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
          >
            Add Demo Games to Library
          </button>

          <div className="text-center">
            <p className="text-white/50 text-xs">
              Full Steam import coming soon with API integration
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
              <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Importing Demo Games
            </h4>
            <p className="text-white/70 text-sm">
              {importStatus}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/70">
              <span>Progress</span>
              <span>{Math.round(importProgress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${importProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="text-white/80 text-sm font-medium mb-2">What gets imported?</h4>
        <ul className="text-white/60 text-xs space-y-1">
          <li>• Game metadata (titles, descriptions, cover images)</li>
          <li>• Playtime data and last played dates</li>
          <li>• Achievement progress</li>
          <li>• Genre and tag information for recommendations</li>
        </ul>
      </div>
    </div>
  )
}
