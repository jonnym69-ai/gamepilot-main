import type { Game } from '@gamepilot/types'
import { PlatformCode } from '@gamepilot/types'

export function launchGame(game: Game): void {
  if (!game.launcherId) {
    showTooltip('No launcher ID set')
    return
  }

  if (!game.platforms || game.platforms.length === 0) {
    showTooltip('No platforms configured')
    return
  }

  // Try to launch on the first available platform
  const platform = game.platforms[0]
  const url = generateLauncherUrl(platform.code, game.launcherId)
  
  if (url) {
    window.open(url, '_blank')
  } else {
    showTooltip(`Unsupported platform: ${platform.name}`)
  }
}

export function generateLauncherUrl(platform: PlatformCode, launcherId: string): string | null {
  switch (platform) {
    case PlatformCode.STEAM:
      return `steam://rungameid/${launcherId}` 
    
    case PlatformCode.EPIC:
      return `com.epicgames.launcher://apps/${launcherId}?action=launch` 
    
    case PlatformCode.GOG:
      return `goggalaxy://openGame/${launcherId}` 
    
    case PlatformCode.XBOX:
      return `xbox://launch/${launcherId}` 
    
    case PlatformCode.PLAYSTATION:
      return `psn://launch/${launcherId}`
    
    case PlatformCode.NINTENDO:
      return `nintendo://launch/${launcherId}`
    
    default:
      console.warn(`Unsupported platform for launching: ${platform}`)
      return null
  }
}

function showTooltip(message: string): void {
  // Create a simple tooltip notification
  const tooltip = document.createElement('div')
  tooltip.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse'
  tooltip.textContent = message
  document.body.appendChild(tooltip)
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip)
    }
  }, 3000)
}

export function getLauncherIcon(platform: PlatformCode): string {
  switch (platform) {
    case PlatformCode.STEAM:
      return '🎮'
    case PlatformCode.EPIC:
      return '🚀'
    case PlatformCode.GOG:
      return '🎯'
    case PlatformCode.XBOX:
      return '🎪'
    case PlatformCode.PLAYSTATION:
      return '🎯'
    case PlatformCode.NINTENDO:
      return '🎮'
    default:
      return '🎮'
  }
}

export function getPlatformName(platform: PlatformCode): string {
  switch (platform) {
    case PlatformCode.STEAM:
      return 'Steam'
    case PlatformCode.EPIC:
      return 'Epic Games'
    case PlatformCode.GOG:
      return 'GOG'
    case PlatformCode.XBOX:
      return 'Xbox'
    case PlatformCode.PLAYSTATION:
      return 'PlayStation'
    case PlatformCode.NINTENDO:
      return 'Nintendo'
    default:
      return 'Unknown Platform'
  }
}
