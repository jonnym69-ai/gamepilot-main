import { Game } from '../features/library/types'

export const filterByGenre = (games: Game[], genre: string): Game[] => {
  if (!genre) return games
  return games.filter(game => game.genres?.includes(genre))
}

export const filterByMood = (games: Game[], mood: string): Game[] => {
  if (!mood) return games
  return games.filter(game => game.mood?.includes(mood))
}

export const filterByPlatform = (games: Game[], platform: string): Game[] => {
  if (!platform) return games
  return games.filter(game => game.platforms?.some((p) => p === platform))
}

export const sortByPlayStatus = (games: Game[]): Game[] => {
  const statusOrder = ['playing', 'completed', 'paused', 'abandoned']
  
  return [...games].sort((a, b) => {
    const statusA = statusOrder.indexOf(a.status || '')
    const statusB = statusOrder.indexOf(b.status || '')
    return statusA - statusB
  })
}

export const sortByLastPlayed = (games: Game[]): Game[] => {
  return [...games].sort((a, b) => {
    const dateA = a.lastPlayed ? new Date(a.lastPlayed) : new Date(0)
    const dateB = b.lastPlayed ? new Date(b.lastPlayed) : new Date(0)
    return dateB.getTime() - dateA.getTime()
  })
}
