"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMetadataEnrichment = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const ErrorBoundary_1 = require("../../../components/ErrorBoundary");
const Loading_1 = require("../../../components/Loading");
const GameMetadataEnrichment = ({ isOpen, onClose, game, onUpdateGame }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [activeTab, setActiveTab] = (0, react_1.useState)('cover');
    const [formData, setFormData] = (0, react_1.useState)({
        coverImage: '',
        description: '',
        screenshots: [],
        developer: '',
        publisher: '',
        releaseDate: '',
        backgroundImages: []
    });
    // Initialize form when game changes
    react_1.default.useEffect(() => {
        if (game) {
            setFormData({
                coverImage: game.coverImage || '',
                description: game.description || '',
                screenshots: game.backgroundImages?.slice(0, 4) || [],
                developer: game.developer || '',
                publisher: game.publisher || '',
                releaseDate: game.releaseDate ? new Date(game.releaseDate).toISOString().split('T')[0] : '',
                backgroundImages: game.backgroundImages || []
            });
        }
    }, [game]);
    const handleSave = async () => {
        if (!game)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const updates = {
                coverImage: formData.coverImage || undefined,
                description: formData.description || undefined,
                backgroundImages: formData.backgroundImages.length > 0 ? formData.backgroundImages : undefined,
                developer: formData.developer || undefined,
                publisher: formData.publisher || undefined,
                releaseDate: formData.releaseDate ? new Date(formData.releaseDate) : undefined
            };
            await onUpdateGame(game.id, updates);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update game metadata');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleImageUrlChange = (0, react_1.useCallback)((url) => {
        setFormData(prev => ({ ...prev, coverImage: url }));
    }, []);
    const handleImageUrlInputChange = (0, react_1.useCallback)((e) => {
        setFormData(prev => ({ ...prev, coverImage: e.target.value }));
    }, []);
    const handleDescriptionChange = (0, react_1.useCallback)((e) => {
        setFormData(prev => ({ ...prev, description: e.target.value }));
    }, []);
    const handleScreenshotAdd = (0, react_1.useCallback)(() => {
        const url = prompt('Enter screenshot URL:');
        if (url) {
            setFormData(prev => ({
                ...prev,
                screenshots: [...prev.screenshots, url].slice(0, 10)
            }));
        }
    }, []);
    const handleScreenshotRemove = (0, react_1.useCallback)((index) => {
        setFormData(prev => ({
            ...prev,
            screenshots: prev.screenshots.filter((_, i) => i !== index)
        }));
    }, []);
    const handleDeveloperChange = (0, react_1.useCallback)((e) => {
        setFormData(prev => ({ ...prev, developer: e.target.value }));
    }, []);
    const handlePublisherChange = (0, react_1.useCallback)((e) => {
        setFormData(prev => ({ ...prev, publisher: e.target.value }));
    }, []);
    const handleReleaseDateChange = (0, react_1.useCallback)((e) => {
        setFormData(prev => ({ ...prev, releaseDate: e.target.value }));
    }, []);
    const handleBackgroundImageAdd = (0, react_1.useCallback)(() => {
        const url = prompt('Enter background image URL:');
        if (url) {
            setFormData(prev => ({
                ...prev,
                backgroundImages: [...prev.backgroundImages, url].slice(0, 5)
            }));
        }
    }, []);
    const handleBackgroundImageRemove = (0, react_1.useCallback)((index) => {
        setFormData(prev => ({
            ...prev,
            backgroundImages: prev.backgroundImages.filter((_, i) => i !== index)
        }));
    }, []);
    if (!isOpen || !game)
        return null;
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-white/10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white", children: "Enhance Game Metadata" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex border-b border-white/10", children: ['cover', 'description', 'screenshots'].map((tab) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab(tab), className: `flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'text-gaming-primary border-b-2 border-gaming-primary'
                                : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`, children: [tab === 'cover' && '🖼️ Cover', tab === 'description' && '📝 Description', tab === 'screenshots' && '📸 Screenshots'] }, tab))) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [error && ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4 border border-red-500/30 mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm", children: error }) })), activeTab === 'cover' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Current Cover Image" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("input", { type: "url", value: formData.coverImage, onChange: handleImageUrlInputChange, placeholder: "Enter cover image URL", className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Quick Cover Sources" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleImageUrlChange(`https://cdn.akamai.steamstatic.com/steam/apps/${game.appId}/header.jpg`), className: "p-3 glass-morphism rounded-lg border border-white/10 hover:border-gaming-primary/50 transition-colors text-left", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: "Steam Header" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "Official Steam store image" })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleImageUrlChange(`https://cdn.akamai.steamstatic.com/steam/apps/${game.appId}/library_600x900.jpg`), className: "p-3 glass-morphism rounded-lg border border-white/10 hover:border-gaming-primary/50 transition-colors text-left", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: "Steam Library" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "600x900 library image" })] }) })] })] })] })), activeTab === 'description' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Game Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: formData.description, onChange: handleDescriptionChange, rows: 6, placeholder: "Enter a detailed description of the game...", className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50 resize-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Developer" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.developer, onChange: handleDeveloperChange, placeholder: "Game developer", className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Publisher" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.publisher, onChange: handlePublisherChange, placeholder: "Game publisher", className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Release Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: formData.releaseDate, onChange: handleReleaseDateChange, className: "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" })] })] })), activeTab === 'screenshots' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Game Screenshots" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [formData.screenshots.map((screenshot, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full h-24 bg-gray-700 rounded-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: screenshot, alt: `Screenshot ${index + 1}`, className: "w-full h-full object-cover group-hover:scale-105 transition-transform" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleScreenshotRemove(index), className: "absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: "\u2715" })] }, index))), formData.screenshots.length < 10 && ((0, jsx_runtime_1.jsx)("button", { onClick: handleScreenshotAdd, className: "w-full h-24 bg-white/10 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:border-gaming-primary/50 hover:text-gaming-primary transition-colors", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "+" }) }))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-3", children: "Background Images" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [formData.backgroundImages.map((bgImage, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full h-24 bg-gray-700 rounded-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: bgImage, alt: `Background ${index + 1}`, className: "w-full h-full object-cover group-hover:scale-105 transition-transform" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBackgroundImageRemove(index), className: "absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: "\u2715" })] }, index))), formData.backgroundImages.length < 5 && ((0, jsx_runtime_1.jsx)("button", { onClick: handleBackgroundImageAdd, className: "w-full h-24 bg-white/10 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:border-gaming-primary/50 hover:text-gaming-primary transition-colors", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "+" }) }))] })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t border-white/10", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, disabled: isLoading, className: "px-6 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Loading_1.Loading, { message: "", size: "sm" }), "Saving..."] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "\uD83D\uDCBE Save Changes" })) })] })] }) }) }));
};
exports.GameMetadataEnrichment = GameMetadataEnrichment;
