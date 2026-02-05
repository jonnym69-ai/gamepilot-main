"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRecommendationEngine = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
const SimpleRecommendationEngine = ({ games, userGames, currentMood, onRecommendationSelect, className = '' }) => {
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [isAnalyzing, setIsAnalyzing] = (0, react_1.useState)(false);
    // Analyze user play patterns
    const analyzeUserPatterns = (0, react_1.useCallback)(() => {
        const playedGames = userGames.filter(game => game.hoursPlayed && game.hoursPlayed > 0);
        const completedGames = userGames.filter(game => game.playStatus === 'completed');
        // Calculate preferred genres by playtime
        const playtimeByGenre = {};
        playedGames.forEach(game => {
            game.genres?.forEach(genre => {
                const genreName = typeof genre === 'string' ? genre : genre.name || 'Unknown';
                playtimeByGenre[genreName] = (playtimeByGenre[genreName] || 0) + (game.hoursPlayed || 0);
            });
        });
        const preferredGenres = Object.entries(playtimeByGenre)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([genre]) => genre);
        // Completion rate
        const completionRate = userGames.length > 0
            ? (completedGames.length / userGames.length) * 100
            : 0;
        return {
            preferredGenres,
            completionRate,
            playtimeByGenre,
            avgSessionLength: playedGames.length > 0
                ? playedGames.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0) / playedGames.length
                : 0
        };
    }, [userGames]);
    // Mood-based recommendations
    const getMoodRecommendations = (0, react_1.useCallback)((mood) => {
        const moodData = static_data_1.MOODS.find(m => m.name.toLowerCase() === mood.toLowerCase());
        if (!moodData)
            return [];
        return games
            .filter(game => !userGames.some(ug => ug.id === game.id))
            .map(game => {
            let score = 0;
            const reasons = [];
            // Check if game matches mood through associated genres
            const gameGenres = game.genres?.map(g => typeof g === 'string' ? g : g.name || '') || [];
            const moodGenreMatch = gameGenres.some(genre => moodData.associatedGenres.includes(genre.toLowerCase()));
            if (moodGenreMatch) {
                score += 50;
                reasons.push(`Perfect mood match for ${mood}`);
            }
            // Check intensity matching using playtime as proxy
            const estimatedPlaytime = game.hoursPlayed || 20; // Default 20 hours
            const intensityDiff = Math.abs(estimatedPlaytime - moodData.intensity * 10);
            if (intensityDiff <= 15) {
                score += 25;
                reasons.push('Playtime matches your mood');
            }
            // Bonus for completed games (as quality indicator)
            if (game.playStatus === 'completed') {
                score += 15;
                reasons.push('Quality game worth completing');
            }
            return {
                gameId: game.id,
                score: Math.min(score, 100),
                reasons,
                confidence: moodGenreMatch ? 0.8 : 0.6,
                category: 'mood-match'
            };
        })
            .filter(rec => rec.score > 30)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
    }, [games, userGames]);
    // Similar games recommendations
    const getSimilarGamesRecommendations = (0, react_1.useCallback)(() => {
        const recommendations = [];
        userGames.forEach(userGame => {
            if (userGame.playStatus !== 'completed' && userGame.playStatus !== 'playing')
                return;
            // Find similar games
            const similarGames = games
                .filter(game => !userGames.some(ug => ug.id === game.id))
                .map(game => {
                let similarity = 0;
                const reasons = [];
                // Genre similarity
                const userGenres = userGame.genres?.map(g => typeof g === 'string' ? g : g.name || '') || [];
                const gameGenres = game.genres?.map(g => typeof g === 'string' ? g : g.name || '') || [];
                const commonGenres = userGenres.filter(g => gameGenres.includes(g));
                if (commonGenres.length > 0) {
                    similarity += (commonGenres.length / Math.max(userGenres.length, gameGenres.length)) * 50;
                    reasons.push(`Similar genres: ${commonGenres.join(', ')}`);
                }
                // Platform similarity
                const userPlatforms = userGame.platforms?.map(p => p.name) || [];
                const gamePlatforms = game.platforms?.map(p => p.name) || [];
                const commonPlatforms = userPlatforms.filter(p => gamePlatforms.includes(p));
                if (commonPlatforms.length > 0) {
                    similarity += 20;
                    reasons.push('Available on your platforms');
                }
                // Tag similarity
                const userTags = userGame.tags || [];
                const gameTags = game.tags || [];
                const commonTags = userTags.filter(t => gameTags.includes(t));
                if (commonTags.length > 0) {
                    similarity += (commonTags.length / Math.max(userTags.length, gameTags.length)) * 30;
                    reasons.push(`Similar tags: ${commonTags.join(', ')}`);
                }
                return {
                    gameId: game.id,
                    score: Math.min(similarity, 100),
                    reasons,
                    confidence: 0.7,
                    category: 'similar-games'
                };
            })
                .filter(rec => rec.score > 30);
            recommendations.push(...similarGames);
        });
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }, [games, userGames]);
    // Play pattern recommendations
    const getPlayPatternRecommendations = (0, react_1.useCallback)((userPattern) => {
        return games
            .filter(game => !userGames.some(ug => ug.id === game.id))
            .map(game => {
            let score = 0;
            const reasons = [];
            // Genre affinity scoring
            game.genres?.forEach(genre => {
                const genreName = typeof genre === 'string' ? genre : genre.name || '';
                const genreScore = userPattern.playtimeByGenre[genreName] || 0;
                if (genreScore > 0) {
                    score += Math.min(genreScore / 10, 40);
                    reasons.push(`You love ${genreName} games`);
                }
            });
            // Completion rate matching
            if (userPattern.completionRate > 70) {
                // User completes games, recommend games they're likely to finish
                if (game.playStatus === 'completed') {
                    score += 20;
                    reasons.push('Quality game - you finish what you start');
                }
            }
            else if (userPattern.completionRate < 30) {
                // User doesn't complete games, recommend shorter games
                if (game.hoursPlayed && game.hoursPlayed < 15) {
                    score += 15;
                    reasons.push('Shorter game - perfect for your play style');
                }
            }
            // Session length matching
            if (userPattern.avgSessionLength > 0) {
                const gamePlaytime = game.hoursPlayed || 20;
                const playtimeDiff = Math.abs(userPattern.avgSessionLength - gamePlaytime);
                if (playtimeDiff < 5) {
                    score += 15;
                    reasons.push('Matches your average session length');
                }
            }
            return {
                gameId: game.id,
                score: Math.min(score, 100),
                reasons,
                confidence: 0.75,
                category: 'play-pattern'
            };
        })
            .filter(rec => rec.score > 25)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
    }, [games, userGames]);
    // Generate all recommendations
    const generateRecommendations = (0, react_1.useCallback)(() => {
        setIsAnalyzing(true);
        const userPattern = analyzeUserPatterns();
        let allRecommendations = [];
        // Generate different types of recommendations
        if (currentMood) {
            allRecommendations.push(...getMoodRecommendations(currentMood));
        }
        allRecommendations.push(...getSimilarGamesRecommendations());
        allRecommendations.push(...getPlayPatternRecommendations(userPattern));
        // Remove duplicates and sort by score
        const uniqueRecommendations = allRecommendations.reduce((acc, rec) => {
            const existing = acc.find(r => r.gameId === rec.gameId);
            if (existing) {
                // Combine scores and reasons
                existing.score = Math.min(existing.score + rec.score * 0.3, 100);
                existing.reasons.push(...rec.reasons);
                existing.confidence = Math.max(existing.confidence, rec.confidence);
            }
            else {
                acc.push(rec);
            }
            return acc;
        }, []);
        const finalRecommendations = uniqueRecommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 12);
        setTimeout(() => setIsAnalyzing(false), 500); // Simulate processing time
        return finalRecommendations;
    }, [analyzeUserPatterns, currentMood, getMoodRecommendations, getSimilarGamesRecommendations, getPlayPatternRecommendations]);
    const recommendations = (0, react_1.useMemo)(() => generateRecommendations(), [generateRecommendations]);
    // Filter recommendations by category
    const filteredRecommendations = (0, react_1.useMemo)(() => {
        if (selectedCategory === 'all')
            return recommendations;
        return recommendations.filter(rec => rec.category === selectedCategory);
    }, [recommendations, selectedCategory]);
    // Get game by ID
    const getGameById = (0, react_1.useCallback)((gameId) => {
        return games.find(game => game.id === gameId);
    }, [games]);
    const categories = [
        { id: 'all', label: 'All Recommendations', icon: '✨' },
        { id: 'mood-match', label: 'Mood Matches', icon: '🎭' },
        { id: 'similar-games', label: 'Similar Games', icon: '🎮' },
        { id: 'play-pattern', label: 'Play Patterns', icon: '📊' }
    ];
    if (recommendations.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `text-center py-12 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83E\uDD14" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white mb-2", children: "No recommendations yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Add more games to your library to get personalized recommendations!" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `space-y-6 ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-2", children: "Recommended for You" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: currentMood ? `Games perfect for your ${currentMood} mood` : 'Based on your gaming patterns' })] }), isAnalyzing && ((0, jsx_runtime_1.jsx)("div", { className: "text-gaming-primary animate-pulse", children: "Analyzing your patterns..." }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 flex-wrap", children: categories.map(category => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedCategory(category.id), className: `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedCategory === category.id
                        ? 'bg-gaming-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: category.icon }), category.label] }, category.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredRecommendations.map((recommendation) => {
                    const game = getGameById(recommendation.gameId);
                    if (!game)
                        return null;
                    return ((0, jsx_runtime_1.jsx)(RecommendationCard, { game: game, recommendation: recommendation, onSelect: () => onRecommendationSelect?.(game, recommendation.reasons[0]) }, recommendation.gameId));
                }) })] }));
};
exports.SimpleRecommendationEngine = SimpleRecommendationEngine;
// Recommendation Card Component
const RecommendationCard = ({ game, recommendation, onSelect }) => {
    const confidenceColor = recommendation.confidence > 0.8 ? 'text-green-400' :
        recommendation.confidence > 0.6 ? 'text-yellow-400' : 'text-orange-400';
    return ((0, jsx_runtime_1.jsxs)("div", { onClick: onSelect, className: "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gaming-primary/50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-gaming-primary/20 group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative mb-3 rounded-lg overflow-hidden", children: [game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAE" }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2 bg-gaming-primary/90 backdrop-blur-sm px-2 py-1 rounded-lg", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-white font-bold text-sm", children: [Math.round(recommendation.score), "%"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-white group-hover:text-gaming-primary transition-colors line-clamp-1", children: game.title }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: game.genres?.slice(0, 2).map((genre, index) => ((0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-1 bg-gray-700 rounded text-gray-300", children: typeof genre === 'string' ? genre : genre.name }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: `text-xs font-medium ${confidenceColor}`, children: [Math.round(recommendation.confidence * 100), "% match"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: recommendation.category.replace('-', ' ') })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 line-clamp-2", children: recommendation.reasons[0] })] })] })] }));
};
