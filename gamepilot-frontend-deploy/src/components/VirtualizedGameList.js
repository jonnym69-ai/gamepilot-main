"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualizedGameList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_virtual_1 = require("@tanstack/react-virtual");
const GameCard_1 = require("../features/library/components/GameCard");
const ROW_HEIGHT = 260; // Increased height for less cramped feeling
const VirtualizedGameList = ({ games, onGameLaunch, onGameEdit, onGameDelete, selectedGames, onGameSelectToggle, isBulkSelectMode }) => {
    // Group games into rows of 3 for better layout
    const gameRows = (0, react_1.useMemo)(() => {
        const rows = [];
        for (let i = 0; i < games.length; i += 3) {
            rows.push(games.slice(i, i + 3));
        }
        return rows;
    }, [games]);
    const parentRef = (0, react_1.useRef)(null);
    const virtualizer = (0, react_virtual_1.useVirtualizer)({
        count: gameRows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 5, // Render 5 extra rows for smooth scrolling
    });
    const GameRow = (0, react_1.useCallback)(({ rowIndex, gameRow }) => {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 p-2", children: [gameRow.map((game) => ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 min-w-0", children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: game, onSelect: () => onGameSelectToggle(game.id), onLaunch: () => onGameLaunch(game), onEdit: () => onGameEdit(game.id, {}), onDelete: () => onGameDelete(game), isSelectable: isBulkSelectMode, isSelected: selectedGames.has(game.id) }) }, game.id))), gameRow.length < 3 && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: Array.from({ length: 3 - gameRow.length }).map((_, emptyIndex) => ((0, jsx_runtime_1.jsx)("div", { className: "flex-1" }, `empty-${rowIndex}-${emptyIndex}`))) }))] }));
    }, [
        onGameLaunch,
        onGameEdit,
        onGameDelete,
        selectedGames,
        onGameSelectToggle,
        isBulkSelectMode
    ]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "virtualized-game-list", children: (0, jsx_runtime_1.jsx)("div", { ref: parentRef, className: "h-[700px] overflow-auto", style: {
                contain: 'strict',
            }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }, children: virtualizer.getVirtualItems().map((virtualItem) => ((0, jsx_runtime_1.jsx)("div", { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                    }, children: (0, jsx_runtime_1.jsx)(GameRow, { rowIndex: virtualItem.index, gameRow: gameRows[virtualItem.index] }) }, virtualItem.index))) }) }) }));
};
exports.VirtualizedGameList = VirtualizedGameList;
