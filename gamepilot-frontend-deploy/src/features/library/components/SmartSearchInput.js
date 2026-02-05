"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartSearchInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SmartSearchInput = ({ games, value, onChange, onSelectGame, placeholder = "Search games, genres, platforms...", className = "" }) => {
    const [showSuggestions, setShowSuggestions] = (0, react_1.useState)(false);
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const [highlightedIndex, setHighlightedIndex] = (0, react_1.useState)(-1);
    const inputRef = (0, react_1.useRef)(null);
    const suggestionsRef = (0, react_1.useRef)(null);
    // Generate suggestions based on search term
    (0, react_1.useEffect)(() => {
        if (value.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        const searchLower = value.toLowerCase();
        const filtered = games
            .filter(game => {
            const titleMatch = game.title.toLowerCase().includes(searchLower);
            const genreMatch = game.genres?.some(genre => {
                const genreName = typeof genre === 'string' ? genre : genre?.name || '';
                return genreName.toLowerCase().includes(searchLower);
            });
            const platformMatch = game.platforms?.some(platform => (platform.name || '').toLowerCase().includes(searchLower));
            const tagMatch = game.tags?.some(tag => (tag || '').toLowerCase().includes(searchLower));
            return titleMatch || genreMatch || platformMatch || tagMatch;
        })
            .slice(0, 8) // Limit to 8 suggestions
            .sort((a, b) => {
            // Prioritize exact title matches
            const aExact = a.title.toLowerCase() === searchLower;
            const bExact = b.title.toLowerCase() === searchLower;
            if (aExact && !bExact)
                return -1;
            if (!aExact && bExact)
                return 1;
            // Then prioritize title starts with
            const aStarts = a.title.toLowerCase().startsWith(searchLower);
            const bStarts = b.title.toLowerCase().startsWith(searchLower);
            if (aStarts && !bStarts)
                return -1;
            if (!aStarts && bStarts)
                return 1;
            // Finally alphabetical
            return a.title.localeCompare(b.title);
        });
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setHighlightedIndex(-1);
    }, [value, games]);
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions)
            return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    onSelectGame(suggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };
    // Handle click outside to close suggestions
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                !inputRef.current?.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSuggestionClick = (game) => {
        onSelectGame(game);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
    };
    const getHighlightText = (text, highlight) => {
        if (!highlight)
            return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, index) => part.toLowerCase() === highlight.toLowerCase()
            ? (0, jsx_runtime_1.jsx)("span", { className: "bg-gaming-primary/30 text-gaming-primary font-bold", children: part }, index)
            : part);
    };
    const getMatchType = (game, searchTerm) => {
        const searchLower = searchTerm.toLowerCase();
        if (game.title.toLowerCase().includes(searchLower))
            return 'title';
        if (game.genres?.some(genre => {
            const genreName = typeof genre === 'string' ? genre : genre?.name || '';
            return genreName.toLowerCase().includes(searchLower);
        }))
            return 'genre';
        if (game.platforms?.some(platform => (platform.name || '').toLowerCase().includes(searchLower)))
            return 'platform';
        if (game.tags?.some(tag => (tag || '').toLowerCase().includes(searchLower)))
            return 'tag';
        return 'other';
    };
    const getMatchIcon = (matchType) => {
        switch (matchType) {
            case 'title': return '🎮';
            case 'genre': return '🎭';
            case 'platform': return '🖥️';
            case 'tag': return '🏷️';
            default: return '🔍';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative ${className}`, ref: suggestionsRef, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDD0D" }) }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, type: "text", placeholder: placeholder, value: value, onChange: (e) => onChange(e.target.value), onKeyDown: handleKeyDown, onFocus: () => setShowSuggestions(suggestions.length > 0), className: "w-full pl-14 pr-12 py-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50 focus:bg-gray-800/70 text-lg rounded-xl border border-gray-700/50 focus:border-gaming-primary/50 transition-all duration-200" }), value && ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            onChange('');
                            setShowSuggestions(false);
                            inputRef.current?.focus();
                        }, className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u2715" }) }))] }), showSuggestions && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl z-50 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "max-h-96 overflow-y-auto", children: suggestions.map((game, index) => {
                            const matchType = getMatchType(game, value);
                            const isHighlighted = index === highlightedIndex;
                            return ((0, jsx_runtime_1.jsx)("div", { onClick: () => handleSuggestionClick(game), className: `px-4 py-3 cursor-pointer transition-all duration-150 border-b border-gray-800/50 last:border-b-0 ${isHighlighted
                                    ? 'bg-gaming-primary/20 border-gaming-primary/30'
                                    : 'hover:bg-gray-800/50'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-10 h-10 rounded-lg object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: getMatchIcon(matchType) }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-white truncate", children: getHighlightText(game.title, value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-400", children: [game.genres && game.genres.length > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 bg-gray-800 rounded", children: typeof game.genres[0] === 'string' ? game.genres[0] : game.genres[0].name })), game.platforms && game.platforms.length > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 bg-gray-800 rounded", children: game.platforms[0].name })), game.hoursPlayed && game.hoursPlayed > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-gaming-primary", children: [Math.floor(game.hoursPlayed), "h"] }))] })] })] }) }, game.id));
                        }) }), (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-gray-800/50 border-t border-gray-700/50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-400", children: [(0, jsx_runtime_1.jsxs)("span", { children: [suggestions.length, " results"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2191\u2193 Navigate" }), (0, jsx_runtime_1.jsx)("span", { children: "\u21B5 Select" }), (0, jsx_runtime_1.jsx)("span", { children: "ESC Close" })] })] }) })] }))] }));
};
exports.SmartSearchInput = SmartSearchInput;
