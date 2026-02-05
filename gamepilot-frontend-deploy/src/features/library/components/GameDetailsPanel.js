"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDetailsPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const GameDetailsPanel = ({ game, onClose, onGameUpdate, onLaunchGame }) => {
    const { actions } = (0, useLibraryStore_1.useLibraryStore)();
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editedNotes, setEditedNotes] = (0, react_1.useState)(game?.notes || '');
    const [editedRating, setEditedRating] = (0, react_1.useState)(game?.userRating || 0);
    const [editedStatus, setEditedStatus] = (0, react_1.useState)(game?.playStatus ?? 'backlog');
    const [isTrackingTime, setIsTrackingTime] = (0, react_1.useState)(false);
    if (!game)
        return null;
    const handleSave = () => {
        if (onGameUpdate) {
            const updatedGame = {
                ...game,
                notes: editedNotes,
                userRating: editedRating,
                playStatus: editedStatus
            };
            onGameUpdate(updatedGame);
        }
        setIsEditing(false);
    };
    const handleLaunch = () => {
        if (onLaunchGame && game) {
            onLaunchGame(game);
        }
    };
    const handleStatusChange = (newStatus) => {
        setEditedStatus(newStatus);
        if (game) {
            actions.updateGameStatus(game.id, newStatus);
        }
    };
    const handleTimeTracking = () => {
        if (game) {
            setIsTrackingTime(!isTrackingTime);
            if (!isTrackingTime) {
                // Start tracking - could implement a timer here
                console.log(`Started tracking time for ${game.title}`);
            }
            else {
                // Stop tracking and update playtime
                const additionalTime = 1; // In real implementation, this would be actual tracked time
                const currentPlaytime = game.hoursPlayed || 0;
                actions.updateGamePlaytime(game.id, currentPlaytime + additionalTime);
                console.log(`Stopped tracking time for ${game.title}. Added ${additionalTime} hours.`);
            }
        }
    };
    const handleCancel = () => {
        setEditedNotes(game.notes || '');
        setEditedRating(game.userRating || 0);
        setEditedStatus(game.playStatus || 'backlog');
        setIsEditing(false);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'playing': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'backlog': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'abandoned': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative h-64 bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20", children: [game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-5xl", children: "\uD83C\uDFAE" }) }) })), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors", children: "\u2715" }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-4 left-4 right-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-white mb-2", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-300", children: [game.developer && (0, jsx_runtime_1.jsxs)("span", { children: ["\uD83C\uDFE2 ", game.developer] }), game.releaseDate && (0, jsx_runtime_1.jsxs)("span", { children: ["\uD83D\uDCC5 ", game.releaseDate.getFullYear()] }), game.hoursPlayed && (0, jsx_runtime_1.jsxs)("span", { children: ["\u23F1\uFE0F ", game.hoursPlayed, "h played"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(game.playStatus || 'backlog')}`, children: game.playStatus || 'backlog' }), game.platforms && ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: game.platforms.map((platform) => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gaming-primary/20 text-gaming-primary rounded text-xs", children: platform.name }, platform.id))) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => isEditing ? handleCancel() : setIsEditing(true), className: "px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity", children: isEditing ? 'Cancel' : 'Edit' }), !isEditing && onLaunchGame && ((0, jsx_runtime_1.jsxs)("button", { onClick: handleLaunch, className: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2", title: game.launcherId ? undefined : 'No launcher ID set', children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAE" }), "Launch Game"] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Rating" }), isEditing ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "5", step: "0.5", value: editedRating, onChange: (e) => setEditedRating(parseFloat(e.target.value)), className: "flex-1 accent-gaming-accent" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white font-medium", children: [editedRating, " \u2B50"] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl text-yellow-400", children: "\u2B50" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl text-white", children: game.userRating || 'Not rated' })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Status" }), isEditing ? ((0, jsx_runtime_1.jsxs)("select", { value: editedStatus, onChange: (e) => handleStatusChange(e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "backlog", children: "Backlog" }), (0, jsx_runtime_1.jsx)("option", { value: "playing", children: "Playing" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "abandoned", children: "Abandoned" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-3 py-1 rounded-lg text-sm ${getStatusColor(game.playStatus || 'backlog')}`, children: game.playStatus || 'Backlog' }), (0, jsx_runtime_1.jsx)("button", { onClick: handleTimeTracking, className: `px-3 py-1 rounded-lg text-sm ${isTrackingTime ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`, children: isTrackingTime ? '⏹️ Stop' : '⏱️ Track Time' })] }))] }), game.genres && game.genres.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: game.genres.map((genre) => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gaming-secondary/20 text-gaming-secondary rounded-full text-sm", children: genre.name }, genre.id))) })] })), game.tags && game.tags.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Emotional Tags" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: game.tags.map((tag) => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-accent-500/20 text-accent-300 rounded-full text-sm", children: tag }, tag))) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [game.achievements && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Achievements" }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: "Progress" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-accent-400", children: [game.achievements.unlocked, " / ", game.achievements.total] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-gaming-primary to-gaming-secondary h-2 rounded-full transition-all duration-300", style: { width: `${(game.achievements.unlocked / game.achievements.total) * 100}%` } }) })] })] })), game.lastPlayed && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Last Played" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white", children: game.lastPlayed?.toLocaleDateString() })] })), game.publisher && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Publisher" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white", children: game.publisher })] }))] })] }), game.description && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Description" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-100 leading-relaxed", children: game.description })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Personal Notes" }), isEditing ? ((0, jsx_runtime_1.jsx)("textarea", { value: editedNotes, onChange: (e) => setEditedNotes(e.target.value), placeholder: "Add your thoughts about this game...", className: "w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gaming-accent focus:outline-none resize-none" })) : ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-lg p-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-100", children: game.notes || 'No notes yet. Click Edit to add your thoughts.' }) }))] }), isEditing && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleCancel, className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, className: "px-6 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity", children: "Save Changes" })] }))] })] }) }));
};
exports.GameDetailsPanel = GameDetailsPanel;
