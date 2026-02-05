"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityShareCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// Mood icons mapping
const moodIcons = {
    'chill': '😌',
    'creative': '🎨',
    'competitive': '⚔️',
    'focused': '🎯',
    'intense': '🔥',
    'cozy': '🏠',
    'exploration': '🗺️',
    'puzzle': '🧩',
    'social': '👥',
    'immersive': '🌟',
    'relaxed': '🧘',
    'energetic': '⚡',
    'strategic': '♟️',
    'adventurous': '🚀',
    'mysterious': '🌙',
    'playful': '🎮'
};
// Session length icons
const sessionIcons = {
    'short': '⏱️',
    'medium': '⏰',
    'long': '⏳'
};
// Time of day icons
const timeIcons = {
    'morning': '🌅',
    'afternoon': '☀️',
    'evening': '🌆',
    'late-night': '🌙'
};
// Play pattern icons
const patternIcons = {
    'completionist': '🏆',
    'explorer': '🗺️',
    'strategist': '♟️',
    'social': '👥',
    'casual': '😊',
    'competitive': '⚔️',
    'collector': '💎',
    'speedrunner': '⚡'
};
const IdentityShareCard = ({ personaContext, identityNarrative, identityDefiningGames, className = '' }) => {
    const cardRef = (0, react_1.useRef)(null);
    // Extract key data
    const dominantMoods = personaContext?.dominantMoods?.slice(0, 4) || [];
    const preferredSession = personaContext?.preferredSessionLength || 'medium';
    const preferredTimes = personaContext?.preferredTimesOfDay?.slice(0, 2) || [];
    const playPatterns = personaContext?.recentPlayPatterns?.slice(0, 3) || [];
    const topGames = identityDefiningGames?.slice(0, 4) || [];
    // Shorten narrative for card
    const shortNarrative = identityNarrative
        ? identityNarrative.split('.').filter(Boolean).slice(0, 2).join('. ') + '.'
        : 'Your unique gaming identity awaits discovery.';
    return ((0, jsx_runtime_1.jsxs)("div", { ref: cardRef, className: `identity-share-card ${className}`, style: {
            width: '400px',
            height: '600px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '32px',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                } }), (0, jsx_runtime_1.jsxs)("div", { style: { position: 'relative', textAlign: 'center', marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)("h1", { style: {
                            fontSize: '28px',
                            fontWeight: 'bold',
                            margin: 0,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }, children: "My Gaming Identity" }), (0, jsx_runtime_1.jsx)("div", { style: {
                            fontSize: '14px',
                            opacity: 0.9,
                            marginTop: '8px'
                        }, children: "Generated with GamePilot" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Gaming Moods" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' }, children: dominantMoods.map(mood => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                background: 'rgba(255,255,255,0.2)',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backdropFilter: 'blur(10px)'
                            }, children: [(0, jsx_runtime_1.jsx)("span", { children: moodIcons[mood.toLowerCase()] || '🎮' }), (0, jsx_runtime_1.jsx)("span", { children: mood })] }, mood))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Gaming Preferences" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '24px', marginBottom: '4px' }, children: sessionIcons[preferredSession] || '⏰' }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: 0.8 }, children: "Session Length" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '14px', fontWeight: '600' }, children: preferredSession })] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '24px', marginBottom: '4px' }, children: preferredTimes.map(time => timeIcons[time.toLowerCase()] || '🌅').join(' ') }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: 0.8 }, children: "Peak Times" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '14px', fontWeight: '600' }, children: preferredTimes.join(', ') })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Play Style" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' }, children: playPatterns.map(pattern => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                background: 'rgba(255,255,255,0.15)',
                                padding: '8px 12px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backdropFilter: 'blur(10px)'
                            }, children: [(0, jsx_runtime_1.jsx)("span", { children: patternIcons[pattern.toLowerCase()] || '🎮' }), (0, jsx_runtime_1.jsx)("span", { children: pattern })] }, pattern))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "My Gaming Story" }), (0, jsx_runtime_1.jsxs)("p", { style: {
                            fontSize: '14px',
                            lineHeight: '1.5',
                            opacity: 0.9,
                            fontStyle: 'italic',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '12px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)'
                        }, children: ["\"", shortNarrative, "\""] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Games That Define Me" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: topGames.map((match, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                background: 'rgba(255,255,255,0.1)',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backdropFilter: 'blur(10px)'
                            }, children: [(0, jsx_runtime_1.jsxs)("span", { children: [index + 1, ". ", match.game.title] }), (0, jsx_runtime_1.jsx)("span", { style: {
                                        fontSize: '11px',
                                        opacity: 0.8,
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '2px 6px',
                                        borderRadius: '4px'
                                    }, children: match.score.toFixed(1) })] }, match.game.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    fontSize: '10px',
                    opacity: 0.7,
                    textAlign: 'right'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Generated on ", new Date().toLocaleDateString()] }), (0, jsx_runtime_1.jsx)("div", { children: "gamepilot.app" })] })] }));
};
exports.IdentityShareCard = IdentityShareCard;
