"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotlightGrid = exports.SpotlightCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SpotlightCard = ({ spotlight, onClick }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'legendary': return 'from-yellow-500 to-orange-500';
            case 'epic': return 'from-purple-500 to-pink-500';
            case 'rare': return 'from-blue-500 to-cyan-500';
            case 'common': return 'from-gray-500 to-gray-600';
            default: return 'from-gaming-primary to-gaming-secondary';
        }
    };
    const getRarityBorder = (rarity) => {
        switch (rarity) {
            case 'legendary': return 'border-yellow-500/50';
            case 'epic': return 'border-purple-500/50';
            case 'rare': return 'border-blue-500/50';
            case 'common': return 'border-gray-500/50';
            default: return 'border-gaming-primary/50';
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case 'game': return '🎮';
            case 'achievement': return '🏆';
            case 'milestone': return '🎯';
            case 'recommendation': return '✨';
            default: return '🌟';
        }
    };
    const getTypeGradient = (type) => {
        switch (type) {
            case 'game': return 'from-gaming-primary to-gaming-secondary';
            case 'achievement': return 'from-yellow-500 to-orange-500';
            case 'milestone': return 'from-green-500 to-blue-500';
            case 'recommendation': return 'from-purple-500 to-pink-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `
        relative group cursor-pointer transition-all duration-300 transform
        ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100 translate-y-0'}
      `, onClick: onClick, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [(0, jsx_runtime_1.jsxs)("div", { className: `
        glass-morphism rounded-xl overflow-hidden cinematic-shadow
        border-2 ${getRarityBorder(spotlight.metadata?.rarity)}
        ${isHovered ? 'ring-2 ring-white/20' : ''}
      `, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative h-48 bg-gradient-to-br", children: [spotlight.image ? ((0, jsx_runtime_1.jsx)("img", { src: spotlight.image, alt: spotlight.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: `w-full h-full bg-gradient-to-br ${getRarityColor(spotlight.metadata?.rarity)}` })), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 left-3", children: (0, jsx_runtime_1.jsxs)("div", { className: `
              px-3 py-1 rounded-full text-xs font-semibold text-white
              bg-gradient-to-r ${getTypeGradient(spotlight.type)}
            `, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-1", children: getTypeIcon(spotlight.type) }), spotlight.type.charAt(0).toUpperCase() + spotlight.type.slice(1)] }) }), spotlight.metadata?.rarity && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 right-3", children: (0, jsx_runtime_1.jsx)("div", { className: `
                px-3 py-1 rounded-full text-xs font-semibold text-white
                bg-gradient-to-r ${getRarityColor(spotlight.metadata.rarity)}
              `, children: spotlight.metadata.rarity.charAt(0).toUpperCase() + spotlight.metadata.rarity.slice(1) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white mb-2 group-hover:text-gaming-accent transition-colors", children: spotlight.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-200 line-clamp-2", children: spotlight.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-900/50", children: [spotlight.game && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded overflow-hidden bg-gray-800", children: spotlight.game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: spotlight.game.coverImage, alt: spotlight.game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-white truncate", children: spotlight.game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 truncate", children: spotlight.game.developer || 'Unknown Developer' })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 text-gray-400", children: [spotlight.metadata?.achievementCount && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFC6" }), spotlight.metadata.achievementCount] })), spotlight.metadata?.playtime && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u23F1\uFE0F" }), spotlight.metadata.playtime, "h"] }))] }), (0, jsx_runtime_1.jsx)("button", { className: "text-accent-400 hover:text-accent-300 transition-colors font-medium", children: "View \u2192" })] })] })] }), isHovered && ((0, jsx_runtime_1.jsx)("div", { className: `
          absolute inset-0 rounded-xl bg-gradient-to-r opacity-20 blur-xl -z-10
          ${getRarityColor(spotlight.metadata?.rarity)}
        ` }))] }));
};
exports.SpotlightCard = SpotlightCard;
const SpotlightGrid = ({ spotlights, onSpotlightClick, maxItems = 3 }) => {
    const displaySpotlights = spotlights.slice(0, maxItems);
    if (spotlights.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDF1F" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "No Spotlight Items" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Your achievements and milestones will appear here." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDF1F" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "Spotlight" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Featured achievements and milestones" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: displaySpotlights.map((spotlight) => ((0, jsx_runtime_1.jsx)(exports.SpotlightCard, { spotlight: spotlight, onClick: () => onSpotlightClick?.(spotlight) }, spotlight.id))) }), spotlights.length > maxItems && ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsxs)("button", { className: "text-accent-400 hover:text-accent-300 transition-colors font-medium", children: ["View All Spotlight Items (", spotlights.length, ")"] }) }))] }));
};
exports.SpotlightGrid = SpotlightGrid;
