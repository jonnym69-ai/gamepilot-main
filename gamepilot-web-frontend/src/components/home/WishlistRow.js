"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRow = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WishlistRow = ({ games }) => {
    const displayGames = games.slice(0, 10); // Show up to 10 games
    if (displayGames.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u2764\uFE0F" }), "Steam Wishlist"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xl mb-4", children: "\uD83D\uDC9D" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-2", children: "Your wishlist is empty" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "Add games to your Steam wishlist to see them here" })] })] }));
    }
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
        catch {
            return dateString;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u2764\uFE0F" }), "Steam Wishlist"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-400 text-sm", children: [displayGames.length, " ", displayGames.length === 1 ? 'game' : 'games'] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "flex gap-4 pb-4", children: displayGames.map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex-shrink-0 w-48 bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 hover:border-gaming-accent/50 transition-all duration-200 hover:scale-105 cursor-pointer", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative h-32", children: [(0, jsx_runtime_1.jsx)("img", { src: game.capsuleImage, alt: game.name, className: "w-full h-full object-cover" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }), game.price && game.price.discount_percent > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-2 left-2 px-2 py-1 bg-red-500 rounded text-white text-xs font-bold", children: ["-", game.price.discount_percent, "%"] })), game.isFree && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 left-2 px-2 py-1 bg-green-500 rounded text-white text-xs font-bold", children: "FREE" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold text-sm mb-1 line-clamp-2", children: game.name }), (0, jsx_runtime_1.jsx)("div", { className: "mb-2", children: game.isFree ? ((0, jsx_runtime_1.jsx)("span", { className: "text-green-400 font-bold text-sm", children: "Free to Play" })) : game.price ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [game.price.discount_percent > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 line-through text-xs", children: [game.price.currency, " ", (game.price.initial / 100).toFixed(2)] })), (0, jsx_runtime_1.jsxs)("span", { className: "text-white font-bold text-sm", children: [game.price.currency, " ", (game.price.final / 100).toFixed(2)] })] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Price not available" })) }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xs", children: formatDate(game.releaseDate) })] })] }, game.appId))) }) }), games.length > 10 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center mt-4", children: (0, jsx_runtime_1.jsxs)("button", { className: "px-4 py-2 bg-gaming-accent hover:bg-gaming-primary text-white rounded-lg text-sm font-medium transition-colors", children: ["View ", games.length - 10, " more games"] }) }))] }));
};
exports.WishlistRow = WishlistRow;
