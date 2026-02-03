import { useState } from 'react'
import { SteamImportInline } from './SteamImportInline'

interface EmptyLibraryStateProps {
  isSearchResult: boolean
  onImportSteam: () => void
}

export function EmptyLibraryState({ 
  isSearchResult, 
  onImportSteam 
}: EmptyLibraryStateProps) {
  const [showSteamImport, setShowSteamImport] = useState(false)

  if (isSearchResult) {
    return (
      <div className="glass-morphism rounded-2xl p-12 text-center border border-gray-700/30">
        <div className="text-6xl mb-6">🔍</div>
        <h3 className="text-2xl font-bold text-white mb-3">No games found</h3>
        <p className="text-gray-400 mb-8 text-base max-w-md mx-auto">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            Clear Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      {/* Steam Import Modal */}
      {showSteamImport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Import Steam Library</h2>
                <button
                  onClick={() => setShowSteamImport(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <SteamImportInline
                onComplete={(_count) => {
                  setShowSteamImport(false)
                  onImportSteam() // Call original handler
                }}
                onError={(error) => {
                  console.error('Steam import error:', error)
                  setShowSteamImport(false)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
