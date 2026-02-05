"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDetailsLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const framer_motion_1 = require("framer-motion");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const emulatorService_1 = require("../../../services/emulatorService");
const emulatorLauncher_1 = require("../../../services/emulatorLauncher");
const ToastProvider_1 = require("../../../components/ui/ToastProvider");
require("./GameDetailsLayout.css");
// Import persona components
const persona_1 = require("../../../components/persona");
const persona_2 = require("../../../hooks/persona");
const GameDetailsLayout = ({ game }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { games, actions } = (0, useLibraryStore_1.useLibraryStore)();
    const { showSuccess, showError, showWarning, showInfo } = (0, ToastProvider_1.useToast)();
    // Generate better header image URL from Steam app ID
    const getHeaderImageUrl = (game) => {
        if (game.coverImage) {
            // Convert library image to header image
            const appId = game.appId || game.id?.split('_')[1];
            if (appId) {
                return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
            }
        }
        return game.coverImage;
    };
    const headerImageUrl = getHeaderImageUrl(game);
    // Debug: Log the game object to see its structure
    console.log('🔍 Game Details - Full Game Object:', game);
    console.log('🔍 Game Details - Original Cover Image URL:', game?.coverImage);
    console.log('🔍 Game Details - Header Image URL:', headerImageUrl);
    // Get persona for this specific game
    const persona = (0, persona_2.useGamePersona)(game.id);
    const handlePlayNow = async () => {
        console.log('🎮 Launching game:', game.title);
        // Show loading toast
        showInfo('Launching Game: Starting ' + game.title + '...', {
            autoClose: 2000
        });
        const platform = game.platforms?.[0]?.code;
        // Check if this is an emulator game
        if (platform && emulatorService_1.emulatorService.isEmulatorPlatform(platform)) {
            try {
                const result = await emulatorLauncher_1.emulatorLauncher.launchGame(game, { fullscreen: true });
                if (result.success) {
                    showSuccess('Game Launched! ' + game.title + ' is now running', {
                        autoClose: 3000
                    });
                    // Update game status to playing
                    actions.updateGameStatus(game.id, 'playing');
                }
                else {
                    showError('Launch Failed: ' + (result.error || 'Failed to launch emulator game'), {
                        autoClose: 5000
                    });
                }
            }
            catch (error) {
                showError('Launch Error: An error occurred while launching the game', {
                    autoClose: 5000
                });
            }
        }
        else {
            // Steam/other platform launch logic - use direct Steam URL as fallback
            if (game.appId) {
                console.log('🎮 Launching Steam game with appId:', game.appId);
                // Direct Steam URL launch
                const steamUrl = `steam://rungameid/${game.appId}`;
                console.log('🚀 Direct Steam URL:', steamUrl);
                try {
                    window.location.href = steamUrl;
                    // Check if launch was successful (simple heuristic)
                    setTimeout(() => {
                        const isStillOnPage = document.visibilityState === 'visible';
                        if (isStillOnPage) {
                            showWarning('Launch Failed: Steam may not be installed or running. Please check Steam is available.', {
                                autoClose: 5000
                            });
                        }
                        else {
                            showSuccess('Steam Launch Initiated: Opening ' + game.title + ' via Steam...', {
                                autoClose: 3000
                            });
                            // Update game status to playing
                            actions.updateGameStatus(game.id, 'playing');
                        }
                    }, 3000);
                }
                catch (error) {
                    console.error('Failed to launch game:', error);
                    showError('Launch Error: Could not execute launch command', {
                        autoClose: 5000
                    });
                }
            }
            else {
                console.warn('No appId found for game:', game.title);
                showWarning('Launch Not Available: This game cannot be launched automatically. App ID not found.', {
                    autoClose: 4000
                });
            }
        }
    };
    const handleMarkCompleted = () => {
        console.log('✅ Marking game as completed:', game.title);
        actions.updateGameStatus(game.id, 'completed');
        showSuccess('Game Completed: ' + game.title + ' marked as completed', {
            autoClose: 3000
        });
    };
    const handleAddTags = () => {
        console.log('🏷️ Add tags for:', game.title);
        showInfo('Tags Feature: Tag management coming soon!', {
            autoClose: 3000
        });
    };
    const handleAddToShelf = () => {
        console.log('📚 Add to shelf:', game.title);
        showInfo('Shelf Feature: Custom shelves coming soon!', {
            autoClose: 3000
        });
    };
    const handleRateMood = () => {
        console.log('⭐ Rate mood for:', game.title);
        showInfo('Mood Rating: Mood rating system coming soon!', {
            autoClose: 3000
        });
    };
    const handleEditMetadata = () => {
        console.log('✏️ Edit metadata for:', game.title);
        showInfo('Edit Feature: Game editor coming soon!', {
            autoClose: 3000
        });
    };
    const handleMarkAsBacklog = () => {
        console.log('📋 Mark as backlog:', game.title);
        // Check if game already has backlog tag
        const currentTags = game.tags || [];
        const hasBacklogTag = currentTags.includes('Backlog');
        if (hasBacklogTag) {
            // Remove backlog tag
            const updatedTags = currentTags.filter(tag => tag !== 'Backlog');
            actions.updateGame(game.id, { tags: updatedTags });
            showSuccess('Backlog tag removed from ' + game.title, {
                autoClose: 3000
            });
        }
        else {
            // Add backlog tag
            const updatedTags = [...currentTags, 'Backlog'];
            actions.updateGame(game.id, { tags: updatedTags });
            showSuccess('Backlog tag added to ' + game.title, {
                autoClose: 3000
            });
        }
    };
    const formatPlaytime = (hours) => {
        if (!hours)
            return '0h';
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
    };
    const formatDate = (dateString) => {
        if (!dateString)
            return 'Never';
        return new Date(dateString).toLocaleDateString();
    };
    // Get mood tags for game (using tags directly)
    const gameMoods = game?.tags || [];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative h-96 overflow-hidden hero-section", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-gaming-primary via-gaming-secondary to-gaming-accent" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute inset-0", initial: { opacity: 0, scale: 1.05 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.2, ease: "easeOut" }, children: headerImageUrl && ((0, jsx_runtime_1.jsx)("img", { src: headerImageUrl, alt: game?.title, className: "w-full h-full object-cover object-center game-header-image", style: {
                                objectPosition: 'center center',
                                filter: 'brightness(0.8) contrast(1.2)'
                            }, onError: (e) => {
                                console.error('❌ Header image failed to load:', headerImageUrl);
                                // Fallback to gradient background
                                e.currentTarget.style.display = 'none';
                            }, onLoad: () => {
                                console.log('✅ Header image loaded successfully:', headerImageUrl);
                            } })) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute inset-0 bg-gradient-to-br from-gaming-primary/20 via-transparent to-gaming-accent/20", animate: {
                            background: [
                                "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), transparent, rgba(34, 197, 94, 0.2))",
                                "linear-gradient(to bottom right, rgba(34, 197, 94, 0.2), transparent, rgba(168, 85, 247, 0.2))",
                                "linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), transparent, rgba(59, 130, 246, 0.2))"
                            ]
                        }, transition: { duration: 8, repeat: Infinity }, children: (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40", style: {
                                background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)'
                            } }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: [...Array(20)].map((_, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute w-1 h-1 bg-white/20 rounded-full", initial: {
                                x: Math.random() * 100 + '%',
                                y: Math.random() * 100 + '%',
                                scale: 0
                            }, animate: {
                                x: Math.random() * 100 + '%',
                                y: Math.random() * 100 + '%',
                                scale: [0, 1, 0],
                                opacity: [0, 0.8, 0]
                            }, transition: {
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            } }, i))) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 left-0 right-0 p-8", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-end justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [persona && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "mb-4", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-3 py-1 bg-gaming-primary/20 border border-gaming-primary/30 rounded-full text-gaming-primary text-xs font-medium backdrop-blur-sm", children: ["\uD83E\uDDE0 ", persona?.traits?.archetypeId || 'Explorer'] }), (0, jsx_runtime_1.jsxs)("div", { className: "px-3 py-1 bg-gaming-accent/20 border border-gaming-accent/30 rounded-full text-gaming-accent text-xs font-medium backdrop-blur-sm", children: ["\u2B50 ", Math.round((persona?.traits?.confidence || 0) * 100), "% Match"] })] }) })), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "mb-3", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4 }, children: (0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-medium backdrop-blur-sm", children: game?.releaseYear ? `From ${game.releaseYear}` : 'Classic Era' }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.h1, { className: "text-5xl font-bold text-white drop-shadow-2xl mb-2", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, children: game?.title }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex items-center gap-4 text-white/80 text-lg", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, children: [(0, jsx_runtime_1.jsx)("span", { children: game?.platforms?.map(platform => platform.name).join(' • ') || 'Unknown Platform' }), game?.hoursPlayed && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u23F1\uFE0F" }), Math.floor(game.hoursPlayed), "h played"] }))] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { onClick: handlePlayNow, className: "px-8 py-4 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-gaming-accent/50 flex items-center gap-3 backdrop-blur-sm border border-white/20 game-action-button", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.7 }, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u25B6\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: "Launch Game" })] })] }) }) })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "bg-gaming-dark/80 backdrop-blur-xl border-b border-gaming-primary/20 sticky top-0 z-50", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => navigate('/library'), className: "flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-xl font-bold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-gaming-accent/50", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u2190" }), (0, jsx_runtime_1.jsx)("span", { children: "Back to Library" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/analytics'), className: "px-4 py-2 bg-gaming-accent/20 border border-gaming-accent/30 text-gaming-accent rounded-lg font-medium transition-all hover:bg-gaming-accent/30", children: "\uD83D\uDCCA Analytics" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/'), className: "px-4 py-2 bg-gaming-primary/20 border border-gaming-primary/30 text-gaming-primary rounded-lg font-medium transition-all hover:bg-gaming-primary/30", children: "\uD83C\uDFE0 Home" })] })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8 content-section", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "glass-morphism rounded-xl p-6 mb-8 border border-gaming-primary/20", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.9 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gaming-primary/20 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u23F1\uFE0F" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-bold text-lg", children: formatPlaytime(game.hoursPlayed) }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Total Playtime" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-bold text-lg", children: game.localSessionCount || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Sessions" })] })] }), game.lastLocalPlayedAt && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDCC5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-bold text-lg", children: formatDate(game.lastLocalPlayedAt) }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Last Played" })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleAddTags, className: "p-3 bg-gaming-primary/20 hover:bg-gaming-primary/30 text-gaming-primary rounded-xl transition-all group relative border border-gaming-primary/30", title: "Add Tags", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFF7\uFE0F" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-gaming-primary text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gaming-primary/30", children: "Add Tags" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleAddToShelf, className: "p-3 bg-gaming-accent/20 hover:bg-gaming-accent/30 text-gaming-accent rounded-xl transition-all group relative border border-gaming-accent/30", title: "Add to Shelf", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDCDA" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-gaming-accent text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gaming-accent/30", children: "Add to Shelf" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleMarkCompleted, className: "p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-all group relative border border-green-500/30", title: "Mark as Completed", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u2705" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-green-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-green-500/30", children: "Mark as Completed" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleMarkAsBacklog, className: "p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all group relative border border-yellow-500/30", title: game.tags?.includes('Backlog') ? 'Remove from Backlog' : 'Mark as Backlog', children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: game.tags?.includes('Backlog') ? '✓' : '📋' }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-yellow-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-yellow-500/30", children: game.tags?.includes('Backlog') ? 'Remove from Backlog' : 'Mark as Backlog' })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleRateMood, className: "p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-all group relative border border-purple-500/30", title: "Rate Mood", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u2B50" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-purple-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-purple-500/30", children: "Rate Mood" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleEditMetadata, className: "p-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl transition-all group relative border border-amber-500/30", title: "Edit Metadata", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\u270F\uFE0F" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gaming-dark text-amber-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-amber-500/30", children: "Edit Metadata" })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-3xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAD" }), "Identity & Mood"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-4", children: "Current Mood Tags" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-3", children: gameMoods.length > 0 ? (gameMoods.map((mood) => ((0, jsx_runtime_1.jsxs)("span", { className: "px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm text-purple-200 backdrop-blur-sm", children: [mood === 'Chill' && '😌 Chill', mood === 'Competitive' && '🏆 Competitive', mood === 'Story' && '📖 Story', mood === 'Creative' && '🎨 Creative', mood === 'Social' && '👥 Social', mood === 'Dark' && '🌙 Dark', mood === 'Fast-Paced' && '⚡ Fast-Paced', mood] }, mood)))) : ((0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "No mood tags assigned" })) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-4", children: "What this game says about you" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-800/50 rounded-lg p-4 border border-gray-700/50", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300 leading-relaxed", children: [gameMoods.includes('Competitive') && "You're driven by achievement and enjoy testing your skills against others. ", gameMoods.includes('Story') && "You appreciate deep narratives and emotional storytelling experiences. ", gameMoods.includes('Creative') && "You love self-expression and building unique experiences. ", gameMoods.includes('Social') && "You value connection and shared experiences with others. ", gameMoods.includes('Chill') && "You prefer relaxed, stress-free gaming sessions. ", gameMoods.includes('Dark') && "You're drawn to mysterious and atmospheric experiences. ", gameMoods.includes('Fast-Paced') && "You thrive on adrenaline and quick decision-making. ", !gameMoods.length && "This game's personality is waiting to be discovered through your playstyle."] }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-4", children: "When you usually play this" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: game?.hoursPlayed && game.hoursPlayed > 20 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-blue-300 text-sm font-medium", children: "Weekend" }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-100 text-xs mt-1", children: "Deep Sessions" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-purple-300 text-sm font-medium", children: "Evening" }), (0, jsx_runtime_1.jsx)("div", { className: "text-purple-100 text-xs mt-1", children: "Wind Down" })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-green-300 text-sm font-medium", children: "Quick Breaks" }), (0, jsx_runtime_1.jsx)("div", { className: "text-green-100 text-xs mt-1", children: "Short Sessions" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-yellow-300 text-sm font-medium", children: "Exploring" }), (0, jsx_runtime_1.jsx)("div", { className: "text-yellow-100 text-xs mt-1", children: "First Time" })] })] })) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-3xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }), "Game Details"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative w-64 h-96 rounded-xl overflow-hidden cinematic-shadow", children: [(0, jsx_runtime_1.jsx)("img", { src: game.coverImage || 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Game+Cover', alt: game.title, className: "w-full h-full object-cover game-cover-image", onError: (e) => {
                                                                        console.error('❌ Cover art failed to load:', game.coverImage);
                                                                    }, onLoad: () => {
                                                                        console.log('✅ Cover art loaded successfully:', game.coverImage);
                                                                    } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white truncate flex-1 mr-4", children: game.title }), (0, jsx_runtime_1.jsx)(persona_1.PersonaSummaryBar, { persona: persona })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-3", children: (0, jsx_runtime_1.jsxs)("span", { className: `px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${game.playStatus === 'playing' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                                                game.playStatus === 'completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                                                    game.playStatus === 'backlog' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                                                        'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`, children: [game.playStatus === 'playing' && '▶️ Currently Playing', game.playStatus === 'completed' && '✅ Completed', game.playStatus === 'backlog' && '📋 In Backlog', game.playStatus === 'paused' && '⏸️ Paused', game.playStatus === 'abandoned' && '🚫 Abandoned', !game.playStatus && '📝 Not Started'] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 truncate", children: game.platforms?.map(platform => platform.name).join(' • ') || 'Unknown Platform' })] }), game.releaseYear && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent", children: "\uD83D\uDCC5" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-300 whitespace-nowrap", children: ["Released ", game.releaseYear] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [game.hoursPlayed && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent", children: "\u23F1\uFE0F" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-300 whitespace-nowrap", children: [formatPlaytime(game.hoursPlayed), " played"] })] })), game.lastLocalPlayedAt && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent", children: "\uD83D\uDD50" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-300 whitespace-nowrap", children: ["Last played ", formatDate(game.lastLocalPlayedAt)] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFF7\uFE0F" }), "Genres & Tags"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [game.genres && game.genres.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mb-2", children: "Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: game.genres.map((genre, index) => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gaming-primary/20 text-gaming-primary text-xs rounded-full border border-gaming-primary/30 whitespace-nowrap", children: genre.description || genre.name }, index))) })] })), game.tags && game.tags.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mb-2", children: "Tags" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [game.tags.slice(0, 8).map((tag, index) => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/30 whitespace-nowrap", children: tag }, index))), game.tags.length > 8 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-3 py-1 bg-gray-600/50 text-gray-400 text-xs rounded-full whitespace-nowrap", children: ["+", game.tags.length - 8, " more"] }))] })] }))] })] })] })] }), game.description && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCD6" }), "About This Game"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 leading-relaxed text-lg", children: game.description })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-3xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCDA" }), "Shelves"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD70\uFE0F" }), "From This Era"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [games
                                                                        .filter(g => g.id !== game?.id && g.releaseYear === game?.releaseYear)
                                                                        .slice(0, 3)
                                                                        .map((eraGame) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gaming-accent/50 transition-colors cursor-pointer", onClick: () => navigate(`/library/game/${eraGame.id}`), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("img", { src: eraGame.coverImage || 'https://via.placeholder.com/60x80/8b5cf6/ffffff?text=Game', alt: eraGame.title, className: "w-12 h-16 rounded object-cover" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-semibold text-white", children: eraGame.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: [eraGame.releaseYear, " \u2022 ", eraGame.platforms?.[0]?.name] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gaming-accent", children: "Same Era" }) })] }, eraGame.id))), games.filter(g => g.id !== game?.id && g.releaseYear === game?.releaseYear).length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-center py-4", children: "No other games from this era" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAD" }), "Similar Vibes"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [games
                                                                        .filter(g => g.id !== game?.id && g.tags && game?.tags && g.tags.some(tag => game.tags.includes(tag)))
                                                                        .slice(0, 3)
                                                                        .map((vibeGame) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gaming-accent/50 transition-colors cursor-pointer", onClick: () => navigate(`/library/game/${vibeGame.id}`), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("img", { src: vibeGame.coverImage || 'https://via.placeholder.com/60x80/8b5cf6/ffffff?text=Game', alt: vibeGame.title, className: "w-12 h-16 rounded object-cover" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-semibold text-white", children: vibeGame.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: vibeGame.tags?.filter(tag => game?.tags?.includes(tag)).slice(0, 2).join(', ') })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gaming-accent", children: "Similar Mood" }) })] }, vibeGame.id))), games.filter(g => g.id !== game?.id && g.tags && game?.tags && g.tags.some(tag => game.tags.includes(tag))).length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-center py-4", children: "No games with similar vibes found" }))] })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-1 space-y-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCCA" }), "Stats & History"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 rounded-lg p-4 border border-gray-700/50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm", children: "Total Playtime" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-bold text-lg", children: formatPlaytime(game.hoursPlayed) })] }), game.lastLocalPlayedAt && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm", children: "Last Played" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: formatDate(game.lastLocalPlayedAt) })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-800/50 rounded-lg p-4 border border-gray-700/50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm", children: "Total Sessions" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-bold text-lg", children: game.localSessionCount || 0 })] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Recent Sessions" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [game.lastLocalPlayedAt && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-300 text-sm font-medium", children: formatDate(game.lastLocalPlayedAt) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-400 text-xs", children: [formatPlaytime(game.hoursPlayed), " session"] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-gray-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-300 text-sm font-medium", children: "First played" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-xs", children: "Added to library" })] })] })] })] })] })] }) })] })] })] }));
};
exports.GameDetailsLayout = GameDetailsLayout;
