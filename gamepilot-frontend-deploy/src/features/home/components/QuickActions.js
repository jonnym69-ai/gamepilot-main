"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultQuickActions = exports.QuickActions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const QuickActions = ({ actions, onActionClick }) => {
    const [hoveredAction, setHoveredAction] = (0, react_1.useState)(null);
    const handleActionClick = (action) => {
        action.action();
        onActionClick?.(action);
    };
    if (actions.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u26A1" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "Quick Actions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Common tasks and shortcuts" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: actions.map((action) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleActionClick(action), onMouseEnter: () => setHoveredAction(action.id), onMouseLeave: () => setHoveredAction(null), className: `
              relative p-4 rounded-xl transition-all duration-300 transform
              ${hoveredAction === action.id ? 'scale-105 -translate-y-1' : 'scale-100 translate-y-0'}
              ${hoveredAction === action.id ? 'ring-2 ring-white/20' : ''}
            `, children: [(0, jsx_runtime_1.jsx)("div", { className: `
              absolute inset-0 rounded-xl bg-gradient-to-br ${action.gradient}
              opacity-10 hover:opacity-20 transition-opacity duration-300
            ` }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: `
                w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-3 mx-auto
                bg-gradient-to-r ${action.gradient}
              `, children: action.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium text-sm mb-1", children: action.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-xs leading-relaxed", children: action.description })] }), hoveredAction === action.id && ((0, jsx_runtime_1.jsx)("div", { className: `
                absolute inset-0 rounded-xl bg-gradient-to-r ${action.gradient}
                opacity-20 blur-xl -z-10
              ` }))] }, action.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-6 border-t border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-3", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white rounded-lg transition-colors text-sm", children: "\uD83D\uDCDA View Library" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white rounded-lg transition-colors text-sm", children: "\uD83C\uDFC6 Achievements" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white rounded-lg transition-colors text-sm", children: "\uD83D\uDCCA Statistics" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white rounded-lg transition-colors text-sm", children: "\uD83D\uDD17 Integrations" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 hover:text-white rounded-lg transition-colors text-sm", children: "\u2699\uFE0F Settings" })] }) })] }));
};
exports.QuickActions = QuickActions;
// Default quick actions that can be used as a starting point
exports.defaultQuickActions = [
    {
        id: 'add-game',
        title: 'Add Game',
        description: 'Manually add a game to your library',
        icon: '➕',
        gradient: 'from-green-500 to-emerald-600',
        action: () => {
            console.log('Add game clicked');
            // Navigate to add game form
        }
    },
    {
        id: 'import-games',
        title: 'Import Games',
        description: 'Import from Steam, Xbox, PlayStation',
        icon: '📥',
        gradient: 'from-blue-500 to-cyan-600',
        action: () => {
            console.log('Import games clicked');
            // Navigate to import wizard
        }
    },
    {
        id: 'random-game',
        title: 'Random Game',
        description: 'Pick a random game from your library',
        icon: '🎲',
        gradient: 'from-purple-500 to-pink-600',
        action: () => {
            console.log('Random game clicked');
            // Show random game picker
        }
    },
    {
        id: 'backup',
        title: 'Backup Data',
        description: 'Export your game library and data',
        icon: '💾',
        gradient: 'from-orange-500 to-red-600',
        action: () => {
            console.log('Backup clicked');
            // Start backup process
        }
    },
    {
        id: 'discover',
        title: 'Discover',
        description: 'Find new games to play',
        icon: '🔍',
        gradient: 'from-indigo-500 to-purple-600',
        action: () => {
            console.log('Discover clicked');
            // Navigate to discovery page
        }
    },
    {
        id: 'share',
        title: 'Share Profile',
        description: 'Share your gaming profile',
        icon: '🔗',
        gradient: 'from-teal-500 to-green-600',
        action: () => {
            console.log('Share profile clicked');
            // Open share dialog
        }
    },
    {
        id: 'wishlist',
        title: 'Wishlist',
        description: 'View your game wishlist',
        icon: '⭐',
        gradient: 'from-yellow-500 to-orange-600',
        action: () => {
            console.log('Wishlist clicked');
            // Navigate to wishlist
        }
    },
    {
        id: 'reviews',
        title: 'Reviews',
        description: 'Write and read game reviews',
        icon: '📝',
        gradient: 'from-pink-500 to-rose-600',
        action: () => {
            console.log('Reviews clicked');
            // Navigate to reviews section
        }
    }
];
