// Simple test data generator for virtual scrolling performance testing
import { useLibraryStore } from '../stores/useLibraryStore'
import type { Game, PlayStatus } from '@gamepilot/types'

export function addTestGamesToLibrary(count: number = 100) {
  const { actions } = useLibraryStore.getState()
  
  const genres = ['action', 'rpg', 'adventure', 'strategy', 'simulation', 'puzzle', 'fps', 'racing', 'sports', 'horror']
  const emotionalTags = ['Competitive', 'Chill', 'Energetic', 'Social', 'Story', 'Creative', 'Focused']
  const playStatuses: PlayStatus[] = ['unplayed', 'playing', 'completed', 'paused', 'backlog']
  
  for (let i = 0; i < count; i++) {
    const selectedGenres = genres.slice(0, Math.floor(Math.random() * 3) + 1)
    const selectedEmotionalTags = emotionalTags.slice(0, Math.floor(Math.random() * 2) + 1)
    
    const game: Game = {
      id: `test-game-${i + 1}`,
      title: `Test Game ${i + 1}`,
      description: `This is a test game for performance testing number ${i + 1}`,
      backgroundImages: [],
      coverImage: `https://picsum.photos/seed/test-game-${i + 1}/400/600.jpg`,
      releaseDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      developer: `Test Developer ${i + 1}`,
      publisher: `Test Publisher ${i + 1}`,
      genres: selectedGenres as any,
      platforms: [{ id: 'steam', name: 'Steam', code: 'steam' as any, isConnected: true }],
      moods: selectedEmotionalTags as any,
      emotionalTags: selectedEmotionalTags as any,
      userRating: Math.floor(Math.random() * 5) + 5,
      globalRating: Math.floor(Math.random() * 5) + 5,
      playStatus: playStatuses[Math.floor(Math.random() * playStatuses.length)],
      hoursPlayed: Math.floor(Math.random() * 500),
      lastPlayed: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) : undefined,
      addedAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      notes: `Test game ${i + 1} for performance testing`,
      isFavorite: Math.random() > 0.8,
      releaseYear: 2020 + Math.floor(Math.random() * 4),
      achievements: { 
        unlocked: Math.floor(Math.random() * 50), 
        total: 50 + Math.floor(Math.random() * 50)
      }
    }
    
    actions.addGame(game)
  }
  
  return count
}
