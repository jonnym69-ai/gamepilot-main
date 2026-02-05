"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkOperations = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ErrorBoundary_1 = require("../../../components/ErrorBoundary");
const Loading_1 = require("../../../components/Loading");
const BulkOperations = ({ isOpen, onClose, selectedGames, games, onUpdateMultipleGames, onDeleteMultipleGames }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [selectedAction, setSelectedAction] = (0, react_1.useState)('status');
    const [actionData, setActionData] = (0, react_1.useState)({
        status: 'unplayed',
        isFavorite: false,
        tags: '',
        platforms: []
    });
    const selectedGamesData = selectedGames.map(id => games.find(game => game.id === id)).filter(Boolean);
    const handleBulkAction = (0, react_1.useCallback)(async () => {
        if (selectedGames.length === 0)
            return;
        setIsLoading(true);
        setError(null);
        try {
            switch (selectedAction) {
                case 'status':
                    await onUpdateMultipleGames(selectedGames, { playStatus: actionData.status });
                    break;
                case 'favorite':
                    await onUpdateMultipleGames(selectedGames, { isFavorite: actionData.isFavorite });
                    break;
                case 'delete':
                    await onDeleteMultipleGames(selectedGames);
                    break;
                case 'tags':
                    await onUpdateMultipleGames(selectedGames, {
                        tags: actionData.tags.split(',').map(t => t.trim()).filter(t => t)
                    });
                    break;
                case 'platforms':
                    await onUpdateMultipleGames(selectedGames, {
                        platforms: actionData.platforms.map(code => ({
                            id: code,
                            name: code,
                            code: code,
                            isConnected: false
                        }))
                    });
                    break;
            }
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to perform bulk operation');
        }
        finally {
            setIsLoading(false);
        }
    }, [selectedGames, selectedAction, actionData, onUpdateMultipleGames, onDeleteMultipleGames]);
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-white/10", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-bold text-white", children: ["Bulk Operations (", selectedGames.length, " games)"] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-red-500/30 mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm", children: error }) })), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "Selected Games" }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-32 overflow-y-auto space-y-2", children: selectedGamesData.map(game => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-2 glass-morphism rounded-lg border border-white/10", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gray-700 rounded flex-shrink-0 overflow-hidden", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-white font-medium truncate", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: game.genres?.map(g => g.name).slice(0, 2).join(', ') || 'No genres' })] })] }, game.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "Select Action" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedAction('status'), className: `p-3 rounded-lg border transition-all ${selectedAction === 'status'
                                                    ? 'border-gaming-primary bg-gaming-primary/20 text-gaming-primary'
                                                    : 'border-white/20 bg-white/10 text-gray-300 hover:border-gaming-primary/50'}`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "\uD83C\uDFAE Change Status" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedAction('favorite'), className: `p-3 rounded-lg border transition-all ${selectedAction === 'favorite'
                                                    ? 'border-gaming-primary bg-gaming-primary/20 text-gaming-primary'
                                                    : 'border-white/20 bg-white/10 text-gray-300 hover:border-gaming-primary/50'}`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "\u2B50 Toggle Favorite" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedAction('tags'), className: `p-3 rounded-lg border transition-all ${selectedAction === 'tags'
                                                    ? 'border-gaming-primary bg-gaming-primary/20 text-gaming-primary'
                                                    : 'border-white/20 bg-white/10 text-gray-300 hover:border-gaming-primary/50'}`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "\uD83C\uDFF7\uFE0F Add Tags" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedAction('platforms'), className: `p-3 rounded-lg border transition-all ${selectedAction === 'platforms'
                                                    ? 'border-gaming-primary bg-gaming-primary/20 text-gaming-primary'
                                                    : 'border-white/20 bg-white/10 text-gray-300 hover:border-gaming-primary/50'}`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "\uD83D\uDCBB Set Platforms" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedAction('delete'), className: `p-3 rounded-lg border transition-all ${selectedAction === 'delete'
                                                    ? 'border-red-500 bg-red-500/20 text-red-400'
                                                    : 'border-white/20 bg-white/10 text-gray-300 hover:border-red-500/50'}`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "\uD83D\uDDD1\uFE0F Delete Games" }) })] })] }), selectedAction === 'status' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Set Play Status" }), (0, jsx_runtime_1.jsxs)("select", { value: actionData.status, onChange: (e) => setActionData(prev => ({ ...prev, status: e.target.value })), className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", children: [(0, jsx_runtime_1.jsx)("option", { value: "unplayed", children: "Unplayed" }), (0, jsx_runtime_1.jsx)("option", { value: "playing", children: "Playing" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "paused", children: "Paused" }), (0, jsx_runtime_1.jsx)("option", { value: "abandoned", children: "Abandoned" })] })] })), selectedAction === 'favorite' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Toggle Favorite Status" }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-3 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: actionData.isFavorite, onChange: (e) => setActionData(prev => ({ ...prev, isFavorite: e.target.checked })), className: "rounded border-white/20 bg-white/10 text-gaming-primary focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-300", children: ["Mark as ", actionData.isFavorite ? 'Favorite' : 'Not Favorite'] })] })] })), selectedAction === 'tags' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Add Tags" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: actionData.tags, onChange: (e) => setActionData(prev => ({ ...prev, tags: e.target.value })), placeholder: "Enter tags (comma separated)", className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" })] })), selectedAction === 'platforms' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Set Platforms" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: ['steam', 'epic', 'gog', 'manual'].map((platform) => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: actionData.platforms.includes(platform), onChange: (e) => {
                                                        const platforms = e.target.checked
                                                            ? [...actionData.platforms, platform]
                                                            : actionData.platforms.filter(p => p !== platform);
                                                        setActionData(prev => ({ ...prev, platforms }));
                                                    }, className: "rounded border-white/20 bg-white/10 text-gaming-primary focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300 capitalize", children: platform })] }, platform))) })] })), selectedAction === 'delete' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-red-500/30", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-red-400 font-medium mb-3", children: "\u26A0\uFE0F Delete Confirmation" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300 mb-4", children: ["This will permanently delete ", selectedGames.length, " game(s) and all associated data. This action cannot be undone!"] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t border-white/10", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleBulkAction, disabled: isLoading || selectedGames.length === 0 || (selectedAction === 'delete' && selectedGames.length > 10), className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Loading_1.Loading, { message: "", size: "sm" }), "Processing..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [selectedAction === 'delete' ? '🗑️ Delete' : '⚡ Apply', selectedAction === 'delete' ? `${selectedGames.length} Games` : 'to Selected'] })) })] })] })] }) }) }));
};
exports.BulkOperations = BulkOperations;
