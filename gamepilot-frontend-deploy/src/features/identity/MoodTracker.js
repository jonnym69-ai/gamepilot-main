"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodTracker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
const ErrorBoundary_1 = require("../../components/ErrorBoundary");
const Loading_1 = require("../../components/Loading");
const MoodTracker = ({ games, onGameSessionEnd }) => {
    const [activeSessions, setActiveSessions] = (0, react_1.useState)([]);
    const [userMoodProfile, setUserMoodProfile] = (0, react_1.useState)(null);
    const [isLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // Initialize mood profile with mock data
    (0, react_1.useEffect)(() => {
        try {
            // Mock user moods for now - TODO: Connect to real mood engine
            const userMoods = [
                {
                    id: 'chill',
                    preference: 80,
                    frequency: 4,
                    lastExperienced: new Date(),
                    triggers: ['relaxing', 'casual'],
                    associatedGenres: ['puzzle', 'simulation']
                }
            ];
            const profile = {
                currentMood: 'chill',
                moodHistory: userMoods,
                dominantMood: 'chill',
                lastUpdated: new Date()
            };
            setUserMoodProfile(profile);
        }
        catch (err) {
            console.error('Failed to initialize mood profile:', err);
            setError('Failed to initialize mood tracking');
        }
    }, []);
    // End game session
    const endGameSession = (0, react_1.useCallback)((sessionId) => {
        const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1)
            return;
        const session = activeSessions[sessionIndex];
        if (!session)
            return;
        const endTime = new Date();
        const duration = session.startTime ? (endTime.getTime() - session.startTime.getTime()) / 1000 / 60 : 0;
        const updatedSession = {
            ...session,
            endTime,
            duration
        };
        setActiveSessions(prev => prev.map((s, index) => index === sessionIndex ? updatedSession : s));
        // Update mood model with completed session
        const gameSession = {
            id: session.id,
            gameId: session.gameId,
            gameName: 'Game', // Placeholder
            game: {}, // Placeholder
            genre: 'unknown', // Placeholder
            startTime: session.startTime || new Date(),
            endTime: new Date(),
            duration: duration,
            mood: session.mood || 'chill',
            intensity: session.intensity || 5,
            tags: [],
            platform: 'unknown',
            rating: session.rating
        };
        // Mock mood preference update - TODO: Connect to real mood engine
        const updatedMoods = [...(userMoodProfile?.moodHistory || [])];
        if (updatedMoods) {
            setUserMoodProfile(prev => prev ? {
                ...prev,
                moodHistory: updatedMoods,
                lastUpdated: new Date()
            } : null);
        }
        onGameSessionEnd?.(session.gameId, {
            gameId: session.gameId,
            startTime: session.startTime,
            endTime,
            duration,
            intensity: session.intensity,
            mood: session.mood
        });
    }, [activeSessions, userMoodProfile, onGameSessionEnd]);
    // Get mood color and icon
    const getMoodDisplay = (moodId) => {
        const moodData = static_data_1.MOODS.find(m => m.id === moodId);
        return {
            name: moodData?.name || 'Unknown',
            color: moodData?.color || '#6B7280',
            icon: moodData?.icon || '🎮',
            description: moodData?.description || 'No description available'
        };
    };
    // Get current mood with fallback
    const currentMoodDisplay = userMoodProfile?.currentMood
        ? getMoodDisplay(userMoodProfile.currentMood)
        : getMoodDisplay('chill');
    // Calculate mood distribution
    const getMoodDistribution = (0, react_1.useCallback)(() => {
        if (!userMoodProfile?.moodHistory || userMoodProfile.moodHistory.length === 0) {
            return [];
        }
        // Use UserMood frequency for distribution
        const moodData = userMoodProfile.moodHistory.map(userMood => ({
            moodId: userMood.id,
            count: userMood.frequency,
            display: getMoodDisplay(userMood.id)
        }));
        const total = moodData.reduce((sum, item) => sum + item.count, 0);
        return moodData.map(({ moodId, count, display }) => ({
            mood: moodId,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            display
        }));
    }, [userMoodProfile]);
    // Get mood insights
    const getMoodInsights = (0, react_1.useCallback)(() => {
        if (!userMoodProfile)
            return [];
        const insights = [];
        // Dominant mood
        if (userMoodProfile.dominantMood) {
            const dominantDisplay = getMoodDisplay(userMoodProfile.dominantMood);
            insights.push({
                type: 'dominant',
                title: 'Dominant Mood',
                value: dominantDisplay.name,
                icon: dominantDisplay.icon,
                color: dominantDisplay.color,
                description: `You're most often ${dominantDisplay.name.toLowerCase()} when gaming`
            });
        }
        // Mood variety
        const moodCount = Object.keys(getMoodDistribution()).length;
        if (moodCount > 3) {
            insights.push({
                type: 'variety',
                title: 'Diverse Gamer',
                value: `${moodCount} different moods`,
                icon: '🌈',
                color: '#8B5CF6',
                description: 'You experience a wide range of gaming moods'
            });
        }
        // Recent trend
        const recentEntries = userMoodProfile.moodHistory.slice(-10);
        if (recentEntries.length >= 2) {
            const moodChanges = recentEntries.filter((entry, index) => index > 0 && entry.id !== recentEntries[index - 1].id).length;
            if (moodChanges > 0) {
                insights.push({
                    type: 'trend',
                    title: 'Mood Explorer',
                    value: `${moodChanges} mood changes recently`,
                    icon: '📊',
                    color: '#10B981',
                    description: 'Your gaming mood has been changing frequently'
                });
            }
        }
        return insights;
    }, [userMoodProfile]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(Loading_1.Loading, { message: "Initializing mood tracking...", size: "xl" }) }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 max-w-md w-full border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83E\uDDE0" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Mood Tracking Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setError(null), className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80", children: "Try Again" })] }) }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Current Gaming Mood" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl", children: currentMoodDisplay.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold text-white", children: currentMoodDisplay.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 capitalize", children: currentMoodDisplay.description })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Based on your recent gaming sessions" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Mood Distribution" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: getMoodDistribution().map(({ mood, count, percentage, display }) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: display.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: display.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [count, " sessions"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-4", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-transparent to-currentMoodDisplay.color rounded-full", style: { width: `${percentage}%` } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right text-sm text-gray-400", children: [percentage, "%"] })] })] }, mood))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Gaming Insights" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: getMoodInsights().map((insight, index) => ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: insight.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium mb-1", children: insight.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: insight.value }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: insight.description })] })] }) }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Active Gaming Sessions" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: activeSessions.slice(-5).map((session) => {
                                    const game = games.find(g => g.id === session.gameId);
                                    const moodDisplay = getMoodDisplay(session.mood);
                                    const duration = session.duration ? Math.round(session.duration / 60) : 0;
                                    return ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gray-700 rounded flex-shrink-0 overflow-hidden", children: game?.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 min-w-0", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: game?.title || 'Unknown Game' }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [moodDisplay.icon, " ", moodDisplay.name.toLowerCase(), " mood"] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [duration, "h ", duration > 1 ? 'hours' : 'hour'] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => endGameSession(session.id), className: "ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm", children: "End Session" })] })] }) }, session.id));
                                }) })] })] }) }) }));
};
exports.MoodTracker = MoodTracker;
