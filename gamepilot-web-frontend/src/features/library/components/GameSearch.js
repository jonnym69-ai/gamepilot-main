"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSearch = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GameSearch = ({ searchTerm, onSearchChange, onSortChange, totalCount = 0, filteredCount = 0 }) => {
    const [sortBy, setSortBy] = (0, react_1.useState)('title');
    const [sortDirection, setSortDirection] = (0, react_1.useState)('asc');
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const sortOptions = [
        { field: 'title', label: 'Title', icon: '📝' },
        { field: 'releaseDate', label: 'Release Date', icon: '📅' },
        { field: 'playtime', label: 'Playtime', icon: '⏱️' },
        { field: 'rating', label: 'Rating', icon: '⭐' },
        { field: 'lastPlayed', label: 'Last Played', icon: '🎮' }
    ];
    const handleSortFieldChange = (field) => {
        if (sortBy === field) {
            // Toggle direction if same field
            const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            setSortDirection(newDirection);
            onSortChange?.(`${field}-${newDirection}`);
        }
        else {
            // Change field and reset to asc
            setSortBy(field);
            setSortDirection('asc');
            onSortChange?.(`${field}-asc`);
        }
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearchChange(searchTerm);
    };
    const handleClearSearch = () => {
        onSearchChange('');
    };
    const sortOption = {
        field: sortBy,
        direction: sortDirection
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-6", children: "Search Games" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSearchSubmit, className: "mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex gap-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: (e) => onSearchChange(e.target.value), onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), placeholder: "Search games...", className: `
                w-full px-4 py-2 pr-10 bg-gray-800/50 border border-gray-600 rounded-lg
                text-white placeholder-gray-400 transition-all duration-200
                focus:outline-none focus:border-gaming-accent focus:bg-gray-800/70
                ${isFocused ? 'ring-2 ring-gaming-accent/20' : ''}
              ` }), searchTerm && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleClearSearch, className: "absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "\u2715" }) }))] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 text-sm text-gray-400", children: ["Press ", (0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 bg-gray-700 rounded text-xs", children: "Ctrl+K" }), " to focus search"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 mb-2", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-300", children: "Sort by:" }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-2", children: sortOptions.map((option) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleSortFieldChange(option.field), className: `
                px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2
                ${sortOption.field === option.field
                                ? 'bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'}
              `, children: [(0, jsx_runtime_1.jsx)("span", { children: option.icon }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: option.label }), sortOption.field === option.field && ((0, jsx_runtime_1.jsx)("span", { className: "ml-auto", children: sortOption.direction === 'asc' ? '↑' : '↓' }))] }, option.field))) })] }), (totalCount > 0 || searchTerm) && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: filteredCount === totalCount ? ((0, jsx_runtime_1.jsxs)("span", { children: ["Showing all ", totalCount.toLocaleString(), " games"] })) : ((0, jsx_runtime_1.jsxs)("span", { children: ["Showing ", filteredCount.toLocaleString(), " of ", totalCount.toLocaleString(), " games"] })) }), searchTerm && ((0, jsx_runtime_1.jsxs)("div", { className: "text-accent-400", children: ["Searching for \"", (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: searchTerm }), "\""] }))] }) }))] }));
};
exports.GameSearch = GameSearch;
