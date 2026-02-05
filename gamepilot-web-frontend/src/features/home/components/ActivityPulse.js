"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityPulse = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// Temporary local imports until workspace is configured
const integrations_1 = require("@gamepilot/integrations");
const ActivityPulse = ({ activities, maxItems = 5, refreshInterval = 30000, onRefresh, className, variant = 'detailed' }) => {
    const [isRefreshing, setIsRefreshing] = (0, react_1.useState)(false);
    const [allActivities, setAllActivities] = (0, react_1.useState)([]);
    const [integrationActivities, setIntegrationActivities] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        setAllActivities([...integrationActivities, ...activities].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, maxItems));
    }, [activities, maxItems, integrationActivities]);
    (0, react_1.useEffect)(() => {
        loadIntegrationActivities();
    }, []);
    (0, react_1.useEffect)(() => {
        if (refreshInterval > 0) {
            const interval = setInterval(() => {
                handleRefresh();
            }, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);
    const loadIntegrationActivities = async () => {
        try {
            // Initialize integrations with environment variables
            const integrationManager = new integrations_1.IntegrationManager({
                youtube: {
                    apiKey: process.env.VITE_YOUTUBE_API_KEY,
                    enabled: !!process.env.VITE_YOUTUBE_API_KEY
                },
                discord: {
                    botToken: process.env.VITE_DISCORD_BOT_TOKEN,
                    userToken: process.env.VITE_DISCORD_USER_TOKEN,
                    enabled: !!process.env.VITE_DISCORD_BOT_TOKEN || !!process.env.VITE_DISCORD_USER_TOKEN
                }
            });
            const newActivities = [];
            // Load YouTube activities
            const youtube = integrationManager.getYouTube();
            if (youtube.isApiAvailable()) {
                try {
                    const trendingVideos = await youtube.getTrendingGamingVideos();
                    trendingVideos.videos.slice(0, 2).forEach((video) => {
                        newActivities.push({
                            id: `youtube-${video.id}`,
                            type: 'youtube',
                            title: video.title,
                            description: `Trending gaming video with ${video.viewCount.toLocaleString()} views`,
                            timestamp: video.publishedAt,
                            icon: '📺',
                            intensity: video.viewCount > 1000000 ? 'high' : video.viewCount > 100000 ? 'medium' : 'low',
                            metadata: {
                                videoId: video.id,
                                channelId: video.channelId,
                                viewCount: video.viewCount,
                                likeCount: video.likeCount
                            }
                        });
                    });
                }
                catch (error) {
                    console.error('Failed to load YouTube activities:', error);
                }
            }
            // Load Discord activities
            const discord = integrationManager.getDiscord();
            const discordStatus = discord.isIntegrationAvailable();
            if (discordStatus.publicAvailable) {
                try {
                    // Get mock guild data (would use real data with proper tokens)
                    const mockGuilds = discord.getMockGuilds();
                    mockGuilds.slice(0, 1).forEach((guild) => {
                        newActivities.push({
                            id: `discord-${guild.id}`,
                            type: 'discord',
                            title: `${guild.name} - ${guild.memberCount?.toLocaleString() || 0} members online`,
                            description: guild.description,
                            timestamp: new Date(),
                            icon: '💬',
                            intensity: guild.presenceCount && guild.presenceCount > 500 ? 'high' :
                                guild.presenceCount && guild.presenceCount > 100 ? 'medium' : 'low',
                            metadata: {
                                guildId: guild.id
                            }
                        });
                    });
                }
                catch (error) {
                    console.error('Failed to load Discord activities:', error);
                }
            }
            setIntegrationActivities(newActivities);
        }
        catch (error) {
            console.error('Failed to load integration activities:', error);
        }
    };
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await onRefresh?.();
            await loadIntegrationActivities();
        }
        finally {
            setTimeout(() => setIsRefreshing(false), 1000);
        }
    };
    const sortedActivities = [...integrationActivities, ...activities]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, maxItems);
    const getActivityIcon = (type) => {
        const iconMap = {
            game: '🎮',
            friend: '👥',
            achievement: '🏆',
            community: '🌐',
            youtube: '📺',
            discord: '💬'
        };
        return iconMap[type];
    };
    const getActivityColor = (type, intensity) => {
        const baseColors = {
            game: 'from-blue-500 to-purple-600',
            friend: 'from-green-500 to-teal-600',
            achievement: 'from-yellow-500 to-orange-600',
            community: 'from-purple-500 to-pink-600',
            youtube: 'from-red-500 to-pink-600',
            discord: 'from-indigo-500 to-purple-600'
        };
        const intensityModifiers = {
            low: 'opacity-60',
            medium: 'opacity-80',
            high: 'opacity-100'
        };
        return `bg-gradient-to-r ${baseColors[type]} ${intensity ? intensityModifiers[intensity] : ''}`;
    };
    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        if (days < 7)
            return `${days}d ago`;
        return date.toLocaleDateString();
    };
    const getVariantClasses = () => {
        const variantClasses = {
            compact: 'p-3 space-y-2',
            detailed: 'p-4 space-y-3',
            minimal: 'p-2 space-y-1'
        };
        return variantClasses[variant];
    };
    const getItemClasses = (_activity) => {
        const baseClasses = 'relative rounded-lg border transition-all duration-300 cursor-pointer hover:scale-102';
        const variantClasses = {
            compact: 'p-2 border-gray-700 hover:border-gray-600',
            detailed: 'p-3 border-gray-700 hover:border-gaming-accent/50',
            minimal: 'p-1 border-gray-800 hover:border-gray-700'
        };
        return `${baseClasses} ${variantClasses[variant]}`;
    };
    if (variant === 'minimal') {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl ${getVariantClasses()} ${className || ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-gaming-accent rounded-full animate-pulse" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Activity" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleRefresh, disabled: isRefreshing, className: "text-gray-400 hover:text-white transition-colors disabled:opacity-50", children: isRefreshing ? '⟳' : '↻' })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: sortedActivities.slice(0, 8).map((activity) => ((0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full ${getActivityColor(activity.type, activity.intensity)}`, title: activity.title }, activity.id))) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl ${getVariantClasses()} ${className || ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-gaming-accent rounded-full animate-pulse" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium", children: "Activity Pulse" }), integrationActivities.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-red-500 rounded-full", title: "YouTube" }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-indigo-500 rounded-full", title: "Discord" })] }))] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleRefresh, disabled: isRefreshing, className: `text-gray-400 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isRefreshing && 'animate-spin'}`, children: "\u21BB" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: sortedActivities.map((activity) => ((0, jsx_runtime_1.jsx)("div", { className: getItemClasses(activity), onClick: () => {
                        // Handle activity click based on type
                        if (activity.type === 'youtube' && activity.metadata?.videoId) {
                            window.open(`https://youtube.com/watch?v=${activity.metadata.videoId}`, '_blank');
                        }
                        else if (activity.type === 'discord' && activity.metadata?.guildId) {
                            // Would open Discord invite or guild info
                            console.log('Open Discord guild:', activity.metadata.guildId);
                        }
                    }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getActivityColor(activity.type, activity.intensity)}`, children: activity.icon || getActivityIcon(activity.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium text-sm truncate", children: activity.title }), variant === 'detailed' && activity.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-xs mt-1 line-clamp-2", children: activity.description })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-1", children: [activity.user && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: activity.user })), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: formatTimestamp(activity.timestamp) }), activity.type === 'youtube' && activity.metadata?.viewCount && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-blue-400", children: [activity.metadata.viewCount.toLocaleString(), " views"] }))] })] }), activity.intensity && variant === 'detailed' && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-1", children: Array.from({ length: activity.intensity === 'low' ? 1 : activity.intensity === 'medium' ? 2 : 3 }).map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: "w-1 h-1 bg-gaming-accent rounded-full" }, i))) }))] }) }, activity.id))) }), sortedActivities.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-4xl mb-2", children: "\uD83D\uDCED" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "No recent activity" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-xs mt-2", children: "Connect YouTube or Discord to see community activity" })] })), allActivities.length > maxItems && ((0, jsx_runtime_1.jsx)("div", { className: "text-center mt-4", children: (0, jsx_runtime_1.jsxs)("button", { className: "text-gaming-accent hover:text-gaming-accent/80 text-sm transition-colors", children: ["View ", sortedActivities.length - maxItems, " more activities"] }) }))] }));
};
exports.ActivityPulse = ActivityPulse;
