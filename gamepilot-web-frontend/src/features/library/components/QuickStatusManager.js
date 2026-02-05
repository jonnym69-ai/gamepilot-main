"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickStatusManager = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ErrorBoundary_1 = require("../../../components/ErrorBoundary");
const QuickStatusManager = ({ games, selectedGames, onUpdateMultipleGames }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [selectedStatus, setSelectedStatus] = (0, react_1.useState)('unplayed');
    const selectedGamesData = selectedGames.map(id => games.find(game => game.id === id)).filter(Boolean);
    const statusOptions = [
        { value: 'unplayed', label: 'Unplayed', icon: '🎮', color: 'bg-gray-600' },
        { value: 'playing', label: 'Playing', icon: '🎯', color: 'bg-green-600' },
        { value: 'completed', label: 'Completed', icon: '✅', color: 'bg-blue-600' },
        { value: 'paused', label: 'Paused', icon: '⏸️', color: 'bg-yellow-600' },
        { value: 'abandoned', label: 'Abandoned', icon: '🗑️', color: 'bg-red-600' }
    ];
    const handleApplyStatus = (0, react_1.useCallback)(async () => {
        if (selectedGames.length === 0)
            return;
        try {
            await onUpdateMultipleGames(selectedGames, { playStatus: selectedStatus });
            setIsOpen(false);
        }
        catch (err) {
            console.error('Failed to update game status:', err);
        }
    }, [selectedGames, selectedStatus, onUpdateMultipleGames]);
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 max-w-md w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-white/10", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-bold text-white", children: ["Update Status (", selectedGames.length, " games)"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "Selected Games" }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-32 overflow-y-auto space-y-2", children: selectedGamesData.map(game => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-2 glass-morphism rounded-lg border border-white/10", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gray-700 rounded flex-shrink-0 overflow-hidden", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-white font-medium truncate", children: game.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400", children: ["Current: ", game.playStatus || 'unplayed'] })] })] }, game.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "Select New Status" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: statusOptions.map((status) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedStatus(status.value), className: `p-4 rounded-lg border-2 transition-all ${selectedStatus === status.value
                                                ? `${status.color} text-white`
                                                : 'bg-white/10 text-gray-300 hover:border-gray-400'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: status.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: status.label })] }) }, status.value))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border-white/10", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-2", children: "Preview" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-3", children: statusOptions.find(s => s.value === selectedStatus) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: `w-8 h-8 rounded-full ${statusOptions.find(s => s.value === selectedStatus)?.color || 'bg-gray-600'}` }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium", children: statusOptions.find(s => s.value === selectedStatus)?.label }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: [selectedGames.length, " games will be updated to this status"] })] })] })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t border-white/10", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleApplyStatus, disabled: selectedGames.length === 0, className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2", children: "\u26A1 Apply Status" })] })] })] }) }) }));
};
exports.QuickStatusManager = QuickStatusManager;
