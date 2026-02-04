import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLibraryStore } from '../../../stores/useLibraryStore'
import { emulatorService } from '../../../services/emulatorService'
import { emulatorLauncher } from '../../../services/emulatorLauncher'
import { useToast } from '../../../components/ui/ToastProvider'
import type { Game } from '@gamepilot/types'
import { MOODS, type MoodId } from '@gamepilot/static-data'
import { getEnhancedMoods } from '../../../utils/enhancedMoodTagging'
import './GameDetailsLayout.css'

// Import persona components
import { PersonaSummaryBar } from '../../../components/persona'
import { useGamePersona } from '../../../hooks/persona'

interface GameDetailsLayoutProps {
  game: Game
}

export const GameDetailsLayout: React.FC<GameDetailsLayoutProps> = ({ game }) => {
  const navigate = useNavigate()
  const { games, actions } = useLibraryStore()
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  
  // Generate better header image URL from Steam app ID
  const getHeaderImageUrl = (game: Game) => {
    if (game.coverImage) {
      // Convert library image to header image
      const appId = game.appId || game.id?.split('_')[1]
      if (appId) {
        return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`
      }
    }
    return game.coverImage
  }
  
  const headerImageUrl = getHeaderImageUrl(game)
  
  // Debug: Log the game object to see its structure
  console.log('🔍 Game Details - Full Game Object:', game)
  console.log('🔍 Game Details - Original Cover Image URL:', game?.coverImage)
  console.log('🔍 Game Details - Header Image URL:', headerImageUrl)
  
  // Get persona for this specific game
  const persona = useGamePersona(game.id)

  const handlePlayNow = async () => {
    console.log('🎮 Launching game:', game.title)
    
    // Show loading toast
    showInfo('Launching Game: Starting ' + game.title + '...', {
      autoClose: 2000
    })
    
    const platform = game.platforms?.[0]?.code
    
    // Check if this is an emulator game
    if (platform && emulatorService.isEmulatorPlatform(platform)) {
      try {
        const result = await emulatorLauncher.launchGame(game, { fullscreen: true })
        if (result.success) {
          showSuccess('Game Launched! ' + game.title + ' is now running', {
            autoClose: 3000
          })
          // Update game status to playing
          actions.updateGameStatus(game.id, 'playing')
        } else {
          showError('Launch Failed: ' + (result.error || 'Failed to launch emulator game'), {
            autoClose: 5000
          })
        }
      } catch (error) {
        showError('Launch Error: An error occurred while launching the game', {
          autoClose: 5000
        })
      }
    } else {
      // Steam/other platform launch logic - use direct Steam URL as fallback
      if (game.appId) {
        console.log('🎮 Launching Steam game with appId:', game.appId)
        
        // Direct Steam URL launch
        const steamUrl = `steam://rungameid/${game.appId}`
        console.log('🚀 Direct Steam URL:', steamUrl)
        
        try {
          window.location.href = steamUrl
          
          // Check if launch was successful (simple heuristic)
          setTimeout(() => {
            const isStillOnPage = document.visibilityState === 'visible'
            if (isStillOnPage) {
              showWarning('Launch Failed: Steam may not be installed or running. Please check Steam is available.', {
                autoClose: 5000
              })
            } else {
              showSuccess('Steam Launch Initiated: Opening ' + game.title + ' via Steam...', {
                autoClose: 3000
              })
              // Update game status to playing
              actions.updateGameStatus(game.id, 'playing')
            }
          }, 3000)
        } catch (error) {
          console.error('Failed to launch game:', error)
          showError('Launch Error: Could not execute launch command', {
            autoClose: 5000
          })
        }
      } else {
        console.warn('No appId found for game:', game.title)
        showWarning('Launch Not Available: This game cannot be launched automatically. App ID not found.', {
          autoClose: 4000
        })
      }
    }
  }

  const handleMarkCompleted = () => {
    console.log('✅ Marking game as completed:', game.title)
    actions.updateGameStatus(game.id, 'completed')
    showSuccess('Game Completed: ' + game.title + ' marked as completed', {
      autoClose: 3000
    })
  }

  const handleAddTags = () => {
    console.log('🏷️ Add tags for:', game.title)
    showInfo('Tags Feature: Tag management coming soon!', {
      autoClose: 3000
    })
  }

  const handleAddToShelf = () => {
    console.log('📚 Add to shelf:', game.title)
    showInfo('Shelf Feature: Custom shelves coming soon!', {
      autoClose: 3000
    })
  }

  const handleRateMood = () => {
    console.log('⭐ Rate mood for:', game.title)
    showInfo('Mood Rating: Mood rating system coming soon!', {
      autoClose: 3000
    })
  }

  const handleEditMetadata = () => {
    console.log('✏️ Edit metadata for:', game.title)
    showInfo('Edit Feature: Game editor coming soon!', {
      autoClose: 3000
    })
  }

  const handleMarkAsBacklog = () => {
    console.log('📋 Mark as backlog:', game.title)
    
    // Check if game already has backlog tag
    const currentTags = game.tags || []
    const hasBacklogTag = currentTags.includes('Backlog')
    
    if (hasBacklogTag) {
      // Remove backlog tag
      const updatedTags = currentTags.filter(tag => tag !== 'Backlog')
      actions.updateGame(game.id, { tags: updatedTags })
      showSuccess('Backlog tag removed from ' + game.title, {
        autoClose: 3000
      })
    } else {
      // Add backlog tag
      const updatedTags = [...currentTags, 'Backlog']
      actions.updateGame(game.id, { tags: updatedTags })
      showSuccess('Backlog tag added to ' + game.title, {
        autoClose: 3000
      })
    }
  }

  const formatPlaytime = (hours?: number) => {
    if (!hours) return '0h'
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  // Get enhanced moods for game
  const gameMoods = getEnhancedMoods(game)
  const gameMoodData = gameMoods.map(moodId => MOODS.find(m => m.id === moodId)).filter((mood): mood is Exclude<typeof mood, undefined> => mood !== undefined)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker">
      {/* Cinematic Hero Section with Enhanced Header */}
      <div className="relative h-96 overflow-hidden hero-section">
        {/* Background placeholder to prevent flashing */}
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-primary via-gaming-secondary to-gaming-accent" />
        
        {/* Background Image with Smooth Loading */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Game Cover Image with Better Sizing */}
          {headerImageUrl && (
            <img 
              src={headerImageUrl} 
              alt={game?.title}
              className="w-full h-full object-cover object-center game-header-image"
              style={{
                objectPosition: 'center center',
                filter: 'brightness(0.8) contrast(1.2)'
              }}
              onError={(e) => {
                console.error('❌ Header image failed to load:', headerImageUrl)
                // Fallback to gradient background
                e.currentTarget.style.display = 'none'
              }}
              onLoad={() => {
                console.log('✅ Header image loaded successfully:', headerImageUrl)
              }}
            />
          )}
        </motion.div>
        
        {/* Enhanced overlay layers for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gaming-primary/20 via-transparent to-gaming-accent/20"
          animate={{ 
            background: [
              "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), transparent, rgba(34, 197, 94, 0.2))",
              "linear-gradient(to bottom right, rgba(34, 197, 94, 0.2), transparent, rgba(168, 85, 247, 0.2))",
              "linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), transparent, rgba(59, 130, 246, 0.2))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          {/* Additional vignette for cinematic effect */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" 
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)'
            }}
          />
        </motion.div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0
              }}
              animate={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                {/* Mood/Persona Context */}
                {persona && (
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-gaming-primary/20 border border-gaming-primary/30 rounded-full text-gaming-primary text-xs font-medium backdrop-blur-sm">
                        🧠 {persona?.traits?.archetypeId || 'Explorer'}
                      </div>
                      <div className="px-3 py-1 bg-gaming-accent/20 border border-gaming-accent/30 rounded-full text-gaming-accent text-xs font-medium backdrop-blur-sm">
                        ⭐ {Math.round((persona?.traits?.confidence || 0) * 100)}% Match
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Era Badge */}
                <motion.div 
                  className="mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-medium backdrop-blur-sm">
                    {game?.releaseYear ? `From ${game.releaseYear}` : 'Classic Era'}
                  </span>
                </motion.div>
                
                {/* Title and Platform */}
                <motion.h1 
                  className="text-5xl font-bold text-white drop-shadow-2xl mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {game?.title}
                </motion.h1>
                <motion.div 
                  className="flex items-center gap-4 text-white/80 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>{game?.platforms?.map(platform => platform.name).join(' • ') || 'Unknown Platform'}</span>
                  {game?.hoursPlayed && (
                    <span className="flex items-center gap-1">
                      <span>⏱️</span>
                      {Math.floor(game.hoursPlayed)}h played
                    </span>
                  )}
                </motion.div>
              </div>
              
              {/* Launch Button */}
              <motion.button
                onClick={handlePlayNow}
                className="px-8 py-4 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-gaming-accent/50 flex items-center gap-3 backdrop-blur-sm border border-white/20 game-action-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-2xl">▶️</span>
                <span>Launch Game</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Bar */}
      <motion.div 
        className="bg-gaming-dark/80 backdrop-blur-xl border-b border-gaming-primary/20 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/library')}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-xl font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-gaming-accent/50"
            >
              <span className="text-xl">←</span>
              <span>Back to Library</span>
            </button>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/analytics')}
                className="px-4 py-2 bg-gaming-accent/20 border border-gaming-accent/30 text-gaming-accent rounded-lg font-medium transition-all hover:bg-gaming-accent/30"
              >
                📊 Analytics
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gaming-primary/20 border border-gaming-primary/30 text-gaming-primary rounded-lg font-medium transition-all hover:bg-gaming-primary/30"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-8 content-section">
        {/* Enhanced Actions Toolbar */}
        <motion.div 
          className="glass-morphism rounded-xl p-6 mb-8 border border-gaming-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between">
            {/* Enhanced Quick Stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gaming-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{formatPlaytime(game.hoursPlayed)}</div>
                  <div className="text-gray-400 text-sm">Total Playtime</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎮</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{game.localSessionCount || 0}</div>
                  <div className="text-gray-400 text-sm">Sessions</div>
                </div>
              </div>
              {game.lastLocalPlayedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{formatDate(game.lastLocalPlayedAt)}</div>
                    <div className="text-gray-400 text-sm">Last Played</div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddTags}
                className="p-3 bg-gaming-primary/20 hover:bg-gaming-primary/30 text-gaming-primary rounded-xl transition-all group relative border border-gaming-primary/30"
                title="Add Tags"
              >
                <span className="text-xl">🏷️</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-gaming-primary text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gaming-primary/30">
                  Add Tags
                </div>
              </button>
              <button
                onClick={handleAddToShelf}
                className="p-3 bg-gaming-accent/20 hover:bg-gaming-accent/30 text-gaming-accent rounded-xl transition-all group relative border border-gaming-accent/30"
                title="Add to Shelf"
              >
                <span className="text-xl">📚</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-gaming-accent text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gaming-accent/30">
                  Add to Shelf
                </div>
              </button>
              <button
                onClick={handleMarkCompleted}
                className="p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-all group relative border border-green-500/30"
                title="Mark as Completed"
              >
                <span className="text-xl">✅</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-green-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-green-500/30">
                  Mark as Completed
                </div>
              </button>
              <button
                onClick={handleMarkAsBacklog}
                className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all group relative border border-yellow-500/30"
                title={game.tags?.includes('Backlog') ? 'Remove from Backlog' : 'Mark as Backlog'}
              >
                <span className="text-xl">{game.tags?.includes('Backlog') ? '✓' : '📋'}</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-yellow-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-yellow-500/30">
                  {game.tags?.includes('Backlog') ? 'Remove from Backlog' : 'Mark as Backlog'}
                </div>
              </button>
              <button
                onClick={handleRateMood}
                className="p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-all group relative border border-purple-500/30"
                title="Rate Mood"
              >
                <span className="text-xl">⭐</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-purple-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-purple-500/30">
                  Rate Mood
                </div>
              </button>
              <button
                onClick={handleEditMetadata}
                className="p-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl transition-all group relative border border-amber-500/30"
                title="Edit Metadata"
              >
                <span className="text-xl">✏️</span>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-amber-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-amber-500/30">
                  Edit Metadata
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Game Info (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Identity + Mood Layer */}
            <div className="glass-morphism rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                Identity & Mood
              </h2>
              
              <div className="space-y-6">
                {/* Enhanced Mood Tags */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎭</span>
                    Game Moods
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {gameMoodData.length > 0 ? (
                      gameMoodData.map((mood, index) => (
                        <motion.div
                          key={mood.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 ${
                            mood.id === 'competitive' ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30 border-red-400/50 text-red-200 hover:from-red-500/40 hover:to-orange-500/40' :
                            mood.id === 'chill' ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-400/50 text-blue-200 hover:from-blue-500/40 hover:to-cyan-500/40' :
                            mood.id === 'story' ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400/50 text-purple-200 hover:from-purple-500/40 hover:to-pink-500/40' :
                            mood.id === 'creative' ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400/50 text-green-200 hover:from-green-500/40 hover:to-emerald-500/40' :
                            mood.id === 'social' ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 border-teal-400/50 text-teal-200 hover:from-teal-500/40 hover:to-cyan-500/40' :
                            mood.id === 'focused' ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-indigo-400/50 text-indigo-200 hover:from-indigo-500/40 hover:to-purple-500/40' :
                            mood.id === 'energetic' ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-400/50 text-yellow-200 hover:from-yellow-500/40 hover:to-orange-500/40' :
                            mood.id === 'exploratory' ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400/50 text-emerald-200 hover:from-emerald-500/40 hover:to-teal-500/40' :
                            'bg-gradient-to-r from-gray-500/30 to-slate-500/30 border-gray-400/50 text-gray-200 hover:from-gray-500/40 hover:to-slate-500/40'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <span className="text-lg">{mood.emoji}</span>
                            <span>{mood.name}</span>
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-gray-400 italic">
                        <span className="text-2xl mr-2">🤔</span>
                        No mood tags assigned yet
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Emotional Profile */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">What this game says about you</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <p className="text-gray-300 leading-relaxed">
                      {gameMoodData.some(mood => mood.id === 'competitive') && "You're driven by achievement and enjoy testing your skills against others. "}
                      {gameMoodData.some(mood => mood.id === 'story') && "You appreciate deep narratives and emotional storytelling experiences. "}
                      {gameMoodData.some(mood => mood.id === 'creative') && "You love self-expression and building unique experiences. "}
                      {gameMoodData.some(mood => mood.id === 'social') && "You value connection and shared experiences with others. "}
                      {gameMoodData.some(mood => mood.id === 'chill') && "You prefer relaxed, stress-free gaming sessions. "}
                      {gameMoodData.some(mood => mood.id === 'focused') && "You enjoy strategic thinking and deep concentration. "}
                      {gameMoodData.some(mood => mood.id === 'energetic') && "You thrive on adrenaline and high-energy gameplay. "}
                      {gameMoodData.some(mood => mood.id === 'exploratory') && "You love discovering new worlds and uncovering secrets. "}
                      {gameMoodData.length === 0 && "This game's personality is waiting to be discovered through your playstyle."}
                    </p>
                  </div>
                </div>
                
                {/* Play Patterns */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">When you usually play this</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {game?.hoursPlayed && game.hoursPlayed > 20 ? (
                      <>
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
                          <div className="text-blue-300 text-sm font-medium">Weekend</div>
                          <div className="text-blue-100 text-xs mt-1">Deep Sessions</div>
                        </div>
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-center">
                          <div className="text-purple-300 text-sm font-medium">Evening</div>
                          <div className="text-purple-100 text-xs mt-1">Wind Down</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                          <div className="text-green-300 text-sm font-medium">Quick Breaks</div>
                          <div className="text-green-100 text-xs mt-1">Short Sessions</div>
                        </div>
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                          <div className="text-yellow-300 text-sm font-medium">Exploring</div>
                          <div className="text-yellow-100 text-xs mt-1">First Time</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Game Details */}
            <div className="glass-morphism rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                Game Details
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cover Art */}
                <div className="flex justify-center">
                  <div className="relative w-64 h-96 rounded-xl overflow-hidden cinematic-shadow">
                    <img 
                      src={game.coverImage || 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Game+Cover'}
                      alt={game.title}
                      className="w-full h-full object-cover game-cover-image"
                      onError={(e) => {
                        console.error('❌ Cover art failed to load:', game.coverImage)
                      }}
                      onLoad={() => {
                        console.log('✅ Cover art loaded successfully:', game.coverImage)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Game Info */}
                <div className="space-y-6">
                  {/* Title & Status */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-white truncate flex-1 mr-4">{game.title}</h3>
                      <PersonaSummaryBar persona={persona} />
                    </div>
                    
                    {/* Play Status Badge */}
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                        game.playStatus === 'playing' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        game.playStatus === 'completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        game.playStatus === 'backlog' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {game.playStatus === 'playing' && '▶️ Currently Playing'}
                        {game.playStatus === 'completed' && '✅ Completed'}
                        {game.playStatus === 'backlog' && '📋 In Backlog'}
                        {game.playStatus === 'paused' && '⏸️ Paused'}
                        {game.playStatus === 'abandoned' && '🚫 Abandoned'}
                        {!game.playStatus && '📝 Not Started'}
                      </span>
                    </div>
                  </div>

                  {/* Game Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gaming-accent">🎮</span>
                        <span className="text-gray-300 truncate">
                          {game.platforms?.map(platform => platform.name).join(' • ') || 'Unknown Platform'}
                        </span>
                      </div>
                      
                      {game.releaseYear && (
                        <div className="flex items-center gap-2">
                          <span className="text-gaming-accent">📅</span>
                          <span className="text-gray-300 whitespace-nowrap">Released {game.releaseYear}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {game.hoursPlayed && (
                        <div className="flex items-center gap-2">
                          <span className="text-gaming-accent">⏱️</span>
                          <span className="text-gray-300 whitespace-nowrap">{formatPlaytime(game.hoursPlayed)} played</span>
                        </div>
                      )}
                      
                      {game.lastLocalPlayedAt && (
                        <div className="flex items-center gap-2">
                          <span className="text-gaming-accent">🕐</span>
                          <span className="text-gray-300 whitespace-nowrap">Last played {formatDate(game.lastLocalPlayedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Genres & Tags */}
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <span>🏷️</span>
                      Genres & Tags
                    </h4>
                    <div className="space-y-3">
                      {game.genres && game.genres.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Genres</p>
                          <div className="flex flex-wrap gap-2">
                            {game.genres.map((genre, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-gaming-primary/20 text-gaming-primary text-xs rounded-full border border-gaming-primary/30 whitespace-nowrap"
                              >
                                {genre.description || genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {game.tags && game.tags.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {game.tags.slice(0, 8).map((tag, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/30 whitespace-nowrap"
                              >
                                {tag}
                              </span>
                            ))}
                            {game.tags.length > 8 && (
                              <span className="px-3 py-1 bg-gray-600/50 text-gray-400 text-xs rounded-full whitespace-nowrap">
                                +{game.tags.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {game.description && (
                <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📖</span>
                    About This Game
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {game.description}
                  </p>
                </div>
              )}
            </div>
            
            {/* Shelves - Game Recommendations */}
            <div className="glass-morphism rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📚</span>
                Shelves
              </h2>
              
              <div className="space-y-8">
                {/* From This Era */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🕰️</span>
                    From This Era
                  </h3>
                  <div className="space-y-3">
                    {games
                      .filter(g => g.id !== game?.id && g.releaseYear === game?.releaseYear)
                      .slice(0, 3)
                      .map((eraGame) => (
                        <div key={eraGame.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gaming-accent/50 transition-colors cursor-pointer"
                             onClick={() => navigate(`/library/game/${eraGame.id}`)}>
                          <div className="flex items-center gap-3">
                            <img 
                              src={eraGame.coverImage || 'https://via.placeholder.com/60x80/8b5cf6/ffffff?text=Game'}
                              alt={eraGame.title}
                              className="w-12 h-16 rounded object-cover"
                            />
                            <div>
                              <h4 className="text-lg font-semibold text-white">{eraGame.title}</h4>
                              <p className="text-sm text-gray-400">{eraGame.releaseYear} • {eraGame.platforms?.[0]?.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gaming-accent">Same Era</span>
                          </div>
                        </div>
                      ))}
                    {games.filter(g => g.id !== game?.id && g.releaseYear === game?.releaseYear).length === 0 && (
                      <p className="text-gray-400 text-center py-4">No other games from this era</p>
                    )}
                  </div>
                </div>
                
                {/* Similar Vibes */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🎭</span>
                    Similar Vibes
                  </h3>
                  <div className="space-y-3">
                    {games
                      .filter(g => g.id !== game?.id && g.tags && game?.tags && g.tags.some(tag => game.tags!.includes(tag)))
                      .slice(0, 3)
                      .map((vibeGame) => (
                        <div key={vibeGame.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gaming-accent/50 transition-colors cursor-pointer"
                             onClick={() => navigate(`/library/game/${vibeGame.id}`)}>
                          <div className="flex items-center gap-3">
                            <img 
                              src={vibeGame.coverImage || 'https://via.placeholder.com/60x80/8b5cf6/ffffff?text=Game'}
                              alt={vibeGame.title}
                              className="w-12 h-16 rounded object-cover"
                            />
                            <div>
                              <h4 className="text-lg font-semibold text-white">{vibeGame.title}</h4>
                              <p className="text-sm text-gray-400">
                                {vibeGame.tags?.filter(tag => game?.tags?.includes(tag)).slice(0, 2).join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gaming-accent">Similar Mood</span>
                          </div>
                        </div>
                      ))}
                    {games.filter(g => g.id !== game?.id && g.tags && game?.tags && g.tags.some(tag => game.tags!.includes(tag))).length === 0 && (
                      <p className="text-gray-400 text-center py-4">No games with similar vibes found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Stats & History (1/3 width) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Enhanced Stats & History */}
            <div className="glass-morphism rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📊</span>
                Stats & History
              </h2>
              
              <div className="space-y-4">
                {/* Enhanced Playtime Stats */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300 text-sm">Total Playtime</span>
                    <span className="text-white font-bold text-lg">
                      {formatPlaytime(game.hoursPlayed)}
                    </span>
                  </div>
                  {game.lastLocalPlayedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Last Played</span>
                      <span className="text-gray-400 text-sm">
                        {formatDate(game.lastLocalPlayedAt)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Sessions Stats */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Total Sessions</span>
                    <span className="text-white font-bold text-lg">
                      {game.localSessionCount || 0}
                    </span>
                  </div>
                </div>
                
                {/* Sessions Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Sessions</h3>
                  <div className="space-y-3">
                    {game.lastLocalPlayedAt && (
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="text-gray-300 text-sm font-medium">
                            {formatDate(game.lastLocalPlayedAt)}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {formatPlaytime(game.hoursPlayed)} session
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <div>
                        <div className="text-gray-300 text-sm font-medium">First played</div>
                        <div className="text-gray-400 text-xs">Added to library</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
