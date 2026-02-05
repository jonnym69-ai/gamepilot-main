"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyLibraryState = EmptyLibraryState;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SteamImportInline_1 = require("./SteamImportInline");
function EmptyLibraryState({ isSearchResult, onImportSteam }) {
    const [showSteamImport, setShowSteamImport] = (0, react_1.useState)(false);
    if (isSearchResult) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-2xl p-12 text-center border border-gray-700/30", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-6", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-3", children: "No games found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-8 text-base max-w-md mx-auto", children: "Try adjusting your search terms or filters to find what you're looking for." }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => window.history.back(), className: "px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-200", children: "Clear Search" }) })] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: showSteamImport && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Import Steam Library" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowSteamImport(false), className: "text-gray-400 hover:text-white text-2xl leading-none", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)(SteamImportInline_1.SteamImportInline, { onComplete: (_count) => {
                                setShowSteamImport(false);
                                onImportSteam(); // Call original handler
                            }, onError: (error) => {
                                console.error('Steam import error:', error);
                                setShowSteamImport(false);
                            } })] }) }) })) }));
}
