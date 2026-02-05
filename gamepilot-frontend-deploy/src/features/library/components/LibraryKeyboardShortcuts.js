"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardShortcutsHelp = exports.LibraryKeyboardShortcuts = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useKeyboardShortcuts_1 = require("../../../hooks/useKeyboardShortcuts");
const LibraryKeyboardShortcuts = ({ onSearchFocus, onAddGame, onImportSteam, onToggleStats, onSelectAll, onDeselectAll, onDeleteSelected, onToggleBulkSelect, selectedCount, isBulkSelectMode }) => {
    // Define keyboard shortcuts
    const shortcuts = [
        // Search
        {
            key: '/',
            description: 'Focus search',
            action: () => onSearchFocus()
        },
        // Add game
        {
            key: 'n',
            ctrlKey: true,
            description: 'Add new game',
            action: () => onAddGame()
        },
        // Import Steam
        {
            key: 'i',
            ctrlKey: true,
            description: 'Import Steam games',
            action: () => onImportSteam()
        },
        // Toggle Stats
        {
            key: 'd',
            ctrlKey: true,
            description: 'Toggle stats dashboard',
            action: () => onToggleStats()
        },
        // Bulk select
        {
            key: 'a',
            ctrlKey: true,
            description: 'Select all (or toggle bulk select)',
            action: () => {
                if (isBulkSelectMode) {
                    onSelectAll();
                }
                else {
                    onToggleBulkSelect();
                }
            }
        },
        // Deselect all
        {
            key: 'Escape',
            description: 'Deselect all / Exit bulk select',
            action: () => {
                if (isBulkSelectMode) {
                    onDeselectAll();
                }
            }
        },
        // Delete selected
        {
            key: 'Delete',
            description: 'Delete selected games',
            action: () => {
                if (isBulkSelectMode && selectedCount > 0) {
                    onDeleteSelected();
                }
            }
        },
        // Help
        {
            key: '?',
            description: 'Show keyboard shortcuts',
            action: () => {
                // Toggle help modal or show shortcuts
                console.log('Show keyboard shortcuts help');
            }
        }
    ];
    (0, useKeyboardShortcuts_1.useKeyboardShortcuts)(shortcuts);
    return null; // This component doesn't render anything, just handles shortcuts
};
exports.LibraryKeyboardShortcuts = LibraryKeyboardShortcuts;
// Help modal component for shortcuts
const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
    if (!isOpen)
        return null;
    const shortcuts = [
        { key: '/', description: 'Focus search' },
        { key: 'Ctrl + N', description: 'Add new game' },
        { key: 'Ctrl + I', description: 'Import Steam games' },
        { key: 'Ctrl + D', description: 'Toggle stats dashboard' },
        { key: 'Ctrl + A', description: 'Select all / Toggle bulk select' },
        { key: 'Escape', description: 'Deselect all / Exit bulk select' },
        { key: 'Delete', description: 'Delete selected games' },
        { key: '?', description: 'Show this help' }
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl max-w-md w-full p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white", children: "Keyboard Shortcuts" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors p-2", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u2715" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: shortcuts.map((shortcut, index) => ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between p-3 bg-gray-800/50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("kbd", { className: "px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm font-mono text-gray-200", children: shortcut.key }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: shortcut.description })] }) }, index))) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-4 border-t border-gray-700/50", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400 text-center", children: ["Press ", (0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs", children: "?" }), " anytime to show this help"] }) })] }) }));
};
exports.KeyboardShortcutsHelp = KeyboardShortcutsHelp;
