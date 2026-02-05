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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHelp = exports.HelpProvider = exports.HelpContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// Help Button Component - Centralized Help Access
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const TourManager_1 = require("./TourManager");
const Tooltip_1 = __importDefault(require("./Tooltip"));
const HelpButton = ({ position = 'fixed', location = 'bottom-right', size = 'medium', showTooltip = true, className = '' }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const buttonRef = (0, react_1.useRef)(null);
    const menuRef = (0, react_1.useRef)(null);
    const { startTour, getAvailableTours } = (0, TourManager_1.useTour)();
    const availableTours = getAvailableTours();
    const helpOptions = [
        // Tour options
        ...availableTours
            .filter(tour => !tour.hasSeen)
            .map(tour => ({
            id: `tour-${tour.id}`,
            title: tour.name,
            description: tour.description,
            icon: '🎯',
            action: () => {
                startTour(tour.id);
                setIsOpen(false);
            },
            category: 'tour',
            badge: 'New'
        })),
        // Documentation options
        {
            id: 'help-center',
            title: 'Help Center',
            description: 'Browse comprehensive documentation and guides',
            icon: '📚',
            action: () => {
                window.open('/help', '_blank');
                setIsOpen(false);
            },
            category: 'documentation'
        },
        {
            id: 'quick-start',
            title: 'Quick Start Guide',
            description: 'Get started with GamePilot in 5 minutes',
            icon: '🚀',
            action: () => {
                window.open('/help/quick-start', '_blank');
                setIsOpen(false);
            },
            category: 'documentation'
        },
        {
            id: 'features-guide',
            title: 'Features Guide',
            description: 'Learn about all GamePilot features',
            icon: '⚡',
            action: () => {
                window.open('/help/features', '_blank');
                setIsOpen(false);
            },
            category: 'documentation'
        },
        // Support options
        {
            id: 'contact-support',
            title: 'Contact Support',
            description: 'Get help from our support team',
            icon: '💬',
            action: () => {
                window.open('/support', '_blank');
                setIsOpen(false);
            },
            category: 'support'
        },
        {
            id: 'report-bug',
            title: 'Report a Bug',
            description: 'Help us improve by reporting issues',
            icon: '🐛',
            action: () => {
                window.open('/support/bug-report', '_blank');
                setIsOpen(false);
            },
            category: 'support'
        },
        {
            id: 'feature-request',
            title: 'Request a Feature',
            description: 'Suggest new features or improvements',
            icon: '💡',
            action: () => {
                window.open('/support/feature-request', '_blank');
                setIsOpen(false);
            },
            category: 'support'
        },
        // Feedback options
        {
            id: 'send-feedback',
            title: 'Send Feedback',
            description: 'Share your thoughts and suggestions',
            icon: '📝',
            action: () => {
                window.open('/feedback', '_blank');
                setIsOpen(false);
            },
            category: 'feedback'
        },
        {
            id: 'rate-experience',
            title: 'Rate Your Experience',
            description: 'Help us improve by rating your experience',
            icon: '⭐',
            action: () => {
                window.open('/feedback/rating', '_blank');
                setIsOpen(false);
            },
            category: 'feedback'
        },
        // Community options
        {
            id: 'community-forum',
            title: 'Community Forum',
            description: 'Connect with other GamePilot users',
            icon: '👥',
            action: () => {
                window.open('https://community.gamepilot.app', '_blank');
                setIsOpen(false);
            },
            category: 'support'
        },
        {
            id: 'discord-server',
            title: 'Discord Server',
            description: 'Join our Discord community',
            icon: '💎',
            action: () => {
                window.open('https://discord.gg/gamepilot', '_blank');
                setIsOpen(false);
            },
            category: 'support'
        }
    ];
    const filteredOptions = helpOptions.filter(option => option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const getPositionClasses = () => {
        if (position === 'static')
            return '';
        const positions = {
            'bottom-right': 'bottom-6 right-6',
            'bottom-left': 'bottom-6 left-6',
            'top-right': 'top-6 right-6',
            'top-left': 'top-6 left-6'
        };
        return positions[location];
    };
    const getSizeClasses = () => {
        const sizes = {
            small: 'w-10 h-10',
            medium: 'w-12 h-12',
            large: 'w-14 h-14'
        };
        return sizes[size];
    };
    const getIconSize = () => {
        const sizes = {
            small: 'text-lg',
            medium: 'text-xl',
            large: 'text-2xl'
        };
        return sizes[size];
    };
    const getMenuPosition = () => {
        if (position === 'static')
            return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
        const positions = {
            'bottom-right': 'bottom-full mb-2 right-0',
            'bottom-left': 'bottom-full mb-2 left-0',
            'top-right': 'top-full mt-2 right-0',
            'top-left': 'top-full mt-2 left-0'
        };
        return positions[location];
    };
    const handleClickOutside = (event) => {
        if (menuRef.current &&
            !menuRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);
    const handleKeyDown = (event) => {
        if (event.key === 'Escape' && isOpen) {
            setIsOpen(false);
        }
    };
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);
    const getCategoryColor = (category) => {
        const colors = {
            tour: 'bg-purple-500/20 text-purple-300 border-purple-500',
            documentation: 'bg-blue-500/20 text-blue-300 border-blue-500',
            support: 'bg-green-500/20 text-green-300 border-green-500',
            feedback: 'bg-orange-500/20 text-orange-300 border-orange-500'
        };
        return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500';
    };
    const helpButton = ((0, jsx_runtime_1.jsxs)("button", { ref: buttonRef, onClick: () => setIsOpen(!isOpen), className: `
        ${position === 'fixed' ? 'fixed' : 'relative'} 
        ${getPositionClasses()}
        ${getSizeClasses()}
        bg-gradient-to-r from-purple-500 to-blue-500 
        text-white rounded-full 
        shadow-lg hover:shadow-xl 
        transform transition-all duration-200 
        hover:scale-110 
        flex items-center justify-center
        z-50
        ${className}
      `, "aria-label": "Help", children: [(0, jsx_runtime_1.jsx)("span", { className: getIconSize(), children: "?" }), availableTours.some(tour => !tour.hasSeen) && ((0, jsx_runtime_1.jsx)("span", { className: "absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" }))] }));
    const helpMenu = isOpen ? (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("div", { ref: menuRef, className: `
        fixed z-50 
        ${getMenuPosition()}
        w-80 max-h-96 
        bg-gray-900 border border-gray-700 
        rounded-xl shadow-2xl 
        overflow-hidden
      `, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-700", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: "How can we help?" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search for help...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500", autoFocus: true }), (0, jsx_runtime_1.jsx)("svg", { className: "absolute right-3 top-2.5 w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-64 overflow-y-auto", children: filteredOptions.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-center text-gray-400", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-12 h-12 mx-auto mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), (0, jsx_runtime_1.jsx)("p", { children: "No help options found" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "p-2", children: filteredOptions.map(option => ((0, jsx_runtime_1.jsx)("button", { onClick: option.action, className: "w-full p-3 text-left hover:bg-gray-800 rounded-lg transition-colors group", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-sm", children: option.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium truncate", children: option.title }), option.badge && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full", children: option.badge }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-1 line-clamp-2", children: option.description }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block px-2 py-0.5 text-xs rounded-full border ${getCategoryColor(option.category)}`, children: option.category }) })] })] }) }, option.id))) })) }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 border-t border-gray-700 bg-gray-800", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-400", children: [(0, jsx_runtime_1.jsx)("span", { children: "Need more help?" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                window.open('/help', '_blank');
                                setIsOpen(false);
                            }, className: "text-purple-400 hover:text-purple-300 transition-colors", children: "Visit Help Center \u2192" })] }) })] }), document.body) : null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showTooltip ? ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { content: "Get help with GamePilot", position: "left", children: helpButton })) : (helpButton), helpMenu] }));
};
// Help Context for managing help state across the app
exports.HelpContext = react_1.default.createContext({
    showHelp: () => { },
    hideHelp: () => { },
    isHelpVisible: false
});
const HelpProvider = ({ children }) => {
    const [isHelpVisible, setIsHelpVisible] = (0, react_1.useState)(false);
    const showHelp = (topic) => {
        if (topic) {
            // Navigate to specific help topic
            window.open(`/help/${topic}`, '_blank');
        }
        else {
            setIsHelpVisible(true);
        }
    };
    const hideHelp = () => {
        setIsHelpVisible(false);
    };
    return ((0, jsx_runtime_1.jsxs)(exports.HelpContext.Provider, { value: { showHelp, hideHelp, isHelpVisible }, children: [children, (0, jsx_runtime_1.jsx)(HelpButton, {})] }));
};
exports.HelpProvider = HelpProvider;
// Hook for accessing help functionality
const useHelp = () => {
    const context = react_1.default.useContext(exports.HelpContext);
    if (!context) {
        throw new Error('useHelp must be used within a HelpProvider');
    }
    return context;
};
exports.useHelp = useHelp;
exports.default = HelpButton;
