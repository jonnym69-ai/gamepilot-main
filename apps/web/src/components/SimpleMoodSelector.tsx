import { useState, useCallback } from 'react'
import { MOODS, type MoodId } from '@gamepilot/static-data'

/**
 * Simplified Mood Selector for GamePilot UI
 * This component can be easily integrated into the existing interface
 */

interface SimpleMoodSelectorProps {
  onMoodChange?: (mood: MoodId, secondaryMood?: MoodId) => void
  className?: string
  variant?: 'compact' | 'full'
}

export function SimpleMoodSelector({ onMoodChange, className = '', variant = 'compact' }: SimpleMoodSelectorProps) {
  const [primaryMood, setPrimaryMood] = useState<MoodId | null>(null)
  const [secondaryMood, setSecondaryMood] = useState<MoodId | null>(null)
  const [showSecondary, setShowSecondary] = useState(false)

  const handlePrimaryMoodSelect = useCallback((moodId: MoodId) => {
    setPrimaryMood(moodId)
    
    // Reset secondary if it conflicts (basic compatibility check)
    if (secondaryMood) {
      const primary = MOODS.find(m => m.id === moodId)
      // Simple conflict check for basic moods
      if (primary && ((primary.id === 'competitive' && secondaryMood === 'chill') || 
          (primary.id === 'chill' && secondaryMood === 'competitive'))) {
        setSecondaryMood(null)
        setShowSecondary(false)
      }
    }
    
    // Call parent callback
    if (onMoodChange) {
      onMoodChange(moodId, secondaryMood || undefined)
    }
  }, [secondaryMood, onMoodChange])

  const handleSecondaryMoodSelect = useCallback((moodId: MoodId) => {
    if (!primaryMood) return
    
    // Simple compatibility check for basic moods
    const primary = MOODS.find(m => m.id === primaryMood)
    if (primary && !((primary.id === 'competitive' && moodId === 'chill') || 
                    (primary.id === 'chill' && moodId === 'competitive'))) {
      setSecondaryMood(moodId)
      
      if (onMoodChange) {
        onMoodChange(primaryMood, moodId)
      }
    }
  }, [primaryMood, onMoodChange])

  const clearMoods = useCallback(() => {
    setPrimaryMood(null)
    setSecondaryMood(null)
    setShowSecondary(false)
    
    if (onMoodChange) {
      onMoodChange('', undefined)
    }
  }, [onMoodChange])

  const getMoodButtonClasses = (mood: any, isActive: boolean, isSecondary: boolean = false) => {
    const baseClasses = 'relative flex flex-col items-center justify-center rounded-lg transition-all duration-300 cursor-pointer'
    
    const sizeClasses = variant === 'compact' 
      ? 'w-12 h-12 text-sm p-2' 
      : 'w-16 h-16 text-base p-3'
    
    const activeClasses = isActive
      ? isSecondary 
        ? 'ring-2 ring-purple-500 bg-purple-500/20 scale-110'
        : 'ring-2 ring-blue-500 bg-blue-500/20 scale-110'
      : 'hover:bg-gray-700/50 hover:scale-105'
    
    return `${baseClasses} ${sizeClasses} ${activeClasses} ${mood.color}`
  }

  const primaryMoodData = primaryMood ? MOODS.find(m => m.id === primaryMood) : undefined
  const secondaryMoodData = secondaryMood ? MOODS.find(m => m.id === secondaryMood) : undefined

  if (variant === 'compact') {
    return (
      <div className={`glass-morphism rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">How are you feeling?</h3>
          {(primaryMood || secondaryMood) && (
            <button
              onClick={clearMoods}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        {/* Primary Mood Selection */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handlePrimaryMoodSelect(mood.id)}
              className={getMoodButtonClasses(mood, mood.id === primaryMood)}
              title={mood.name}
            >
              <span className="text-lg mb-1">{mood.emoji}</span>
              <span className="text-xs text-white font-medium">{mood.name}</span>
            </button>
          ))}
        </div>

        {/* Secondary Mood (if primary selected) */}
        {primaryMood && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Add secondary mood?</span>
              <button
                onClick={() => setShowSecondary(!showSecondary)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {showSecondary ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showSecondary && (
              <div className="grid grid-cols-4 gap-2">
                {MOODS
                  .filter(mood => mood.id !== primaryMood)
                  .map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleSecondaryMoodSelect(mood.id)}
                      className={getMoodButtonClasses(mood, mood.id === secondaryMood, true)}
                      title={mood.name}
                    >
                      <span className="text-lg mb-1">{mood.emoji}</span>
                      <span className="text-xs text-white font-medium">{mood.name}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Current Selection Display */}
        {(primaryMoodData || secondaryMoodData) && (
          <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              {primaryMoodData && (
                <>
                  <span className="text-lg">{primaryMoodData.emoji}</span>
                  <span className="text-sm text-white">{primaryMoodData.name}</span>
                </>
              )}
              {secondaryMoodData && (
                <>
                  <span className="text-gray-400">+</span>
                  <span className="text-lg">{secondaryMoodData.emoji}</span>
                  <span className="text-sm text-white">{secondaryMoodData.name}</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {primaryMoodData?.description}
              {secondaryMoodData && ` + ${secondaryMoodData.description}`}
            </p>
          </div>
        )}
      </div>
    )
  }

  // Full variant
  return (
    <div className={`glass-morphism rounded-2xl p-6 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">Select Your Gaming Mood</h2>
      <p className="text-gray-400 text-sm mb-6">
        Choose how you're feeling to get personalized game recommendations
      </p>

      {/* Primary Mood Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Primary Mood</h3>
        <div className="grid grid-cols-4 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handlePrimaryMoodSelect(mood.id)}
              className={getMoodButtonClasses(mood, mood.id === primaryMood)}
              title={mood.name}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs text-white font-medium">{mood.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Mood */}
      {primaryMood && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Secondary Mood (Optional)</h3>
            <button
              onClick={() => setShowSecondary(!showSecondary)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showSecondary ? 'Hide' : 'Add Secondary Mood'}
            </button>
          </div>
          
          {showSecondary && (
            <div className="grid grid-cols-4 gap-3">
              {MOODS
                .filter(mood => mood.id !== primaryMood)
                .map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleSecondaryMoodSelect(mood.id)}
                    className={getMoodButtonClasses(mood, mood.id === secondaryMood, true)}
                    title={mood.name}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-xs text-white font-medium">{mood.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Current Selection */}
      {(primaryMoodData || secondaryMoodData) && (
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Current Selection</h3>
          <div className="flex items-center gap-4 mb-2">
            {primaryMoodData && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{primaryMoodData.emoji}</span>
                <span className="text-white font-medium">{primaryMoodData.name}</span>
              </div>
            )}
            {secondaryMoodData && (
              <>
                <span className="text-gray-400">+</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{secondaryMoodData.emoji}</span>
                  <span className="text-white font-medium">{secondaryMoodData.name}</span>
                </div>
              </>
            )}
            <button
              onClick={clearMoods}
              className="ml-auto text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          <p className="text-sm text-gray-400">
            {primaryMoodData?.description}
            {secondaryMoodData && ` + ${secondaryMoodData.description}`}
          </p>
        </div>
      )}
    </div>
  )
}
