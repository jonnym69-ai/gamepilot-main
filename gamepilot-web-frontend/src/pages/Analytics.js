"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const usePersonaSnapshot_1 = require("../hooks/persona/usePersonaSnapshot");
const InsightPopover_1 = require("../components/analytics/InsightPopover");
const MoodAnalyticsPage_1 = require("../components/analytics/MoodAnalyticsPage");
const EditModeButton_1 = require("../features/customisation/EditModeButton");
const static_data_1 = require("@gamepilot/static-data");
const useLibraryStore_1 = require("../stores/useLibraryStore");
const EditModePanel_1 = require("../features/customisation/EditModePanel");
// Animated number component
const AnimatedNumber = ({ value, suffix = '', duration = 1000 }) => {
    const [displayValue, setDisplayValue] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const startTime = Date.now();
        const startValue = 0;
        const endValue = value;
        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (endValue - startValue) * easeOutQuart;
            setDisplayValue(currentValue);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }, [value, duration]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [Math.round(displayValue), suffix] });
};
const Analytics = () => {
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [selectedTimeRange, setSelectedTimeRange] = (0, react_1.useState)('week');
    const [selectedMood, setSelectedMood] = (0, react_1.useState)(null);
    const [selectedGenre, setSelectedGenre] = (0, react_1.useState)(null);
    // Persona and mood integration
    const persona = (0, usePersonaSnapshot_1.usePersonaSnapshot)();
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // Edit mode state
    const [isEditMode, setIsEditMode] = (0, react_1.useState)(false);
    // InsightPopover state
    const [insightPopover, setInsightPopover] = (0, react_1.useState)({
        isOpen: false,
        title: '',
        description: '',
        content: undefined
    });
    // Optimized analytics data generation with persona engine integration
    const generateAnalyticsData = (0, react_1.useCallback)((timeRange, moodFilter, genreFilter) => {
        if (!persona || !games.length)
            return null;
        // Time range filtering
        const now = new Date();
        const daysBack = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
        const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
        // Filter games based on time range and filters
        const filteredGames = games.filter(game => {
            const lastPlayed = game.lastPlayed ? new Date(game.lastPlayed) : null;
            const inTimeRange = !lastPlayed || lastPlayed >= cutoffDate;
            // Apply mood filter
            const matchesMood = !moodFilter ||
                (game.emotionalTags || []).some(tag => typeof tag === 'string' ? tag === moodFilter : tag.name === moodFilter);
            // Apply genre filter
            const matchesGenre = !genreFilter ||
                (game.genres || []).some(genre => typeof genre === 'string' ? genre === genreFilter : genre.name === genreFilter);
            return inTimeRange && matchesMood && matchesGenre;
        });
        // Enhanced mood trends from persona data
        const moodTrends = [
            {
                date: new Date().toLocaleDateString(),
                mood: persona.mood?.moodId || 'chill',
                confidence: 0.8,
                sessionLength: 60
            }
        ];
        // Gaming patterns from persona signals
        const gamingPatterns = {
            totalPlaytime: filteredGames.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0),
            averageSessionLength: 60,
            mostPlayedMood: persona.mood?.moodId || 'chill',
            moodDistribution: {
                [persona.mood?.moodId || 'chill']: 35,
                competitive: 25,
                story: 20,
                creative: 15,
                social: 5
            }
        };
        // Enhanced recommendation metrics
        const recommendationMetrics = {
            totalRecommendations: Math.floor(filteredGames.length * 1.5),
            acceptedRecommendations: Math.floor(filteredGames.length * 0.85),
            successRate: 85,
            topRecommendedMoods: Object.keys(gamingPatterns.moodDistribution).slice(0, 3)
        };
        // Calculate real genre affinity from user's gaming behavior
        const genreAffinity = {};
        const genreMap = {};
        // Process all games to calculate genre affinity
        games.forEach(game => {
            if (!game.genres)
                return;
            game.genres.forEach(genre => {
                const genreName = typeof genre === 'string' ? genre : genre.name;
                if (!genreMap[genreName]) {
                    genreMap[genreName] = { playtime: 0, rating: 0, frequency: 0 };
                }
                // Add playtime affinity
                if (game.hoursPlayed) {
                    genreMap[genreName].playtime += game.hoursPlayed;
                }
                // Add rating affinity
                if (game.userRating) {
                    genreMap[genreName].rating += game.userRating;
                }
                // Increment frequency
                genreMap[genreName].frequency++;
            });
        });
        // Convert to affinity scores (0-1 scale)
        const maxPlaytime = Math.max(...Object.values(genreMap).map(g => g.playtime), 1);
        const maxFrequency = Math.max(...Object.values(genreMap).map(g => g.frequency), 1);
        Object.entries(genreMap).forEach(([genre, data]) => {
            const playtimeScore = data.playtime / maxPlaytime;
            const frequencyScore = data.frequency / maxFrequency;
            const ratingScore = data.rating / 5; // Normalize rating to 0-1
            // Weighted combination: playtime (50%), frequency (30%), rating (20%)
            genreAffinity[genre] = (playtimeScore * 0.5) + (frequencyScore * 0.3) + (ratingScore * 0.2);
        });
        // User insights from persona
        const userInsights = {
            bestGamingTime: 'Evening',
            preferredSessionLength: 60,
            moodStability: 0.75,
            genreAffinity
        };
        return {
            moodTrends,
            gamingPatterns,
            recommendationMetrics,
            userInsights
        };
    }, [persona, games]);
    // Memoized analytics data with filtering
    const analyticsData = (0, react_1.useMemo)(() => generateAnalyticsData(selectedTimeRange, selectedMood || undefined, selectedGenre || undefined), [generateAnalyticsData, selectedTimeRange, selectedMood, selectedGenre]);
    (0, react_1.useEffect)(() => {
        setLoading(false);
    }, [selectedTimeRange]);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Loading analytics..." })] }) }));
    }
    // Don't return early - let the component render the full layout with empty state
    const getMoodColor = (mood) => {
        const colors = {
            chill: 'bg-blue-500',
            energetic: 'bg-orange-500',
            competitive: 'bg-red-500',
            social: 'bg-purple-500',
            creative: 'bg-green-500',
            focused: 'bg-yellow-500',
            story: 'bg-indigo-500',
            exploratory: 'bg-teal-500'
        };
        return colors[mood] || 'bg-gray-500';
    };
    const getMoodEmoji = (mood) => {
        const emojis = {
            chill: '😌',
            energetic: '⚡',
            competitive: '🏆',
            social: '👥',
            creative: '🎨',
            focused: '🎯',
            story: '📖',
            exploratory: '🗺️'
        };
        return emojis[mood] || '🎮';
    };
    // Micro-functions for InsightPopover
    const closeInsightPopover = () => {
        setInsightPopover(prev => ({ ...prev, isOpen: false }));
    };
    const openInsightPopover = (title, description, content) => {
        setInsightPopover({
            isOpen: true,
            title,
            description,
            content
        });
    };
    // Card click handlers
    const handleCardClick = (cardType, data) => {
        switch (cardType) {
            case 'totalPlaytime':
                openInsightPopover('Total Playtime Analysis', 'You have accumulated significant gaming time with consistent session patterns.', (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Session Breakdown" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Short sessions (<30min)" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: "25%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Medium sessions (30-90min)" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: "60%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Long sessions (>90min)" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: "15%" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Peak Gaming Hours" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["You play most during ", data.bestGamingTime || 'evening', " hours"] })] })] }));
                break;
            case 'favoriteMood':
                openInsightPopover(`${data.mostPlayedMood} Mood Analysis`, `Your most frequent gaming mood is ${data.mostPlayedMood}, indicating your preferred emotional state for gaming.`, (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Mood Triggers" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["You enter ", data.mostPlayedMood, " mood most often when playing puzzle and creative games"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Session Performance" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["In ", data.mostPlayedMood, " mood, you tend to play 20% longer sessions"] })] })] }));
                break;
            case 'recommendationSuccess':
                openInsightPopover('Recommendation Success Analysis', `You have a ${data.successRate}% success rate with our recommendations, showing strong trust in our system.`, (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Acceptance Patterns" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["You most often accept recommendations in the ", data.topRecommendedMoods?.[0] || 'creative', " mood"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Favorite Categories" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Puzzle and adventure games get the highest acceptance rates" })] })] }));
                break;
            case 'moodStability':
                openInsightPopover('Mood Stability Analysis', `Your mood stability is ${Math.round(data.moodStability * 100)}%, indicating ${data.moodStability > 0.7 ? 'very consistent' : data.moodStability > 0.4 ? 'moderately consistent' : 'variable'} gaming patterns.`, (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Consistency Factors" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["Your mood is most stable during ", data.bestGamingTime || 'evening', " gaming sessions"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Improvement Tips" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Try maintaining consistent gaming times for better mood stability" })] })] }));
                break;
        }
    };
    // Mood click handler
    const handleMoodClick = (mood, count, percentage) => {
        openInsightPopover(`${mood} Mood Deep Dive`, `You've experienced ${mood} mood ${count} times (${Math.round(percentage)}% of your sessions).`, (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-gaming-primary font-medium mb-2", children: ["Top Games in ", mood, " Mood"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-300", children: "\u2022 Zen Puzzle Master (12 sessions)" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-300", children: "\u2022 Creative Builder (8 sessions)" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-300", children: "\u2022 Story Explorer (6 sessions)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Time-of-Day Correlation" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["You feel ", mood, " most often during evening hours"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Session Length" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["Average ", mood, " sessions last 45 minutes"] })] })] }));
    };
    // Genre click handler
    const handleGenreClick = (genre, affinity) => {
        openInsightPopover(`${genre} Genre Analysis`, `You have a ${Math.round(affinity * 100)}% affinity for ${genre} games.`, (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-gaming-primary font-medium mb-2", children: ["When You Play ", genre] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["You prefer ", genre, " games most during evening hours"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Typical Mood" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["You're usually in a ", analyticsData?.gamingPatterns.mostPlayedMood || 'creative', " mood when playing ", genre] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Session Duration" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["Average ", genre, " sessions last ", analyticsData?.gamingPatterns.averageSessionLength || 60, " minutes"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-gaming-primary font-medium mb-2", children: ["Top ", genre, " Games"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-300", children: "\u2022 Game Title 1 (most played)" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-300", children: "\u2022 Game Title 2 (second)" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-300", children: "\u2022 Game Title 3 (third)" })] })] })] }));
    };
    // Personal insights click handler
    const handleInsightClick = (type) => {
        switch (type) {
            case 'time':
                openInsightPopover('Best Gaming Time Analysis', `Your optimal gaming time is ${analyticsData?.userInsights.bestGamingTime || 'evening'}.`, (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Why Evening Works Best" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Your mood stability is highest during evening hours, leading to better gaming performance and enjoyment." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Performance Metrics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Evening sessions show 25% higher completion rates and better mood consistency." })] })] }));
                break;
            case 'session':
                openInsightPopover('Optimal Session Length Analysis', `Your ideal session length is ${analyticsData?.userInsights.preferredSessionLength || 60} minutes.`, (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Why This Length Works" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "This duration maximizes engagement while preventing fatigue, maintaining optimal focus and enjoyment." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Session Patterns" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Sessions longer than 90 minutes show decreased performance, while sessions under 30 minutes feel incomplete." })] })] }));
                break;
            case 'moods':
                openInsightPopover('Top Recommendation Moods Analysis', 'These moods consistently lead to your best gaming experiences.', (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Why These Moods Work" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Creative, Chill, and Exploratory moods align with your playstyle, maximizing enjoyment and engagement." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-gaming-primary font-medium mb-2", children: "Recommendation Success" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Games recommended during these moods have a 85% acceptance rate and higher satisfaction scores." })] })] }));
                break;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker p-6 ${isEditMode ? 'ring-2 ring-gaming-primary/50 ring-offset-2 ring-offset-gray-900' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-12 relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 -top-20 -left-20 w-[500px] h-[500px] bg-gaming-primary/10 rounded-full blur-[100px]" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 -top-10 -right-10 w-[400px] h-[400px] bg-gaming-accent/5 rounded-full blur-[80px]" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)("h1", { className: "text-5xl font-gaming font-bold text-white", children: "Mood Analytics" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsx)(EditModeButton_1.EditModeButton, { onClick: () => setIsEditMode(!isEditMode) }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/40 font-medium text-xl tracking-wide uppercase font-gaming", children: "Your gaming rhythm, decoded." }), persona && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-wrap", children: [(0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gaming-primary/20 text-gaming-primary rounded-full text-sm font-medium border border-gaming-primary/30 hover:bg-gaming-primary/30 transition-colors duration-200", children: persona.traits.archetypeId }), persona.mood && ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gaming-accent/20 text-gaming-accent rounded-full text-sm font-medium border border-gaming-accent/30 capitalize hover:bg-gaming-accent/30 transition-colors duration-200", children: persona.mood.moodId })), (0, jsx_runtime_1.jsxs)("span", { className: "px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors duration-200", children: [analyticsData?.userInsights.bestGamingTime || 'Evening', " Player"] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-6 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Time Range:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: ['week', 'month', 'all'].map((range) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedTimeRange(range), className: `px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedTimeRange === range
                                                        ? 'bg-gaming-primary text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`, children: range.charAt(0).toUpperCase() + range.slice(1) }, range))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Mood:" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedMood || '', onChange: (e) => setSelectedMood(e.target.value || null), "aria-label": "Filter by mood", className: "bg-gray-800 text-gray-300 rounded-lg px-3 py-1 text-sm border border-gray-600 focus:border-gaming-primary focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Moods" }), static_data_1.MOODS.map((mood) => ((0, jsx_runtime_1.jsxs)("option", { value: mood.id, children: [mood.emoji, " ", mood.name] }, mood.id)))] })] }), (selectedMood || selectedGenre) && ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                            setSelectedMood(null);
                                            setSelectedGenre(null);
                                        }, className: "px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium border border-red-500/30 hover:bg-red-500/30 transition-colors", children: "Clear Filters" }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [loading && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Loading analytics data..." })] })), !loading && (!analyticsData || games.length === 0) && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-4xl", children: "\uD83D\uDCCA" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "No Gaming Data Yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-6 max-w-md mx-auto", children: "Start by importing your Steam library or adding games manually to see your gaming analytics and insights." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 justify-center", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.href = '/library', className: "bg-gaming-primary hover:bg-gaming-primary/80 text-white font-medium py-2 px-6 rounded-lg transition-colors", children: "Go to Library" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.href = '/library?import=steam', className: "bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg border border-gray-600 transition-colors", children: "Import Steam Games" })] })] })), analyticsData && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105", onClick: () => handleCardClick('totalPlaytime', analyticsData.gamingPatterns), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Total Hours" })] }), (0, jsx_runtime_1.jsx)(AnimatedNumber, { value: analyticsData.gamingPatterns.totalPlaytime, suffix: "h" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105", onClick: () => handleCardClick('favoriteMood', analyticsData.gamingPatterns), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: getMoodEmoji(analyticsData.gamingPatterns.mostPlayedMood) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Favorite Mood" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium capitalize", children: analyticsData.gamingPatterns.mostPlayedMood })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105", onClick: () => handleCardClick('recommendationSuccess', analyticsData.recommendationMetrics), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Success Rate" })] }), (0, jsx_runtime_1.jsx)(AnimatedNumber, { value: analyticsData.recommendationMetrics.successRate, suffix: "%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105", onClick: () => handleCardClick('moodStability', analyticsData.userInsights), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83D\uDCCA" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Mood Stability" })] }), (0, jsx_runtime_1.jsx)(AnimatedNumber, { value: Math.round(analyticsData.userInsights.moodStability * 100), suffix: "%" })] })] }), (0, jsx_runtime_1.jsx)(MoodAnalyticsPage_1.MoodAnalyticsPage, { analyticsData: analyticsData, getMoodEmoji: getMoodEmoji, getMoodColor: getMoodColor, AnimatedNumber: AnimatedNumber, onCardClick: handleCardClick, onMoodClick: handleMoodClick, onGenreClick: handleGenreClick, onInsightClick: handleInsightClick })] }))] }), insightPopover.isOpen && ((0, jsx_runtime_1.jsx)(InsightPopover_1.InsightPopover, { isOpen: insightPopover.isOpen, onClose: closeInsightPopover, title: insightPopover.title, description: insightPopover.description, children: insightPopover.content })), isEditMode && ((0, jsx_runtime_1.jsx)(EditModePanel_1.EditModePanel, { pageId: "analytics", isOpen: isEditMode, onClose: () => setIsEditMode(false) }))] }));
};
exports.Analytics = Analytics;
