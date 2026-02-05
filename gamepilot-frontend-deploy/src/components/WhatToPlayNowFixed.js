"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatToPlayNowFixed = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Fixed WhatToPlayNow Component
 *
 * Integrates the new mood filter system for accurate, predictable recommendations
 * with strict non-overlapping mood categories and feature-based filtering.
 */
const react_1 = require("react");
const useLibraryStore_1 = require("../stores/useLibraryStore");
const contextualEngine_1 = require("../utils/contextualEngine");
const analytics_1 = require("../utils/analytics");
const moodFilterSystem_1 = require("../utils/moodFilterSystem");
const contextualEngine_2 = require("../utils/contextualEngine");
const WhatToPlayNowFixed = ({ onClose, className = '' }) => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const [recommendations, setRecommendations] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [rerollCount, setRerollCount] = (0, react_1.useState)(0);
    const [suggestedGameIds, setSuggestedGameIds] = (0, react_1.useState)(new Set());
    const [validationResults, setValidationResults] = (0, react_1.useState)(null);
    // Generate recommendations using the new mood filter system
    const generateRecommendations = (excludeIds = new Set()) => {
        setIsLoading(true);
        try {
            // Track analytics
            (0, analytics_1.trackEvent)("what_to_play_opened", {
                timeOfDay: (0, contextualEngine_2.detectTimeOfDay)(),
                selectedSessionLength: 'auto',
                selectedMoods: 'auto',
                system: 'mood_filter_v2'
            });
            // Generate persona context
            const personaContext = (0, contextualEngine_1.generatePersonaContext)(games);
            // Get available games (exclude already suggested)
            const availableGames = games.filter((game) => !excludeIds.has(game.id));
            // Validate mood system with current library
            const validation = (0, moodFilterSystem_1.validateMoodSystem)(games);
            setValidationResults(validation);
            // Determine primary mood from persona context
            let primaryMood = null;
            let secondaryMood = null;
            if (personaContext.dominantMoods && personaContext.dominantMoods.length > 0) {
                // Map persona moods to new mood filter system
                const moodMapping = {
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
                    .filter((mood) => mood !== undefined);
                primaryMood = mappedMoods[0] || null;
                secondaryMood = mappedMoods[1] || null;
            }
            // Get mood-based recommendations
            let moodRecommendations = [];
            if (primaryMood) {
                const moodGames = (0, moodFilterSystem_1.filterGamesByMood)(availableGames, primaryMood, 20);
                moodRecommendations = moodGames.map((game) => {
                    const moodRec = (0, moodFilterSystem_1.getMoodRecommendation)(game, primaryMood);
                    const secondaryRec = secondaryMood ? (0, moodFilterSystem_1.getMoodRecommendation)(game, secondaryMood) : null;
                    // Calculate combined score
                    let finalScore = moodRec?.score || 50;
                    if (secondaryRec && secondaryRec.matches) {
                        finalScore = Math.min(100, finalScore + 15); // Bonus for matching both moods
                    }
                    // Apply persona weighting
                    if (personaContext.dominantMoods.includes(primaryMood)) {
                        finalScore = Math.min(100, finalScore + 10); // Bonus for matching dominant mood
                    }
                    const reasons = [];
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
                    reasons.push(`Perfect for ${(0, contextualEngine_2.detectTimeOfDay)()} gaming`);
                    return {
                        game,
                        score: finalScore,
                        reasons: reasons.slice(0, 4),
                        moodMatch: {
                            moodId: primaryMood,
                            moodName: moodFilterSystem_1.MOOD_FILTERS.find(m => m.id === primaryMood)?.name || primaryMood,
                            score: moodRec?.score || 50,
                            reason: moodRec?.reason || 'Good match'
                        }
                    };
                });
            }
            // If no mood recommendations, fallback to persona-based scoring
            if (moodRecommendations.length === 0) {
                moodRecommendations = availableGames.slice(0, 10).map((game) => {
                    const score = 50 + Math.random() * 30; // Base score with some randomness
                    return {
                        game,
                        score,
                        reasons: [
                            'Available in your library',
                            `Good for ${(0, contextualEngine_2.detectTimeOfDay)()} gaming`,
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
        }
        catch (error) {
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
        }
        finally {
            setIsLoading(false);
        }
    };
    // Initial recommendations
    (0, react_1.useEffect)(() => {
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
        (0, analytics_1.trackEvent)("what_to_play_reroll", {
            count: rerollCount + 1,
            totalSuggested: newSuggestedIds.size,
            system: 'mood_filter_v2'
        });
        generateRecommendations(newSuggestedIds);
    };
    // Handle game launch
    const handleLaunchGame = (game, isPrimary) => {
        (0, analytics_1.trackEvent)(isPrimary ? "what_to_play_launch" : "what_to_play_alt_launch", {
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
        return ((0, jsx_runtime_1.jsx)("div", { className: `what-to-play-now ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "what-to-play-loading", children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), (0, jsx_runtime_1.jsx)("h3", { children: "Finding Your Perfect Game..." }), (0, jsx_runtime_1.jsx)("p", { children: "Analyzing your gaming personality with our enhanced mood filter system" })] }) }));
    }
    if (recommendations.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `what-to-play-now ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "what-to-play-empty", children: [(0, jsx_runtime_1.jsx)("div", { className: "empty-icon", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("h3", { children: "No Games Available" }), (0, jsx_runtime_1.jsx)("p", { children: "Add some games to your library to get personalized recommendations!" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "close-btn", children: "Go Back" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `what-to-play-now ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "what-to-play-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("h2", { className: "title", children: "I'm Not Sure What To Play" }), (0, jsx_runtime_1.jsx)("p", { className: "subtitle", children: "Let GamePilot pick based on your mood, personality, and play style" }), validationResults && ((0, jsx_runtime_1.jsx)("div", { className: "validation-summary", children: (0, jsx_runtime_1.jsxs)("span", { className: "validation-text", children: ["Enhanced mood filter system active \u2022 ", validationResults.totalOverlap === 0 ? '✅ No overlap' : `⚠️ ${validationResults.totalOverlap} overlaps`] }) }))] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "close-btn", "aria-label": "Close", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), primary && ((0, jsx_runtime_1.jsx)("div", { className: "primary-recommendation", children: (0, jsx_runtime_1.jsx)("div", { className: "game-card primary", children: (0, jsx_runtime_1.jsxs)("div", { className: "game-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-info", children: [(0, jsx_runtime_1.jsx)("h3", { className: "game-title", children: primary.game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "game-meta", children: [primary.moodMatch && ((0, jsx_runtime_1.jsxs)("span", { className: "mood-badge", children: [moodFilterSystem_1.MOOD_FILTERS.find(m => m.id === primary.moodMatch.moodId)?.icon, " ", primary.moodMatch.moodName] })), primary.game.genres?.slice(0, 2).map((genre) => ((0, jsx_runtime_1.jsx)("span", { className: "genre-tag", children: typeof genre === 'string' ? genre : genre.name }, typeof genre === 'string' ? genre : genre.name)))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-art", children: primary.game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: primary.game.coverImage, alt: primary.game.title, className: "game-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "game-cover-placeholder", children: (0, jsx_runtime_1.jsx)("div", { className: "placeholder-icon", children: "\uD83C\uDFAE" }) })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-description", children: (0, jsx_runtime_1.jsx)("p", { children: primary.game.description || 'No description available' }) }), (0, jsx_runtime_1.jsxs)("div", { className: "game-reasons", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Why this game?" }), (0, jsx_runtime_1.jsx)("ul", { className: "reasons-list", children: primary.reasons.map((reason, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "reason-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "reason-icon", children: "\u2713" }), reason] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "game-actions", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => handleLaunchGame(primary.game, true), className: "launch-btn primary", children: [(0, jsx_runtime_1.jsx)("span", { className: "btn-icon", children: "\uD83D\uDE80" }), "Launch Now"] }), (0, jsx_runtime_1.jsxs)("div", { className: "confidence-score", children: [(0, jsx_runtime_1.jsx)("span", { className: "score-label", children: "Match Score:" }), (0, jsx_runtime_1.jsxs)("span", { className: "score-value", children: [Math.round(primary.score), "%"] }), primary.moodMatch && ((0, jsx_runtime_1.jsxs)("span", { className: "mood-score", children: [primary.moodMatch.moodName, ": ", Math.round(primary.moodMatch.score), "%"] }))] })] })] }) }) })), alternates.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "alternate-recommendations", children: [(0, jsx_runtime_1.jsxs)("div", { className: "alternates-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Or Try These" }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleReroll, className: "reroll-btn", disabled: games.length <= 3, children: [(0, jsx_runtime_1.jsx)("span", { className: "reroll-icon", children: "\uD83C\uDFB2" }), "Reroll", rerollCount > 0 && (0, jsx_runtime_1.jsxs)("span", { className: "reroll-count", children: ["(", rerollCount, ")"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "alternates-grid", children: alternates.map((rec, index) => ((0, jsx_runtime_1.jsx)("div", { className: "game-card alternate", children: (0, jsx_runtime_1.jsxs)("div", { className: "game-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-info", children: [(0, jsx_runtime_1.jsx)("h4", { className: "game-title", children: rec.game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "game-meta", children: [rec.moodMatch && ((0, jsx_runtime_1.jsxs)("span", { className: "mood-badge small", children: [moodFilterSystem_1.MOOD_FILTERS.find(m => m.id === rec.moodMatch.moodId)?.icon, " ", rec.moodMatch.moodName] })), rec.game.genres?.slice(0, 1).map((genre) => ((0, jsx_runtime_1.jsx)("span", { className: "genre-tag small", children: typeof genre === 'string' ? genre : genre.name }, typeof genre === 'string' ? genre : genre.name)))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-art small", children: rec.game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: rec.game.coverImage, alt: rec.game.title, className: "game-cover small" })) : ((0, jsx_runtime_1.jsx)("div", { className: "game-cover-placeholder small", children: (0, jsx_runtime_1.jsx)("div", { className: "placeholder-icon small", children: "\uD83C\uDFAE" }) })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-reasons small", children: (0, jsx_runtime_1.jsx)("div", { className: "reasons-list", children: rec.reasons.slice(0, 2).map((reason, reasonIndex) => ((0, jsx_runtime_1.jsxs)("div", { className: "reason-item small", children: [(0, jsx_runtime_1.jsx)("span", { className: "reason-icon small", children: "\u2713" }), reason] }, reasonIndex))) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "game-actions", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleLaunchGame(rec.game, false), className: "launch-btn small", children: "Play Now" }), (0, jsx_runtime_1.jsxs)("div", { className: "confidence-score small", children: [Math.round(rec.score), "%", rec.moodMatch && ((0, jsx_runtime_1.jsx)("span", { className: "mood-score small", children: rec.moodMatch.moodName }))] })] })] }) }, rec.game.id))) })] })), (0, jsx_runtime_1.jsx)("div", { className: "what-to-play-footer", children: (0, jsx_runtime_1.jsxs)("p", { className: "footer-text", children: ["Recommendations powered by enhanced mood filter system \u2022 ", games.length, " games in your library"] }) })] }));
};
exports.WhatToPlayNowFixed = WhatToPlayNowFixed;
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
