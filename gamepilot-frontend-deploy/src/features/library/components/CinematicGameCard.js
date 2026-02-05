"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinematicGameCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const gameImageUtils_1 = require("../../../utils/gameImageUtils");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const LazyImage_1 = require("../../../components/LazyImage");
const useDragAndDrop_1 = require("../../../hooks/useDragAndDrop");
const CinematicGameCard = ({ game, isSelected = false, isSelectable = false, onSelect, capsuleImage, currentSession, onEdit, onDelete, onLaunch, index = 0, onReorder, isDraggable = false, isLaunching = false }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { actions } = (0, useLibraryStore_1.useLibraryStore)();
    // Drag and drop functionality
    const { handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDragLeave, handleDrop, isDraggedOver, isDragging } = (0, useDragAndDrop_1.useDragAndDrop)({
        items: [game],
        onReorder: onReorder || (() => { }),
        disabled: !isDraggable || !onReorder
    });
    const currentIndex = index || 0;
    const isDraggingResult = isDragging(currentIndex) ? true : false;
    const dragStyles = (0, useDragAndDrop_1.useDragStyles)(isDraggedOver(currentIndex), isDraggingResult);
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
    }, []);
    const handleCardClick = () => {
        navigate(`/library/game/${game.id}`);
    };
    const hasSteamAppId = game.appId && game.appId > 0;
    const isInSession = currentSession?.gameId === game.id;
    const getStatusColor = (status) => {
        switch (status) {
            case 'playing': return 'from-green-500 to-emerald-600';
            case 'completed': return 'from-blue-500 to-indigo-600';
            case 'backlog': return 'from-yellow-500 to-orange-600';
            case 'unplayed': return 'from-gray-500 to-gray-600';
            case 'paused': return 'from-orange-500 to-red-600';
            case 'abandoned': return 'from-red-500 to-gray-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };
    const getStatusBadgeStyles = (status) => {
        switch (status) {
            case 'playing':
                return 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 border-green-400/50 shadow-green-500/30';
            case 'completed':
                return 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 border-blue-400/50 shadow-blue-500/30';
            case 'backlog':
                return 'bg-gradient-to-r from-yellow-500/90 to-orange-600/90 border-yellow-400/50 shadow-yellow-500/30';
            case 'unplayed':
                return 'bg-gradient-to-r from-gray-500/90 to-gray-600/90 border-gray-400/50 shadow-gray-500/30';
            case 'paused':
                return 'bg-gradient-to-r from-orange-500/90 to-red-600/90 border-orange-400/50 shadow-orange-500/30';
            case 'abandoned':
                return 'bg-gradient-to-r from-red-500/90 to-gray-600/90 border-red-400/50 shadow-red-500/30';
            default:
                return 'bg-gradient-to-r from-gray-500/90 to-gray-600/90 border-gray-400/50 shadow-gray-500/30';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'playing':
                return '🎮';
            case 'completed':
                return '✅';
            case 'backlog':
                return '📚';
            case 'unplayed':
                return '🆕';
            case 'paused':
                return '⏸️';
            case 'abandoned':
                return '❌';
            default:
                return '🎯';
        }
    };
    const handleDetailsClick = (e) => {
        e.stopPropagation();
        navigate(`/library/game/${game.id}`);
    };
    const handleLaunchClick = (e) => {
        e.stopPropagation();
        // Use the custom onLaunch handler if provided, otherwise fall back to store action
        if (onLaunch) {
            onLaunch(game);
        }
        else {
            // Use the store's launchGame action with game ID
            actions.launchGame(game.id);
        }
    };
    const handleEndSession = (e) => {
        e.stopPropagation();
        actions.endCurrentSession();
    };
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `
        relative group cursor-pointer transition-all duration-500 transform hover:scale-105
        ${isSelected ? 'ring-2 ring-gaming-primary ring-offset-2 ring-offset-gaming-dark' : ''}
        ${isMounted ? 'animate-fade-in' : 'opacity-0'}
        hover:shadow-2xl hover:shadow-gaming-primary/40
        ${isDraggable ? 'cursor-grab' : 'cursor-pointer'}
        h-[400px] // Increased height for better proportions
      `, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), onClick: handleCardClick, draggable: isDraggable, onDragStart: (e) => handleDragStart(e, currentIndex), onDragEnd: handleDragEnd, onDragOver: (e) => handleDragOver(e, currentIndex), onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDrop: (e) => handleDrop(e, currentIndex), style: dragStyles, children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-2xl overflow-hidden border border-gray-700/30 transition-all duration-500 group-hover:border-gaming-primary/50 group-hover:shadow-2xl group-hover:shadow-gaming-accent/30 h-full flex flex-col", children: [isSelectable && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 left-3 z-20", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isSelected, onChange: (e) => {
                                e.stopPropagation();
                                onSelect?.(game, e.target.checked);
                            }, className: "w-4 h-4 rounded border-gray-300 text-gaming-primary focus:ring-gaming-primary", "aria-label": `Select ${game.title}`, title: `Select ${game.title}` }) })), (0, jsx_runtime_1.jsxs)("div", { className: "relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20 flex-shrink-0 group", children: [(0, gameImageUtils_1.getHighQualityGameImage)(game) ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LazyImage_1.LazyImage, { src: (0, gameImageUtils_1.getHighQualityGameImage)(game), alt: game.title, className: "w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500", children: (0, jsx_runtime_1.jsx)("span", { className: "text-6xl text-gray-500 group-hover:text-gray-400 transition-colors duration-300", children: "\uD83C\uDFAE" }) })), game.price && game.price.discount_percent > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white text-sm font-bold z-10 shadow-lg shadow-red-500/30 animate-pulse", children: ["-", game.price.discount_percent, "%"] })), game.playStatus && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 right-3 z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: `px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm border ${getStatusBadgeStyles(game.playStatus)}`, children: [getStatusIcon(game.playStatus), " ", game.playStatus.toUpperCase()] }) })), game.completionPercentage !== undefined && game.completionPercentage > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-3 right-3 z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative w-12 h-12", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "w-12 h-12 transform -rotate-90", children: [(0, jsx_runtime_1.jsx)("circle", { cx: "24", cy: "24", r: "20", stroke: "rgba(255,255,255,0.2)", strokeWidth: "4", fill: "none" }), (0, jsx_runtime_1.jsx)("circle", { cx: "24", cy: "24", r: "20", stroke: "url(#progressGradient)", strokeWidth: "4", fill: "none", strokeDasharray: `${2 * Math.PI * 20}`, strokeDashoffset: `${2 * Math.PI * 20 * (1 - game.completionPercentage / 100)}`, className: "transition-all duration-500" }), (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: "progressGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "#10b981" }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "#34d399" })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-white", children: [Math.round(game.completionPercentage), "%"] }) })] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col justify-end", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-bold text-lg mb-3 line-clamp-2 transition-all duration-300 group-hover:text-gaming-primary leading-tight", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4 pb-4 border-b border-gray-700/40", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [game.platforms && game.platforms.length > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2.5 py-1 bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-sm rounded-lg text-xs text-gray-200 font-semibold border border-gray-600/50 truncate shadow-sm", children: ["\uD83C\uDFAF ", game.platforms[0].name] })), game.genres && game.genres.length > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2.5 py-1 bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm rounded-lg text-xs text-blue-200 font-semibold border border-blue-500/40 truncate shadow-sm", children: ["\uD83C\uDFAD ", typeof game.genres[0] === 'string' ? game.genres[0] : game.genres[0].name || 'Genre'] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-shrink-0", children: [game.playStatus && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-600/40 shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full bg-gradient-to-r ${getStatusColor(game.playStatus)} animate-pulse` }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white font-semibold capitalize", children: game.playStatus })] })), game.hoursPlayed !== undefined && game.hoursPlayed > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-300 font-bold bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-600/40 shadow-sm", children: ["\u23F1\uFE0F ", Math.floor(game.hoursPlayed), "h"] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-auto pt-4 border-t border-gray-700/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2.5", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleDetailsClick, className: "flex-1 px-4 py-3 bg-gradient-to-r from-gaming-primary/90 to-gaming-secondary/90 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gaming-primary/40 border border-gaming-primary/30 flex items-center justify-center gap-2 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-base", children: "\uD83D\uDCCB" }), (0, jsx_runtime_1.jsx)("span", { children: "Details" })] }), hasSteamAppId && ((0, jsx_runtime_1.jsxs)("button", { onClick: isInSession ? handleEndSession : handleLaunchClick, disabled: isLaunching, className: `px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 border backdrop-blur-sm ${isInSession
                                                        ? 'bg-gradient-to-r from-red-600/90 to-red-700/90 text-white hover:opacity-90 hover:shadow-lg hover:shadow-red-600/40 border-red-500/30'
                                                        : isLaunching
                                                            ? 'bg-gradient-to-r from-gray-600/90 to-gray-700/90 text-gray-300 cursor-not-allowed border-gray-500/30'
                                                            : 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 text-white hover:opacity-90 hover:shadow-lg hover:shadow-green-600/40 border-green-500/30'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-base", children: isInSession ? '⏹️' : isLaunching ? '⏳' : '▶️' }), (0, jsx_runtime_1.jsx)("span", { children: isInSession ? 'End' : isLaunching ? 'Launching...' : 'Play' })] }))] }) })] })] })] }), isHovered && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-lg bg-gaming-primary/5 blur-xl -z-10" }))] }));
};
exports.CinematicGameCard = CinematicGameCard;
