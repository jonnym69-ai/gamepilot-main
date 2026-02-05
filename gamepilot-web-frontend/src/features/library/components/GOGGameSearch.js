"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOGGameSearchComponent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const gogApi_1 = require("../../../services/gogApi");
const GOGGameSearchComponent = ({ onGameSelect, placeholder = "Search GOG games..." }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [searchResults, setSearchResults] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isDropdownOpen, setIsDropdownOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const handleSearch = async () => {
            if (searchTerm.trim().length < 2) {
                setSearchResults([]);
                setIsDropdownOpen(false);
                return;
            }
            setIsLoading(true);
            try {
                const results = await gogApi_1.GOGGameSearch.searchWithCache(searchTerm);
                setSearchResults(results.slice(0, 8)); // Limit to 8 results
                setIsDropdownOpen(true);
            }
            catch (error) {
                console.error('GOG search error:', error);
                setSearchResults([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        const debounceTimer = setTimeout(handleSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);
    const handleGameClick = (game) => {
        onGameSelect(game);
        setSearchTerm('');
        setSearchResults([]);
        setIsDropdownOpen(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onFocus: () => searchTerm.trim().length >= 2 && setIsDropdownOpen(true), onKeyDown: handleKeyDown, className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", placeholder: placeholder }), isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-gaming-accent" }) }))] }), isDropdownOpen && searchResults.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto", children: searchResults.map((game) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handleGameClick(game), className: "flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0", children: [(0, jsx_runtime_1.jsx)("img", { src: game.image, alt: game.title, className: "w-12 h-12 rounded object-cover", onError: (e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/48x48/8b5cf6/ffffff?text=GOG';
                            } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium truncate", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm truncate", children: game.genres.slice(0, 2).join(', ') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gaming-accent text-sm font-medium", children: game.price === '0' ? 'Free' : `$${game.price}` }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-xs", children: game.platforms.slice(0, 2).join(', ') })] })] }, game.id))) })), isDropdownOpen && searchTerm.trim().length >= 2 && searchResults.length === 0 && !isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400 text-center", children: ["No GOG games found for \"", searchTerm, "\""] }) }))] }));
};
exports.GOGGameSearchComponent = GOGGameSearchComponent;
