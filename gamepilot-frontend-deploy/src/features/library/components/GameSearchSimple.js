"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSearch = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GameSearch = ({ searchTerm, onSearchChange, onSortChange }) => {
    const [sortBy, setSortBy] = (0, react_1.useState)('title');
    const handleSortChange = (sort) => {
        setSortBy(sort);
        onSortChange?.(sort);
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearchChange(searchTerm);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-6", children: "Search Games" }), (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSearchSubmit, className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: (e) => onSearchChange(e.target.value), placeholder: "Search games...", className: "flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsxs)("select", { value: sortBy, onChange: (e) => handleSortChange(e.target.value), className: "px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", children: [(0, jsx_runtime_1.jsx)("option", { value: "title", children: "Title" }), (0, jsx_runtime_1.jsx)("option", { value: "rating", children: "Rating" }), (0, jsx_runtime_1.jsx)("option", { value: "playtime", children: "Playtime" }), (0, jsx_runtime_1.jsx)("option", { value: "lastPlayed", children: "Last Played" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-4 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-secondary transition-colors", children: "Search" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: searchTerm && ((0, jsx_runtime_1.jsxs)("p", { children: ["Searching for: ", (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: searchTerm })] })) })] }));
};
exports.GameSearch = GameSearch;
