"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddGameModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GOGGameSearch_1 = require("./GOGGameSearch");
const gogApi_1 = require("../../../services/gogApi");
const ToastProvider_1 = require("../../../components/ui/ToastProvider");
const ErrorBoundaryWrapper_1 = require("../../../components/ErrorBoundaryWrapper");
const MultiSelectDropdown_1 = require("../../../components/MultiSelectDropdown");
const TagsDropdown_1 = require("../../../components/TagsDropdown");
const static_data_1 = require("@gamepilot/static-data");
const AddGameModal = ({ isOpen, onClose, onAddGame }) => {
    const { showSuccess, showError } = (0, ToastProvider_1.useToast)();
    const [formData, setFormData] = (0, react_1.useState)({
        title: '',
        genres: [],
        moods: [],
        tags: [],
        platforms: [],
        playStatus: 'backlog',
        status: 'backlog',
        coverImage: '',
        launcherId: ''
    });
    const [selectedPlatform, setSelectedPlatform] = (0, react_1.useState)('manual');
    const handleGOGGameSelect = (gogGame) => {
        const convertedGame = gogApi_1.GOGAPI.convertGOGGameToGame(gogGame);
        setFormData({
            title: convertedGame.title || '',
            genres: convertedGame.genres?.map((g) => g.name) || [],
            moods: [],
            platforms: convertedGame.platforms || [],
            playStatus: 'backlog',
            status: 'backlog',
            tags: convertedGame.tags || [],
            coverImage: convertedGame.coverImage || '',
            launcherId: convertedGame.launcherId || ''
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newGame = {
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
                    name: code.charAt(0).toUpperCase() + code.slice(1),
                    code,
                    isConnected: false
                })),
                playStatus: formData.playStatus,
                tags: formData.tags,
                coverImage: formData.coverImage || '',
                hoursPlayed: 0,
                userRating: undefined,
                achievements: { unlocked: 0, total: 0 },
                launcherId: formData.launcherId || undefined,
                addedAt: new Date(),
                releaseYear: new Date().getFullYear(),
                emotionalTags: formData.moods.map(mood => mood),
                moods: formData.moods, // Add moods field with MoodId[]
                isFavorite: false,
                notes: '',
                globalRating: undefined,
                lastPlayed: undefined,
                totalPlaytime: 0,
                averageRating: undefined,
                completionPercentage: undefined
            };
            console.log('🎮 Adding game:', newGame);
            // Call the onAddGame callback to update local state
            onAddGame(newGame);
            showSuccess(`"${newGame.title}" added to your library`);
            onClose();
        }
        catch (error) {
            console.error('❌ Failed to add game:', error);
            // Show error toast to user
            showError('Failed to add game. Please try again.');
        }
    };
    const handlePlatformToggle = (platform) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform]
        }));
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)(ErrorBoundaryWrapper_1.ErrorBoundaryWrapper, { children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto cinematic-shadow", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Add New Game" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Add From Platform" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedPlatform, onChange: (e) => setSelectedPlatform(e.target.value), className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", "aria-label": "Select platform to add game from", children: [(0, jsx_runtime_1.jsx)("option", { value: "manual", children: "\uD83D\uDCDD Manual Entry" }), (0, jsx_runtime_1.jsx)("option", { value: "steam", children: "\uD83C\uDFAE Steam Search" }), (0, jsx_runtime_1.jsx)("option", { value: "gog", children: "\uD83C\uDFAF GOG Search" })] })] }), selectedPlatform === 'gog' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Search GOG Games" }), (0, jsx_runtime_1.jsx)(GOGGameSearch_1.GOGGameSearchComponent, { onGameSelect: handleGOGGameSelect, placeholder: "Search GOG catalog..." })] })), selectedPlatform === 'steam' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Search Steam Games" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm p-3 bg-gray-800 rounded-lg", children: "Steam search coming soon! Use Steam Import for full library access." })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Title *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", required: true, value: formData.title, onChange: (e) => setFormData(prev => ({ ...prev, title: e.target.value })), className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", placeholder: "Enter game title" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Genres" }), (0, jsx_runtime_1.jsx)(MultiSelectDropdown_1.MultiSelectDropdown, { options: static_data_1.GENRES.map(g => g.name), selected: formData.genres, onChange: (genres) => setFormData(prev => ({ ...prev, genres })), placeholder: "Select genres..." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Moods" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: static_data_1.MOODS.map((mood) => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white transition-colors", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: formData.moods.includes(mood.id), onChange: (e) => {
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({ ...prev, moods: [...prev.moods, mood.id] }));
                                                            }
                                                            else {
                                                                setFormData(prev => ({ ...prev, moods: prev.moods.filter(m => m !== mood.id) }));
                                                            }
                                                        }, className: "rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:border-blue-500" }), (0, jsx_runtime_1.jsx)("span", { children: mood.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-500 text-sm", children: mood.emoji })] }, mood.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Platforms" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: ['steam', 'epic', 'gog'].map((platform) => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 text-gray-300", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: formData.platforms.includes(platform), onChange: () => handlePlatformToggle(platform), className: "rounded border-gray-600 bg-gray-700 text-gaming-primary focus:ring-gaming-primary" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm capitalize", children: platform })] }, platform))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Status" }), (0, jsx_runtime_1.jsxs)("select", { value: formData.status, onChange: (e) => setFormData(prev => ({ ...prev, status: e.target.value })), className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", "aria-label": "Select game status", children: [(0, jsx_runtime_1.jsx)("option", { value: "backlog", children: "\uD83D\uDCDA Backlog" }), (0, jsx_runtime_1.jsx)("option", { value: "playing", children: "\uD83C\uDFAE Playing" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "\u2705 Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "abandoned", children: "\uD83D\uDEAB Abandoned" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Launcher ID" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.launcherId, onChange: (e) => setFormData(prev => ({ ...prev, launcherId: e.target.value })), className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", placeholder: "Steam App ID, Epic Catalog ID, etc." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Tags" }), (0, jsx_runtime_1.jsx)(TagsDropdown_1.TagsDropdown, { selected: formData.tags, onChange: (tags) => setFormData(prev => ({ ...prev, tags })), placeholder: "Select or add tags..." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Cover Image URL" }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: formData.coverImage, onChange: (e) => setFormData(prev => ({ ...prev, coverImage: e.target.value })), className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", placeholder: "https://example.com/cover.jpg" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-6 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity", children: "Add Game" })] })] })] }) }) }) }));
};
exports.AddGameModal = AddGameModal;
