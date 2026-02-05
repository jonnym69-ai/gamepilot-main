import React, { useState, useMemo } from 'react'
import { useLibraryStore, getTrendingGames, getRecommendedGames } from '../../stores/useLibraryStore'
import { GameCard } from '../library/components/GameCard'
import { GameSearch } from './components'
import { GameDetailsPanel } from './components'
import { AddGameModal } from './components'
import { SteamImportModal } from './components'
import { BulkOperations } from './components'
import { GameDetailsModal } from './components/GameDetailsModal'
import type { Game } from '@gamepilot/types'

// Mood-based game filtering - Uses heuristic genre matching for recommendations
// Future enhancement: Integrate with identity-engine mood analysis
function matchesTemporaryMoodFallback(game: any, mood: string): boolean {
  const genreNames = (game.genres || []).map((g: any) => 
    (g.description || g.name || '').toLowerCase()
  );

  switch (mood.toLowerCase()) {
    case "chill":
      return genreNames.some((g: string) => ["indie", "casual", "adventure", "simulation", "puzzle"].includes(g));
    case "competitive":
      return genreNames.some((g: string) => ["action", "shooter", "rpg", "fighting", "racing", "sports"].includes(g));
    case "story":
      return genreNames.some((g: string) => ["rpg", "adventure", "narrative", "visual novel"].includes(g));
    case "horror":
      return genreNames.includes("horror");
    case "strategic":
      return genreNames.some((g: string) => ["strategy", "simulation", "turn-based", "management"].includes(g));
    case "creative":
      return genreNames.some((g: string) => ["sandbox", "building", "design", "modding"].includes(g));
    default:
      return true;
  }
}

// Session length filtering - Uses local playtime data for session recommendations
// Future enhancement: Integrate with gaming analytics for accurate session predictions
function matchesTemporarySessionFallback(game: any, length: string): boolean {
  const minutes = game.localSessionMinutes || 0;

  switch (length.toLowerCase()) {
    case "short":
      return minutes < 30;
    case "medium":
      return minutes >= 30 && minutes < 120;
    case "long":
      return minutes >= 120;
    default:
      return true;
  }
}

