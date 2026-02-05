"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendedGamesStrip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const RecommendedGamesStrip = ({ games, loading = false, onGameSelect, onQuickPlay }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleGameClick = (game) => {
        if (onGameSelect) {
            onGameSelect(game);
        }
        else {
            // Navigate to library with game selected
            navigate(`/library?game=${game.id}`);
        }
    };
    const handleQuickPlay = (e, game) => {
        e.stopPropagation();
        if (onQuickPlay) {
            onQuickPlay(game);
        }
        else {
            // Navigate to library with game selected for now (game details page may not exist)
            navigate(`/library?game=${game.id}`);
        }
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Recommended Games" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-4 overflow-x-auto", children: [1, 2, 3, 4, 5].map(i => ((0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 w-32 h-40 bg-gray-700/50 rounded-lg animate-pulse" }, i))) })] }));
    }
    if (games.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Recommended Games" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm", children: "No recommendations available" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: "Recommended Games" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/library'), className: "text-sm text-gaming-primary hover:text-gaming-accent transition-colors", children: "View All \u2192" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-4 overflow-x-auto pb-2", children: games.map((game) => ((0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 w-40", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 rounded-lg overflow-hidden border border-white/10 hover:border-gaming-primary/50 transition-all duration-200 cursor-pointer group", onClick: () => handleGameClick(game), children: [game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-24 bg-gradient-to-br from-gaming-primary/20 to-gaming-accent/20 flex items-center justify-center group-hover:from-gaming-primary/30 group-hover:to-gaming-accent/30 transition-all duration-200", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAE" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "p-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-white truncate group-hover:text-gaming-primary transition-colors", children: game.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1 line-clamp-2", children: game.reason }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs px-2 py-1 bg-gaming-primary/20 rounded text-gaming-primary", children: [Math.round(game.moodAlignment * 100), "%"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs px-2 py-1 bg-gaming-accent/20 rounded text-gaming-accent", children: [Math.round(game.genreMatch * 100), "%"] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => handleQuickPlay(e, game), className: "mt-2 w-full px-2 py-1 bg-gaming-primary text-white text-xs rounded hover:bg-gaming-accent transition-colors", children: "Quick Play" })] })] }) }, game.id))) })] }));
};
exports.RecommendedGamesStrip = RecommendedGamesStrip;
