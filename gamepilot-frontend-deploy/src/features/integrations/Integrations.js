"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integrations = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const integrations_1 = require("@gamepilot/integrations");
const Integrations = () => {
    const [integrationManager, setIntegrationManager] = (0, react_1.useState)(null);
    const [integrations, setIntegrations] = (0, react_1.useState)([
        {
            id: 'steam',
            name: 'Steam',
            description: 'Connect your Steam account to import your game library, track playtime, and sync achievements',
            icon: '🎮',
            color: 'from-blue-500 to-blue-600',
            isConnected: false,
            isAvailable: false,
            status: 'disabled',
            message: 'Steam integration disabled',
            features: [
                '📚 Import game library',
                '⏱️ Track playtime statistics',
                '🏆 Sync achievements',
                '🎯 Game recommendations',
                '📊 Gaming analytics'
            ]
        },
        {
            id: 'youtube',
            name: 'YouTube',
            description: 'Connect YouTube to discover gaming content, watch trailers, and follow your favorite creators',
            icon: '📺',
            color: 'from-red-500 to-red-600',
            isConnected: false,
            isAvailable: false,
            status: 'disabled',
            message: 'YouTube integration disabled',
            features: [
                '🎬 Gaming content discovery',
                '📺 Watch trailers & gameplay',
                '👥 Follow creators',
                '🔍 Search gaming videos',
                '📈 Trending content'
            ]
        },
        {
            id: 'discord',
            name: 'Discord',
            description: 'Link Discord to join gaming communities, chat with friends, and share your gaming status',
            icon: '💬',
            color: 'from-indigo-500 to-purple-600',
            isConnected: false,
            isAvailable: false,
            status: 'disabled',
            message: 'Discord integration disabled',
            features: [
                '👥 Join gaming communities',
                '💬 Chat with friends',
                '🎮 Rich presence',
                '📊 Server analytics',
                '🔗 Share gaming status'
            ]
        },
        {
            id: 'twitch',
            name: 'Twitch',
            description: 'Connect Twitch to watch live streams, follow streamers, and discover gaming content',
            icon: '🎬',
            color: 'from-purple-500 to-purple-600',
            isConnected: false,
            isAvailable: false,
            status: 'disabled',
            message: 'Twitch integration coming soon',
            features: [
                '🎥 Watch live streams',
                '👥 Follow streamers',
                '🎮 Gaming content',
                '💬 Chat integration',
                '📈 Stream analytics'
            ]
        },
        {
            id: 'reddit',
            name: 'Reddit',
            description: 'Connect Reddit to join gaming subreddits, discuss games, and share content',
            icon: '🤖',
            color: 'from-orange-500 to-red-600',
            isConnected: false,
            isAvailable: false,
            status: 'disabled',
            message: 'Reddit integration coming soon',
            features: [
                '🎮 Gaming subreddits',
                '💬 Game discussions',
                '📊 Trending topics',
                '🎯 Content sharing',
                '👥 Community engagement'
            ]
        },
        {
            id: 'spotify',
            name: 'Spotify',
            description: 'Sync Spotify to share gaming playlists and discover music that matches your gaming mood',
            icon: '🎵',
            color: 'from-green-500 to-green-600',
            isConnected: false,
            isAvailable: false,
            status: 'disabled',
            message: 'Spotify integration coming soon',
            features: [
                '🎵 Gaming playlists',
                '🎶 Mood-based music',
                '📊 Listening stats',
                '🔗 Share playlists',
                '🎭 Game soundtracks'
            ]
        },
        {
            id: 'twitter',
            name: 'Twitter/X',
            description: 'Connect Twitter/X to follow gaming news, share achievements, and join gaming conversations',
            icon: '🐦',
            color: 'from-blue-400 to-blue-500',
            isConnected: false,
            isAvailable: false,
            status: 'disabled',
            message: 'Twitter/X integration coming soon',
            features: [
                '📰 Gaming news',
                '🏆 Share achievements',
                '💬 Gaming discussions',
                '👥 Follow creators',
                '📊 Trending topics'
            ]
        }
    ]);
    (0, react_1.useEffect)(() => {
        // Load integration configuration from localStorage
        const savedConfig = localStorage.getItem('gamepilot-integration-config');
        let config = {
            youtube: { enabled: false },
            discord: { enabled: false },
            steam: { enabled: false }
        };
        if (savedConfig) {
            try {
                config = JSON.parse(savedConfig);
            }
            catch (error) {
                console.error('Error loading integration config:', error);
            }
        }
        // Initialize integration manager
        const manager = new integrations_1.IntegrationManager(config);
        setIntegrationManager(manager);
        // Update integration statuses
        updateIntegrationStatuses(manager);
    }, []);
    const updateIntegrationStatuses = (manager) => {
        const status = manager.getIntegrationStatus();
        const available = manager.getAvailableIntegrations();
        setIntegrations(prev => prev.map(integration => {
            const integrationStatus = status[integration.id];
            const integrationAvailable = available[integration.id];
            // Handle undefined integrationAvailable
            if (!integrationAvailable) {
                return {
                    ...integration,
                    isConnected: false,
                    isAvailable: false,
                    status: 'disabled',
                    message: `${integration.name} integration not available`
                };
            }
            // Handle undefined integrationStatus
            if (!integrationStatus) {
                return {
                    ...integration,
                    isConnected: false,
                    isAvailable: false,
                    status: 'disabled',
                    message: `${integration.name} status unknown`
                };
            }
            // Handle the isAvailable property - it can be boolean or an object
            const isAvailable = typeof integrationAvailable.available === 'boolean'
                ? integrationAvailable.available
                : integrationAvailable.available?.botAvailable || false;
            return {
                ...integration,
                isConnected: integrationStatus.status === 'connected',
                isAvailable,
                status: integrationStatus.status,
                message: integrationStatus.message
            };
        }));
    };
    const handleConnect = async (integrationId) => {
        const integration = integrations.find(i => i.id === integrationId);
        if (!integration)
            return;
        // Check if it's a "coming soon" integration
        if (['twitch', 'reddit', 'twitter', 'spotify'].includes(integrationId)) {
            alert(`${integration.name} integration is coming soon! 🚀\n\nWe're working on bringing ${integration.name} to GamePilot. Stay tuned for updates!`);
            return;
        }
        try {
            // Show loading state
            const updatedIntegrations = integrations.map(integration => integration.id === integrationId
                ? {
                    ...integration,
                    status: 'partial',
                    message: `Connecting to ${integration.name}...`
                }
                : integration);
            setIntegrations(updatedIntegrations);
            // Initialize real integration with API key
            let config;
            if (integrationId === 'youtube') {
                config = {
                    youtube: { enabled: true, apiKey: import.meta.env.VITE_YOUTUBE_API_KEY },
                    discord: { enabled: false },
                    steam: { enabled: false }
                };
            }
            else if (integrationId === 'discord') {
                config = {
                    youtube: { enabled: false },
                    discord: { enabled: true, botToken: import.meta.env.VITE_DISCORD_BOT_TOKEN, userToken: import.meta.env.VITE_DISCORD_USER_TOKEN },
                    steam: { enabled: false }
                };
            }
            else if (integrationId === 'steam') {
                config = {
                    youtube: { enabled: false },
                    discord: { enabled: false },
                    steam: { enabled: true, apiKey: import.meta.env.VITE_STEAM_API_KEY }
                };
            }
            else {
                return;
            }
            // Test the integration
            const newManager = new integrations_1.IntegrationManager(config);
            const status = newManager.getIntegrationStatus();
            const available = newManager.getAvailableIntegrations();
            const integrationStatus = status[integrationId];
            const integrationAvailable = available[integrationId];
            if (integrationAvailable?.available && integrationStatus?.status !== 'error') {
                // Success!
                const finalIntegrations = integrations.map(integration => integration.id === integrationId
                    ? {
                        ...integration,
                        isConnected: true,
                        status: 'connected',
                        lastConnected: new Date().toISOString(),
                        message: `${integration.name} connected successfully!`
                    }
                    : integration);
                setIntegrations(finalIntegrations);
                setIntegrationManager(newManager);
                // Save to localStorage
                localStorage.setItem('gamepilot-integration-config', JSON.stringify(config));
                // Show success message and offer to open the platform
                const openPlatform = confirm(`✅ ${integration.name} integration activated!\n\nWould you like to open ${integration.name} to start exploring?`);
                if (openPlatform) {
                    handleLaunch(integrationId);
                }
            }
            else {
                throw new Error(integrationStatus?.message || 'Integration test failed');
            }
        }
        catch (error) {
            // Handle error
            const errorIntegrations = integrations.map(integration => integration.id === integrationId
                ? {
                    ...integration,
                    status: 'error',
                    message: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
                : integration);
            setIntegrations(errorIntegrations);
            alert(`❌ Failed to connect ${integration.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    const handleDisconnect = (integrationId) => {
        const updatedIntegrations = integrations.map(integration => integration.id === integrationId
            ? {
                ...integration,
                isConnected: false,
                status: 'disabled',
                settings: {}
            }
            : integration);
        setIntegrations(updatedIntegrations);
        // Update configuration
        const config = {
            youtube: { enabled: false },
            discord: { enabled: false },
            steam: { enabled: false }
        };
        localStorage.setItem('gamepilot-integration-config', JSON.stringify(config));
        // Reinitialize manager
        if (integrationManager) {
            const newManager = new integrations_1.IntegrationManager(config);
            setIntegrationManager(newManager);
            updateIntegrationStatuses(newManager);
        }
    };
    const handleSettings = (integrationId) => {
        const integration = integrations.find(i => i.id === integrationId);
        if (!integration)
            return;
        if (integrationId === 'youtube') {
            // Open YouTube integration settings modal or navigate
            alert(`🎬 ${integration.name} Settings\n\nFeatures available:\n• Gaming video search\n• Channel discovery\n• Trending content\n• Creator following\n\nAPI Status: ${integration.isAvailable ? '✅ Connected' : '❌ Not configured'}\n\nFull settings panel coming soon!`);
        }
        else if (integrationId === 'discord') {
            alert(`💬 ${integration.name} Settings\n\nFeatures available:\n• Server discovery\n• Community chat\n• Rich presence\n• Activity sharing\n\nStatus: ${integration.isAvailable ? '✅ Connected' : '❌ Not configured'}\n\nFull settings panel coming soon!`);
        }
        else if (integrationId === 'steam') {
            alert(`🎮 ${integration.name} Settings\n\nFeatures available:\n• Game library sync\n• Playtime tracking\n• Achievement sync\n• Profile integration\n\nStatus: ${integration.isAvailable ? '✅ Connected' : '❌ Not configured'}\n\nFull settings panel coming soon!`);
        }
        else {
            alert(`${integration.name} settings coming soon!`);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return 'bg-green-500';
            case 'partial': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            case 'disabled': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'connected': return 'Connected';
            case 'partial': return 'Partial';
            case 'error': return 'Error';
            case 'disabled': return 'Disabled';
            default: return 'Unknown';
        }
    };
    const handleLaunch = (integrationId) => {
        const integration = integrations.find(i => i.id === integrationId);
        if (!integration)
            return;
        // Launch URLs for each platform
        const launchUrls = {
            youtube: 'https://youtube.com',
            discord: 'https://discord.com/app',
            steam: 'https://store.steampowered.com',
            spotify: 'https://spotify.com',
            twitch: 'https://twitch.tv',
            reddit: 'https://reddit.com/r/gaming',
            twitter: 'https://twitter.com'
        };
        const url = launchUrls[integrationId];
        if (url) {
            window.open(url, '_blank');
            // Show a brief notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = `🚀 Launching ${integration.name}...`;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-0 w-96 h-96 bg-gaming-primary/10 rounded-full blur-3xl" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 right-0 w-96 h-96 bg-gaming-secondary/10 rounded-full blur-3xl" }), (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8 relative z-10", children: [(0, jsx_runtime_1.jsxs)("header", { className: "mb-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-5xl font-bold font-gaming bg-gradient-to-r from-gaming-primary via-gaming-accent to-gaming-secondary bg-clip-text text-transparent mb-4 animate-gradient", children: "Platform Integrations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed", children: "Connect your favorite platforms to enhance your gaming experience with real-time data, social features, and personalized content" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-full px-6 py-3 flex items-center gap-3 border border-white/10", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300 font-medium", children: "Integration Manager Active" }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-white/20" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-400", children: [integrations.filter(i => i.isConnected).length, " Connected"] })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16", children: integrations.map((integration, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "group relative", style: { animationDelay: `${index * 100}ms` }, children: [(0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 bg-gradient-to-r ${integration.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500` }), (0, jsx_runtime_1.jsxs)("div", { className: "relative glass-morphism rounded-2xl p-6 cinematic-shadow hover:transform hover:scale-[1.02] transition-all duration-500 border border-white/10 hover:border-white/20", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: `relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${integration.color} ${integration.isConnected ? 'ring-4 ring-white/30 shadow-lg' : 'shadow-md'} transform transition-all duration-300 group-hover:scale-110`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl filter drop-shadow-sm", children: integration.icon }), integration.isConnected && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-2 h-2 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-white mb-1", children: integration.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${integration.status === 'connected' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                            integration.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                                                integration.status === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                                                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `w-1.5 h-1.5 rounded-full ${getStatusColor(integration.status)}` }), getStatusText(integration.status)] }), integration.isAvailable && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-1 h-1 bg-blue-400 rounded-full" }), "Available"] }))] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300 line-clamp-2", children: integration.description }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-1", children: integration.features.slice(0, 4).map((feature, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-400 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent text-xs", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: feature.replace(/[🎮📺💬🎬🤖🎵🐦]/g, '').trim() })] }, index))) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 truncate", children: integration.message }), integration.lastConnected && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-1", children: ["Connected ", formatDate(integration.lastConnected)] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: !integration.isConnected ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleConnect(integration.id), disabled: integration.id === 'spotify' || integration.status === 'partial', className: `flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${integration.id === 'spotify'
                                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                            : integration.status === 'partial'
                                                                ? 'bg-yellow-600 text-white cursor-wait'
                                                                : `bg-gradient-to-r ${integration.color} text-white hover:opacity-90 hover:shadow-lg transform hover:scale-105`}`, children: integration.id === 'spotify' ? ('Coming Soon') : integration.status === 'partial' ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Connecting..." })] })) : ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), "Connect"] })) }), integration.id !== 'spotify' && !['twitch', 'reddit', 'twitter'].includes(integration.id) && ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleLaunch(integration.id), className: "px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-700 text-white hover:bg-gray-600 transform hover:scale-105 text-sm", children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Launch" })] }) }))] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleLaunch(integration.id), className: "flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-700 text-white hover:bg-gray-600 transform hover:scale-105 text-sm", children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Launch" })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleSettings(integration.id), className: `flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r ${integration.color} text-white hover:opacity-90 hover:shadow-lg transform hover:scale-105 text-sm`, children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Settings" })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDisconnect(integration.id), className: "px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 text-sm", children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center gap-1", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Disconnect" })] }) })] })) })] })] }, integration.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-gaming-primary to-gaming-secondary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300", children: (0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Enhanced Gaming Experience" })] }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "Real-time Synchronization" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Your game library stays updated across all platforms automatically" })] })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "Achievement Tracking" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Automatic playtime and achievement tracking from connected services" })] })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "Smart Recommendations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Personalized content based on your gaming preferences" })] })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "Social Integration" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Connect with friends and share your gaming experiences" })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300", children: (0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD12" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Privacy & Security" })] }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-400 mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "Local Data Processing" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Your data stays on your device with optional cloud backup" })] })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-400 mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "Granular Permissions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Control exactly what each integration can access" })] })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-400 mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "Easy Disconnect" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Remove integrations instantly with one click" })] })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-400 mt-1", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-1", children: "No Data Sharing" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "We never share your data without explicit consent" })] })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-2xl p-8 border border-white/10 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl mx-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl mx-auto mb-6", children: (0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCAC" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-4", children: "Need Help?" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-lg mb-8 leading-relaxed", children: "Get help setting up integrations or troubleshoot connection issues with our comprehensive support resources" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 justify-center flex-wrap", children: [(0, jsx_runtime_1.jsxs)("button", { className: "px-6 py-3 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium transform hover:scale-105 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }), "Documentation"] }), (0, jsx_runtime_1.jsxs)("button", { className: "px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium transform hover:scale-105 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), "Support Chat"] }), (0, jsx_runtime_1.jsxs)("button", { className: "px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium transform hover:scale-105 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "FAQ"] })] })] }) })] })] }));
};
exports.Integrations = Integrations;