export const Library: React.FC = () => {
  // Safely access the store with error handling
  let storeData: any = null
  let error: string | null = null
  
  try {
    storeData = useLibraryStore()
  } catch (err) {
    console.error('LibraryEnhanced store access error:', err)
    error = 'Failed to access library store'
  }

  // Safe destructuring with fallbacks
  const games = storeData?.games || []
  const currentSession = storeData?.currentSession || null
  const actions = storeData?.actions || {}
  const intelligence = storeData?.intelligence || {
    selectedMood: '',
    selectedSessionLength: '',
    selectedGenres: [],
    selectedSorting: 'title',
    preferredGenres: [],
    preferredMoods: [],
    preferredSessionStyle: null
  }
  const setIntelligenceState = storeData?.setIntelligenceState || (() => {})
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false)
  const [isSteamImportModalOpen, setIsSteamImportModalOpen] = useState(false)

  // Error boundary fallback
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Library Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Event handlers
  const handleClearSelection = () => {
    setSelectedGames([])
  }

  const handleSelectAll = () => {
    setSelectedGames(sortedAndFilteredGames.map((game: any) => game.id))
  }

  const handleCloseDetails = () => {
    setIsDetailsPanelOpen(false)
    setSelectedGame(null)
  }

  const handleGameUpdate = (updatedGame: any) => {
    actions.updateGameStatus(updatedGame.id, updatedGame.playStatus || 'backlog')
    if (updatedGame.hoursPlayed) {
      actions.updateGamePlaytime(updatedGame.id, updatedGame.hoursPlayed)
    }
  }

  const sortedAndFilteredGames = useMemo(() => {
    try {
      let filtered = games;

      // Search filter (optional)
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter((game: any) => 
          game.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Genre filter (optional)
      if (intelligence.selectedGenres.length > 0) {
        const normalizedSelectedGenres = intelligence.selectedGenres.map((g: string) => g.toLowerCase());
        filtered = filtered.filter((game: any) => 
          game.genres?.some((g: any) => {
            const genreName = (g.description || g.name || '').toLowerCase();
            return normalizedSelectedGenres.includes(genreName);
          })
        );
      }

      // Mood filter (optional - temporary fallback)
      if (intelligence.selectedMood) {
        filtered = filtered.filter((game: any) => 
          matchesTemporaryMoodFallback(game, intelligence.selectedMood)
        );
      }

      // Session length filter (optional - temporary fallback)
      if (intelligence.selectedSessionLength) {
        filtered = filtered.filter((game: any) => 
          matchesTemporarySessionFallback(game, intelligence.selectedSessionLength)
        );
      }

      // Smart sorting (optional - only reorders, never filters)
      if (intelligence.selectedSorting === 'trending') {
        filtered = getTrendingGames(filtered);
      } else if (intelligence.selectedSorting === 'recommended') {
        filtered = getRecommendedGames(
          filtered,
          intelligence.preferredGenres,
          intelligence.preferredMoods,
          intelligence.preferredSessionStyle
        );
      } else if (intelligence.selectedSorting === 'hidden-gems') {
        filtered = filtered
          .filter((g: any) => (g.globalRating || 0) > 80 && (g.hoursPlayed || 0) < 2)
          .sort((a: any, b: any) => (b.globalRating || 0) - (a.globalRating || 0));
      } else {
        // Default sorting (optional)
        filtered = filtered.sort((a: any, b: any) => {
          switch (intelligence.selectedSorting) {
            case 'title':
              return a.title.localeCompare(b.title);
            case 'rating':
              return (b.userRating || 0) - (a.userRating || 0);
            case 'playtime':
              return (b.hoursPlayed || 0) - (a.hoursPlayed || 0);
            case 'lastPlayed':
              return new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime();
            default:
              return a.title.localeCompare(b.title);
          }
        });
      }

      // Final safety check - always return filtered, never empty array unless no games
      return filtered;
    } catch (err) {
      console.error('Error in sortedAndFilteredGames:', err);
      return games; // Return original games on error, never empty array
    }
  }, [games, searchTerm, intelligence.selectedMood, intelligence.selectedGenres, intelligence.selectedSessionLength, intelligence.selectedSorting])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-gaming bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent mb-2">
                Game Library
              </h1>
              <p className="text-gray-300">
                Your unified collection across all platforms
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (confirm(`Remove duplicates? This will reduce ${games.length} games to unique titles only.`)) {
                    actions.deduplicateGames()
                  }
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
              >
                <span>🧹</span>
                Remove Duplicates ({games.length})
              </button>
              <button
                onClick={() => setIsSteamImportModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <span>🔗</span>
                Import Steam
              </button>
              <button
                onClick={() => setIsAddGameModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center gap-2"
              >
                <span>+</span>
                Add Game
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Intelligence Engine Filters */}
          <div className="lg:col-span-1">
            <div className="glass-morphism rounded-xl p-6 mb-4">
              <h3 className="text-lg font-semibold text-white mb-4">🧠 Intelligence</h3>
              
              {/* Mood Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                <div className="grid grid-cols-2 gap-2">
                  {['competitive', 'chill', 'story', 'strategy', 'horror'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setIntelligenceState({
                        selectedMood: intelligence.selectedMood === mood ? '' : mood,
                        selectedGenres: intelligence.selectedGenres,
                        selectedSessionLength: intelligence.selectedSessionLength,
                        selectedSorting: intelligence.selectedSorting
                      })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        intelligence.selectedMood === mood 
                          ? 'bg-gaming-accent text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Length Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Session Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {['short', 'medium', 'long'].map((length) => (
                    <button
                      key={length}
                      onClick={() => setIntelligenceState({
                        selectedMood: intelligence.selectedMood,
                        selectedGenres: intelligence.selectedGenres,
                        selectedSessionLength: intelligence.selectedSessionLength === length ? '' : length,
                        selectedSorting: intelligence.selectedSorting
                      })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        intelligence.selectedSessionLength === length 
                          ? 'bg-gaming-accent text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'action', label: 'Action', icon: '⚔️' },
                    { id: 'rpg', label: 'RPG', icon: '🗡️' },
                    { id: 'strategy', label: 'Strategy', icon: '🧠' },
                    { id: 'adventure', label: 'Adventure', icon: '🧭' },
                    { id: 'indie', label: 'Indie', icon: '⭐' }
                  ].map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => {
                        setIntelligenceState({
                          selectedMood: intelligence.selectedMood,
                          selectedGenres: intelligence.selectedGenres.includes(genre.id) 
                            ? intelligence.selectedGenres.filter((g: string) => g !== genre.id)
                            : [...intelligence.selectedGenres, genre.id],
                          selectedSessionLength: intelligence.selectedSessionLength,
                          selectedSorting: intelligence.selectedSorting
                        })
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                        intelligence.selectedGenres.includes(genre.id) 
                          ? 'bg-gaming-accent text-white shadow-lg shadow-gaming-accent/25' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      <span className="text-base">{genre.icon}</span>
                      {genre.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Sorting */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Smart Sorting</label>
                <div className="space-y-2">
                  {[
                    { id: 'trending', label: '🔥 Trending' },
                    { id: 'recommended', label: '⭐ Recommended' },
                    { id: 'hidden-gems', label: '💎 Hidden Gems' }
                  ].map((sort) => (
                    <button
                      key={sort.id}
                      onClick={() => setIntelligenceState({
                        selectedMood: intelligence.selectedMood,
                        selectedGenres: intelligence.selectedGenres,
                        selectedSessionLength: intelligence.selectedSessionLength,
                        selectedSorting: intelligence.selectedSorting === sort.id ? 'title' : sort.id
                      })}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                        intelligence.selectedSorting === sort.id 
                          ? 'bg-gaming-accent text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setIntelligenceState({
                    selectedMood: '',
                    selectedGenres: [],
                    selectedSessionLength: '',
                    selectedSorting: 'title'
                  })
                }}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Clear Intelligence Filters
              </button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="lg:col-span-3">
            <GameSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              totalCount={games.length}
              filteredCount={sortedAndFilteredGames.length}
              onSortChange={(sort) => setIntelligenceState({ selectedSorting: sort })}
            />
          </div>
        </div>

        {/* Selection Controls */}
        <div className="mt-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedGames.length === sortedAndFilteredGames.length && sortedAndFilteredGames.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleSelectAll()
                  } else {
                    handleClearSelection()
                  }
                }}
                className="w-4 h-4 accent-gaming-accent"
              />
              <span className="text-sm text-gray-300">
                Select all ({sortedAndFilteredGames.length} games)
              </span>
            </div>
            
            {selectedGames.length > 0 && (
              <button
                onClick={() => setShowBulkOperations(!showBulkOperations)}
                className="px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-colors"
              >
                ⚡ Bulk Operations ({selectedGames.length})
              </button>
            )}
          </div>
        </div>

        {/* Game Grid */}
        <div className="mt-8">
          {sortedAndFilteredGames.length === 0 ? (
            <div className="glass-morphism rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No games found
              </h3>
              <p className="text-gray-300 mb-4">
                {intelligence.selectedMood && !searchTerm && !intelligence.selectedGenres.length
                  ? `No games match "${intelligence.selectedMood}" mood yet — mood intelligence coming soon.`
                  : searchTerm || intelligence.selectedGenres.length || intelligence.selectedMood
                    ? 'Try adjusting your filters or search terms.'
                    : 'Import some games to get started!'
                }
              </p>
              {(searchTerm || intelligence.selectedGenres.length || intelligence.selectedMood) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setIntelligenceState({
                      selectedMood: '',
                      selectedGenres: [],
                      selectedSessionLength: intelligence.selectedSessionLength,
                      selectedSorting: intelligence.selectedSorting
                    })
                  }}
                  className="px-4 py-2 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {sortedAndFilteredGames.map((game: any, index: number) => (
                <div key={game.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <GameCard
                    game={game}
                    capsuleImage={(game as any).capsuleImage || (game as any).headerImage || (game as any).smallHeaderImage}
                    currentSession={currentSession}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Operations Panel */}
        {showBulkOperations && (
          <BulkOperations
            selectedGames={selectedGames}
            onSelectionChange={setSelectedGames}
          />
        )}

        {/* Game Details Panel */}
        {isDetailsPanelOpen && selectedGame && (
          <GameDetailsPanel
            game={selectedGame}
            onClose={handleCloseDetails}
            onGameUpdate={handleGameUpdate}
          />
        )}

        {/* Add Game Modal */}
        {isAddGameModalOpen && (
          <AddGameModal
            isOpen={isAddGameModalOpen}
            onClose={() => setIsAddGameModalOpen(false)}
            onAddGame={(newGame: Omit<Game, 'id'>) => {
              const gameWithId: Game = {
                ...newGame,
                id: crypto.randomUUID(),
                lastPlayed: new Date(),
                addedAt: new Date(),
                releaseYear: new Date().getFullYear(),
                genres: [],
                emotionalTags: []
              }
              actions.setGames([...games, gameWithId])
              setIsAddGameModalOpen(false)
            }}
          />
        )}

        {/* Steam Import Modal */}
        {isSteamImportModalOpen && (
          <SteamImportModal
            isOpen={isSteamImportModalOpen}
            onClose={() => setIsSteamImportModalOpen(false)}
            onImportGames={(importedGames: Omit<Game, 'id'>[]) => {
              const gamesWithIds = importedGames.map(game => ({
                ...game,
                id: crypto.randomUUID(),
                lastPlayed: new Date(),
                addedAt: new Date(),
                releaseYear: new Date().getFullYear(),
                subgenres: [],
                emotionalTags: []
              }))
              actions.setGames([...games, ...gamesWithIds])
              setIsSteamImportModalOpen(false)
            }}
          />
        )}

        {/* Game Details Modal */}
        {selectedGame && (
          <GameDetailsModal
            game={selectedGame}
            onClose={handleCloseDetails}
            onLaunchGame={actions.launchGame}
          />
        )}
      </div>
    </div>
  )
}

export default Library
