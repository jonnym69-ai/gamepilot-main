"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaystyleAnalysisSimplified = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PLAYSTYLE_ARCHETYPES = {
    explorer: {
        name: 'Explorer',
        description: 'You love discovering new worlds and uncovering secrets',
        icon: '🗺️',
        color: '#10B981',
        recommendation: 'Try open-world games with rich narratives'
    },
    achiever: {
        name: 'Achiever',
        description: 'You\'re driven by goals and completion',
        icon: '🏆',
        color: '#F59E0B',
        recommendation: 'Focus on games with progression systems'
    },
    social: {
        name: 'Social',
        description: 'You enjoy cooperative and multiplayer experiences',
        icon: '👥',
        color: '#8B5CF6',
        recommendation: 'Try co-op and party games'
    },
    strategist: {
        name: 'Strategist',
        description: 'You excel at planning and tactical thinking',
        icon: '♟️',
        color: '#3B82F6',
        recommendation: 'Challenge yourself with strategy games'
    },
    casual: {
        name: 'Casual',
        description: 'You prefer relaxed, stress-free gaming experiences',
        icon: '🌴',
        color: '#22C55E',
        recommendation: 'Try indie games and creative experiences'
    },
    competitive: {
        name: 'Competitive',
        description: 'You thrive on challenges and competition',
        icon: '⚔️',
        color: '#EF4444',
        recommendation: 'Test your skills in ranked matches'
    }
};
const PlaystyleAnalysisSimplified = ({ games }) => {
    const [error, setError] = (0, react_1.useState)(null);
    const [isLoading] = (0, react_1.useState)(false);
    // Memoized scores
    const scores = (0, react_1.useMemo)(() => {
        const scores = {
            explorer: 0,
            achiever: 0,
            social: 0,
            strategist: 0,
            casual: 0,
            competitive: 0
        };
        games.forEach(game => {
            // Explorer indicators
            if (game.genres?.some(g => g.name.toLowerCase().includes('adventure')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('rpg')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('open-world')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('sandbox'))) {
                scores.explorer += 1;
            }
            // Achiever indicators
            if (game.playStatus === 'completed' ||
                (game.userRating && game.userRating >= 4) ||
                (game.hoursPlayed && game.hoursPlayed > 50)) {
                scores.achiever += 1;
            }
            // Social indicators
            if (game.genres?.some(g => g.name.toLowerCase().includes('multiplayer')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('mmo')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('party'))) {
                scores.social += 1;
            }
            // Strategist indicators
            if (game.genres?.some(g => g.name.toLowerCase().includes('strategy')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('puzzle'))) {
                scores.strategist += 1;
            }
            // Casual indicators
            if (game.genres?.some(g => g.name.toLowerCase().includes('casual')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('simulation')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('creative'))) {
                scores.casual += 1;
            }
            // Competitive indicators
            if (game.genres?.some(g => g.name.toLowerCase().includes('action')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('shooter')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('fighting')) ||
                game.genres?.some(g => g.name.toLowerCase().includes('racing'))) {
                scores.competitive += 1;
            }
        });
        return scores;
    }, [games]);
    // Get playstyle insights
    const playstyleInsights = (0, react_1.useMemo)(() => {
        const insights = [];
        const currentScores = scores;
        // Find dominant playstyle
        const dominantPlaystyle = Object.entries(currentScores).reduce((a, b) => currentScores[b[0]] > currentScores[a[0]] ? b : a)[0];
        const dominantData = PLAYSTYLE_ARCHETYPES[dominantPlaystyle];
        // Add dominant playstyle insight
        insights.push({
            archetype: dominantData.name,
            score: currentScores[dominantPlaystyle],
            description: dominantData.description,
            icon: dominantData.icon,
            color: dominantData.color,
            recommendation: dominantData.recommendation
        });
        // Add variety insight
        const varietyScore = Object.values(currentScores).filter(score => score > 0).length;
        if (varietyScore >= 3) {
            insights.push({
                archetype: 'versatile',
                score: varietyScore,
                description: `You have ${varietyScore} different playstyles`,
                icon: '🌈',
                color: '#8B5CF6',
                recommendation: 'Continue exploring diverse game genres'
            });
        }
        // Add strengths insights
        Object.entries(currentScores).forEach(([playstyle, score]) => {
            if (score > 0) {
                const data = PLAYSTYLE_ARCHETYPES[playstyle];
                insights.push({
                    archetype: data.name,
                    score,
                    description: `You tend to be a strong ${data.name.toLowerCase()}`,
                    icon: data.icon,
                    color: data.color,
                    recommendation: data.recommendation
                });
            }
        });
        // Add improvement suggestions
        if (currentScores.competitive < currentScores.strategist) {
            insights.push({
                archetype: 'improvement',
                score: 5,
                description: 'Consider more strategy games to balance your playstyle',
                icon: '🎯',
                color: '#3B82F6',
                recommendation: 'Try games that require planning and tactical thinking'
            });
        }
        return insights;
    }, [scores]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "text-white text-xl", children: "Analyzing your playstyle..." }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 max-w-md w-full border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Playstyle Analysis Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setError(null), className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80", children: "Try Again" })] }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Your Gaming Playstyle" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Analysis based on your game library and play patterns" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6", children: Object.entries(scores).map(([playstyle, score]) => ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-white", children: PLAYSTYLE_ARCHETYPES[playstyle]?.icon || '🎮' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: PLAYSTYLE_ARCHETYPES[playstyle]?.name || playstyle }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 capitalize", children: PLAYSTYLE_ARCHETYPES[playstyle]?.description || '' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", style: { color: PLAYSTYLE_ARCHETYPES[playstyle]?.color || '#fff' }, children: score }) })] }) }, playstyle))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Playstyle Distribution" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: Object.entries(scores).map(([playstyle, score]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 min-w-[80px]", children: PLAYSTYLE_ARCHETYPES[playstyle]?.name || playstyle }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-transparent to-blue-500 rounded-full", style: { width: `${score}%` } }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right text-sm text-gray-400 ml-3 min-w-[40px]", children: [score, "%"] })] }, playstyle))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Gaming Insights" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: playstyleInsights.map((insight, index) => ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: insight.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium mb-1", children: insight.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-2", children: insight.description }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: insight.recommendation })] })] }) }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Game Analysis" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-4", children: "Analysis based on your game library and play patterns" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: Object.entries(scores).map(([playstyle, count]) => ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-3 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 capitalize", children: playstyle }), (0, jsx_runtime_1.jsx)("div", { className: "text-right font-bold", children: count })] }) }, playstyle))) })] })] }));
};
exports.PlaystyleAnalysisSimplified = PlaystyleAnalysisSimplified;
