import React, { useState } from 'react'
import type { Game, PlayStatus } from '@gamepilot/types'
import { useLibraryStore } from '../../../stores/useLibraryStore'

interface GameDetailsPanelProps {
  game: Game | null
  onClose: () => void
  onGameUpdate?: (game: Game) => void
  onLaunchGame?: (game: Game) => void
}

export const GameDetailsPanel: React.FC<GameDetailsPanelProps> = ({
  game,
  onClose,
  onGameUpdate,
  onLaunchGame
}) => {
  const { actions } = useLibraryStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState(game?.notes || '')
  const [editedRating, setEditedRating] = useState(game?.userRating || 0)
  const [editedStatus, setEditedStatus] = useState(game?.playStatus ?? 'backlog')
  const [isTrackingTime, setIsTrackingTime] = useState(false)

  if (!game) return null

  const handleSave = () => {
    if (onGameUpdate) {
      const updatedGame = {
        ...game,
        notes: editedNotes,
        userRating: editedRating,
        playStatus: editedStatus
      }
      onGameUpdate(updatedGame)
    }
    setIsEditing(false)
  }

  const handleLaunch = () => {
    if (onLaunchGame && game) {
      onLaunchGame(game)
    }
  }

  const handleStatusChange = (newStatus: PlayStatus) => {
    setEditedStatus(newStatus)
    if (game) {
      actions.updateGameStatus(game.id, newStatus)
    }
  }

  const handleTimeTracking = () => {
    if (game) {
      setIsTrackingTime(!isTrackingTime)
      if (!isTrackingTime) {
        // Start tracking - could implement a timer here
        console.log(`Started tracking time for ${game.title}`)
      } else {
        // Stop tracking and update playtime
        const additionalTime = 1 // In real implementation, this would be actual tracked time
        const currentPlaytime = game.hoursPlayed || 0
        actions.updateGamePlaytime(game.id, currentPlaytime + additionalTime)
        console.log(`Stopped tracking time for ${game.title}. Added ${additionalTime} hours.`)
      }
    }
  }

  const handleCancel = () => {
    setEditedNotes(game.notes || '')
    setEditedRating(game.userRating || 0)
    setEditedStatus(game.playStatus || 'backlog')
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'playing': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'backlog': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'abandoned': return 'bg-red-500/20 text-red-400 border-red-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-morphism rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto cinematic-shadow">
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20">
          {game.coverImage ? (
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl flex items-center justify-center">
                <span className="text-5xl">🎮</span>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            ✕
          </button>
          
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              {game.developer && <span>🏢 {game.developer}</span>}
              {game.releaseDate && <span>📅 {game.releaseDate.getFullYear()}</span>}
              {game.hoursPlayed && <span>⏱️ {game.hoursPlayed}h played</span>}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(game.playStatus || 'backlog')}`}>
                {game.playStatus || 'backlog'}
              </span>
              
              {game.platforms && (
                <div className="flex gap-2">
                  {game.platforms.map((platform) => (
                    <span key={platform.id} className="px-2 py-1 bg-gaming-primary/20 text-gaming-primary rounded text-xs">
                      {platform.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
            <button
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            
            {!isEditing && onLaunchGame && (
              <button
                onClick={handleLaunch}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                title={game.launcherId ? undefined : 'No launcher ID set'}
              >
                <span>🎮</span>
                Launch Game
              </button>
            )}
          </div>
          </div>

          {/* Game Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Rating */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Rating</h3>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={editedRating}
                      onChange={(e) => setEditedRating(parseFloat(e.target.value))}
                      className="flex-1 accent-gaming-accent"
                    />
                    <span className="text-white font-medium">{editedRating} ⭐</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-yellow-400">⭐</span>
                    <span className="text-xl text-white">{game.userRating || 'Not rated'}</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Status</h3>
                  {isEditing ? (
                    <select
                      value={editedStatus}
                      onChange={(e) => handleStatusChange(e.target.value as 'playing' | 'completed' | 'backlog' | 'abandoned')}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="playing">Playing</option>
                      <option value="completed">Completed</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(game.playStatus || 'backlog')}`}>
                        {game.playStatus || 'Backlog'}
                      </span>
                      <button
                        onClick={handleTimeTracking}
                        className={`px-3 py-1 rounded-lg text-sm ${isTrackingTime ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        {isTrackingTime ? '⏹️ Stop' : '⏱️ Track Time'}
                      </button>
                    </div>
                  )}
                </div>

              {/* Genres */}
              {game.genres && game.genres.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.map((genre) => (
                      <span key={genre.id} className="px-3 py-1 bg-gaming-secondary/20 text-gaming-secondary rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Emotional Tags */}
              {game.tags && game.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Emotional Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-accent-500/20 text-accent-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Achievements */}
              {game.achievements && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Achievements</h3>
                  <div className="glass-morphism rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Progress</span>
                      <span className="text-accent-400">
                        {game.achievements.unlocked} / {game.achievements.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-gaming-primary to-gaming-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(game.achievements.unlocked / game.achievements.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Last Played */}
              {game.lastPlayed && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Last Played</h3>
                  <p className="text-white">{game.lastPlayed?.toLocaleDateString()}</p>
                </div>
              )}

              {/* Publisher */}
              {game.publisher && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Publisher</h3>
                  <p className="text-white">{game.publisher}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {game.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
              <p className="text-gray-100 leading-relaxed">{game.description}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Personal Notes</h3>
            {isEditing ? (
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Add your thoughts about this game..."
                className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gaming-accent focus:outline-none resize-none"
              />
            ) : (
              <div className="glass-morphism rounded-lg p-4">
                <p className="text-gray-100">
                  {game.notes || 'No notes yet. Click Edit to add your thoughts.'}
                </p>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
