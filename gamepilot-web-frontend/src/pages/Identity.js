"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PlaystyleCard_1 = require("../features/identity/components/PlaystyleCard");
const MoodHistoryCard_1 = require("../features/identity/components/MoodHistoryCard");
const GenreBreakdownCard_1 = require("../features/identity/components/GenreBreakdownCard");
const InsightCard_1 = require("../features/identity/components/InsightCard");
const TraitCard_1 = require("../features/identity/components/TraitCard");
const ArchetypeModal_1 = require("../features/identity/components/ArchetypeModal");
const IdentityAura_1 = require("../features/identity/components/IdentityAura");
const HybridArchetypeCard_1 = require("../features/identity/components/HybridArchetypeCard");
const IdentityEvolutionCard_1 = require("../features/identity/components/IdentityEvolutionCard");
const usePersonaSnapshot_1 = require("../hooks/persona/usePersonaSnapshot");
const useCurrentMood_1 = require("../hooks/useCurrentMood");
const EditModeButton_1 = require("../features/customisation/EditModeButton");
const EditModePanel_1 = require("../features/customisation/EditModePanel");
// NEW: Import enhanced persona and contextual engines
const contextualEngine_1 = require("../utils/contextualEngine");
// NEW: Import analytics for insights
const contextualEngine_2 = require("../utils/contextualEngine");
// NEW: Import library store for game data
const useLibraryStore_1 = require("../stores/useLibraryStore");
// NEW: Import narrative generation utility
const generateIdentityNarrative_1 = require("../utils/generateIdentityNarrative");
// NEW: Import shareable card components
const IdentityCardModal_1 = require("../components/IdentityCardModal");
// NEW: Import identity history components
const IdentityTimeline_1 = require("../components/IdentityTimeline");
const identityHistory_1 = require("../utils/identityHistory");
// NEW: Import milestone components
const identityMilestones_1 = require("../utils/identityMilestones");
const MilestoneNotification_1 = require("../components/MilestoneNotification");
// NEW: Import season components
const identitySeason_1 = require("../utils/identitySeason");
const SeasonTimeline_1 = require("../components/SeasonTimeline");
const SeasonShareCard_1 = require("../components/SeasonShareCard");
const Identity = () => {
    const personaSnapshot = (0, usePersonaSnapshot_1.usePersonaSnapshot)();
    const currentMood = (0, useCurrentMood_1.useCurrentMood)();
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    const [isArchetypeModalOpen, setIsArchetypeModalOpen] = (0, react_1.useState)(false);
    // Edit mode state
    const [isEditMode, setIsEditMode] = (0, react_1.useState)(false);
    // NEW: Share card modal state
    const [isCardModalOpen, setIsCardModalOpen] = (0, react_1.useState)(false);
    // NEW: Identity history state
    const [identityHistory, setIdentityHistory] = (0, react_1.useState)([]);
    // NEW: Milestone notification system
    const milestoneNotifications = (0, MilestoneNotification_1.useMilestoneNotifications)();
    const { isNotificationOpen, showNotifications, closeNotifications } = milestoneNotifications;
    // NEW: Milestone state
    const [unlockedMilestones, setUnlockedMilestones] = (0, react_1.useState)([]);
    // NEW: Season state
    const [seasonReports, setSeasonReports] = (0, react_1.useState)([]);
    const [isSeasonCardModalOpen, setIsSeasonCardModalOpen] = (0, react_1.useState)(false);
    const [selectedSeasonReport, setSelectedSeasonReport] = (0, react_1.useState)(null);
    // NEW: Load identity history, milestones, and seasons on mount
    (0, react_1.useEffect)(() => {
        const history = (0, identityHistory_1.getIdentityHistory)();
        setIdentityHistory(history);
        const milestones = (0, identityMilestones_1.getUnlockedMilestones)();
        setUnlockedMilestones(milestones);
        const seasons = (0, identitySeason_1.getSeasonReports)();
        setSeasonReports(seasons);
    }, []);
    // NEW: Listen for milestone events
    (0, react_1.useEffect)(() => {
        const handleMilestoneUpdate = (event) => {
            const { milestones } = event.detail;
            setUnlockedMilestones(milestones);
        };
        window.addEventListener('milestones-updated', handleMilestoneUpdate);
        return () => {
            window.removeEventListener('milestones-updated', handleMilestoneUpdate);
        };
    }, []);
    // NEW: Listen for season events
    (0, react_1.useEffect)(() => {
        const handleSeasonUpdate = (event) => {
            const { reports } = event.detail;
            setSeasonReports(reports);
        };
        window.addEventListener('season-reports-updated', handleSeasonUpdate);
        return () => {
            window.removeEventListener('season-reports-updated', handleSeasonUpdate);
        };
    }, []);
    // NEW: Check if we should generate a season report
    (0, react_1.useEffect)(() => {
        if (identityHistory.length > 0) {
            const lastReport = seasonReports[0];
            if ((0, identitySeason_1.shouldGenerateSeasonReport)(lastReport || null)) {
                const newReport = (0, identitySeason_1.generateSeasonReport)(identityHistory, unlockedMilestones);
                if (newReport) {
                    (0, identitySeason_1.saveSeasonReport)(newReport);
                    setSeasonReports(prev => [newReport, ...prev]);
                }
            }
        }
    }, [identityHistory, unlockedMilestones, seasonReports]);
    // NEW: Get library data for persona analysis
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    // NEW: Generate enhanced persona context
    const personaContext = (0, react_1.useMemo)(() => {
        if (!games || games.length === 0)
            return null;
        try {
            return (0, contextualEngine_1.generatePersonaContext)(games);
        }
        catch (error) {
            console.warn('Failed to generate persona context:', error);
            return null;
        }
    }, [games]);
    // NEW: Get identity-defining games using enhanced contextual matching
    const identityDefiningGames = (0, react_1.useMemo)(() => {
        if (!personaContext || !games)
            return [];
        try {
            const tuning = (0, contextualEngine_2.getTuningSettings)();
            const currentTimeOfDay = (0, contextualEngine_1.detectTimeOfDay)();
            // Use high persona weight for identity-defining games
            const matches = games.map(game => {
                // Convert Game to ContextualGame format
                const contextualGame = {
                    ...game,
                    genres: game.genres?.map(g => typeof g === 'string' ? g : g.name) || [],
                    moods: game.moods || [],
                    sessionLength: game.sessionLength || undefined,
                    recommendedTimes: game.recommendedTimes || undefined,
                    hoursPlayed: game.hoursPlayed || 0,
                    lastPlayed: game.lastPlayed || undefined
                };
                return (0, contextualEngine_1.getPersonaContextualMatch)(contextualGame, {
                    selectedMoods: personaContext.dominantMoods,
                    selectedSessionLength: personaContext.preferredSessionLength,
                    timeOfDay: currentTimeOfDay,
                    personaContext,
                    personaWeight: 0.6 // High weight for identity-defining games
                });
            });
            return matches.slice(0, 10); // Top 10 identity-defining games
        }
        catch (error) {
            console.warn('Failed to get identity-defining games:', error);
            return [];
        }
    }, [personaContext, games]);
    // NEW: Get analytics insights
    const analyticsInsights = (0, react_1.useMemo)(() => {
        try {
            const storedStats = localStorage.getItem('analytics_stats');
            return storedStats ? JSON.parse(storedStats) : null;
        }
        catch (error) {
            return null;
        }
    }, []);
    // NEW: Generate identity narrative
    const identityNarrative = (0, react_1.useMemo)(() => {
        try {
            return (0, generateIdentityNarrative_1.generateIdentityNarrative)({
                personaContext: personaContext || undefined,
                analyticsInsights: analyticsInsights || undefined
            });
        }
        catch (error) {
            console.warn('Failed to generate identity narrative:', error);
            return "Your gaming journey is uniquely yours, shaped by your choices and experiences.";
        }
    }, [personaContext, analyticsInsights]);
    // NEW: Check if we should create a snapshot (weekly trigger)
    (0, react_1.useEffect)(() => {
        if (personaContext && identityDefiningGames && identityNarrative) {
            const lastSnapshot = identityHistory[0];
            if ((0, identityHistory_1.shouldCreateSnapshot)(lastSnapshot?.timestamp)) {
                const snapshot = (0, identityHistory_1.createIdentitySnapshot)(personaContext, identityDefiningGames, identityNarrative.split('.').filter(Boolean).slice(0, 2).join('. ') + '.', identityNarrative);
                (0, identityHistory_1.saveIdentitySnapshot)(snapshot);
                // Check for new milestones
                const newMilestones = (0, identityMilestones_1.detectNewMilestones)(identityHistory, snapshot);
                if (newMilestones.length > 0) {
                    showNotifications(newMilestones);
                }
                setIdentityHistory(prev => [{ ...snapshot, id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }, ...prev]);
            }
        }
    }, [personaContext, identityDefiningGames, identityNarrative, identityHistory]);
    (0, react_1.useEffect)(() => {
        // Trigger animations after component mounts
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);
    // Get archetype theme colors
    const getArchetypeTheme = (archetypeId) => {
        const themes = {
            'Achiever': { primary: 'from-yellow-500 to-amber-600', accent: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            'Explorer': { primary: 'from-purple-500 to-indigo-600', accent: 'text-purple-400', bg: 'bg-purple-500/10' },
            'Socializer': { primary: 'from-blue-500 to-cyan-600', accent: 'text-blue-400', bg: 'bg-blue-500/10' },
            'Competitor': { primary: 'from-red-500 to-orange-600', accent: 'text-red-400', bg: 'bg-red-500/10' },
            'Strategist': { primary: 'from-emerald-500 to-teal-600', accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            'Creative': { primary: 'from-pink-500 to-rose-600', accent: 'text-pink-400', bg: 'bg-pink-500/10' },
            'Casual': { primary: 'from-green-500 to-lime-600', accent: 'text-green-400', bg: 'bg-green-500/10' },
            'Specialist': { primary: 'from-indigo-500 to-purple-600', accent: 'text-indigo-400', bg: 'bg-indigo-500/10' }
        };
        return themes[archetypeId] || themes.Explorer;
    };
    const getArchetypeSymbol = (archetypeId) => {
        const symbols = {
            'Achiever': '🏆',
            'Explorer': '🗺️',
            'Socializer': '👥',
            'Competitor': '⚔️',
            'Strategist': '♟️',
            'Creative': '🎨',
            'Casual': '😌',
            'Specialist': '🎯'
        };
        return symbols[archetypeId] || '🎮';
    };
    const getArchetypeDetails = (archetypeId) => {
        const details = {
            'Achiever': {
                fullDescription: 'You are driven by goals, achievements, and the thrill of completion. Every challenge is an opportunity to prove your worth and climb higher.',
                strengths: ['Goal-oriented mindset', 'High motivation', 'Persistent determination', 'Strategic thinking'],
                weaknesses: ['May over-extend', 'Can be too competitive', 'Sometimes misses the journey', 'Perfectionist tendencies'],
                moodTendencies: ['Focused', 'Determined', 'Competitive', 'Accomplished'],
                recommendedGenres: ['RPG', 'Action', 'Platformer', 'Sports'],
                signatureTraits: ['Completionist', 'Perfectionist', 'Competitive', 'Goal-driven']
            },
            'Explorer': {
                fullDescription: 'You are driven by curiosity and the desire to discover new worlds. Every uncharted territory calls to your adventurous spirit.',
                strengths: ['Curiosity-driven', 'Adaptable', 'Open-minded', 'Detail-oriented'],
                weaknesses: ['Can get distracted', 'May not finish', 'Overly curious', 'Risk-taking'],
                moodTendencies: ['Curious', 'Adventurous', 'Wonder-filled', 'Restless'],
                recommendedGenres: ['Open World', 'Adventure', 'Exploration', 'Survival'],
                signatureTraits: ['Curious', 'Adventurous', 'Detail-oriented', 'Open-minded']
            },
            'Socializer': {
                fullDescription: 'You thrive on connections and shared experiences. Gaming is your way to build communities and forge lasting friendships.',
                strengths: ['Empathetic', 'Team player', 'Communication skills', 'Community builder'],
                weaknesses: ['May avoid solo content', 'Too accommodating', 'Social pressure', 'Distraction-prone'],
                moodTendencies: ['Connected', 'Collaborative', 'Friendly', 'Engaged'],
                recommendedGenres: ['MMO', 'Co-op', 'Social', 'Party Games'],
                signatureTraits: ['Empathetic', 'Collaborative', 'Social', 'Community-focused']
            },
            'Competitor': {
                fullDescription: 'You live for the thrill of victory and the challenge of opposition. Every match is a chance to prove your superiority.',
                strengths: ['Competitive drive', 'Quick thinking', 'Strategic mind', 'Performance under pressure'],
                weaknesses: ['Can be ruthless', 'Poor sportsmanship', 'Overly aggressive', 'Burnout risk'],
                moodTendencies: ['Competitive', 'Focused', 'Intense', 'Victorious'],
                recommendedGenres: ['FPS', 'MOBA', 'Fighting', 'Sports'],
                signatureTraits: ['Competitive', 'Strategic', 'Intense', 'Victory-driven']
            },
            'Strategist': {
                fullDescription: 'You see the bigger picture and excel at planning. Every game is a puzzle to be solved with perfect precision.',
                strengths: ['Analytical thinking', 'Planning skills', 'Pattern recognition', 'Patience'],
                weaknesses: ['Analysis paralysis', 'Over-planning', 'Slow adaptation', 'Perfectionism'],
                moodTendencies: ['Analytical', 'Patient', 'Methodical', 'Strategic'],
                recommendedGenres: ['Strategy', 'Turn-based', 'Puzzle', 'Management'],
                signatureTraits: ['Analytical', 'Strategic', 'Methodical', 'Patient']
            },
            'Creative': {
                fullDescription: 'You express yourself through creation and imagination. Every game is a canvas for your artistic vision.',
                strengths: ['Creativity', 'Innovation', 'Expression', 'Imagination'],
                weaknesses: ['Lack of focus', 'Perfectionism', 'Over-ambitious', 'Procrastination'],
                moodTendencies: ['Inspired', 'Expressive', 'Imaginative', 'Artistic'],
                recommendedGenres: ['Sandbox', 'Building', 'Art', 'Simulation'],
                signatureTraits: ['Creative', 'Innovative', 'Expressive', 'Imaginative']
            },
            'Casual': {
                fullDescription: 'You seek balance and enjoyment in gaming. Every session should be relaxing and stress-free.',
                strengths: ['Balanced approach', 'Stress management', 'Consistency', 'Enjoyment-focused'],
                weaknesses: ['Lack of challenge', 'Slow progress', 'Comfort zone', 'Limited growth'],
                moodTendencies: ['Relaxed', 'Balanced', 'Content', 'Peaceful'],
                recommendedGenres: ['Casual', 'Puzzle', 'Simulation', 'Story'],
                signatureTraits: ['Balanced', 'Relaxed', 'Consistent', 'Enjoyment-focused']
            },
            'Specialist': {
                fullDescription: 'You dedicate yourself to mastering specific genres or games. Excellence is your only acceptable standard.',
                strengths: ['Expertise', 'Dedication', 'Mastery', 'Deep knowledge'],
                weaknesses: ['Narrow focus', 'Resistance to change', 'Perfectionism', 'Burnout risk'],
                moodTendencies: ['Focused', 'Dedicated', 'Expert', 'Mastery-driven'],
                recommendedGenres: ['Specialized', 'Complex', 'Deep', 'Niche'],
                signatureTraits: ['Specialized', 'Dedicated', 'Expert', 'Mastery-focused']
            }
        };
        return details[archetypeId] || details.Explorer;
    };
    const currentArchetype = personaSnapshot?.traits.archetypeId || 'Explorer';
    const theme = getArchetypeTheme(currentArchetype);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker relative overflow-hidden ${isEditMode ? 'ring-2 ring-gaming-primary/50 ring-offset-2 ring-offset-gray-900' : ''}`, children: [(0, jsx_runtime_1.jsx)(IdentityAura_1.IdentityAura, { primaryArchetype: currentArchetype, currentMood: currentMood?.moodId }), (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8 pointer-events-auto relative z-10", children: [(0, jsx_runtime_1.jsx)("header", { className: `mb-16 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: `inline-block ${theme.bg} px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-sm mb-6 cursor-pointer hover:scale-105 transition-transform`, onClick: () => setIsArchetypeModalOpen(true), children: [(0, jsx_runtime_1.jsx)("h1", { className: `text-6xl md:text-7xl font-black ${theme.accent} mb-2 tracking-tight`, children: currentArchetype.toUpperCase() }), (0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: getArchetypeSymbol(currentArchetype) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Click for detailed analysis" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light", children: getArchetypeDetails(currentArchetype).fullDescription })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto space-y-8", children: [(0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-200`, children: (0, jsx_runtime_1.jsx)(HybridArchetypeCard_1.HybridArchetypeCard, { theme: theme }) }), (0, jsx_runtime_1.jsxs)("div", { className: `grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-300`, children: [(0, jsx_runtime_1.jsx)(TraitCard_1.TraitCard, { icon: "\u26A1", label: "Intensity", value: personaSnapshot?.traits.intensity || 'Medium', description: "Energy and engagement level", theme: theme }), (0, jsx_runtime_1.jsx)(TraitCard_1.TraitCard, { icon: "\u23F1\uFE0F", label: "Pacing", value: personaSnapshot?.traits.pacing || 'Flow', description: "Session duration preference", theme: theme }), (0, jsx_runtime_1.jsx)(TraitCard_1.TraitCard, { icon: "\uD83D\uDC65", label: "Social Style", value: personaSnapshot?.traits.socialStyle || 'Solo', description: "Multiplayer preference", theme: theme }), (0, jsx_runtime_1.jsx)(TraitCard_1.TraitCard, { icon: "\uD83C\uDFAF", label: "Challenge", value: personaSnapshot?.traits.riskProfile || 'Balanced', description: "Risk tolerance level", theme: theme }), (0, jsx_runtime_1.jsx)(TraitCard_1.TraitCard, { icon: "\uD83D\uDCD6", label: "Narrative", value: "Story-driven", description: "Story preference", theme: theme })] }), personaContext && ((0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-400`, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-6", children: "Your Gaming Identity" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Dominant Moods" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: personaContext.dominantMoods.map(mood => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm", children: mood }, mood))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Preferred Sessions" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white text-lg font-medium capitalize", children: personaContext.preferredSessionLength })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Peak Times" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: personaContext.preferredTimesOfDay.map(time => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm capitalize", children: time }, time))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Play Patterns" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: personaContext.recentPlayPatterns.slice(0, 2).map(pattern => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm capitalize", children: pattern }, pattern))) })] })] })] }) })), (0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-450`, children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-6", children: "Your Gaming Story" }), (0, jsx_runtime_1.jsx)("div", { className: "max-w-3xl mx-auto", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-gray-200 leading-relaxed font-light", children: identityNarrative }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 flex justify-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-gray-400 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAD" }), (0, jsx_runtime_1.jsx)("span", { children: "Personalized Narrative" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-gray-400 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCCA" }), (0, jsx_runtime_1.jsx)("span", { children: "Data-Driven Insights" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-gray-400 text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u2728" }), (0, jsx_runtime_1.jsx)("span", { children: "Unique Gaming Identity" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 flex justify-center", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                                        setIsCardModalOpen(true);
                                                        // Save snapshot when generating card
                                                        if (personaContext && identityDefiningGames && identityNarrative) {
                                                            const snapshot = (0, identityHistory_1.createIdentitySnapshot)(personaContext, identityDefiningGames, identityNarrative.split('.').filter(Boolean).slice(0, 2).join('. ') + '.', identityNarrative);
                                                            (0, identityHistory_1.saveIdentitySnapshot)(snapshot);
                                                            setIdentityHistory(prev => [{ ...snapshot, id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }, ...prev]);
                                                        }
                                                    }, className: "px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDFB4" }), "Generate Shareable Card"] }) })] }) }) }), identityDefiningGames.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-500`, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-6", children: "Games That Define You" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: identityDefiningGames.slice(0, 9).map((match, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-black/20 rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium", children: match.game.title }), (0, jsx_runtime_1.jsx)("span", { className: "text-green-400 text-sm font-mono", children: match.score.toFixed(1) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: match.game.moods?.slice(0, 3).map(mood => ((0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded", children: mood }, mood))) })] }, match.game.id))) })] }) })), analyticsInsights && ((0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-600`, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-6", children: "How You Play" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-3", children: "Time-of-Day Engagement" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(analyticsInsights.timeOfDayUsage || {}).map(([time, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm capitalize", children: time }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-blue-500 rounded-full", style: { width: `${Math.max(10, (Number(count) / Math.max(...Object.values(analyticsInsights.timeOfDayUsage || {}).map(Number))) * 100)}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-xs w-8", children: Number(count) })] })] }, time))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-3", children: "Session Length Distribution" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(analyticsInsights.sessionLengthUsage || {}).map(([length, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm capitalize", children: length }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-green-500 rounded-full", style: { width: `${Math.max(10, (Number(count) / Math.max(...Object.values(analyticsInsights.sessionLengthUsage || {}).map(Number))) * 100)}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-xs w-8", children: Number(count) })] })] }, length))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-3", children: "Top Moods" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(analyticsInsights.moodUsage || {})
                                                                .sort(([, a], [, b]) => Number(b) - Number(a))
                                                                .slice(0, 5)
                                                                .map(([mood, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm", children: mood }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-purple-500 rounded-full", style: { width: `${Math.max(10, (Number(count) / Math.max(...Object.values(analyticsInsights.moodUsage || {}).map(Number))) * 100)}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-xs w-8", children: Number(count) })] })] }, mood))) })] })] })] }) })), personaContext && ((0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-700`, children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-6", children: "Your Recent Behavior" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Average Session" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white text-lg font-medium", children: [Math.round(personaContext.averageSessionLengthMinutes), " min"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Night Owl Ratio" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white text-lg font-medium", children: [Math.round(personaContext.lateNightRatio * 100), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Completion Rate" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white text-lg font-medium", children: [Math.round(personaContext.completionRate * 100), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-2", children: "Social Gaming" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white text-lg font-medium", children: [Math.round(personaContext.multiplayerRatio * 100), "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-400 text-sm mb-3", children: "Mood Affinity" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: Object.entries(personaContext.moodAffinity)
                                                        .sort(([, a], [, b]) => b - a)
                                                        .slice(0, 8)
                                                        .map(([mood, affinity]) => ((0, jsx_runtime_1.jsxs)("span", { className: "px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm", children: [mood, ": ", (affinity * 100).toFixed(0), "%"] }, mood))) })] })] }) })), (0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-800`, children: (0, jsx_runtime_1.jsx)(IdentityTimeline_1.IdentityTimeline, { snapshots: identityHistory, onRegenerateCard: (snapshot) => {
                                        // Create temporary persona context and games from snapshot
                                        const tempPersonaContext = {
                                            dominantMoods: snapshot.dominantMoods,
                                            preferredSessionLength: snapshot.preferredSessionLength,
                                            preferredTimesOfDay: snapshot.preferredTimesOfDay,
                                            recentPlayPatterns: snapshot.recentPlayPatterns,
                                            moodAffinity: {},
                                            averageSessionLengthMinutes: snapshot.averageSessionLengthMinutes,
                                            lateNightRatio: 0,
                                            completionRate: snapshot.completionRate,
                                            multiplayerRatio: snapshot.multiplayerRatio
                                        };
                                        const tempGames = snapshot.topIdentityGames.map(game => ({
                                            id: game.id,
                                            title: game.title,
                                            moods: [],
                                            genres: [],
                                            hoursPlayed: 0,
                                            sessionLength: snapshot.preferredSessionLength,
                                            recommendedTimes: snapshot.preferredTimesOfDay,
                                            score: game.score
                                        }));
                                        // Open card modal with snapshot data
                                        setIsCardModalOpen(true);
                                    }, onDelete: (snapshotId) => {
                                        (0, identityHistory_1.deleteIdentitySnapshot)(snapshotId);
                                        setIdentityHistory(prev => prev.filter(s => s.id !== snapshotId));
                                    } }) }), (0, jsx_runtime_1.jsx)("div", { className: `mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-900`, children: (0, jsx_runtime_1.jsx)(SeasonTimeline_1.SeasonTimeline, { reports: seasonReports, onGenerateSeasonCard: (report) => {
                                        setSelectedSeasonReport(report);
                                        setIsSeasonCardModalOpen(true);
                                    } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "relative z-10 p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-white mb-2", children: "Identity" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-lg", children: "Your gaming personality decoded" })] }), (0, jsx_runtime_1.jsx)(EditModeButton_1.EditModeButton, { onClick: () => setIsEditMode(!isEditMode), isActive: isEditMode })] }) }), (0, jsx_runtime_1.jsx)("div", { className: `${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-200`, children: (0, jsx_runtime_1.jsx)(PlaystyleCard_1.PlaystyleCard, {}) }), (0, jsx_runtime_1.jsx)("div", { className: `${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-250`, children: (0, jsx_runtime_1.jsx)(IdentityEvolutionCard_1.IdentityEvolutionCard, { theme: theme }) }), (0, jsx_runtime_1.jsx)("div", { className: `${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-300`, children: (0, jsx_runtime_1.jsx)(MoodHistoryCard_1.MoodHistoryCard, {}) }), (0, jsx_runtime_1.jsx)("div", { className: `${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-400`, children: (0, jsx_runtime_1.jsx)(GenreBreakdownCard_1.GenreBreakdownCard, {}) }), (0, jsx_runtime_1.jsx)("div", { className: `${isLoaded ? 'animate-slide-up' : 'opacity-0'} animate-delay-500`, children: (0, jsx_runtime_1.jsx)(InsightCard_1.InsightCards, {}) })] })] })] }), (0, jsx_runtime_1.jsx)(ArchetypeModal_1.ArchetypeModal, { isOpen: isArchetypeModalOpen, onClose: () => setIsArchetypeModalOpen(false), archetype: {
                    id: currentArchetype,
                    name: currentArchetype,
                    symbol: getArchetypeSymbol(currentArchetype),
                    description: getArchetypeDetails(currentArchetype).fullDescription,
                    fullDescription: getArchetypeDetails(currentArchetype).fullDescription,
                    strengths: getArchetypeDetails(currentArchetype).strengths,
                    weaknesses: getArchetypeDetails(currentArchetype).weaknesses,
                    moodTendencies: getArchetypeDetails(currentArchetype).moodTendencies,
                    recommendedGenres: getArchetypeDetails(currentArchetype).recommendedGenres,
                    signatureTraits: getArchetypeDetails(currentArchetype).signatureTraits,
                    theme
                } }), (0, jsx_runtime_1.jsx)(EditModePanel_1.EditModePanel, { pageId: "identity", isOpen: isEditMode, onClose: () => setIsEditMode(false) }), (0, jsx_runtime_1.jsx)(IdentityCardModal_1.IdentityCardModal, { isOpen: isCardModalOpen, onClose: () => setIsCardModalOpen(false), personaContext: personaContext || undefined, identityNarrative: identityNarrative, identityDefiningGames: identityDefiningGames }), (0, jsx_runtime_1.jsx)(MilestoneNotification_1.MilestoneNotification, { milestones: milestoneNotifications.notifications, isOpen: milestoneNotifications.isNotificationOpen, onClose: milestoneNotifications.closeNotifications }), isSeasonCardModalOpen && selectedSeasonReport && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-2xl max-w-4xl w-full border border-amber-500/30 shadow-2xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-amber-500/20", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-2xl font-bold text-white mb-1", children: [selectedSeasonReport.monthName, " ", selectedSeasonReport.year, " Season Report"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-amber-300 text-sm", children: "Your monthly gaming identity summary" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsSeasonCardModalOpen(false), className: "text-amber-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)(SeasonShareCard_1.SeasonShareCard, { report: selectedSeasonReport }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-t border-amber-500/20", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-amber-300 text-sm", children: ["Generated on ", new Date(selectedSeasonReport.generatedAt).toLocaleDateString()] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsSeasonCardModalOpen(false), className: "px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all", children: "Close" })] }) })] }) }))] }));
};
exports.Identity = Identity;
// Add custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
  
  .animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
    opacity: 0;
  }
`;
document.head.appendChild(style);
