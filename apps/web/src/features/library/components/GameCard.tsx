import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { PlayStatus } from '@gamepilot/types'
import type { Game } from '@gamepilot/types'
import { MOODS } from '@gamepilot/static-data'
import { getHighQualityGameImage } from "../../../utils/gameImageUtils";
import { useLibraryStore } from '../../../stores/useLibraryStore'
import { LazyImage } from '../../../components/LazyImage'
import { deriveMoodFromGame } from '../../../utils/moodMapping'

interface GameCardProps {
  game: Game
  isSelected?: boolean
  isSelectable?: boolean
  onSelect?: (game: Game, selected: boolean) => void
  currentSession?: { gameId: string; startedAt: number } | null
  onLaunch?: (game: Game) => void
  onDelete?: (game: Game) => void
  onEdit?: (game: Game) => void
  capsuleImage?: string
}

export function GameCard({ game, isSelected, isSelectable, onSelect, currentSession, onLaunch, onDelete, onEdit }: GameCardProps) {
  const navigate = useNavigate()
  const { actions } = useLibraryStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isInSession, setIsInSession] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  
  // Check if game is currently in a session
  useEffect(() => {
    setIsInSession(currentSession?.gameId === game.id)
  }, [currentSession, game.id])

  const handleDetailsClick = () => {
    navigate(`/library/game/${game.id}`)
  }

  const handleLaunchClick = async () => {
    if (isLaunching || !onLaunch) return
    
    setIsLaunching(true)
    try {
      await onLaunch(game)
    } finally {
      setIsLaunching(false)
    }
  }

  const handleEndSession = async () => {
    if (currentSession) {
      // End the current session
      await actions.endGameSession(currentSession.gameId)
    }
  }

  const getStatusColor = (status: PlayStatus) => {
    switch (status) {
      case 'playing': return 'from-green-500 to-emerald-500'
      case 'completed': return 'from-blue-500 to-indigo-500'
      case 'backlog': return 'from-gray-500 to-slate-500'
      case 'abandoned': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getStatusIcon = (status: PlayStatus) => {
    switch (status) {
      case 'playing': return '🎮'
      case 'completed': return '✅'
      case 'backlog': return '📚'
      case 'abandoned': return '🚫'
      default: return '📋'
    }
  }

  const getStatusBadgeStyles = (status: PlayStatus) => {
    const baseStyles = 'px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm border'
    switch (status) {
      case 'playing':
        return `${baseStyles} bg-green-600/80 border-green-500/40`
      case 'completed':
        return `${baseStyles} bg-blue-600/80 border-blue-500/40`
      case 'backlog':
        return `${baseStyles} bg-gray-600/80 border-gray-500/40`
      case 'abandoned':
        return `${baseStyles} bg-red-600/80 border-red-500/40`
      default:
        return `${baseStyles} bg-gray-600/80 border-gray-500/40`
    }
  }

  const hasSteamAppId = game.appId && String(game.appId).trim() !== ''

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-gaming-primary shadow-gaming-primary/50' 
          : 'border-gray-700/50 hover:border-gray-600/50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      {isSelectable && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-3 left-3 z-10"
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onSelect?.(game, e.target.checked)
            }}
            className="w-5 h-5 rounded border-2 border-gray-300 text-gaming-primary focus:ring-gaming-primary focus:ring-2 transition-colors"
            aria-label={`Select ${game.title}`}
            title={`Select ${game.title}`}
          />
        </motion.div>
      )}
      
      {/* Game Cover Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20 flex-shrink-0 group">
        {getHighQualityGameImage(game) ? (
          <>
            <LazyImage
              src={getHighQualityGameImage(game)}
              alt={game.title}
              className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            />
            {/* Enhanced overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300">
            <span className="text-6xl text-gray-500 group-hover:text-gray-400 transition-colors duration-300">🎮</span>
          </div>
        )}
        
        {/* Enhanced Sale Badge */}
        {(game as any).price && (game as any).price.discount_percent > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white text-sm font-bold z-10 shadow-lg shadow-red-500/30 animate-pulse">
            -{(game as any).price.discount_percent}%
          </div>
        )}

        {/* New Visual Status Badge */}
        {game.playStatus && game.playStatus !== 'backlog' && (
          <div className="absolute top-3 right-3 z-10">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm border ${getStatusBadgeStyles(game.playStatus)}`}>
              {getStatusIcon(game.playStatus)} {game.playStatus.toUpperCase()}
            </div>
          </div>
        )}

        {/* Visual Progress Ring for completion */}
        {game.completionPercentage !== undefined && game.completionPercentage > 0 && (
          <div className="absolute bottom-3 right-3 z-10">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - game.completionPercentage / 100)}`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{Math.round(game.completionPercentage)}%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Game Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col justify-between">
          {/* Top Section - Title and basic info */}
          <div>
            {/* Title */}
            <h3 className="text-white font-bold text-xl mb-3 line-clamp-2 transition-all duration-200 group-hover:text-gaming-primary leading-tight">
              {game.title}
            </h3>

            {/* Enhanced Metadata Row */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700/40">
              {/* Platform and Genre with better styling */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {game.platforms && game.platforms.length > 0 && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-sm rounded-lg text-xs text-gray-200 font-semibold border border-gray-600/50 truncate shadow-sm">
                    🎯 {typeof game.platforms[0] === 'string' ? game.platforms[0] : game.platforms[0]?.name || 'Unknown'}
                  </span>
                )}
                {game.genres && game.genres.length > 0 && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm rounded-lg text-xs text-blue-200 font-semibold border border-blue-500/40 truncate shadow-sm">
                    🎭 {typeof game.genres[0] === 'string' ? game.genres[0] : game.genres[0]?.name || 'Genre'}
                  </span>
                )}
              </div>
              {/* Enhanced Status and Playtime */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {game.playStatus && game.playStatus !== 'backlog' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-600/40 shadow-sm">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStatusColor(game.playStatus)} animate-pulse`} />
                    <span className="text-xs text-white font-semibold capitalize">
                      {game.playStatus}
                    </span>
                  </div>
                )}
                {game.hoursPlayed !== undefined && game.hoursPlayed > 0 && (
                  <span className="text-xs text-gray-300 font-bold bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-600/40 shadow-sm">
                    ⏱️ {Math.floor(game.hoursPlayed)}h
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section - Additional content to fill space */}
          <div className="flex-1 py-3">
            {/* Description or additional info */}
            {game.description && typeof game.description === 'string' && (
              <p className="text-gray-300 text-xs line-clamp-3 mb-3 leading-relaxed">
                {game.description}
              </p>
            )}
            
            {/* Enhanced Mood Display */}
            <div className="flex flex-wrap gap-1 mb-3">
              {game.moods && Array.isArray(game.moods) && game.moods.length > 0 ? (
                game.moods.slice(0, 2).map((moodId: string, index: number) => {
                  const mood = MOODS.find(m => m.id === moodId)
                  if (!mood) return null
                  return (
                    <motion.span
                      key={moodId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        mood.id === 'competitive' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                        mood.id === 'chill' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
                        mood.id === 'story' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' :
                        mood.id === 'creative' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                        mood.id === 'social' ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' :
                        mood.id === 'focused' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' :
                        mood.id === 'energetic' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
                        mood.id === 'exploratory' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                        'bg-gray-500/20 border-gray-500/40 text-gray-300'
                      }`}
                    >
                      {mood.emoji} {mood.name}
                    </motion.span>
                  )
                })
              ) : (
                // Derive mood from game if not explicitly tagged
                (() => {
                  const derivedMoodId = deriveMoodFromGame(game)
                  const derivedMood = derivedMoodId ? MOODS.find(m => m.id === derivedMoodId) : null
                  return derivedMood ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        derivedMood.id === 'competitive' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                        derivedMood.id === 'chill' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
                        derivedMood.id === 'story' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' :
                        derivedMood.id === 'creative' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                        derivedMood.id === 'social' ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' :
                        derivedMood.id === 'focused' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' :
                        derivedMood.id === 'energetic' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
                        derivedMood.id === 'exploratory' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                        'bg-gray-500/20 border-gray-500/40 text-gray-300'
                      }`}
                    >
                      {derivedMood.emoji} {derivedMood.name}
                    </motion.span>
                  ) : null
                })()
              )}
              
              {/* Show play status as secondary tag */}
              {game.playStatus && game.playStatus !== 'backlog' && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  game.playStatus === 'playing' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                  game.playStatus === 'completed' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' :
                  game.playStatus === 'abandoned' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                  'bg-gray-500/20 border-gray-500/40 text-gray-300'
                }`}>
                  {getStatusIcon(game.playStatus)} {game.playStatus}
                </span>
              )}
            </div>

            {/* Rating or achievement info */}
            {(game as any).rating || (game as any).achievements ? (
              <div className="flex items-center justify-between text-xs">
                {(game as any).rating && typeof (game as any).rating === 'string' && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-gray-300">{(game as any).rating}</span>
                  </div>
                )}
                {(game as any).achievements && typeof (game as any).achievements === 'string' && (
                  <div className="flex items-center gap-1">
                    <span className="text-green-400">🏆</span>
                    <span className="text-gray-300">{(game as any).achievements}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Bottom Section - Action Buttons */}
          <div>
            <div className="flex gap-2.5">
              {/* Enhanced Details Button */}
              <button
                onClick={handleDetailsClick}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gaming-primary/90 to-gaming-secondary/90 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-gaming-primary/40 border border-gaming-primary/30 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <span className="text-base">📋</span>
                <span>Details</span>
              </button>
              
              {/* Enhanced Play Button */}
              {hasSteamAppId && (
                <button
                  onClick={isInSession ? handleEndSession : handleLaunchClick}
                  disabled={isLaunching}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 border backdrop-blur-sm ${
                    isInSession 
                      ? 'bg-gradient-to-r from-red-600/90 to-red-700/90 text-white hover:opacity-90 hover:shadow-lg hover:shadow-red-600/40 border-red-500/30'
                      : isLaunching
                      ? 'bg-gradient-to-r from-gray-600/90 to-gray-700/90 text-gray-300 cursor-not-allowed border-gray-500/30'
                      : 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 text-white hover:opacity-90 hover:shadow-lg hover:shadow-green-600/40 border-green-500/30'
                  }`}
                >
                  <span className="text-base">{isInSession ? '⏹️' : isLaunching ? '⏳' : '▶️'}</span>
                  <span>{isInSession ? 'End' : isLaunching ? 'Launching...' : 'Play'}</span>
                </button>
              )}
              
              {/* Edit buttons for bulk mode */}
              {isSelectable && (
                <button
                  onClick={() => onSelect?.(game, true)}
                  className="px-3 py-3 bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/40 border border-blue-500/30 backdrop-blur-sm"
                  title="Select game"
                >
                  <span className="text-base">✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
