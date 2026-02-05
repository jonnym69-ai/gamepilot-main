"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkOperations = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const BulkOperations = ({ selectedGames, onSelectionChange }) => {
    const { actions } = (0, useLibraryStore_1.useLibraryStore)();
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const handleBulkStatusUpdate = (status) => {
        if (selectedGames.length === 0)
            return;
        setIsProcessing(true);
        actions.bulkUpdateStatus(selectedGames, status);
        setTimeout(() => {
            setIsProcessing(false);
            onSelectionChange([]);
        }, 1000);
    };
    const handleBulkAddToCategory = (category) => {
        if (selectedGames.length === 0)
            return;
        setIsProcessing(true);
        actions.bulkAddToCategory(selectedGames, category);
        setTimeout(() => {
            setIsProcessing(false);
            onSelectionChange([]);
        }, 1000);
    };
    const handleBulkDelete = () => {
        if (selectedGames.length === 0)
            return;
        if (confirm(`Are you sure you want to delete ${selectedGames.length} game(s)?`)) {
            setIsProcessing(true);
            actions.bulkDelete(selectedGames);
            setTimeout(() => {
                setIsProcessing(false);
                onSelectionChange([]);
            }, 1000);
        }
    };
    const handleExport = () => {
        setIsProcessing(true);
        actions.bulkExport();
        setTimeout(() => {
            setIsProcessing(false);
        }, 500);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u26A1" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white", children: "Bulk Operations" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: [selectedGames.length, " game", selectedGames.length !== 1 ? 's' : '', " selected"] })] })] }), selectedGames.length > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: () => onSelectionChange([]), className: "px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Clear Selection" }))] }), selectedGames.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-2", children: "Update Status" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkStatusUpdate('playing'), disabled: isProcessing, className: "flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors", children: "\uD83C\uDFAE Set Playing" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkStatusUpdate('completed'), disabled: isProcessing, className: "flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors", children: "\u2705 Set Completed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkStatusUpdate('backlog'), disabled: isProcessing, className: "flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors", children: "\uD83D\uDCCB Set Backlog" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkStatusUpdate('abandoned'), disabled: isProcessing, className: "flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors", children: "\u274C Set Abandoned" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-2", children: "Add to Category" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkAddToCategory('favorites'), disabled: isProcessing, className: "flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors", children: "\u2B50 Favorites" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkAddToCategory('hidden'), disabled: isProcessing, className: "flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors", children: "\uD83D\uDC41\uFE0F Hidden" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-2", children: "Actions" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleBulkDelete, disabled: isProcessing, className: "flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors", children: "\uD83D\uDDD1\uFE0F Delete" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleExport, disabled: isProcessing, className: "flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors", children: "\uD83D\uDCE4 Export" })] })] })] })), isProcessing && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "inline-flex items-center gap-3 px-4 py-2 bg-gaming-primary/20 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-gaming-accent border-t-transparent animate-spin rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent", children: "Processing..." })] }) }))] }));
};
exports.BulkOperations = BulkOperations;
