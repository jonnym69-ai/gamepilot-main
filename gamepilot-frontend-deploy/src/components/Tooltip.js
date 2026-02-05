"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipProvider = exports.IntegrationTooltip = exports.SettingsTooltip = exports.ProfileTooltip = exports.GameTooltip = exports.MoodTooltip = exports.NavigationTooltip = exports.useTooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// Tooltip System for GamePilot - Contextual Help Tooltips
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
// Predefined tooltip content for common UI elements
const tooltipContent = {
    // Navigation tooltips
    'nav-home': {
        id: 'nav-home',
        title: 'Home Dashboard',
        content: 'Your personalized gaming dashboard with mood-based recommendations and recent activity.',
        category: 'basic'
    },
    'nav-library': {
        id: 'nav-library',
        title: 'Game Library',
        content: 'View and manage your entire game collection. Import from Steam or add games manually.',
        category: 'basic'
    },
    'nav-identity': {
        id: 'nav-identity',
        title: 'Gaming Identity',
        content: 'Discover your gaming personality through mood analysis and playstyle insights.',
        category: 'feature'
    },
    'nav-settings': {
        id: 'nav-settings',
        title: 'Settings',
        content: 'Manage your profile, privacy settings, and connected accounts.',
        category: 'basic'
    },
    'nav-integrations': {
        id: 'nav-integrations',
        title: 'Integrations',
        content: 'Connect Steam, Discord, and YouTube to enhance your gaming experience.',
        category: 'feature'
    },
    // Mood engine tooltips
    'mood-selector': {
        id: 'mood-selector',
        title: 'Mood Selector',
        content: 'Choose how you\'re feeling to get personalized game recommendations that match your current mood.',
        category: 'feature',
        relatedFeature: 'recommendations'
    },
    'mood-competitive': {
        id: 'mood-competitive',
        title: 'Competitive Mood',
        content: 'Perfect for when you want to challenge yourself. Includes competitive multiplayer, strategy games, and FPS titles.',
        category: 'basic'
    },
    'mood-chill': {
        id: 'mood-chill',
        title: 'Chill Mood',
        content: 'Great for relaxing and unwinding. Includes casual games, simulation titles, and creative experiences.',
        category: 'basic'
    },
    'mood-story': {
        id: 'mood-story',
        title: 'Story Mood',
        content: 'Ideal for immersive narratives. Features RPGs, adventure games, and story-driven experiences.',
        category: 'basic'
    },
    'mood-creative': {
        id: 'mood-creative',
        title: 'Creative Mood',
        content: 'For expressing your creativity. Includes building games, sandbox experiences, and art-focused titles.',
        category: 'basic'
    },
    'mood-social': {
        id: 'mood-social',
        title: 'Social Mood',
        content: 'Perfect for playing with others. Features co-op games, party games, and multiplayer experiences.',
        category: 'basic'
    },
    'mood-focused': {
        id: 'mood-focused',
        title: 'Focused Mood',
        content: 'For deep concentration and problem-solving. Includes puzzle games, strategy titles, and focused single-player experiences.',
        category: 'basic'
    },
    'mood-energetic': {
        id: 'mood-energetic',
        title: 'Energetic Mood',
        content: 'High-energy gaming experiences. Features action games, rhythm games, and sports titles.',
        category: 'basic'
    },
    'mood-exploratory': {
        id: 'mood-exploratory',
        title: 'Exploratory Mood',
        content: 'For discovery and adventure. Includes open-world games, exploration titles, and mystery experiences.',
        category: 'basic'
    },
    // Game library tooltips
    'game-search': {
        id: 'game-search',
        title: 'Search Games',
        content: 'Search your game library by title, genre, platform, or tags. Use advanced filters for precise results.',
        category: 'basic'
    },
    'game-filter': {
        id: 'game-filter',
        title: 'Filter Games',
        content: 'Filter your library by platform, genre, play status, or custom tags to find exactly what you\'re looking for.',
        category: 'basic'
    },
    'game-sort': {
        id: 'game-sort',
        title: 'Sort Games',
        content: 'Sort your library by recently played, playtime, alphabetically, or custom criteria.',
        category: 'basic'
    },
    'add-game': {
        id: 'add-game',
        title: 'Add Game',
        content: 'Add a new game to your library. Import from Steam, enter manually, or scan barcode.',
        category: 'basic'
    },
    'game-status': {
        id: 'game-status',
        title: 'Game Status',
        content: 'Track your progress: Unplayed, Playing, Completed, Paused, or Dropped. Update as you play.',
        category: 'basic'
    },
    'game-playtime': {
        id: 'game-playtime',
        title: 'Playtime Tracking',
        content: 'Automatically tracks how long you\'ve played each game. View total hours and recent activity.',
        category: 'feature'
    },
    'game-achievements': {
        id: 'game-achievements',
        title: 'Achievements',
        content: 'View your unlocked achievements and track progress toward completion. Includes rare and difficult achievements.',
        category: 'feature'
    },
    // Profile tooltips
    'profile-avatar': {
        id: 'profile-avatar',
        title: 'Profile Avatar',
        content: 'Your gaming identity. Upload a custom image or choose from our selection of gaming avatars.',
        category: 'basic'
    },
    'profile-name': {
        id: 'profile-name',
        title: 'Display Name',
        content: 'How other players see you in GamePilot. Can be changed anytime in settings.',
        category: 'basic'
    },
    'profile-bio': {
        id: 'profile-bio',
        title: 'Bio',
        content: 'Share your gaming interests, favorite genres, and what you\'re looking for in gaming communities.',
        category: 'basic'
    },
    'profile-stats': {
        id: 'profile-stats',
        title: 'Gaming Statistics',
        content: 'Your gaming overview including total playtime, games completed, achievements unlocked, and favorite genres.',
        category: 'feature'
    },
    // Settings tooltips
    'privacy-profile': {
        id: 'privacy-profile',
        title: 'Profile Privacy',
        content: 'Control who can see your profile: Public (everyone), Friends (connections only), or Private (only you).',
        category: 'advanced'
    },
    'privacy-data': {
        id: 'privacy-data',
        title: 'Data Sharing',
        content: 'Choose what gaming data to share: playtime statistics, achievements, game library, and activity status.',
        category: 'advanced'
    },
    'notifications': {
        id: 'notifications',
        title: 'Notifications',
        content: 'Manage alerts for friend requests, game recommendations, achievement unlocks, and community updates.',
        category: 'basic'
    },
    'theme': {
        id: 'theme',
        title: 'Theme Settings',
        content: 'Customize your GamePilot experience with different themes, colors, and visual preferences.',
        category: 'basic'
    },
    // Integration tooltips
    'steam-connect': {
        id: 'steam-connect',
        title: 'Connect Steam',
        content: 'Import your Steam library, track playtime, and sync achievements. Your Steam data stays private and secure.',
        category: 'feature'
    },
    'discord-connect': {
        id: 'discord-connect',
        title: 'Connect Discord',
        content: 'Show your Discord status, join gaming communities, and enable rich presence for GamePilot.',
        category: 'feature'
    },
    'youtube-connect': {
        id: 'youtube-connect',
        title: 'Connect YouTube',
        content: 'Get gaming content recommendations, follow creators, and discover new games through YouTube.',
        category: 'feature'
    },
    // Recommendation tooltips
    'recommendation-card': {
        id: 'recommendation-card',
        title: 'Game Recommendation',
        content: 'Personalized game suggestion based on your current mood, gaming history, and preferences.',
        category: 'feature'
    },
    'recommendation-reason': {
        id: 'recommendation-reason',
        title: 'Why This Game?',
        content: 'See why this game was recommended for you based on mood compatibility, genre preferences, and similar games you\'ve enjoyed.',
        category: 'feature'
    },
    'recommendation-save': {
        id: 'recommendation-save',
        title: 'Save for Later',
        content: 'Add this game to your wishlist or backlog to play later. Access from your library.',
        category: 'basic'
    },
    // Social features tooltips
    'friend-request': {
        id: 'friend-request',
        title: 'Friend Request',
        content: 'Send a friend request to connect with other gamers. Share libraries, compare stats, and play together.',
        category: 'basic'
    },
    'share-game': {
        id: 'share-game',
        title: 'Share Game',
        content: 'Share your gaming achievements, recommendations, and library with friends on social media.',
        category: 'basic'
    },
    'activity-feed': {
        id: 'activity-feed',
        title: 'Activity Feed',
        content: 'See what your friends are playing, their achievements, and gaming recommendations.',
        category: 'feature'
    }
};
// Tooltip Component
const Tooltip = ({ content, children, position = 'top', delay = 300, persistent = false, maxWidth = 300, className = '', showOnHover = true, showOnClick = false, hideDelay = 100 }) => {
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [tooltipPosition, setTooltipPosition] = (0, react_1.useState)({ top: 0, left: 0 });
    const triggerRef = (0, react_1.useRef)(null);
    const tooltipRef = (0, react_1.useRef)(null);
    const timeoutRef = (0, react_1.useRef)();
    const hideTimeoutRef = (0, react_1.useRef)();
    const calculatePosition = (0, react_1.useCallback)(() => {
        if (!triggerRef.current || !tooltipRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        let top = 0;
        let left = 0;
        switch (position) {
            case 'top':
                top = triggerRect.top + scrollY - tooltipRect.height - 8;
                left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + scrollY + 8;
                left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.left + scrollX - tooltipRect.width - 8;
                break;
            case 'right':
                top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.right + scrollX + 8;
                break;
            case 'auto':
                // Auto position based on available space
                const spaceTop = triggerRect.top;
                const spaceBottom = window.innerHeight - triggerRect.bottom;
                const spaceRight = window.innerWidth - triggerRect.right;
                if (spaceBottom >= tooltipRect.height + 8) {
                    top = triggerRect.bottom + scrollY + 8;
                    left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
                }
                else if (spaceTop >= tooltipRect.height + 8) {
                    top = triggerRect.top + scrollY - tooltipRect.height - 8;
                    left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
                }
                else if (spaceRight >= tooltipRect.width + 8) {
                    top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.right + scrollX + 8;
                }
                else {
                    top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.left + scrollX - tooltipRect.width - 8;
                }
                break;
        }
        // Adjust if tooltip goes out of viewport
        if (left < scrollX + 8) {
            left = scrollX + 8;
        }
        else if (left + tooltipRect.width > scrollX + window.innerWidth - 8) {
            left = scrollX + window.innerWidth - tooltipRect.width - 8;
        }
        if (top < scrollY + 8) {
            top = scrollY + 8;
        }
        else if (top + tooltipRect.height > scrollY + window.innerHeight - 8) {
            top = scrollY + window.innerHeight - tooltipRect.height - 8;
        }
        setTooltipPosition({ top, left });
    }, [position]);
    const showTooltip = (0, react_1.useCallback)(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    }, [delay]);
    const hideTooltip = (0, react_1.useCallback)(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (persistent) {
            hideTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, hideDelay);
        }
        else {
            setIsVisible(false);
        }
    }, [persistent, hideDelay]);
    const handleClick = (0, react_1.useCallback)(() => {
        if (showOnClick) {
            setIsVisible(!isVisible);
        }
    }, [showOnClick, isVisible]);
    (0, react_1.useEffect)(() => {
        if (isVisible) {
            calculatePosition();
        }
    }, [isVisible, calculatePosition]);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            if (isVisible) {
                calculatePosition();
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', () => {
            if (isVisible) {
                calculatePosition();
            }
        });
        return () => {
            window.removeEventListener('resize', handleResize);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, [isVisible, calculatePosition]);
    const tooltipElement = isVisible ? (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("div", { ref: tooltipRef, className: `fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700 max-w-${maxWidth} ${className}`, style: {
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            maxWidth: `${maxWidth}px`
        }, onMouseEnter: () => persistent && hideTooltip(), onMouseLeave: () => persistent && hideTooltip(), children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: typeof content === 'string' ? ((0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: content } })) : (content) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute w-2 h-2 bg-gray-900 border border-gray-700 transform rotate-45" })] }), document.body) : null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { ref: triggerRef, className: `inline-block ${className}`, onMouseEnter: showOnHover ? showTooltip : undefined, onMouseLeave: showOnHover ? hideTooltip : undefined, onClick: handleClick, children: children }), tooltipElement] }));
};
// Hook for predefined tooltips
const useTooltip = (tooltipId) => {
    const content = tooltipContent[tooltipId];
    if (!content) {
        console.warn(`Tooltip with id "${tooltipId}" not found`);
        return { title: '', content: '', category: 'basic' };
    }
    return content;
};
exports.useTooltip = useTooltip;
// Predefined tooltip components for common use cases
const NavigationTooltip = ({ feature, children }) => {
    const tooltip = (0, exports.useTooltip)(`nav-${feature}`);
    return ((0, jsx_runtime_1.jsx)(Tooltip, { content: tooltip.content, position: "bottom", delay: 500, children: children }));
};
exports.NavigationTooltip = NavigationTooltip;
const MoodTooltip = ({ mood, children }) => {
    const tooltip = (0, exports.useTooltip)(`mood-${mood}`);
    return ((0, jsx_runtime_1.jsx)(Tooltip, { content: tooltip.content, position: "top", delay: 300, children: children }));
};
exports.MoodTooltip = MoodTooltip;
const GameTooltip = ({ action, children }) => {
    const tooltip = (0, exports.useTooltip)(`game-${action}`);
    return ((0, jsx_runtime_1.jsx)(Tooltip, { content: tooltip.content, position: "top", delay: 300, children: children }));
};
exports.GameTooltip = GameTooltip;
const ProfileTooltip = ({ field, children }) => {
    const tooltip = (0, exports.useTooltip)(`profile-${field}`);
    return ((0, jsx_runtime_1.jsx)(Tooltip, { content: tooltip.content, position: "top", delay: 300, children: children }));
};
exports.ProfileTooltip = ProfileTooltip;
const SettingsTooltip = ({ setting, children }) => {
    const tooltip = (0, exports.useTooltip)(setting);
    return ((0, jsx_runtime_1.jsx)(Tooltip, { content: tooltip.content, position: "left", delay: 500, children: children }));
};
exports.SettingsTooltip = SettingsTooltip;
const IntegrationTooltip = ({ platform, children }) => {
    const tooltip = (0, exports.useTooltip)(`${platform}-connect`);
    return ((0, jsx_runtime_1.jsx)(Tooltip, { content: tooltip.content, position: "top", delay: 300, children: children }));
};
exports.IntegrationTooltip = IntegrationTooltip;
// Tooltip provider for managing global tooltip state
const TooltipProvider = ({ children }) => {
    const [enabledTooltips, setEnabledTooltips] = (0, react_1.useState)(new Set());
    const [disabledTooltips, setDisabledTooltips] = (0, react_1.useState)(new Set());
    const enableTooltip = (tooltipId) => {
        setEnabledTooltips(prev => new Set(prev).add(tooltipId));
        setDisabledTooltips(prev => {
            const newSet = new Set(prev);
            newSet.delete(tooltipId);
            return newSet;
        });
    };
    const disableTooltip = (tooltipId) => {
        setDisabledTooltips(prev => new Set(prev).add(tooltipId));
        setEnabledTooltips(prev => {
            const newSet = new Set(prev);
            newSet.delete(tooltipId);
            return newSet;
        });
    };
    const isTooltipEnabled = (tooltipId) => {
        return !disabledTooltips.has(tooltipId);
    };
    return ((0, jsx_runtime_1.jsx)(TooltipContext.Provider, { value: {
            enabledTooltips,
            disabledTooltips,
            enableTooltip,
            disableTooltip,
            isTooltipEnabled
        }, children: children }));
};
exports.TooltipProvider = TooltipProvider;
// Context for tooltip management
const TooltipContext = react_1.default.createContext({
    enabledTooltips: new Set(),
    disabledTooltips: new Set(),
    enableTooltip: () => { },
    disableTooltip: () => { },
    isTooltipEnabled: () => true
});
exports.default = Tooltip;
