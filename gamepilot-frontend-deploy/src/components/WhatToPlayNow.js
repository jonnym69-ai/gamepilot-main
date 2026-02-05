"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatToPlayNow = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useLibraryStore_1 = require("../stores/useLibraryStore");
const contextualEngine_1 = require("../utils/contextualEngine");
const contextualEngine_2 = require("../utils/contextualEngine");
const contextualEngine_3 = require("../utils/contextualEngine");
const analytics_1 = require("../utils/analytics");
const ToastProvider_1 = require("./ui/ToastProvider");
const launchGame_1 = require("../utils/launchGame");
const WhatToPlayNow = ({ onClose, className = '' }) => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const { showSuccess, showError, showWarning, showInfo } = (0, ToastProvider_1.useToast)();
    const [recommendations, setRecommendations] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [rerollCount, setRerollCount] = (0, react_1.useState)(0);
    const [suggestedGameIds, setSuggestedGameIds] = (0, react_1.useState)(new Set());
    const [isSpinning, setIsSpinning] = (0, react_1.useState)(false);
    const [spinningGames, setSpinningGames] = (0, react_1.useState)([]);
    const [finalGame, setFinalGame] = (0, react_1.useState)(null);
    // Generate recommendations
    const generateRecommendations = async (excludeIds = new Set()) => {
        setIsLoading(true);
        // Filter out invalid games
        const validGames = games?.filter((g) => g && g.id) || [];
        try {
            // Safety check for games array
            if (!games || !Array.isArray(games) || games.length === 0) {
                showInfo('No games available for recommendations');
                setRecommendations([]);
                return;
            }
            if (validGames.length === 0) {
                showWarning('No valid games found in your library');
                setRecommendations([]);
                return;
            }
            // Track analytics
            (0, analytics_1.trackEvent)("what_to_play_opened", {
                timeOfDay: (0, contextualEngine_3.detectTimeOfDay)(),
                selectedSessionLength: 'auto',
                selectedMoods: 'auto'
            });
            // Build contextual filters from current context
            const contextualFilters = {
                selectedMoods: [], // Will be derived from persona
                selectedSessionLength: 'medium', // Will be derived from persona
                timeOfDay: (0, contextualEngine_3.detectTimeOfDay)(),
                excludeIds: Array.from(excludeIds)
            };
            // Generate persona context
            const personaContext = (0, contextualEngine_1.generatePersonaContext)(validGames);
            // Get ranked matches
            const matches = (0, contextualEngine_2.getPersonaContextualMatches)(validGames, personaContext, contextualFilters, { personaWeight: 0.8 } // High persona weight for confident recommendations
            );
            // Take top recommendations
            const validMatches = (matches || []).filter(match => match && match.game && match.game.id);
            const topMatches = validMatches.slice(0, 3);
            if (topMatches.length === 0) {
                console.warn('No valid matches found, using fallback recommendations');
                showInfo('Using fallback recommendations');
                // Don't return early - let the fallback logic handle this
            }
            // Generate reasons for each recommendation only if we have matches
            let enrichedRecommendations = [];
            if (topMatches.length > 0) {
                enrichedRecommendations = topMatches.map(match => {
                    const reasons = [];
                    // Similar games reason
                    if (personaContext?.dominantMoods && personaContext.dominantMoods.length > 0) {
                        const similarReason = `Matches your dominant moods: ${personaContext.dominantMoods.slice(0, 2).join(', ')}`;
                        reasons.push(similarReason);
                    }
                    // Session length reason
                    if (personaContext?.preferredSessionLength) {
                        const sessionReason = `Fits your usual session length: ${personaContext.preferredSessionLength}`;
                        reasons.push(sessionReason);
                    }
                    // Time of day reason
                    const timeReason = `Perfect for ${(0, contextualEngine_3.detectTimeOfDay)()} gaming`;
                    reasons.push(timeReason);
                    // Similar games reason (fallback to library games if no persona data)
                    if (games && games.length > 0) {
                        const topGames = games.slice(0, 2).map(g => g.title || 'Unknown Game');
                        const similarReason = `Similar to games in your library: ${topGames.join(', ')}`;
                        reasons.push(similarReason);
                    }
                    // Completion rate reason
                    if (personaContext?.completionRate && personaContext.completionRate > 0.7) {
                        const completionReason = `Matches your ${Math.round(personaContext.completionRate * 100)}% completion rate`;
                        reasons.push(completionReason);
                    }
                    return {
                        game: match.game,
                        score: match.score,
                        reasons: reasons.slice(0, 4) // Limit to 4 reasons
                    };
                });
            }
            // Use enriched recommendations if available, otherwise use fallback
            if (enrichedRecommendations.length > 0) {
                setRecommendations(enrichedRecommendations);
                showSuccess('Recommendations generated successfully');
            }
            else {
                console.warn('No enriched recommendations, using fallback');
                showInfo('Using fallback recommendations');
                const fallbackRecommendations = validGames
                    .filter((g) => !excludeIds.has(g.id))
                    .slice(0, 3)
                    .map((game) => ({
                    game,
                    score: 0.5,
                    reasons: ['Available in your library']
                }));
                setRecommendations(fallbackRecommendations);
            }
        }
        catch (error) {
            console.error('Error generating recommendations:', error);
            showError('Failed to generate recommendations');
            // Fallback: just show top games
            const fallbackRecommendations = validGames
                .filter((g) => !excludeIds.has(g.id))
                .slice(0, 3)
                .map((game) => ({
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
    // Handle animated slot machine reroll
    const handleReroll = async () => {
        if (isSpinning)
            return;
        setIsSpinning(true);
        setFinalGame(null);
        // Get random games for the slot machine animation
        const validGames = games?.filter((g) => g && g.id) || [];
        const randomGames = [];
        for (let i = 0; i < 10; i++) {
            const randomGame = validGames[Math.floor(Math.random() * validGames.length)];
            if (randomGame)
                randomGames.push(randomGame);
        }
        setSpinningGames(randomGames);
        // Generate actual recommendations
        const newSuggestedIds = new Set(suggestedGameIds);
        recommendations.forEach(rec => {
            if (rec.game?.id) {
                newSuggestedIds.add(rec.game.id);
            }
        });
        setSuggestedGameIds(newSuggestedIds);
        setRerollCount(prev => prev + 1);
        // Simulate slot machine spinning
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Generate new recommendations
        try {
            await generateRecommendations(newSuggestedIds);
            // The function sets recommendations internally, so we'll use the first one after it completes
        }
        catch (error) {
            console.error('Error generating recommendations:', error);
        }
        finally {
            setIsSpinning(false);
            setSpinningGames([]);
        }
        (0, analytics_1.trackEvent)("what_to_play_reroll", {
            count: rerollCount + 1,
            totalSuggested: newSuggestedIds.size
        });
    };
    // Handle game launch
    const handleLaunchGame = async (game, isPrimary) => {
        if (!game?.id || !game?.title) {
            console.warn('Invalid game data for launch:', game);
            showError('Invalid game data for launch');
            return;
        }
        (0, analytics_1.trackEvent)(isPrimary ? "what_to_play_launch" : "what_to_play_alt_launch", {
            gameId: game.id,
            gameTitle: game.title,
            score: recommendations.find(r => r.game?.id === game.id)?.score,
            isPrimary
        });
        try {
            showSuccess(`Launching ${game.title}...`);
            if (game.appId) {
                await (0, launchGame_1.launchGame)(game.appId);
                showSuccess(`${game.title} launched successfully!`);
            }
            else {
                showError(`No launch ID available for ${game.title}`);
            }
        }
        catch (error) {
            showError(`Failed to launch ${game.title}`);
            console.error('Launch error:', error);
        }
    };
    const primary = recommendations[0];
    const alternates = recommendations.slice(1, 3);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `what-to-play-now ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "what-to-play-loading", children: [(0, jsx_runtime_1.jsx)("div", { className: "loading-spinner" }), (0, jsx_runtime_1.jsx)("h3", { children: "Finding Your Perfect Game..." }), (0, jsx_runtime_1.jsx)("p", { children: "Analyzing your gaming personality and preferences" })] }) }));
    }
    if (recommendations.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `what-to-play-now ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "what-to-play-empty", children: [(0, jsx_runtime_1.jsx)("div", { className: "empty-icon", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("h3", { children: "No Games Available" }), (0, jsx_runtime_1.jsx)("p", { children: "Add some games to your library to get personalized recommendations!" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "close-btn", children: "Go Back" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `what-to-play-now ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "what-to-play-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("h2", { className: "title", children: "I'm Not Sure What To Play" }), (0, jsx_runtime_1.jsx)("p", { className: "subtitle", children: "Let GamePilot pick based on your mood, time, and play style" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "close-btn", "aria-label": "Close", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), primary && primary.game && ((0, jsx_runtime_1.jsx)("div", { className: "primary-recommendation", children: (0, jsx_runtime_1.jsx)("div", { className: "game-card primary", children: (0, jsx_runtime_1.jsxs)("div", { className: "game-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-info", children: [(0, jsx_runtime_1.jsx)("h3", { className: "game-title", children: primary.game.title || 'Unknown Game' }), (0, jsx_runtime_1.jsx)("div", { className: "game-meta", children: primary.game?.genres?.slice(0, 2).map((genre) => ((0, jsx_runtime_1.jsx)("span", { className: "genre-tag", children: typeof genre === 'string' ? genre : genre.name }, typeof genre === 'string' ? genre : genre.name))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-art", children: primary.game?.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: primary.game.coverImage, alt: primary.game?.title || 'Game', className: "game-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "game-cover-placeholder", children: (0, jsx_runtime_1.jsx)("div", { className: "placeholder-icon", children: "\uD83C\uDFAE" }) })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-description", children: (0, jsx_runtime_1.jsx)("p", { children: primary.game.description || 'No description available' }) }), (0, jsx_runtime_1.jsxs)("div", { className: "game-reasons", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Why this game?" }), (0, jsx_runtime_1.jsx)("ul", { className: "reasons-list", children: (primary.reasons || []).map((reason, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "reason-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "reason-icon", children: "\u2713" }), reason] }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "game-actions", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => primary.game && handleLaunchGame(primary.game, true), className: "launch-btn primary", children: [(0, jsx_runtime_1.jsx)("span", { className: "btn-icon", children: "\uD83D\uDE80" }), "Launch Now"] }), (0, jsx_runtime_1.jsxs)("div", { className: "confidence-score", children: [(0, jsx_runtime_1.jsx)("span", { className: "score-label", children: "Match Score:" }), (0, jsx_runtime_1.jsxs)("span", { className: "score-value", children: [Math.round((primary.score || 0) * 100), "%"] })] })] })] }) }) })), isSpinning && ((0, jsx_runtime_1.jsxs)("div", { className: "slot-machine-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "slot-machine-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83C\uDFB0 Finding Your Perfect Game..." }), (0, jsx_runtime_1.jsx)("div", { className: "spinning-indicator", children: (0, jsx_runtime_1.jsx)("div", { className: "spinner" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "slot-machine-track", children: (0, jsx_runtime_1.jsx)("div", { className: "slot-machine-games", children: spinningGames.map((game, index) => ((0, jsx_runtime_1.jsx)("div", { className: "slot-game-card", style: {
                                    animation: `slideIn 0.5s ease-in-out ${index * 0.1}s both`
                                }, children: (0, jsx_runtime_1.jsxs)("div", { className: "slot-game-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "slot-game-image", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "slot-game-placeholder", children: "\uD83C\uDFAE" })) }), (0, jsx_runtime_1.jsx)("div", { className: "slot-game-title", children: game.title || 'Unknown Game' })] }) }, `${game.id}-${index}`))) }) })] })), !isSpinning && finalGame && ((0, jsx_runtime_1.jsx)("div", { className: "final-game-reveal", children: (0, jsx_runtime_1.jsx)("div", { className: "reveal-animation", children: (0, jsx_runtime_1.jsxs)("div", { className: "reveal-content", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83C\uDFAF Your Perfect Match!" }), (0, jsx_runtime_1.jsxs)("div", { className: "final-game-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "final-game-image", children: finalGame.game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: finalGame.game.coverImage, alt: finalGame.game.title })) : ((0, jsx_runtime_1.jsx)("div", { className: "final-game-placeholder", children: "\uD83C\uDFAE" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "final-game-info", children: [(0, jsx_runtime_1.jsx)("h4", { children: finalGame.game.title || 'Unknown Game' }), (0, jsx_runtime_1.jsxs)("div", { className: "final-game-score", children: [Math.round((finalGame.score || 0) * 100), "% Match"] })] })] })] }) }) })), alternates.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "alternate-recommendations", children: [(0, jsx_runtime_1.jsxs)("div", { className: "alternates-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Or Try These" }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleReroll, className: "reroll-btn", disabled: games.length <= 3 || isSpinning, children: [(0, jsx_runtime_1.jsx)("span", { className: "reroll-icon", children: isSpinning ? '🎰' : '🎲' }), isSpinning ? 'Spinning...' : 'Surprise Me!', rerollCount > 0 && (0, jsx_runtime_1.jsxs)("span", { className: "reroll-count", children: ["(", rerollCount, ")"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "alternates-grid", children: alternates.map((rec) => ((0, jsx_runtime_1.jsx)("div", { className: "game-card alternate", children: (0, jsx_runtime_1.jsxs)("div", { className: "game-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "game-info", children: [(0, jsx_runtime_1.jsx)("h4", { className: "game-title", children: rec.game?.title || 'Unknown Game' }), (0, jsx_runtime_1.jsx)("div", { className: "game-meta", children: rec.game?.genres?.slice(0, 1).map((genre) => ((0, jsx_runtime_1.jsx)("span", { className: "genre-tag small", children: typeof genre === 'string' ? genre : genre.name }, typeof genre === 'string' ? genre : genre.name))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-art small", children: rec.game?.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: rec.game.coverImage, alt: rec.game?.title || 'Game', className: "game-cover small" })) : ((0, jsx_runtime_1.jsx)("div", { className: "game-cover-placeholder small", children: (0, jsx_runtime_1.jsx)("div", { className: "placeholder-icon small", children: "\uD83C\uDFAE" }) })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "game-reasons small", children: (0, jsx_runtime_1.jsx)("div", { className: "reasons-list", children: (rec.reasons || []).slice(0, 2).map((reason, reasonIndex) => ((0, jsx_runtime_1.jsxs)("div", { className: "reason-item small", children: [(0, jsx_runtime_1.jsx)("span", { className: "reason-icon small", children: "\u2713" }), reason] }, reasonIndex))) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "game-actions", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => rec.game && handleLaunchGame(rec.game, false), className: "launch-btn small", children: "Play Now" }), (0, jsx_runtime_1.jsxs)("div", { className: "confidence-score small", children: [Math.round((rec.score || 0) * 100), "%"] })] })] }) }, rec.game?.id || Math.random()))) })] })), (0, jsx_runtime_1.jsx)("div", { className: "what-to-play-footer", children: (0, jsx_runtime_1.jsxs)("p", { className: "footer-text", children: ["Recommendations based on your gaming personality and ", games.length, " games in your library"] }) })] }));
};
exports.WhatToPlayNow = WhatToPlayNow;
// Add CSS styles
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

/* Slot Machine Animations */
.slot-machine-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1rem 0;
  overflow: hidden;
}

.slot-machine-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.slot-machine-header h3 {
  color: white;
  margin: 0;
  font-size: 1.2rem;
}

.spinning-indicator {
  display: flex;
  align-items: center;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.slot-machine-track {
  position: relative;
  height: 120px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slot-machine-games {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  animation: slideAcross 3s ease-in-out;
}

@keyframes slideAcross {
  0% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slot-game-card {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-width: 150px;
  transition: all 0.3s ease;
}

.slot-game-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.slot-game-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.slot-game-image {
  width: 60px;
  height: 60px;
  border-radius: 0.25rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.slot-game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slot-game-placeholder {
  font-size: 1.5rem;
}

.slot-game-title {
  color: white;
  font-size: 0.75rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.2;
}

/* Final Game Reveal */
.final-game-reveal {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1rem 0;
  animation: fadeInScale 0.5s ease-out;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.reveal-content h3 {
  color: white;
  text-align: center;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.final-game-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.final-game-image {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.final-game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.final-game-placeholder {
  font-size: 2rem;
}

.final-game-info {
  flex: 1;
}

.final-game-info h4 {
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.final-game-score {
  color: #10b981;
  font-weight: bold;
  font-size: 0.9rem;
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
