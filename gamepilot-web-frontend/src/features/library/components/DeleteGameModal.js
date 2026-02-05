"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGameModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ErrorBoundary_1 = require("../../../components/ErrorBoundary");
const Loading_1 = require("../../../components/Loading");
const DeleteGameModal = ({ isOpen, onClose, game, onDeleteGame }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [confirmationText, setConfirmationText] = (0, react_1.useState)('');
    const handleConfirm = async () => {
        if (!game)
            return;
        setIsLoading(true);
        setError(null);
        try {
            await onDeleteGame(game.id);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete game');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleConfirmationChange = (e) => {
        setConfirmationText(e.target.value);
    };
    if (!isOpen || !game)
        return null;
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 max-w-md w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-white/10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white", children: "Delete Game" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-red-500/30 mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm", children: error }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-1", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: game.genres?.map(g => g.name).join(', ') || 'No genres' }), game.hoursPlayed && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: [game.hoursPlayed, " hours played"] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-yellow-500/30 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl text-yellow-400", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-yellow-400 font-medium mb-2", children: "This action cannot be undone!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300 mb-3", children: "All game data, including playtime, ratings, and notes will be permanently deleted." })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: ["Type ", (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary font-bold", children: "DELETE" }), " to confirm:"] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: confirmationText, onChange: handleConfirmationChange, placeholder: "Type DELETE to confirm", className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleConfirm, disabled: isLoading || confirmationText !== 'DELETE', className: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Loading_1.Loading, { message: "", size: "sm" }), "Deleting..."] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "\uD83D\uDDD1\uFE0F Delete Game" })) })] })] })] }) }) }));
};
exports.DeleteGameModal = DeleteGameModal;
