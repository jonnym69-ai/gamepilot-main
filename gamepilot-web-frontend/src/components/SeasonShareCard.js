"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonShareCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SeasonShareCard = ({ report, className = '' }) => {
    const cardRef = (0, react_1.useRef)(null);
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
    // Get dominant session length
    const dominantSession = Object.entries(report.sessionLengthTrends)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'medium';
    // Get dominant time of day
    const dominantTime = Object.entries(report.timeOfDayPatterns)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'evening';
    return ((0, jsx_runtime_1.jsxs)("div", { ref: cardRef, className: `season-share-card ${className}`, style: {
            width: '450px',
            height: '650px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                    pointerEvents: 'none'
                } }), (0, jsx_runtime_1.jsxs)("div", { style: { position: 'relative', textAlign: 'center', marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsxs)("h1", { style: {
                            fontSize: '28px',
                            fontWeight: 'bold',
                            margin: 0,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }, children: [report.monthName, " ", report.year] }), (0, jsx_runtime_1.jsx)("div", { style: {
                            fontSize: '14px',
                            opacity: 0.9,
                            marginTop: '8px'
                        }, children: "Your Gaming Season" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                            fontSize: '12px',
                            opacity: 0.8,
                            marginTop: '4px'
                        }, children: [report.snapshotCount, " Snapshots \u2022 ", report.newMilestones.length, " Milestones"] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Season Overview" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '20px', marginBottom: '4px' }, children: "\uD83D\uDCC5" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8' }, children: "Snapshots" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '16px', fontWeight: '600' }, children: report.snapshotCount })] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '20px', marginBottom: '4px' }, children: "\uD83C\uDFC6" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8' }, children: "Milestones" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '16px', fontWeight: '600' }, children: report.newMilestones.length })] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '20px', marginBottom: '4px' }, children: "\uD83D\uDCC8" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8' }, children: "Completion" }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '16px', fontWeight: '600' }, children: [Math.round(report.completionRateChange.end * 100), "%", report.completionRateChange.change !== 0 && ((0, jsx_runtime_1.jsxs)("span", { style: {
                                                    fontSize: '12px',
                                                    marginLeft: '4px',
                                                    color: report.completionRateChange.change > 0 ? '#10b981' : '#ef4444'
                                                }, children: [report.completionRateChange.change > 0 ? '↑' : '↓', Math.abs(report.completionRateChange.change * 100).toFixed(0), "%"] }))] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Gaming Patterns" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '16px', marginBottom: '4px' }, children: "\uD83C\uDFAD" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8' }, children: "Dominant Moods" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }, children: report.dominantMoods.slice(0, 3).map(mood => ((0, jsx_runtime_1.jsxs)("span", { style: {
                                                fontSize: '14px',
                                                background: 'rgba(255,255,255,0.2)',
                                                padding: '2px 6px',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '2px'
                                            }, children: [moodIcons[mood.toLowerCase()] || '🎮', mood] }, mood))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '16px', marginBottom: '4px' }, children: "\u23F0" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8' }, children: "Session Length" }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '14px', fontWeight: '600' }, children: [sessionIcons[dominantSession], " ", dominantSession] }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8', marginTop: '2px' }, children: Object.entries(report.sessionLengthTrends).map(([length, count]) => ((0, jsx_runtime_1.jsxs)("span", { style: { marginRight: '8px' }, children: [length, ": ", count] }, length))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '16px', marginBottom: '4px' }, children: "\uD83D\uDD50\uFE0F" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8' }, children: "Peak Time" }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '14px', fontWeight: '600' }, children: [timeIcons[dominantTime], " ", dominantTime.replace('-', ' ')] }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '12px', opacity: '0.8', marginTop: '2px' }, children: Object.entries(report.timeOfDayPatterns).map(([time, count]) => ((0, jsx_runtime_1.jsxs)("span", { style: { marginRight: '8px' }, children: [timeIcons[time], " ", count] }, time))) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Top Identity Games" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: report.topIdentityGames.slice(0, 5).map((game, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                background: 'rgba(255,255,255,0.1)',
                                padding: '8px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#f59e0b',
                                        minWidth: '20px',
                                        textAlign: 'center'
                                    }, children: ["#", index + 1] }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1, textAlign: 'left' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '14px', fontWeight: '500' }, children: game.title }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '12px', opacity: '0.8' }, children: ["Score: ", game.score.toFixed(1), " \u2022 ", game.appearances, " appearances"] })] })] }, game.id))) })] }), report.newMilestones.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "New Milestones" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' }, children: report.newMilestones.slice(0, 4).map(milestone => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                background: 'rgba(255,255,255,0.15)',
                                padding: '8px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                minWidth: '120px'
                            }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '16px' }, children: milestone.icon }), (0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '12px', textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: '500' }, children: milestone.title }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '10px', opacity: '0.8' }, children: milestone.category })] })] }, milestone.id))) })] })), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.95
                        }, children: "Your Season Story" }), (0, jsx_runtime_1.jsx)("div", { style: {
                            fontSize: '13px',
                            lineHeight: '1.4',
                            opacity: 0.9,
                            fontStyle: 'italic',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '12px',
                            borderRadius: '8px',
                            maxHeight: '80px',
                            overflow: 'hidden'
                        }, children: (0, jsx_runtime_1.jsx)("p", { style: { margin: 0 }, children: report.shortNarrative }) })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    fontSize: '10px',
                    opacity: 0.7,
                    textAlign: 'right'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Generated on ", new Date(report.generatedAt).toLocaleDateString()] }), (0, jsx_runtime_1.jsx)("div", { children: "gamepilot.app \u2022 Season Report" })] })] }));
};
exports.SeasonShareCard = SeasonShareCard;
