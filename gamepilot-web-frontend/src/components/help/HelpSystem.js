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
exports.KeyboardShortcuts = exports.HelpButton = exports.useHelp = exports.HelpProvider = exports.QuickHelp = exports.HelpCenter = exports.HelpTooltip = exports.Tooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const Tooltip = ({ content, children, position = 'top', delay = 300, className = '' }) => {
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [coords, setCoords] = (0, react_1.useState)({ x: 0, y: 0 });
    const timeoutRef = (0, react_1.useRef)();
    const containerRef = (0, react_1.useRef)(null);
    const handleMouseEnter = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect)
            return;
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        setCoords({ x, y });
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };
    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };
    const getTooltipPosition = () => {
        const tooltipWidth = 200;
        const tooltipHeight = 40;
        const offset = 10;
        switch (position) {
            case 'top':
                return {
                    left: coords.x - tooltipWidth / 2,
                    top: coords.y - tooltipHeight - offset
                };
            case 'bottom':
                return {
                    left: coords.x - tooltipWidth / 2,
                    top: coords.y + offset
                };
            case 'left':
                return {
                    left: coords.x - tooltipWidth - offset,
                    top: coords.y - tooltipHeight / 2
                };
            case 'right':
                return {
                    left: coords.x + offset,
                    top: coords.y - tooltipHeight / 2
                };
            default:
                return { left: coords.x - tooltipWidth / 2, top: coords.y - tooltipHeight - offset };
        }
    };
    const tooltipPosition = getTooltipPosition();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { ref: containerRef, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, className: `inline-block ${className}`, children: children }), isVisible &&
                (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("div", { className: "fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-700 pointer-events-none transition-opacity duration-200", style: {
                        left: `${tooltipPosition.left}px`,
                        top: `${tooltipPosition.top}px`,
                        maxWidth: '200px',
                        wordWrap: 'break-word'
                    }, children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [content, (0, jsx_runtime_1.jsx)("div", { className: `absolute w-2 h-2 bg-gray-900 border border-gray-700 transform rotate-45 ${position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2' :
                                    position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2' :
                                        position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2' :
                                            'left-[-5px] top-1/2 -translate-y-1/2'}` })] }) }), document.body)] }));
};
exports.Tooltip = Tooltip;
const HelpTooltip = ({ title, content, children, className = '' }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const tooltipRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative inline-block ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { onClick: () => setIsOpen(!isOpen), className: "cursor-help", children: children }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { ref: tooltipRef, className: "absolute z-50 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 top-full mt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white", children: title }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm leading-relaxed", children: content })] }))] }));
};
exports.HelpTooltip = HelpTooltip;
const HelpCenter = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [activeCategory, setActiveCategory] = (0, react_1.useState)('all');
    const helpCategories = [
        {
            id: 'getting-started',
            name: 'Getting Started',
            icon: '🚀',
            articles: [
                {
                    id: 'welcome',
                    title: 'Welcome to GamePilot',
                    content: 'GamePilot is your personal gaming identity platform that helps you discover, organize, and connect your gaming experiences across multiple platforms.',
                    tags: ['beginner', 'overview']
                },
                {
                    id: 'first-steps',
                    title: 'Your First Steps',
                    content: 'Start by connecting your gaming platforms, then explore your personalized recommendations and mood-based gaming suggestions.',
                    tags: ['beginner', 'tutorial']
                },
                {
                    id: 'account-setup',
                    title: 'Setting Up Your Account',
                    content: 'Complete your profile, set your gaming preferences, and configure privacy settings to get the most out of GamePilot.',
                    tags: ['beginner', 'account']
                }
            ]
        },
        {
            id: 'features',
            name: 'Features',
            icon: '🎮',
            articles: [
                {
                    id: 'game-library',
                    title: 'Game Library',
                    content: 'Organize your entire game collection from Steam, Epic, GOG, and more. Add games manually, track playtime, and manage your gaming backlog.',
                    tags: ['library', 'games']
                },
                {
                    id: 'mood-engine',
                    title: 'Mood Engine',
                    content: 'Discover games based on your current mood. Whether you\'re feeling competitive, relaxed, or creative, GamePilot has recommendations for you.',
                    tags: ['mood', 'recommendations']
                },
                {
                    id: 'recommendations',
                    title: 'Personalized Recommendations',
                    content: 'Get AI-powered game recommendations based on your gaming history, preferences, and mood patterns.',
                    tags: ['ai', 'recommendations']
                },
                {
                    id: 'integrations',
                    title: 'Platform Integrations',
                    content: 'Connect your Steam, Epic Games, GOG, Xbox, PlayStation, and Nintendo accounts to sync your game library.',
                    tags: ['integrations', 'platforms']
                }
            ]
        },
        {
            id: 'troubleshooting',
            name: 'Troubleshooting',
            icon: '🔧',
            articles: [
                {
                    id: 'connection-issues',
                    title: 'Connection Issues',
                    content: 'Having trouble connecting your gaming platforms? Check your credentials, ensure your accounts are public, and try refreshing the connection.',
                    tags: ['troubleshooting', 'connections']
                },
                {
                    id: 'sync-problems',
                    title: 'Game Library Sync Problems',
                    content: 'If your game library isn\'t syncing properly, try disconnecting and reconnecting the platform, or check if your profile is set to public.',
                    tags: ['troubleshooting', 'sync']
                },
                {
                    id: 'performance',
                    title: 'Performance Issues',
                    content: 'Experiencing slow performance? Try clearing your cache, disabling extensions, or checking your internet connection.',
                    tags: ['troubleshooting', 'performance']
                }
            ]
        },
        {
            id: 'privacy',
            name: 'Privacy & Security',
            icon: '🔒',
            articles: [
                {
                    id: 'data-privacy',
                    title: 'Data Privacy',
                    content: 'Learn how GamePilot protects your data, what information we collect, and how you can control your privacy settings.',
                    tags: ['privacy', 'security']
                },
                {
                    id: 'account-security',
                    title: 'Account Security',
                    content: 'Keep your account secure with strong passwords, two-factor authentication, and regular security checkups.',
                    tags: ['security', 'account']
                },
                {
                    id: 'data-deletion',
                    title: 'Data Deletion',
                    content: 'Learn how to delete your account and remove all your data from GamePilot if you decide to leave the platform.',
                    tags: ['privacy', 'deletion']
                }
            ]
        }
    ];
    const filteredArticles = helpCategories
        .filter(category => activeCategory === 'all' || category.id === activeCategory)
        .flatMap(category => category.articles)
        .filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-900 rounded-xl shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-700", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Help Center" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors text-2xl", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-b border-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search for help...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveCategory('all'), className: `px-4 py-2 rounded-lg transition-colors ${activeCategory === 'all'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`, children: "All" }), helpCategories.map(category => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveCategory(category.id), className: `px-4 py-2 rounded-lg transition-colors ${activeCategory === category.id
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: category.icon }), category.name] }, category.id)))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 overflow-y-auto max-h-[50vh]", children: filteredArticles.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredArticles.map(article => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: article.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm mb-3", children: article.content }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: article.tags.map(tag => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full", children: tag }, tag))) })] }, article.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "No help articles found matching your search." })] })) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-t border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Can't find what you're looking for?" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: "Contact Support" })] }) })] }) })) }));
};
exports.HelpCenter = HelpCenter;
const QuickHelp = ({ topic, className = '' }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const helpContent = {
        'game-library': {
            title: 'Game Library',
            content: 'Your game library is where you can organize all your games from different platforms. Add games manually, connect platforms, and track your gaming progress.',
            tips: [
                'Connect Steam to import your game library automatically',
                'Add games manually if they\'re not on connected platforms',
                'Use tags to organize your games by genre, mood, or platform',
                'Track your playtime and gaming sessions'
            ]
        },
        'mood-engine': {
            title: 'Mood Engine',
            content: 'The Mood Engine helps you discover games based on your current emotional state. Select your mood and get personalized recommendations.',
            tips: [
                'Choose your current mood from the mood bar',
                'Get recommendations that match your emotional state',
                'Track your mood patterns over time',
                'Discover games you might not have considered'
            ]
        },
        'recommendations': {
            title: 'Recommendations',
            content: 'Get personalized game recommendations based on your gaming history, preferences, and mood patterns.',
            tips: [
                'Rate games to improve recommendations',
                'Connect more platforms for better recommendations',
                'Use the mood engine for mood-based suggestions',
                'Explore new genres based on your preferences'
            ]
        },
        'integrations': {
            title: 'Platform Integrations',
            content: 'Connect your gaming platforms to sync your game library and get personalized recommendations.',
            tips: [
                'Steam: Connect your Steam account to import your library',
                'Epic Games: Link your Epic Games account',
                'GOG: Connect your GOG account',
                'Make sure your profiles are set to public for syncing'
            ]
        }
    };
    const content = helpContent[topic];
    if (!content) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative ${className}`, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(!isOpen), className: "text-purple-400 hover:text-purple-300 transition-colors", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "\u2753" }) }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute z-50 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 top-full mt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white", children: content.title }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm mb-3", children: content.content }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-700 pt-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-white mb-2", children: "Quick Tips:" }), (0, jsx_runtime_1.jsx)("ul", { className: "text-gray-300 text-sm space-y-1", children: content.tips.map((tip, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-purple-400 mr-2", children: "\u2022" }), tip] }, index))) })] })] }))] }));
};
exports.QuickHelp = QuickHelp;
const HelpContext = react_1.default.createContext(null);
const HelpProvider = ({ children }) => {
    const [tooltip, setTooltip] = (0, react_1.useState)(null);
    const showTooltip = (content, element, position = 'top') => {
        setTooltip({ content, element, position });
    };
    const hideTooltip = () => {
        setTooltip(null);
    };
    const showHelp = (topic) => {
        // Help modal functionality - displays contextual help content
        // Future enhancement: Implement modal with rich content, videos, and guided tours
        console.log(`Help requested for topic: ${topic}`);
        // Implementation: Show help modal with topic-specific content
    };
    const hideHelp = () => {
        // Help modal functionality - hides the help interface
        // Future enhancement: Track help usage analytics for improvement
        console.log('Help hidden');
        // Implementation: Hide help modal and cleanup resources
    };
    return ((0, jsx_runtime_1.jsxs)(HelpContext.Provider, { value: { showTooltip, hideTooltip, showHelp, hideHelp }, children: [children, tooltip &&
                (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("div", { className: "fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-700 pointer-events-none", style: {
                        position: 'absolute',
                        left: tooltip.element.getBoundingClientRect().left,
                        top: tooltip.element.getBoundingClientRect().top - 40
                    }, children: tooltip.content }), document.body)] }));
};
exports.HelpProvider = HelpProvider;
const useHelp = () => {
    const context = react_1.default.useContext(HelpContext);
    if (!context) {
        throw new Error('useHelp must be used within a HelpProvider');
    }
    return context;
};
exports.useHelp = useHelp;
// Help Button Component
const HelpButton = ({ className = '' }) => {
    const { showHelp } = (0, exports.useHelp)();
    return ((0, jsx_runtime_1.jsx)("button", { onClick: () => showHelp('game-library'), className: `fixed bottom-6 right-6 w-12 h-12 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors flex items-center justify-center ${className}`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "?" }) }));
};
exports.HelpButton = HelpButton;
// Keyboard Shortcuts Help
const KeyboardShortcuts = () => {
    const shortcuts = [
        { key: 'Ctrl + K', description: 'Open search' },
        { key: 'Ctrl + /', description: 'Open help center' },
        { key: 'Ctrl + N', description: 'Add new game' },
        { key: 'Ctrl + L', description: 'Go to library' },
        { key: 'Ctrl + H', description: 'Go to home' },
        { key: 'Escape', description: 'Close modal' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded-lg p-4 border border-gray-700", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white mb-3", children: "Keyboard Shortcuts" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: shortcuts.map((shortcut, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm", children: shortcut.key }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: shortcut.description })] }, index))) })] }));
};
exports.KeyboardShortcuts = KeyboardShortcuts;
exports.default = {
    Tooltip: exports.Tooltip,
    HelpTooltip: exports.HelpTooltip,
    HelpCenter: exports.HelpCenter,
    QuickHelp: exports.QuickHelp,
    HelpProvider: exports.HelpProvider,
    useHelp: exports.useHelp,
    HelpButton: exports.HelpButton,
    KeyboardShortcuts: exports.KeyboardShortcuts
};
