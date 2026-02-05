"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGridVirtual = GameGridVirtual;
const jsx_runtime_1 = require("react/jsx-runtime");
const VirtualScroll_1 = require("../../../components/VirtualScroll");
const GameCard_1 = require("./GameCard");
function GameGridVirtual({ games, isBulkSelectMode, selectedGames, onSelectGame, onEditGame, onDeleteGame, onReorderGame, isDraggable = false, className = '', launchingGameId = null, onLaunchGame, onLaunch }) {
    const { containerHeight, containerRef } = (0, VirtualScroll_1.useContainerHeight)(600);
    // Calculate grid layout based on screen size
    const getGridColumns = () => {
        if (typeof window === 'undefined')
            return 3; // Default for SSR
        const width = window.innerWidth;
        if (width >= 1536)
            return 4; // 2xl
        if (width >= 1024)
            return 3; // lg
        if (width >= 640)
            return 2; // sm
        return 1; // mobile
    };
    const columns = getGridColumns();
    const itemHeight = 552; // Updated card height (520px) + gap (32px)
    const gap = 32; // Gap between items (tailwind gap-8)
    // Group games into rows
    const rows = [];
    for (let i = 0; i < games.length; i += columns) {
        rows.push(games.slice(i, i + columns));
    }
    const renderRow = (row, rowIndex) => {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "grid gap-8", style: {
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: `${gap}px`
            }, children: [row.map((game, colIndex) => ((0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: game, index: rowIndex * columns + colIndex, isSelectable: isBulkSelectMode, isSelected: selectedGames.has(game.id), onSelect: onSelectGame, onEdit: onEditGame, onDelete: onDeleteGame, onReorder: onReorderGame, onLaunch: onLaunch, isDraggable: isDraggable, isLaunching: launchingGameId === game.id }, game.id))), row.length < columns && Array.from({ length: columns - row.length }).map((_, emptyIndex) => ((0, jsx_runtime_1.jsx)("div", { className: "w-full" }, `empty-${rowIndex}-${emptyIndex}`)))] }));
    };
    if (games.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "w-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-2xl p-12 text-center border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-7xl mb-6 animate-float", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-3", children: "No games found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-8 text-base max-w-md mx-auto", children: "Try adjusting your search terms or filters" })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: `w-full ${className}`, children: (0, jsx_runtime_1.jsx)(VirtualScroll_1.VirtualScroll, { items: rows, itemHeight: itemHeight, containerHeight: containerHeight, renderItem: renderRow, overscan: 2, className: "w-full" }) }));
}
