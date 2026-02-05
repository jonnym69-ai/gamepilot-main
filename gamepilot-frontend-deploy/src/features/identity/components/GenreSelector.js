"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const types_1 = require("../types");
const localStorage_1 = require("../services/localStorage");
const GenreSelector = ({ onGenresUpdate }) => {
    const [userGenres, setUserGenres] = (0, react_1.useState)([]);
    const [customGenres, setCustomGenres] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [showAddGenre, setShowAddGenre] = (0, react_1.useState)(false);
    const [editingGenre, setEditingGenre] = (0, react_1.useState)(null);
    const localStorageService = new localStorage_1.LocalStorageService();
    const [newGenre, setNewGenre] = (0, react_1.useState)({
        id: '',
        name: '',
        tags: []
    });
    (0, react_1.useEffect)(() => {
        const loadGenres = () => {
            const savedGenres = localStorageService.getUserGenres();
            setUserGenres(savedGenres);
            // Load custom genres (those not in predefined GENRES)
            const custom = savedGenres.filter(genre => !types_1.GENRES.find(predefined => predefined.id === genre.id));
            setCustomGenres(custom.map(g => ({ id: g.id, name: g.name, tags: g.tags })));
            setIsLoading(false);
        };
        loadGenres();
    }, []);
    const handleGenreToggle = (genreId) => {
        let updatedGenres = [...userGenres];
        const existingGenre = userGenres.find(g => g.id === genreId);
        if (existingGenre) {
            // Remove genre
            updatedGenres = userGenres.filter(g => g.id !== genreId);
        }
        else {
            // Add genre with default preference
            const genreTemplate = [...types_1.GENRES].find(g => g.id === genreId);
            if (genreTemplate) {
                const newGenre = {
                    ...genreTemplate,
                    preference: 50 // Default preference
                };
                updatedGenres = [...userGenres, newGenre];
            }
            else {
                updatedGenres = userGenres;
            }
        }
        setUserGenres(updatedGenres);
        localStorageService.setUserGenres(updatedGenres);
        onGenresUpdate?.(updatedGenres);
    };
    const handleAddCustomGenre = () => {
        if (!newGenre.name?.trim())
            return;
        const genre = {
            id: `custom-${Date.now()}`,
            name: newGenre.name.trim(),
            tags: newGenre.tags || []
        };
        setCustomGenres([...customGenres, genre]);
        setNewGenre({ id: '', name: '', tags: [] });
        setShowAddGenre(false);
    };
    const handleUpdateCustomGenre = (genreId, updates) => {
        setCustomGenres(customGenres.map(genre => genre.id === genreId ? { ...genre, ...updates } : genre));
        // Also update in userGenres if it's selected
        setUserGenres(userGenres.map(genre => genre.id === genreId ? { ...genre, ...updates } : genre));
    };
    const handleRemoveCustomGenre = (genreId) => {
        setCustomGenres(customGenres.filter(genre => genre.id !== genreId));
        // Also remove from userGenres if it's selected
        const updatedUserGenres = userGenres.filter(g => g.id !== genreId);
        setUserGenres(updatedUserGenres);
        localStorageService.setUserGenres(updatedUserGenres);
        onGenresUpdate?.(updatedUserGenres);
    };
    const handleReorderGenres = (fromIndex, toIndex) => {
        const reordered = [...userGenres];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        setUserGenres(reordered);
        localStorageService.setUserGenres(reordered);
        onGenresUpdate?.(reordered);
    };
    const handlePreferenceChange = (genreId, preference) => {
        const updatedGenres = userGenres.map(genre => genre.id === genreId ? { ...genre, preference } : genre);
        setUserGenres(updatedGenres);
        localStorageService.setUserGenres(updatedGenres);
        onGenresUpdate?.(updatedGenres);
    };
    const getPreferenceColor = (preference) => {
        if (preference >= 80)
            return 'from-green-500 to-emerald-600';
        if (preference >= 60)
            return 'from-blue-500 to-cyan-600';
        if (preference >= 40)
            return 'from-yellow-500 to-orange-600';
        return 'from-gray-500 to-gray-600';
    };
    const getPreferenceLabel = (preference) => {
        if (preference >= 80)
            return 'Love';
        if (preference >= 60)
            return 'Like';
        if (preference >= 40)
            return 'Neutral';
        return 'Dislike';
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAD" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Loading genres..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-semibold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAD" }), "Favorite Genres"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [userGenres.length, " selected"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-gray-800/50 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300", children: "Select your favorite game genres and rate your preference level. This helps us provide better recommendations." }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [...types_1.GENRES, ...customGenres].map((genre) => {
                    const userGenre = userGenres.find(g => g.id === genre.id);
                    const isSelected = !!userGenre;
                    const preference = userGenre?.preference || 0;
                    const isCustom = customGenres.find(g => g.id === genre.id);
                    return ((0, jsx_runtime_1.jsxs)("div", { className: `
                relative group cursor-pointer transition-all duration-300 transform
                ${isSelected ? 'scale-105' : 'scale-100'}
                ${isSelected ? 'ring-2 ring-gaming-accent' : ''}
              `, onClick: () => handleGenreToggle(genre.id), children: [(0, jsx_runtime_1.jsxs)("div", { className: `
                glass-morphism rounded-lg p-4 border-2 transition-all duration-200
                ${isSelected
                                    ? 'border-gaming-accent bg-gaming-accent/10'
                                    : 'border-gray-700 hover:border-gray-600'}
              `, children: [(0, jsx_runtime_1.jsxs)("div", { className: `
                  w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl
                  bg-gradient-to-r ${isSelected ? getPreferenceColor(preference) : 'from-gray-500 to-gray-600'}
                `, children: [genre.id === 'action' && '⚔️', genre.id === 'adventure' && '🗺️', genre.id === 'rpg' && '🐉', genre.id === 'strategy' && '♟️', genre.id === 'simulation' && '🏗️', genre.id === 'sports' && '⚽', genre.id === 'racing' && '🏎️', genre.id === 'puzzle' && '🧩', genre.id === 'platformer' && '🦘', genre.id === 'fps' && '🔫', genre.id === 'moba' && '👥', genre.id === 'roguelike' && '🎲', genre.id === 'horror' && '👻', genre.id === 'indie' && '🎨', genre.id === 'casual' && '😊', isCustom && '🎮'] }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-white font-medium text-sm text-center mb-2", children: [genre.name, isCustom && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-xs text-gaming-accent", children: "Custom" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1 justify-center mb-3", children: genre.tags?.slice(0, 2).map((tag) => ((0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full", children: tag }, tag))) }), isSelected && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Preference" }), (0, jsx_runtime_1.jsx)("span", { className: `font-medium ${getPreferenceColor(preference).split(' ')[0].replace('from-', 'text-')}`, children: getPreferenceLabel(preference) })] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "100", step: "10", value: preference, onChange: (e) => {
                                                    e.stopPropagation();
                                                    handlePreferenceChange(genre.id, parseInt(e.target.value));
                                                }, className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gaming-accent", "aria-label": `Preference level for ${genre.name} genre`, title: `Preference level for ${genre.name} genre`, style: {
                                                    background: `linear-gradient(to right, ${getPreferenceColor(preference).replace('from-', '').replace(' to-', ', ')}) 0%, ${getPreferenceColor(preference).replace('from-', '').replace(' to-', ', ')} ${preference}%, #374151 ${preference}%, #374151 100%)`
                                                } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "0" }), (0, jsx_runtime_1.jsx)("span", { children: preference }), (0, jsx_runtime_1.jsx)("span", { children: "100" })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2", children: isSelected ? ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-gaming-accent rounded-full flex items-center justify-center text-white text-xs", children: "\u2713" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 text-xs", children: "+" })) }), isCustom && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: (e) => {
                                                    e.stopPropagation();
                                                    setEditingGenre(genre.id);
                                                }, className: "w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-1", children: "\u270F\uFE0F" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleRemoveCustomGenre(genre.id);
                                                }, className: "w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs", children: "\u00D7" })] }))] }), isSelected && ((0, jsx_runtime_1.jsx)("div", { className: `
                  absolute inset-0 rounded-lg bg-gradient-to-r ${getPreferenceColor(preference)}
                  opacity-20 blur-xl -z-10
                ` }))] }, genre.id));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 border-t border-gray-700 pt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white", children: "Custom Genres" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowAddGenre(true), className: "px-4 py-2 bg-gaming-accent text-white rounded-lg hover:opacity-90 transition-opacity", children: "+ Add Custom Genre" })] }), showAddGenre && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-white mb-3", children: "Add New Custom Genre" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: newGenre.name || '', onChange: (e) => setNewGenre({ ...newGenre, name: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Genre name", "aria-label": "New genre name", title: "Enter name for new custom genre" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newGenre.tags?.join(', ') || '', onChange: (e) => setNewGenre({
                                            ...newGenre,
                                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                        }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Tags (comma-separated)", "aria-label": "Tags for new genre", title: "Enter tags for new custom genre" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                            setShowAddGenre(false);
                                            setNewGenre({ id: '', name: '', tags: [] });
                                        }, className: "px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleAddCustomGenre, disabled: !newGenre.name?.trim(), className: "px-3 py-1 bg-gaming-accent text-white rounded hover:opacity-90 transition-opacity text-sm disabled:opacity-50", children: "Add Genre" })] })] })), editingGenre && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-white mb-3", children: "Edit Custom Genre" }), (() => {
                                const genre = customGenres.find(g => g.id === editingGenre);
                                if (!genre)
                                    return null;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: genre.name, onChange: (e) => handleUpdateCustomGenre(genre.id, { name: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Genre name", "aria-label": `Edit genre name for ${genre.name}`, title: `Edit genre name for ${genre.name}` }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: genre.tags?.join(', ') || '', onChange: (e) => handleUpdateCustomGenre(genre.id, {
                                                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                            }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Tags (comma-separated)", "aria-label": `Edit tags for ${genre.name}`, title: `Edit tags for ${genre.name}` })] }));
                            })(), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 mt-3", children: (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setEditingGenre(null), className: "px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm", children: "Done" }) })] })), userGenres.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-white mb-3", children: "Reorder Selected Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: userGenres.map((genre, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium flex-1", children: genre.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [index > 0 && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleReorderGenres(index, index - 1), className: "px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs", children: "\u2191" })), index < userGenres.length - 1 && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleReorderGenres(index, index + 1), className: "px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs", children: "\u2193" }))] })] }, genre.id))) })] }))] }), userGenres.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 p-4 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Your Genre Profile" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: userGenres
                            .sort((a, b) => b.preference - a.preference)
                            .slice(0, 5)
                            .map((genre) => ((0, jsx_runtime_1.jsxs)("span", { className: `
                    px-3 py-1 rounded-full text-xs font-medium
                    bg-gradient-to-r ${getPreferenceColor(genre.preference)} text-white
                  `, children: [genre.name, " (", genre.preference, "%)"] }, genre.id))) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: "Top genres influence your recommendations the most" })] })), userGenres.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "No genres selected yet. Click on genres above to build your gaming profile." }) }))] }));
};
exports.GenreSelector = GenreSelector;
