"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGrid = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const GameCard_1 = require("./GameCard");
const GameGrid = ({ games, loading = false, emptyMessage = 'No games found', onGameClick, selectedGames = [], capsuleImages = {} }) => {
    const isSelected = (gameId) => selectedGames.includes(gameId);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6", children: loading ? ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-full flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 border-2 border-gaming-accent border-t-transparent animate-spin rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent", children: "Loading games..." })] })) : games.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-full text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gray-800 rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: emptyMessage })] })) : (games.map((game) => ((0, jsx_runtime_1.jsx)("div", { className: `relative group cursor-pointer transition-all duration-200 ${isSelected(game.id) ? 'ring-2 ring-gaming-accent' : ''}`, onClick: () => onGameClick?.(game), children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: game, isSelected: isSelected(game.id), capsuleImage: capsuleImages[game.id] || game.capsuleImage || game.headerImage || game.smallHeaderImage }) }, game.id)))) }));
    }
    if (games.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-4xl", children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: emptyMessage }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Try adjusting your filters or search terms to find games." })] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6", children: games.map((game) => ((0, jsx_runtime_1.jsx)("div", { className: `relative group cursor-pointer transition-all duration-200 ${isSelected(game.id) ? 'ring-2 ring-gaming-accent' : ''}`, onClick: () => onGameClick?.(game), children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: game, isSelected: isSelected(game.id) }) }, game.id))) }));
};
exports.GameGrid = GameGrid;
