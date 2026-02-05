"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurpriseMeSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const homeHelpers_1 = require("../utils/homeHelpers");
const LazyImage_1 = require("../../../components/LazyImage");
const SurpriseMeSection = ({ games, onLaunchGame }) => {
    const [surprisedGame, setSurprisedGame] = (0, react_1.useState)(null);
    const [isSpinning, setIsSpinning] = (0, react_1.useState)(false);
    const handleSurpriseMe = () => {
        setIsSpinning(true);
        setSurprisedGame(null);
        // Add a small delay for dramatic effect
        setTimeout(() => {
            const game = (0, homeHelpers_1.getWeightedRandomGame)(games);
            setSurprisedGame(game);
            setIsSpinning(false);
        }, 800);
    };
    const handlePlayNow = () => {
        if (surprisedGame) {
            onLaunchGame(surprisedGame.id);
        }
    };
    const handleSpinAgain = () => {
        handleSurpriseMe();
    };
    return ((0, jsx_runtime_1.jsxs)("section", { className: "mb-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-3xl font-bold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFB2" }), "Surprise Me"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [games.length, " games available"] })] }), !surprisedGame ? (
            // Initial state - show the big button
            (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-12 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "Can't decide what to play?" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Let us pick the perfect game from your library based on your play history and preferences." })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSurpriseMe, disabled: isSpinning || games.length === 0, className: "px-8 py-4 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: isSpinning ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "animate-spin", children: "\uD83C\uDFB2" }), "Picking your game..."] })) : ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFB2" }), "Surprise Me"] })) }), games.length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-4", children: "Import some games first to get surprised!" }))] })) : (
            // Game revealed state
            (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-gaming-primary/20 to-gaming-secondary/20", children: surprisedGame.coverImage ? ((0, jsx_runtime_1.jsx)(LazyImage_1.LazyImage, { src: surprisedGame.coverImage, alt: surprisedGame.title, className: "w-full h-full" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "text-3xl text-gray-500", children: "\uD83C\uDFAE" }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-6 flex flex-col justify-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-2", children: surprisedGame.title }), surprisedGame.genres && surprisedGame.genres.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 mb-4", children: surprisedGame.genres.slice(0, 3).map(genre => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gaming-accent/20 rounded text-xs text-gaming-accent", children: genre.name }, genre.id))) })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 mb-6 text-gray-300", children: [surprisedGame.hoursPlayed && ((0, jsx_runtime_1.jsxs)("p", { children: ["\u23F1\uFE0F ", Math.floor(surprisedGame.hoursPlayed), "h played"] })), surprisedGame.localSessionCount && ((0, jsx_runtime_1.jsxs)("p", { children: ["\uD83C\uDFAE ", surprisedGame.localSessionCount, " sessions"] })), surprisedGame.playStatus && ((0, jsx_runtime_1.jsxs)("p", { children: ["\uD83D\uDCCA Status: ", surprisedGame.playStatus] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handlePlayNow, className: "px-6 py-3 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-all", children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u25B6\uFE0F" }), "Play Now"] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSpinAgain, className: "px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all", children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFB2" }), "Spin Again"] }) })] })] })] }) }))] }));
};
exports.SurpriseMeSection = SurpriseMeSection;
