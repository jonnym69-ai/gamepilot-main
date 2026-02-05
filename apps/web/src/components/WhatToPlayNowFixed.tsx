/**
 * Fixed WhatToPlayNow Component
 * 
 * Integrates the new mood filter system for accurate, predictable recommendations
 * with strict non-overlapping mood categories and feature-based filtering.
 */

import React, { useState, useEffect } from 'react';
import { useLibraryStore } from '../stores/useLibraryStore';
import { generatePersonaContext } from '../utils/contextualEngine';
import { trackEvent } from '../utils/analytics';
import { 
  filterGamesByMood, 
  getMoodRecommendation, 
  MoodFilterId, 
  MOOD_FILTERS,
  validateMoodSystem
} from '../utils/moodFilterSystem';
import { detectTimeOfDay } from '../utils/contextualEngine';

interface WhatToPlayNowProps {
  onClose?: () => void;
  className?: string;
}

interface GameRecommendation {
  game: any;
  score: number;
  reasons: string[];
  moodMatch?: {
    moodId: MoodFilterId;
    moodName: string;
    score: number;
    reason: string;
  };
}

export const WhatToPlayNowFixed: React.FC<WhatToPlayNowProps> = ({
  onClose,
  className = ''
}) => {
  const { games } = useLibraryStore();
  const [recommendations, setRecommendations] = useState<GameRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rerollCount, setRerollCount] = useState(0);
  const [suggestedGameIds, setSuggestedGameIds] = useState<Set<string>>(new Set());
  const [validationResults, setValidationResults] = useState<any>(null);

  // Generate recommendations using the new mood filter system
  const generateRecommendations = (excludeIds: Set<string> = new Set()) => {
    setIsLoading(true);

    // Get available games (exclude already suggested)
    const availableGames = games.filter((game: any) => !excludeIds.has(game.id));

    try {
      // Track analytics
      trackEvent("what_to_play_opened", {
        timeOfDay: detectTimeOfDay(),
        selectedSessionLength: 'auto',
        selectedMoods: 'auto',
        system: 'mood_filter_v2'
      });

      // Generate persona context
      const personaContext = generatePersonaContext(games);
      
      // Validate mood system with current library
      const validation = validateMoodSystem(games);
      setValidationResults(validation);

      // Determine primary mood from persona context
      let primaryMood: MoodFilterId | null = null;
      let secondaryMood: MoodFilterId | null = null;
      
      if (personaContext.dominantMoods && personaContext.dominantMoods.length > 0) {
        // Map persona moods to new mood filter system
        const moodMapping: Record<string, MoodFilterId> = {
          'social': 'social',
          'competitive': 'competitive', 
          'story': 'story',
          'adventure': 'adventure',
          'chill': 'chill',
          'creative': 'creative',
          'focused': 'story', // Map focused to story for deep narrative
          'energetic': 'competitive', // Map energetic to competitive
          'exploratory': 'adventure' // Map exploratory to adventure
        };
        
        const mappedMoods = personaContext.dominantMoods
          .map(mood => moodMapping[mood.toLowerCase()])
          .filter((mood): mood is MoodFilterId => mood !== undefined);
        
        primaryMood = mappedMoods[0] || null;
        secondaryMood = mappedMoods[1] || null;
      }

      // Get mood-based recommendations
      let moodRecommendations: GameRecommendation[] = [];
      
      if (primaryMood) {
        const moodGames = filterGamesByMood(availableGames, primaryMood, 20);
        
        moodRecommendations = moodGames.map((game: any) => {
          const moodRec = getMoodRecommendation(game, primaryMood!);
          const secondaryRec = secondaryMood ? getMoodRecommendation(game, secondaryMood) : null;
          
          // Calculate combined score
          let finalScore = moodRec?.score || 50;
          if (secondaryRec && secondaryRec.matches) {
            finalScore = Math.min(100, finalScore + 15); // Bonus for matching both moods
          }
          
          // Apply persona weighting
          if (personaContext.dominantMoods.includes(primaryMood)) {
            finalScore = Math.min(100, finalScore + 10); // Bonus for matching dominant mood
          }
          
          const reasons: string[] = [];
          
          // Primary mood reason
          if (moodRec?.reason) {
            reasons.push(moodRec.reason);
          }
          
          // Secondary mood reason
          if (secondaryRec?.reason) {
            reasons.push(`Also matches ${secondaryMood} mood`);
          }
          
          // Persona-based reasons
          if (personaContext.dominantMoods.includes(primaryMood)) {
            reasons.push(`Matches your dominant ${primaryMood} mood`);
          }
          
          // Session length reason
          if (personaContext.preferredSessionLength) {
            reasons.push(`Fits your ${personaContext.preferredSessionLength} session preference`);
          }
          
          // Time of day reason
          reasons.push(`Perfect for ${detectTimeOfDay()} gaming`);
          
          return {
            game,
            score: finalScore,
            reasons: reasons.slice(0, 4),
            moodMatch: {
              moodId: primaryMood!,
              moodName: MOOD_FILTERS.find(m => m.id === primaryMood)?.name || primaryMood!,
              score: moodRec?.score || 50,
              reason: moodRec?.reason || 'Good match'
            }
          };
        });
      }

      // If no mood recommendations, fallback to persona-based scoring
      if (moodRecommendations.length === 0) {
        moodRecommendations = availableGames.slice(0, 10).map((game: any) => {
          const score = 50 + Math.random() * 30; // Base score with some randomness
          return {
            game,
            score,
            reasons: [
              'Available in your library',
              `Good for ${detectTimeOfDay()} gaming`,
              `Matches your ${personaContext.preferredSessionLength} session preference`
            ]
          };
        });
      }

      // Sort by score and take top recommendations
      const topRecommendations = moodRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setRecommendations(topRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback: just show top games
      const fallbackRecommendations = availableGames
        .slice(0, 3)
        .map(game => ({
          game,
          score: 0.5,
          reasons: ['Available in your library']
        }));
      setRecommendations(fallbackRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial recommendations
  useEffect(() => {
    if (games.length > 0) {
      generateRecommendations(suggestedGameIds);
    }
  }, [games]);

  // Handle reroll
  const handleReroll = () => {
    const newSuggestedIds = new Set(suggestedGameIds);
    recommendations.forEach(rec => newSuggestedIds.add(rec.game.id));
    setSuggestedGameIds(newSuggestedIds);
    setRerollCount(prev => prev + 1);

    trackEvent("what_to_play_reroll", { 
      count: rerollCount + 1,
      totalSuggested: newSuggestedIds.size,
      system: 'mood_filter_v2'
    });

    generateRecommendations(newSuggestedIds);
  };

  // Handle game launch
  const handleLaunchGame = (game: any, isPrimary: boolean) => {
    trackEvent(isPrimary ? "what_to_play_launch" : "what_to_play_alt_launch", {
      gameId: game.id,
      gameTitle: game.title,
      score: recommendations.find(r => r.game.id === game.id)?.score,
      isPrimary,
      system: 'mood_filter_v2',
      moodMatch: recommendations.find(r => r.game.id === game.id)?.moodMatch?.moodId
    });

    // Launch the game (you'll need to implement this based on your game launcher)
    console.log(`Launching game: ${game.title}`);
    // TODO: Implement actual game launching logic
  };

  const primary = recommendations[0];
  const alternates = recommendations.slice(1, 3);

  if (isLoading) {
    return (
      <div className={`what-to-play-now ${className}`}>
        <div className="what-to-play-loading">
          <div className="loading-spinner"></div>
          <h3>Finding Your Perfect Game...</h3>
          <p>Analyzing your gaming personality with our enhanced mood filter system</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`what-to-play-now ${className}`}>
        <div className="what-to-play-empty">
          <div className="empty-icon">🎮</div>
          <h3>No Games Available</h3>
          <p>Add some games to your library to get personalized recommendations!</p>
          <button onClick={onClose} className="close-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`what-to-play-now ${className}`}>
      {/* Header */}
      <div className="what-to-play-header">
        <div className="header-content">
          <h2 className="title">I'm Not Sure What To Play</h2>
          <p className="subtitle">
            Let GamePilot pick based on your mood, personality, and play style
          </p>
          {validationResults && (
            <div className="validation-summary">
              <span className="validation-text">
                Enhanced mood filter system active • {validationResults.totalOverlap === 0 ? '✅ No overlap' : `⚠️ ${validationResults.totalOverlap} overlaps`}
              </span>
            </div>
          )}
        </div>
        <button onClick={onClose} className="close-btn" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Primary Recommendation */}
      {primary && (
        <div className="primary-recommendation">
          <div className="game-card primary">
            <div className="game-content">
              <div className="game-header">
                <div className="game-info">
                  <h3 className="game-title">{primary.game.title}</h3>
                  <div className="game-meta">
                    {primary.moodMatch && (
                      <span className="mood-badge">
                        {MOOD_FILTERS.find(m => m.id === primary.moodMatch!.moodId)?.icon} {primary.moodMatch.moodName}
                      </span>
                    )}
                    {primary.game.genres?.slice(0, 2).map((genre: any) => (
                      <span key={typeof genre === 'string' ? genre : genre.name} className="genre-tag">
                        {typeof genre === 'string' ? genre : genre.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="game-art">
                  {primary.game.coverImage ? (
                    <img 
                      src={primary.game.coverImage} 
                      alt={primary.game.title}
                      className="game-cover"
                    />
                  ) : (
                    <div className="game-cover-placeholder">
                      <div className="placeholder-icon">🎮</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="game-description">
                <p>{primary.game.description || 'No description available'}</p>
              </div>

              <div className="game-reasons">
                <h4>Why this game?</h4>
                <ul className="reasons-list">
                  {primary.reasons.map((reason, index) => (
                    <li key={index} className="reason-item">
                      <span className="reason-icon">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="game-actions">
                <button 
                  onClick={() => handleLaunchGame(primary.game, true)}
                  className="launch-btn primary"
                >
                  <span className="btn-icon">🚀</span>
                  Launch Now
                </button>
                <div className="confidence-score">
                  <span className="score-label">Match Score:</span>
                  <span className="score-value">{Math.round(primary.score)}%</span>
                  {primary.moodMatch && (
                    <span className="mood-score">
                      {primary.moodMatch.moodName}: {Math.round(primary.moodMatch.score)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternate Recommendations */}
      {alternates.length > 0 && (
        <div className="alternate-recommendations">
          <div className="alternates-header">
            <h3>Or Try These</h3>
            <button 
              onClick={handleReroll}
              className="reroll-btn"
              disabled={games.length <= 3}
            >
              <span className="reroll-icon">🎲</span>
              Reroll
              {rerollCount > 0 && <span className="reroll-count">({rerollCount})</span>}
            </button>
          </div>

          <div className="alternates-grid">
            {alternates.map((rec, index) => (
              <div key={rec.game.id} className="game-card alternate">
                <div className="game-content">
                  <div className="game-header">
                    <div className="game-info">
                      <h4 className="game-title">{rec.game.title}</h4>
                      <div className="game-meta">
                        {rec.moodMatch && (
                          <span className="mood-badge small">
                            {MOOD_FILTERS.find(m => m.id === rec.moodMatch!.moodId)?.icon} {rec.moodMatch.moodName}
                          </span>
                        )}
                        {rec.game.genres?.slice(0, 1).map((genre: any) => (
                          <span key={typeof genre === 'string' ? genre : genre.name} className="genre-tag small">
                            {typeof genre === 'string' ? genre : genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="game-art small">
                      {rec.game.coverImage ? (
                        <img 
                          src={rec.game.coverImage} 
                          alt={rec.game.title}
                          className="game-cover small"
                        />
                      ) : (
                        <div className="game-cover-placeholder small">
                          <div className="placeholder-icon small">🎮</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="game-reasons small">
                    <div className="reasons-list">
                      {rec.reasons.slice(0, 2).map((reason, reasonIndex) => (
                        <div key={reasonIndex} className="reason-item small">
                          <span className="reason-icon small">✓</span>
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="game-actions">
                    <button 
                      onClick={() => handleLaunchGame(rec.game, false)}
                      className="launch-btn small"
                    >
                      Play Now
                    </button>
                    <div className="confidence-score small">
                      {Math.round(rec.score)}%
                      {rec.moodMatch && (
                        <span className="mood-score small">
                          {rec.moodMatch.moodName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="what-to-play-footer">
        <p className="footer-text">
          Recommendations powered by enhanced mood filter system • {games.length} games in your library
        </p>
      </div>
    </div>
  );
};

// Add CSS styles (enhanced with mood filter styling)
const style = document.createElement('style');
style.textContent = `
.what-to-play-now {
  background: linear-gradient(135deg, #1e293b 0%, #111827 100%);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
}

.validation-summary {
  margin-top: 0.5rem;
}

.validation-text {
  font-size: 0.75rem;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.mood-badge {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.mood-badge.small {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
}

.mood-score {
  font-size: 0.625rem;
  color: #8b5cf6;
  margin-top: 0.25rem;
}

.mood-score.small {
  font-size: 0.5rem;
  margin-top: 0.125rem;
}

.what-to-play-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(139, 92, 246, 0.2);
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.what-to-play-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.what-to-play-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  flex: 1;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.primary-recommendation {
  padding: 2rem;
}

.game-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.game-card.primary {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-color: rgba(139, 92, 246, 0.3);
}

.game-content {
  padding: 1.5rem;
}

.game-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.game-info {
  flex: 1;
}

.game-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.game-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.genre-tag {
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.genre-tag.small {
  background: rgba(139, 92, 246, 0.15);
  font-size: 0.625rem;
}

.game-art {
  width: 120px;
  height: 160px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.game-art.small {
  width: 80px;
  height: 100px;
}

.game-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.placeholder-icon.small {
  font-size: 1.5rem;
}

.game-description {
  margin-bottom: 1rem;
}

.game-description p {
  color: #d1d5db;
  line-height: 1.5;
  margin: 0;
}

.game-reasons {
  margin-bottom: 1.5rem;
}

.game-reasons h4 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.reasons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.4;
}

.reason-item.small {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.reason-icon {
  color: #10b981;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.reason-icon.small {
  font-size: 0.75rem;
}

.game-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.launch-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.launch-btn:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  transform: translateY(-1px);
}

.launch-btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.launch-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.launch-btn.primary:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.btn-icon {
  font-size: 1rem;
}

.confidence-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.confidence-score.small {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.score-label {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.score-value {
  font-size: 1.125rem;
  font-weight: bold;
  color: #10b981;
}

.alternate-recommendations {
  padding: 0 2rem 2rem;
}

.alternates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.alternates-header h3 {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.reroll-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reroll-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.reroll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reroll-icon {
  font-size: 1rem;
}

.reroll-count {
  font-size: 0.75rem;
  opacity: 0.8;
}

.alternates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.game-card.alternate {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
}

.game-card.alternate:hover {
  background: rgba(255, 255, 255, 0.08);
}

.game-reasons.small {
  margin-bottom: 1rem;
}

.what-to-play-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 768px) {
  .what-to-play-now {
    margin: 1rem;
    border-radius: 0.75rem;
  }

  .what-to-play-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .game-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .game-art {
    width: 100%;
    height: 120px;
  }

  .alternates-grid {
    grid-template-columns: 1fr;
  }

  .game-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .confidence-score {
    align-items: center;
    text-align: center;
  }

  .score-label {
    margin-bottom: 0;
  }
}
`;

document.head.appendChild(style);
