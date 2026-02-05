"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchFilter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ErrorBoundary_1 = require("../../../components/ErrorBoundary");
const AdvancedSearchFilter = ({ games, onFiltersChange, onSearchChange }) => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const [filters, setFilters] = (0, react_1.useState)({
        searchTerm: '',
        genres: [],
        platforms: [],
        playStatus: [],
        tags: [],
        ratingRange: [0, 5],
        playtimeRange: [0, 1000],
        dateRange: {
            start: null,
            end: null
        },
        sortBy: 'title',
        sortOrder: 'asc'
    });
    // Get unique values from games
    const uniqueGenres = (0, react_1.useMemo)(() => {
        const genres = new Set();
        games.forEach(game => {
            game.genres?.forEach(genre => {
                genres.add(genre.name);
            });
        });
        return Array.from(genres).sort();
    }, [games]);
    const uniquePlatforms = (0, react_1.useMemo)(() => {
        const platforms = new Set();
        games.forEach(game => {
            game.platforms?.forEach(platform => {
                platforms.add(platform.code);
            });
        });
        return Array.from(platforms).sort();
    }, [games]);
    // Apply filters to games
    const filteredGames = (0, react_1.useMemo)(() => {
        return games.filter(game => {
            // Search filter
            if (filters.searchTerm && !game.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
                return false;
            }
            // Genre filter
            if (filters.genres.length > 0) {
                const gameGenres = game.genres?.map(g => g.name) || [];
                const hasMatchingGenre = filters.genres.some(genre => gameGenres.includes(genre));
                if (!hasMatchingGenre)
                    return false;
            }
            // Platform filter
            if (filters.platforms.length > 0) {
                const gamePlatforms = game.platforms?.map(p => p.code) || [];
                const hasMatchingPlatform = filters.platforms.some(platform => gamePlatforms.includes(platform));
                if (!hasMatchingPlatform)
                    return false;
            }
            // Play status filter
            if (filters.playStatus.length > 0 && !filters.playStatus.includes(game.playStatus)) {
                return false;
            }
            // Tags filter
            if (filters.tags.length > 0) {
                const gameTags = game.tags || [];
                const hasMatchingTag = filters.tags.some(tag => gameTags.includes(tag));
                if (!hasMatchingTag)
                    return false;
            }
            // Rating filter
            const rating = game.userRating || 0;
            if (rating < filters.ratingRange[0] || rating > filters.ratingRange[1]) {
                return false;
            }
            // Playtime filter
            const playtime = game.hoursPlayed || 0;
            if (playtime < filters.playtimeRange[0] || playtime > filters.playtimeRange[1]) {
                return false;
            }
            // Date range filter
            if (filters.dateRange.start && game.addedAt < filters.dateRange.start) {
                return false;
            }
            if (filters.dateRange.end && game.addedAt > filters.dateRange.end) {
                return false;
            }
            return true;
        });
    }, [games, filters]);
    // Sort filtered games
    const sortedGames = (0, react_1.useMemo)(() => {
        const sorted = [...filteredGames];
        switch (filters.sortBy) {
            case 'title':
                return sorted.sort((a, b) => {
                    const comparison = a.title.localeCompare(b.title);
                    return filters.sortOrder === 'desc' ? -comparison : comparison;
                });
            case 'rating':
                return sorted.sort((a, b) => {
                    const ratingA = a.userRating || 0;
                    const ratingB = b.userRating || 0;
                    const comparison = ratingA - ratingB;
                    return filters.sortOrder === 'desc' ? -comparison : comparison;
                });
            case 'playtime':
                return sorted.sort((a, b) => {
                    const playtimeA = a.hoursPlayed || 0;
                    const playtimeB = b.hoursPlayed || 0;
                    const comparison = playtimeA - playtimeB;
                    return filters.sortOrder === 'desc' ? -comparison : comparison;
                });
            case 'lastPlayed':
                return sorted.sort((a, b) => {
                    const dateA = a.lastPlayed?.getTime() || 0;
                    const dateB = b.lastPlayed?.getTime() || 0;
                    const comparison = dateA - dateB;
                    return filters.sortOrder === 'desc' ? -comparison : comparison;
                });
            case 'dateAdded':
                return sorted.sort((a, b) => {
                    const dateA = a.addedAt.getTime();
                    const dateB = b.addedAt.getTime();
                    const comparison = dateA - dateB;
                    return filters.sortOrder === 'desc' ? -comparison : comparison;
                });
            case 'genre':
                return sorted.sort((a, b) => {
                    const genreA = a.genres?.[0]?.name || '';
                    const genreB = b.genres?.[0]?.name || '';
                    const comparison = genreA.localeCompare(genreB);
                    return filters.sortOrder === 'desc' ? -comparison : comparison;
                });
            default:
                return sorted;
        }
    }, [filteredGames, filters.sortBy, filters.sortOrder]);
    const handleFilterChange = (0, react_1.useCallback)((newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFiltersChange(updatedFilters);
    }, [filters, onFiltersChange]);
    const handleSearchChange = (0, react_1.useCallback)((searchTerm) => {
        handleFilterChange({ searchTerm });
        onSearchChange(searchTerm);
    }, [handleFilterChange, onSearchChange]);
    const clearFilters = (0, react_1.useCallback)(() => {
        const defaultFilters = {
            searchTerm: '',
            genres: [],
            platforms: [],
            playStatus: [],
            tags: [],
            ratingRange: [0, 5],
            playtimeRange: [0, 1000],
            dateRange: {
                start: null,
                end: null
            },
            sortBy: 'title',
            sortOrder: 'asc'
        };
        setFilters(defaultFilters);
        onFiltersChange(defaultFilters);
        onSearchChange('');
    }, [setFilters, onFiltersChange, onSearchChange]);
    const activeFilterCount = (0, react_1.useMemo)(() => {
        let count = 0;
        if (filters.searchTerm)
            count++;
        if (filters.genres.length > 0)
            count++;
        if (filters.platforms.length > 0)
            count++;
        if (filters.playStatus.length > 0)
            count++;
        if (filters.tags.length > 0)
            count++;
        if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5)
            count++;
        if (filters.playtimeRange[0] > 0 || filters.playtimeRange[1] < 1000)
            count++;
        if (filters.dateRange.start || filters.dateRange.end)
            count++;
        return count;
    }, [filters]);
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: filters.searchTerm, onChange: (e) => handleSearchChange(e.target.value), placeholder: "Search games by title...", className: "w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("span", { className: "absolute left-3 top-1/2 text-gray-400", children: "\uD83D\uDD0D" })] }) }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsExpanded(!isExpanded), className: "w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors mb-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-white", children: [isExpanded ? 'Hide Filters' : 'Show Filters', activeFilterCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "ml-2 px-2 py-1 bg-gaming-primary text-white text-xs rounded-full", children: activeFilterCount }))] }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: isExpanded ? '▲' : '▼' })] }), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 animate-in", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto", children: uniqueGenres.map(genre => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.genres.includes(genre), onChange: (e) => {
                                                    const genres = e.target.checked
                                                        ? [...filters.genres, genre]
                                                        : filters.genres.filter(g => g !== genre);
                                                    handleFilterChange({ genres });
                                                }, className: "rounded border-white/20 bg-white/10 text-gaming-primary focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: genre })] }, genre))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Platforms" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: uniquePlatforms.map(platform => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.platforms.includes(platform), onChange: (e) => {
                                                    const platforms = e.target.checked
                                                        ? [...filters.platforms, platform]
                                                        : filters.platforms.filter(p => p !== platform);
                                                    handleFilterChange({ platforms });
                                                }, className: "rounded border-white/20 bg-white/10 text-gaming-primary focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300 capitalize", children: platform })] }, platform))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Play Status" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: ['unplayed', 'playing', 'completed', 'paused', 'abandoned'].map(status => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.playStatus.includes(status), onChange: (e) => {
                                                    const playStatus = e.target.checked
                                                        ? [...filters.playStatus, status]
                                                        : filters.playStatus.filter(s => s !== status);
                                                    handleFilterChange({ playStatus });
                                                }, className: "rounded border-white/20 bg-white/10 text-gaming-primary focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300 capitalize", children: status })] }, status))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Rating Range" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "number", min: "0", max: "5", value: filters.ratingRange[0], onChange: (e) => handleFilterChange({
                                                ratingRange: [parseInt(e.target.value) || 0, filters.ratingRange[1]]
                                            }), placeholder: "Min rating", "aria-label": "Minimum rating", className: "w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "to" }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "0", max: "5", value: filters.ratingRange[1], onChange: (e) => handleFilterChange({
                                                ratingRange: [filters.ratingRange[0], parseInt(e.target.value) || 5]
                                            }), placeholder: "Max rating", "aria-label": "Maximum rating", className: "w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Sort By" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm text-gray-300 mb-2", children: "Sort Field" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.sortBy, onChange: (e) => handleFilterChange({ sortBy: e.target.value }), "aria-label": "Sort games by", className: "w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", children: [(0, jsx_runtime_1.jsx)("option", { value: "title", children: "Title" }), (0, jsx_runtime_1.jsx)("option", { value: "rating", children: "Rating" }), (0, jsx_runtime_1.jsx)("option", { value: "playtime", children: "Playtime" }), (0, jsx_runtime_1.jsx)("option", { value: "lastPlayed", children: "Last Played" }), (0, jsx_runtime_1.jsx)("option", { value: "dateAdded", children: "Date Added" }), (0, jsx_runtime_1.jsx)("option", { value: "genre", children: "Genre" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm text-gray-300 mb-2", children: "Order" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.sortOrder, onChange: (e) => handleFilterChange({ sortOrder: e.target.value }), "aria-label": "Sort order", className: "w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", children: [(0, jsx_runtime_1.jsx)("option", { value: "asc", children: "Ascending" }), (0, jsx_runtime_1.jsx)("option", { value: "desc", children: "Descending" })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pt-4 border-t border-white/10", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-400", children: [sortedGames.length, " of ", games.length, " games"] }), (0, jsx_runtime_1.jsx)("button", { onClick: clearFilters, className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Clear All Filters" })] })] }))] }) }));
};
exports.AdvancedSearchFilter = AdvancedSearchFilter;
