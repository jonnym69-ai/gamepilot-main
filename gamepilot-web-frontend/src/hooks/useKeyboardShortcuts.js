"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLibraryShortcuts = void 0;
exports.useKeyboardShortcuts = useKeyboardShortcuts;
exports.useKeyboardHelp = useKeyboardHelp;
const react_1 = require("react");
function useKeyboardShortcuts(shortcuts) {
    const handleKeyDown = (0, react_1.useCallback)((event) => {
        // Don't trigger shortcuts when user is typing in input fields
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
            return;
        }
        const matchingShortcut = shortcuts.find(shortcut => {
            const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
            const ctrlMatches = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
            const shiftMatches = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
            const altMatches = shortcut.altKey ? event.altKey : !event.altKey;
            return keyMatches && ctrlMatches && shiftMatches && altMatches;
        });
        if (matchingShortcut) {
            event.preventDefault();
            matchingShortcut.action();
        }
    }, [shortcuts]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
/**
 * Predefined keyboard shortcuts for the library
 */
const createLibraryShortcuts = ({ onSelectAll, onDeselectAll, onDeleteSelected, onFocusSearch, onAddGame, onImportSteam, onEscape }) => [
    {
        key: 'a',
        ctrlKey: true,
        action: onSelectAll,
        description: 'Select all games'
    },
    {
        key: 'd',
        ctrlKey: true,
        action: onDeselectAll,
        description: 'Deselect all games'
    },
    {
        key: 'Delete',
        action: onDeleteSelected,
        description: 'Delete selected games'
    },
    {
        key: 'f',
        ctrlKey: true,
        action: onFocusSearch,
        description: 'Focus search bar'
    },
    {
        key: 'n',
        ctrlKey: true,
        action: onAddGame,
        description: 'Add new game'
    },
    {
        key: 'i',
        ctrlKey: true,
        action: onImportSteam,
        description: 'Import Steam library'
    },
    {
        key: 'Escape',
        action: onEscape,
        description: 'Cancel current action'
    }
];
exports.createLibraryShortcuts = createLibraryShortcuts;
/**
 * Hook to display keyboard shortcuts help
 */
function useKeyboardHelp() {
    const [showHelp, setShowHelp] = (0, react_1.useState)(false);
    const toggleHelp = (0, react_1.useCallback)(() => {
        setShowHelp((prev) => !prev);
    }, []);
    // Add help shortcut
    useKeyboardShortcuts([
        {
            key: '?',
            action: toggleHelp,
            description: 'Show keyboard shortcuts'
        }
    ]);
    return { showHelp, toggleHelp };
}
