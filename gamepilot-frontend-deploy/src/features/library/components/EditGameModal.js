"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditGameModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ErrorBoundary_1 = require("../../../components/ErrorBoundary");
const Loading_1 = require("../../../components/Loading");
const MultiSelectDropdown_1 = require("../../../components/MultiSelectDropdown");
const TagsDropdown_1 = require("../../../components/TagsDropdown");
const static_data_1 = require("@gamepilot/static-data");
const EditGameModal = ({ isOpen, onClose, game, onUpdateGame }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        title: '',
        genres: [],
        moods: [],
        tags: [],
        platforms: [],
        playStatus: 'unplayed',
        hoursPlayed: 0,
        userRating: undefined,
        notes: '',
        coverImage: '',
        launcherId: '',
        isFavorite: false,
        totalPlaytime: undefined,
        averageRating: undefined,
        completionPercentage: undefined
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // Populate form when game changes
    (0, react_1.useEffect)(() => {
        if (game) {
            setFormData({
                title: game.title || '',
                genres: game.genres?.map((g) => g.name) || [],
                moods: game.moods || [], // Use game.moods directly as MoodId[]
                platforms: game.platforms?.map(p => p.code) || [],
                playStatus: game.playStatus || 'unplayed',
                tags: game.tags || [],
                hoursPlayed: game.hoursPlayed || 0,
                userRating: game.userRating || undefined,
                notes: game.notes || '',
                coverImage: game.coverImage || '',
                launcherId: game.launcherId || '',
                isFavorite: game.isFavorite || false,
                totalPlaytime: game.totalPlaytime || undefined,
                averageRating: game.averageRating || undefined,
                completionPercentage: game.completionPercentage || undefined
            });
        }
    }, [game]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!game)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const updates = {
                title: formData.title,
                genres: formData.genres.map(name => ({
                    id: name.toLowerCase().replace(/\s+/g, '-'),
                    name,
                    description: `${name} games`,
                    icon: '🎮',
                    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    tags: [name.toLowerCase()]
                })),
                platforms: formData.platforms.map(code => ({
                    id: code,
                    name: code,
                    code,
                    isConnected: false
                })),
                playStatus: formData.playStatus,
                tags: formData.tags,
                hoursPlayed: formData.hoursPlayed,
                userRating: formData.userRating || 0,
                notes: formData.notes,
                isFavorite: formData.isFavorite,
                emotionalTags: formData.moods.map(mood => mood),
                moods: formData.moods // Add moods field with MoodId[]
            };
            await onUpdateGame(game.id, updates);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update game');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    if (!isOpen || !game)
        return null;
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-white/10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white", children: "Edit Game" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-red-500/30", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm", children: error }) })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Title *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.title, onChange: (e) => handleInputChange('title', e.target.value), className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", placeholder: "Enter game title", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Genres" }), (0, jsx_runtime_1.jsx)(MultiSelectDropdown_1.MultiSelectDropdown, { options: static_data_1.GENRES.map(g => g.name), selected: formData.genres, onChange: (genres) => handleInputChange('genres', genres), placeholder: "Select genres..." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Moods" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: static_data_1.MOODS.map((mood) => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white transition-colors", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: formData.moods.includes(mood.id), onChange: (e) => {
                                                        if (e.target.checked) {
                                                            handleInputChange('moods', [...formData.moods, mood.id]);
                                                        }
                                                        else {
                                                            handleInputChange('moods', formData.moods.filter(m => m !== mood.id));
                                                        }
                                                    }, className: "rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:border-blue-500" }), (0, jsx_runtime_1.jsx)("span", { children: mood.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-500 text-sm", children: mood.emoji })] }, mood.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Platforms" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: ['steam', 'epic', 'gog', 'manual'].map((platform) => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: formData.platforms.includes(platform), onChange: (e) => {
                                                        const platforms = e.target.checked
                                                            ? [...formData.platforms, platform]
                                                            : formData.platforms.filter(p => p !== platform);
                                                        handleInputChange('platforms', platforms);
                                                    }, className: "rounded border-white/20 bg-white/10 text-gaming-primary focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300 capitalize", children: platform })] }, platform))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Play Status" }), (0, jsx_runtime_1.jsxs)("select", { value: formData.playStatus, onChange: (e) => handleInputChange('playStatus', e.target.value), className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", "aria-label": "Select game play status", children: [(0, jsx_runtime_1.jsx)("option", { value: "unplayed", children: "Unplayed" }), (0, jsx_runtime_1.jsx)("option", { value: "playing", children: "Playing" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "paused", children: "Paused" }), (0, jsx_runtime_1.jsx)("option", { value: "abandoned", children: "Abandoned" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Hours Played" }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "0", step: "0.1", value: formData.hoursPlayed, onChange: (e) => handleInputChange('hoursPlayed', parseFloat(e.target.value) || 0), className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", placeholder: "0" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Your Rating" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2", children: [1, 2, 3, 4, 5].map((rating) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleInputChange('userRating', rating), className: `w-8 h-8 rounded-full border-2 transition-all ${formData.userRating && formData.userRating >= rating
                                                ? 'border-gaming-primary bg-gaming-primary text-white'
                                                : 'border-white/20 bg-white/10 text-gray-400 hover:border-gaming-primary/50'}`, children: rating }, rating))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Tags" }), (0, jsx_runtime_1.jsx)(TagsDropdown_1.TagsDropdown, { selected: formData.tags, onChange: (tags) => handleInputChange('tags', tags), placeholder: "Select or add tags..." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Cover Image URL" }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: formData.coverImage, onChange: (e) => handleInputChange('coverImage', e.target.value), className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50", placeholder: "https://example.com/cover.jpg" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Notes" }), (0, jsx_runtime_1.jsx)("textarea", { value: formData.notes, onChange: (e) => handleInputChange('notes', e.target.value), rows: 3, className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50 resize-none", placeholder: "Your thoughts about this game..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "isFavorite", checked: formData.isFavorite, onChange: (e) => handleInputChange('isFavorite', e.target.checked), className: "rounded border-white/20 bg-white/10 text-gaming-primary focus:ring-gaming-primary/50" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "isFavorite", className: "text-sm text-gray-300 cursor-pointer", children: "Mark as Favorite" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t border-white/10", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading || !formData.title.trim(), className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Loading_1.Loading, { message: "", size: "sm" }), "Saving..."] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "\uD83D\uDCBE Save Changes" })) })] })] })] }) }) }));
};
exports.EditGameModal = EditGameModal;
