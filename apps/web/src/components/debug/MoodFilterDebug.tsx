/**
 * Debug component to test mood filtering with real data
 */

import React, { useState, useEffect } from 'react'
import { useLibraryStore } from '../../stores/useLibraryStore'
import { filterGamesByMood, MOOD_FILTERS } from '../../utils/moodFilterSystem'

export const MoodFilterDebug: React.FC = () => {
  const { games } = useLibraryStore()
  const [selectedMood, setSelectedMood] = useState<string>('social')
  const [filteredGames, setFilteredGames] = useState<any[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (games.length > 0) {
      const filtered = filterGamesByMood(games, selectedMood as any, 20)
      setFilteredGames(filtered)
    }
  }, [games, selectedMood])

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          🔍 Debug Mood Filter
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">Mood Filter Debug</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mb-4">
        <label className="text-white text-sm block mb-2">Select Mood:</label>
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
        >
          {MOOD_FILTERS.map(mood => (
            <option key={mood.id} value={mood.id}>
              {mood.icon} {mood.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="text-white text-sm mb-2">
          Total Games: {games.length} | Filtered: {filteredGames.length}
        </div>
        <div className="text-gray-400 text-xs">
          {filteredGames.length === 0 && 'No games match this mood. Check game moods and genres.'}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-white text-sm font-semibold">Filtered Games:</div>
        {filteredGames.length === 0 ? (
          <div className="text-gray-400 text-sm">No games found</div>
        ) : (
          filteredGames.map(game => (
            <div key={game.id} className="bg-gray-800 rounded p-2">
              <div className="text-white text-sm font-medium">{game.title}</div>
              <div className="text-gray-400 text-xs">
                Moods: {(game.moods || []).join(', ') || 'None'}
              </div>
              <div className="text-gray-400 text-xs">
                Genres: {(game.genres || []).map((g: any) => g.name).join(', ') || 'None'}
              </div>
            </div>
          ))
        )}
      </div>

      {games.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-white text-sm font-semibold mb-2">Sample Game Data:</div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-white text-sm font-medium">{games[0].title}</div>
            <div className="text-gray-400 text-xs">
              Moods: {(games[0].moods || []).join(', ') || 'None'}
            </div>
            <div className="text-gray-400 text-xs">
              Genres: {(games[0].genres || []).map((g: any) => g.name).join(', ') || 'None'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
