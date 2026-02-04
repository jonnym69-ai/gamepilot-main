import React from 'react'
import { useLibraryStore } from '../stores/useLibraryStore'
import { Button } from './ui/Button'
import { Loading } from './Loading'
import type { Game } from '../types'

interface SteamImportInlineProps {
  className?: string
}

export function SteamImportInline({ className = '' }: SteamImportInlineProps) {
  const { actions } = useLibraryStore()
  const [isImporting, setIsImporting] = React.useState(false)
  const [importStatus, setImportStatus] = React.useState('')

  const handleImport = async () => {
    setIsImporting(true)
    setImportStatus('Connecting to Steam...')

    try {
      // Simulate Steam API connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      setImportStatus('Fetching games...')

      await new Promise(resolve => setTimeout(resolve, 1000))
      setImportStatus('Creating demo library...')

      try {
        // Create demo Steam games data
        const demoGames: Game[] = [
          {
            id: 'steam-730',
            title: 'Counter-Strike 2',
            description: 'The world\'s #1 online action game. Experience the thrill of competitive tactical shooter gameplay.',
            backgroundImages: ['https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg'],
            moods: {
              primary: 'competitive',
              secondary: undefined,
              intensity: 0.9
            },
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
                icon: '⚔️',
                tags: []
              }
            ],
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
            moods: {
              primary: 'competitive',
              secondary: undefined,
              intensity: 0.8
            },
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
                icon: '⚔️',
                tags: []
              }
            ],
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
          }
        ]

        // Add games to library
        for (const game of demoGames) {
          await actions.addGame(game)
        }

        setImportStatus('Successfully imported games!')
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        console.error('Import failed:', error)
        setImportStatus('Import failed. Please try again.')
      }
    } catch (error) {
      console.error('Steam import error:', error)
      setImportStatus('Failed to connect to Steam')
    } finally {
      setIsImporting(false)
      setTimeout(() => setImportStatus(''), 3000)
    }
  }

  return (
    <div className={`glass-morphism rounded-xl p-6 ${className}`}>
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎮</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Import from Steam</h3>
          <p className="text-gray-400 text-sm mb-4">
            Connect your Steam account to automatically import your game library
          </p>
        </div>

        {isImporting ? (
          <div className="space-y-3">
            <Loading size="sm" />
            <p className="text-blue-400 text-sm">{importStatus}</p>
          </div>
        ) : (
          <Button
            onClick={handleImport}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            disabled={isImporting}
          >
            Import Steam Library
          </Button>
        )}

        {importStatus && !isImporting && (
          <p className={`text-sm mt-2 ${
            importStatus.includes('Successfully') 
              ? 'text-green-400' 
              : importStatus.includes('failed') || importStatus.includes('Failed')
              ? 'text-red-400'
              : 'text-blue-400'
          }`}>
            {importStatus}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            This is a demo import that adds sample games to your library
          </p>
        </div>
      </div>
    </div>
  )
}
