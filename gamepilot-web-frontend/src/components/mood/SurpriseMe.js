"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurpriseMe = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const SurpriseMe = ({ className = '', variant = 'button', onSurprise, userMood = 'neutral', personaTraits = {} }) => {
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [currentSurprise, setCurrentSurprise] = (0, react_1.useState)(null);
    const [surpriseHistory, setSurpriseHistory] = (0, react_1.useState)([]);
    const [lastSelectedId, setLastSelectedId] = (0, react_1.useState)('');
    const getPersonaReason = (game, mood, traits) => {
        const moodReasons = {
            'chill': `Perfect for unwinding - ${game.emotionalTags?.some((tag) => tag.name === 'relaxing') ? 'designed to help you decompress' : 'a gentle way to relax'}`,
            'energetic': `Great match for your energy - ${game.emotionalTags?.some((tag) => tag.name === 'competitive') ? 'channel that competitive spirit' : 'fuel your enthusiasm'}`,
            'creative': `Sparks your creativity - ${game.emotionalTags?.some((tag) => tag.name === 'creative') ? 'express yourself through gameplay' : 'think outside the box'}`,
            'focused': `Builds concentration - ${game.emotionalTags?.some((tag) => tag.name === 'strategic') ? 'strategic thinking required' : 'maintain your flow state'}`,
            'social': `Social gaming vibes - ${game.emotionalTags?.some((tag) => tag.name === 'multiplayer') ? 'connect with others' : 'share this experience'}`,
            'exploratory': `Satisfies curiosity - ${game.emotionalTags?.some((tag) => tag.name === 'exploratory') ? 'discover new worlds' : 'expand your horizons'}`,
            'neutral': `A balanced choice - ${game.emotionalTags?.[0]?.name || 'versatile gameplay'} for any mood`
        };
        // Add persona-specific reasoning
        if (traits.playstyle?.includes('achiever') && (game.hoursPlayed || 0) > 120) {
            return `${moodReasons[mood] || moodReasons.neutral} Plus, plenty of content to master!`;
        }
        if (traits.playstyle?.includes('explorer') && game.genres?.some((g) => g.name === 'adventure')) {
            return `${moodReasons[mood] || moodReasons.neutral} Perfect for your explorer nature!`;
        }
        return moodReasons[mood] || moodReasons.neutral;
    };
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return 'morning';
        if (hour < 17)
            return 'afternoon';
        if (hour < 21)
            return 'evening';
        return 'night';
    };
    const selectSurpriseGame = async () => {
        setIsGenerating(true);
        try {
            // Simulate "smart" selection process
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Check if there are any games available
            if (!games || games.length === 0) {
                console.warn('No games available for surprise selection');
                setCurrentSurprise(null);
                return;
            }
            let availableGames = [...games];
            // Filter out recently surprised games and avoid immediate repeats
            availableGames = availableGames.filter(game => game && game.id && !surpriseHistory.includes(game.id) && game.id !== lastSelectedId);
            // If all games have been surprised, reset history
            if (availableGames.length === 0) {
                setSurpriseHistory([]);
                availableGames = [...games].filter(game => game && game.id);
            }
            // Final safety check
            if (availableGames.length === 0) {
                console.warn('No valid games available after filtering');
                setCurrentSurprise(null);
                return;
            }
            // Smart selection logic
            let selectedGame;
            const timeOfDay = getTimeOfDay();
            // Time-based preferences
            if (timeOfDay === 'morning') {
                // Prefer lighter, casual games in morning
                const morningGames = availableGames.filter(g => g.emotionalTags?.some((tag) => tag.name === 'chill' || tag.name === 'relaxing') ||
                    g.emotionalTags?.some((tag) => tag.name === 'creative') ||
                    (g.hoursPlayed || 0) < 120);
                selectedGame = morningGames.length > 0
                    ? morningGames[Math.floor(Math.random() * morningGames.length)]
                    : availableGames[Math.floor(Math.random() * availableGames.length)];
            }
            else if (timeOfDay === 'night') {
                // Prefer immersive games at night
                const nightGames = availableGames.filter(g => g.emotionalTags?.some((tag) => tag.name === 'story') ||
                    g.emotionalTags?.some((tag) => tag.name === 'exploratory') ||
                    (g.hoursPlayed || 0) > 120);
                selectedGame = nightGames.length > 0
                    ? nightGames[Math.floor(Math.random() * nightGames.length)]
                    : availableGames[Math.floor(Math.random() * availableGames.length)];
            }
            else {
                // Random selection for other times
                selectedGame = availableGames[Math.floor(Math.random() * availableGames.length)];
            }
            // Final safety check for selected game
            if (!selectedGame || !selectedGame.id) {
                console.error('Failed to select a valid game');
                setCurrentSurprise(null);
                return;
            }
            // Add to history and track last selected
            setSurpriseHistory(prev => [...prev.slice(-4), selectedGame.id]);
            setLastSelectedId(selectedGame.id);
            // Generate persona-engine flavored reason
            const selectedGameWithReason = {
                ...selectedGame,
                surpriseReason: getPersonaReason(selectedGame, userMood, personaTraits)
            };
            setCurrentSurprise(selectedGameWithReason);
        }
        catch (error) {
            console.error('Error generating surprise:', error);
            setCurrentSurprise(null);
        }
        finally {
            setIsGenerating(false);
        }
    };
    const handleSurprise = () => {
        if (onSurprise && currentSurprise) {
            onSurprise(currentSurprise);
        }
        else if (currentSurprise) {
            // Navigate to game details page if available, otherwise library
            const gameUrl = `/game/${currentSurprise.id}`;
            // Check if game details page exists by trying to navigate
            window.location.href = gameUrl;
        }
        else {
            selectSurpriseGame();
        }
    };
    const handleRegenerate = () => {
        setCurrentSurprise(null);
        selectSurpriseGame();
    };
    (0, react_1.useEffect)(() => {
        // Generate initial surprise on mount only if games are available
        if (games && games.length > 0) {
            selectSurpriseGame();
        }
    }, [games]);
    if (variant === 'button') {
        return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { onClick: handleSurprise, disabled: isGenerating, className: `relative overflow-hidden group ${className}`, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { type: "spring", stiffness: 400, damping: 17 }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300", initial: { opacity: 0 }, animate: { opacity: 1 } }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex items-center gap-2 px-4 py-2 bg-gaming-primary/20 border border-gaming-primary/50 rounded-lg hover:bg-gaming-primary/30 transition-all duration-200", children: isGenerating ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "w-4 h-4 border-2 border-gaming-primary border-t-transparent rounded-full", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.span, { className: "text-gaming-primary font-medium", initial: { opacity: 0 }, animate: { opacity: 1 }, children: "Finding surprise..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.span, { className: "text-lg", whileHover: { rotate: [0, -10, 10, 0] }, transition: { duration: 0.5 }, children: "\uD83C\uDFB2" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-primary font-medium group-hover:text-gaming-accent transition-colors", children: "Surprise Me" })] })) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: `glass-morphism rounded-xl p-6 border border-white/10 ${className}`, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.h3, { className: "text-lg font-semibold text-white flex items-center gap-2", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.span, { className: "text-2xl", animate: { rotate: [0, 5, -5, 0] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }, children: "\uD83C\uDFB2" }), "Surprise Me"] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { onClick: handleRegenerate, disabled: isGenerating, className: "text-sm text-gaming-primary hover:text-gaming-accent transition-colors disabled:opacity-50", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.span, { animate: { rotate: isGenerating ? 360 : 0 }, transition: { duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" }, children: "\uD83D\uDD04" }), ' ', "New Surprise"] })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: isGenerating ? ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex flex-col items-center justify-center py-12", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, transition: { duration: 0.3 }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full mb-6", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-gray-400 text-lg font-medium", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, children: "Finding the perfect game for you..." }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-gray-500 text-sm mt-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, children: "Analyzing your library and mood preferences" })] }, "generating")) : currentSurprise ? ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "space-y-4", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.4 }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "bg-gray-800/50 rounded-lg p-4 border border-white/10", whileHover: { scale: 1.02, borderColor: "rgba(147, 51, 234, 0.3)" }, transition: { duration: 0.2 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "w-20 h-20 bg-gray-700/50 rounded-lg overflow-hidden flex-shrink-0 relative", whileHover: { scale: 1.05, rotate: 2 }, transition: { duration: 0.2 }, children: [currentSurprise.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: currentSurprise.coverImage, alt: currentSurprise.title, className: "w-full h-full object-cover", onError: (e) => {
                                                    // Fallback to placeholder if image fails to load
                                                    const target = e.target;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling?.classList.remove('hidden');
                                                } })) : null, (0, jsx_runtime_1.jsx)("div", { className: "hidden w-full h-full bg-gradient-to-br from-gaming-primary/20 to-gaming-accent/20 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h4, { className: "text-white font-semibold text-lg truncate", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 }, children: currentSurprise.title }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-gray-400 text-sm mt-1", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, children: currentSurprise.genres?.map((g) => g.name || g).join(', ') || 'Unknown genre' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-2 text-xs text-gray-500", children: [currentSurprise.hoursPlayed && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: ["\u23F1\uFE0F ", Math.floor(currentSurprise.hoursPlayed), "h played"] })), currentSurprise.platforms?.length > 0 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.35 }, children: ["\uD83C\uDFAF ", currentSurprise.platforms[0]?.name || 'Unknown'] })), currentSurprise.releaseYear && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, children: ["\uD83D\uDCC5 ", currentSurprise.releaseYear] }))] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.p, { className: "text-gaming-primary text-sm mt-3 bg-gaming-primary/10 px-3 py-2 rounded-lg border border-gaming-primary/20", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 }, children: ["\uD83D\uDCA1 ", currentSurprise.surpriseReason] })] })] }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex gap-3 mt-4", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { onClick: handleSurprise, className: "flex-1 px-4 py-3 bg-gradient-to-r from-gaming-primary to-gaming-accent text-white rounded-lg hover:from-gaming-primary/90 hover:to-gaming-accent/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("span", { children: "Play Now" })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { onClick: handleRegenerate, disabled: isGenerating, className: "px-4 py-3 bg-gray-700/80 text-white rounded-lg hover:bg-gray-600/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2", whileHover: !isGenerating ? { scale: 1.02 } : {}, whileTap: !isGenerating ? { scale: 0.98 } : {}, children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFB2" }), (0, jsx_runtime_1.jsx)("span", { children: "Different" })] })] })] }, "surprise")) : ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "text-center py-12", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "w-20 h-20 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center", whileHover: { scale: 1.05, rotate: 5 }, transition: { duration: 0.2 }, children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFB2" }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-gray-400 text-lg font-medium mb-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 }, children: "Ready for a surprise?" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-gray-500 text-sm", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, children: "Click the button below to discover your next favorite game" }), !games || games.length === 0 && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-yellow-500 text-xs mt-4 bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: "\uD83D\uDCA1 No games in library? Import your Steam games first!" }))] }, "empty")) })] }));
};
exports.SurpriseMe = SurpriseMe;
