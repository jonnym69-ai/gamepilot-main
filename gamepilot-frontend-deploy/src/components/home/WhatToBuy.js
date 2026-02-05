"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatToBuy = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
const WhatToBuy = ({ recommendedGame, onRefresh, userMood, personaTraits }) => {
    const [isRefreshing, setIsRefreshing] = (0, react_1.useState)(false);
    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate refresh delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        onRefresh?.();
        setIsRefreshing(false);
    };
    const handleImageError = (e) => {
        const img = e.currentTarget;
        // Map game IDs to Steam app IDs
        const steamAppIds = {
            'bg3': '1086940',
            'cyberpunk': '1091500',
            'stardew': '413150',
            'hades': '1145360',
            'disco': '646920',
            'vampire': '1794680',
            'elden': '1245620',
            'hollow': '367520',
            'slay': '646570',
            'minecraft': '239140'
        };
        const gameId = steamAppIds[recommendedGame?.game.id || ''] || recommendedGame?.game.id || 'default';
        // Try different image URLs as fallbacks
        const fallbackUrls = [
            `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg`,
            `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/capsule_616x353.jpg`,
            `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/capsule_184x69.jpg`
        ];
        // Try the next fallback URL
        const currentSrc = img.getAttribute('src');
        const currentIndex = fallbackUrls.findIndex(url => url === currentSrc);
        if (currentIndex < fallbackUrls.length - 1) {
            img.src = fallbackUrls[currentIndex + 1];
        }
        else {
            // Final fallback - show emoji placeholder
            img.style.display = 'none';
            if (img.parentElement) {
                img.parentElement.innerHTML = '<span class="text-3xl">🎮</span>';
            }
        }
    };
    const handleBuyGame = () => {
        if (recommendedGame?.game.steamUrl) {
            window.open(recommendedGame.game.steamUrl, '_blank');
        }
    };
    const getMoodEmoji = (mood) => {
        const moodData = static_data_1.MOODS.find(m => m.id === mood);
        return moodData?.emoji || '🎮';
    };
    const getMoodColor = (mood) => {
        const colors = {
            chill: 'text-blue-400',
            competitive: 'text-red-400',
            story: 'text-purple-400',
            creative: 'text-green-400',
            social: 'text-pink-400',
            focused: 'text-yellow-400'
        };
        return colors[mood] || 'text-gray-400';
    };
    if (!recommendedGame) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDED2" }), "What Should I Buy Next?"] }), (userMood || personaTraits) && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-white/5 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: "Current Context:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [userMood && ((0, jsx_runtime_1.jsxs)("span", { className: `flex items-center gap-1 ${getMoodColor(userMood)}`, children: [(0, jsx_runtime_1.jsx)("span", { children: getMoodEmoji(userMood) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm capitalize", children: userMood })] })), personaTraits && ((0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary text-sm", children: personaTraits.archetypeId }))] })] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: "No recommendations available" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mb-4", children: "Add more games to your library to get personalized recommendations" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleRefresh, disabled: isRefreshing, className: "px-4 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors disabled:opacity-50", children: isRefreshing ? 'Refreshing...' : 'Refresh' })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDED2" }), "What Should I Buy Next?"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleRefresh, disabled: isRefreshing, className: "px-3 py-1 bg-gaming-primary/20 text-gaming-primary rounded-lg hover:bg-gaming-primary/30 transition-colors disabled:opacity-50 text-sm", children: [isRefreshing ? '🔄' : '🔄', " Refresh"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-white/5 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: "Recommended because:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [userMood && ((0, jsx_runtime_1.jsxs)("span", { className: `flex items-center gap-1 ${getMoodColor(userMood)}`, children: [(0, jsx_runtime_1.jsx)("span", { children: getMoodEmoji(userMood) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm capitalize", children: userMood })] })), personaTraits && ((0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary text-sm", children: personaTraits.archetypeId }))] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-sm", children: recommendedGame.explanation })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 bg-gaming-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden", children: recommendedGame.game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: recommendedGame.game.coverImage, alt: recommendedGame.game.name, className: "w-full h-full object-cover", onError: handleImageError })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAE" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white mb-2", children: recommendedGame.game.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gaming-accent font-bold", children: [Math.round(recommendedGame.score), "% Match"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/40", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/60 text-sm", children: recommendedGame.game.genres?.slice(0, 2).join(', ') || 'Various' })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm leading-relaxed mb-3", children: recommendedGame.explanation }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm text-white/60 mb-3", children: [recommendedGame.game.price && ((0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold", children: recommendedGame.game.price })), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: "Steam" })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex gap-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleBuyGame, className: "flex-1 px-4 py-3 bg-gaming-accent hover:bg-gaming-primary text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDED2" }), "Buy on Steam"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleRefresh, disabled: isRefreshing, className: "px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors disabled:opacity-50", children: [isRefreshing ? '🔄' : '🔄', " New Suggestion"] })] })] }));
};
exports.WhatToBuy = WhatToBuy;
