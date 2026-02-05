"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonTimeline = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SeasonItem = ({ report, isExpanded, onToggle, onGenerateCard }) => {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "season-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "timeline-dot", children: (0, jsx_runtime_1.jsx)("div", { className: "timeline-dot-inner season-dot" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "timeline-content season-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-date", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-date-text", children: [report.monthName, " ", report.year] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-meta", children: [report.snapshotCount, " snapshots \u2022 ", report.newMilestones.length, " milestones"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-actions", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onToggle(report.id), className: "timeline-expand-btn", "aria-label": isExpanded ? 'Collapse' : 'Expand', children: isExpanded ? '−' : '+' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onGenerateCard(report), className: "season-generate-btn", "aria-label": "Generate season card", children: "\uD83C\uDFB4" })] })] }), !isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "season-compact", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-compact-overview", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-compact-moods", children: report.dominantMoods.slice(0, 3).map(mood => ((0, jsx_runtime_1.jsxs)("span", { className: "season-mood-tag", children: [moodIcons[mood.toLowerCase()] || '🎮', mood] }, mood))) }), (0, jsx_runtime_1.jsxs)("div", { className: "season-compact-patterns", children: [(0, jsx_runtime_1.jsxs)("span", { className: "season-compact-pattern", children: [sessionIcons[dominantSession], " ", dominantSession] }), (0, jsx_runtime_1.jsxs)("span", { className: "season-compact-pattern", children: [timeIcons[dominantTime], " ", dominantTime.replace('-', ' ')] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-compact-games", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-games-label", children: "Top Games:" }), (0, jsx_runtime_1.jsx)("div", { className: "season-games-list", children: report.topIdentityGames.slice(0, 3).map((game, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "season-compact-game", children: [(0, jsx_runtime_1.jsxs)("span", { className: "season-game-rank", children: ["#", index + 1] }), (0, jsx_runtime_1.jsx)("span", { className: "season-game-title", children: game.title }), (0, jsx_runtime_1.jsx)("span", { className: "season-game-score", children: game.score.toFixed(1) })] }, game.id))) })] }), (0, jsx_runtime_1.jsx)("p", { className: "season-compact-narrative", children: report.shortNarrative }), report.newMilestones.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "season-compact-milestones", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-milestones-label", children: "New Milestones:" }), (0, jsx_runtime_1.jsx)("div", { className: "season-milestones-list", children: report.newMilestones.slice(0, 3).map(milestone => ((0, jsx_runtime_1.jsxs)("div", { className: "season-compact-milestone", children: [(0, jsx_runtime_1.jsx)("span", { className: "season-milestone-icon", children: milestone.icon }), (0, jsx_runtime_1.jsx)("span", { className: "season-milestone-title", children: milestone.title })] }, milestone.id))) })] }))] })), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "season-expanded", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-section", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Season Overview" }), (0, jsx_runtime_1.jsxs)("div", { className: "season-overview-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-overview-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-overview-label", children: "Snapshots" }), (0, jsx_runtime_1.jsx)("div", { className: "season-overview-value", children: report.snapshotCount })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-overview-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-overview-label", children: "Milestones" }), (0, jsx_runtime_1.jsx)("div", { className: "season-overview-value", children: report.newMilestones.length })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-overview-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-overview-label", children: "Completion Rate" }), (0, jsx_runtime_1.jsxs)("div", { className: "season-overview-value", children: [Math.round(report.completionRateChange.end * 100), "%", report.completionRateChange.change !== 0 && ((0, jsx_runtime_1.jsxs)("span", { className: `season-change ${report.completionRateChange.change > 0 ? 'positive' : 'negative'}`, children: [' ', report.completionRateChange.change > 0 ? '↑' : '↓', Math.abs(report.completionRateChange.change * 100).toFixed(0), "%"] }))] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-section", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Gaming Patterns" }), (0, jsx_runtime_1.jsxs)("div", { className: "season-patterns-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-header", children: [(0, jsx_runtime_1.jsx)("span", { className: "season-pattern-icon", children: "\uD83C\uDFAD" }), (0, jsx_runtime_1.jsx)("span", { children: "Dominant Moods" })] }), (0, jsx_runtime_1.jsx)("div", { className: "season-pattern-content", children: report.dominantMoods.map(mood => ((0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-mood", children: [(0, jsx_runtime_1.jsx)("span", { children: moodIcons[mood.toLowerCase()] || '🎮' }), (0, jsx_runtime_1.jsx)("span", { children: mood })] }, mood))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-header", children: [(0, jsx_runtime_1.jsx)("span", { className: "season-pattern-icon", children: "\u23F0" }), (0, jsx_runtime_1.jsx)("span", { children: "Session Length" })] }), (0, jsx_runtime_1.jsx)("div", { className: "season-pattern-content", children: Object.entries(report.sessionLengthTrends).map(([length, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-stat", children: [(0, jsx_runtime_1.jsx)("span", { children: sessionIcons[length] || '⏰' }), (0, jsx_runtime_1.jsx)("span", { children: length }), (0, jsx_runtime_1.jsx)("span", { children: count })] }, length))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-header", children: [(0, jsx_runtime_1.jsx)("span", { className: "season-pattern-icon", children: "\uD83D\uDD50\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: "Time of Day" })] }), (0, jsx_runtime_1.jsx)("div", { className: "season-pattern-content", children: Object.entries(report.timeOfDayPatterns).map(([time, count]) => ((0, jsx_runtime_1.jsxs)("div", { className: "season-pattern-stat", children: [(0, jsx_runtime_1.jsx)("span", { children: timeIcons[time] || '🌅' }), (0, jsx_runtime_1.jsx)("span", { children: time.replace('-', ' ') }), (0, jsx_runtime_1.jsx)("span", { children: count })] }, time))) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-section", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Identity-Defining Games" }), (0, jsx_runtime_1.jsx)("div", { className: "season-games-expanded", children: report.topIdentityGames.map((game, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "season-game-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-game-rank", children: ["#", index + 1] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-game-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-game-title", children: game.title }), (0, jsx_runtime_1.jsxs)("div", { className: "season-game-meta", children: ["Score: ", game.score.toFixed(1), " \u2022 ", game.appearances, " appearances"] })] })] }, game.id))) })] }), report.newMilestones.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "season-section", children: [(0, jsx_runtime_1.jsx)("h4", { children: "New Milestones Unlocked" }), (0, jsx_runtime_1.jsx)("div", { className: "season-milestones-expanded", children: report.newMilestones.map(milestone => ((0, jsx_runtime_1.jsxs)("div", { className: "season-milestone-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-milestone-icon", children: milestone.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "season-milestone-info", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-milestone-title", children: milestone.title }), (0, jsx_runtime_1.jsx)("div", { className: "season-milestone-description", children: milestone.description }), (0, jsx_runtime_1.jsx)("div", { className: "season-milestone-category", children: milestone.category })] })] }, milestone.id))) })] })), report.playPatternShifts.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "season-section", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Play Pattern Shifts" }), (0, jsx_runtime_1.jsx)("div", { className: "season-shifts", children: report.playPatternShifts.map(shift => ((0, jsx_runtime_1.jsxs)("div", { className: "season-shift-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-shift-pattern", children: shift.pattern }), (0, jsx_runtime_1.jsxs)("div", { className: "season-shift-change", children: [shift.startCount, " \u2192 ", shift.endCount, (0, jsx_runtime_1.jsxs)("span", { className: `season-shift-indicator ${shift.change > 0 ? 'positive' : 'negative'}`, children: [shift.change > 0 ? '↑' : '↓', Math.abs(shift.change)] })] })] }, shift.pattern))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "season-section", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Season Story" }), (0, jsx_runtime_1.jsx)("div", { className: "season-full-narrative", children: (0, jsx_runtime_1.jsx)("p", { children: report.fullNarrative }) })] })] }))] })] }));
};
const SeasonTimeline = ({ reports, onGenerateSeasonCard }) => {
    const [expandedItems, setExpandedItems] = (0, react_1.useState)(new Set());
    const handleToggle = (id) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            }
            else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    const handleGenerateCard = (report) => {
        if (onGenerateSeasonCard) {
            onGenerateSeasonCard(report);
        }
    };
    if (reports.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "identity-seasons-empty", children: [(0, jsx_runtime_1.jsx)("div", { className: "empty-state-icon", children: "\uD83D\uDCC5" }), (0, jsx_runtime_1.jsx)("h3", { children: "No Season Reports Yet" }), (0, jsx_runtime_1.jsx)("p", { children: "Your monthly gaming identity seasons will appear here as you continue your journey." }), (0, jsx_runtime_1.jsx)("p", { children: "Keep creating snapshots to build your season history!" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "identity-seasons", children: [(0, jsx_runtime_1.jsxs)("div", { className: "identity-seasons-header", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Your Seasons" }), (0, jsx_runtime_1.jsxs)("div", { className: "identity-seasons-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "season-stat", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-stat-number", children: reports.length }), (0, jsx_runtime_1.jsx)("div", { className: "season-stat-label", children: "Seasons" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-stat", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-stat-number", children: reports.reduce((sum, report) => sum + report.snapshotCount, 0) }), (0, jsx_runtime_1.jsx)("div", { className: "season-stat-label", children: "Total Snapshots" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "season-stat", children: [(0, jsx_runtime_1.jsx)("div", { className: "season-stat-number", children: reports.reduce((sum, report) => sum + report.newMilestones.length, 0) }), (0, jsx_runtime_1.jsx)("div", { className: "season-stat-label", children: "Milestones" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "timeline season-timeline", children: reports.map((report, index) => ((0, jsx_runtime_1.jsx)(SeasonItem, { report: report, isExpanded: expandedItems.has(report.id), onToggle: handleToggle, onGenerateCard: handleGenerateCard }, report.id))) })] }));
};
exports.SeasonTimeline = SeasonTimeline;
// Add CSS styles
const style = document.createElement('style');
style.textContent = `
.identity-seasons {
  margin: 2rem 0;
}

.identity-seasons-header {
  text-align: center;
  margin-bottom: 2rem;
}

.identity-seasons-header h2 {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.identity-seasons-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.season-stat {
  text-align: center;
}

.season-stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8b5cf6;
}

.season-stat-label {
  font-size: 0.875rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.season-timeline {
  position: relative;
  padding-left: 2rem;
}

.season-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #4b5563, #374151);
}

.season-item {
  position: relative;
  padding-bottom: 2rem;
}

.season-dot {
  position: absolute;
  left: -2rem;
  top: 0;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.season-dot-inner {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #8b5cf6;
  border: 2px solid #1e293b;
  transition: all 0.2s ease;
}

.season-dot-inner.season-dot {
  background: #f59e0b;
}

.season-item:hover .season-dot-inner {
  transform: scale(1.2);
}

.season-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-left: 1rem;
  transition: all 0.3s ease;
}

.season-content.season-content {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.season-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.season-date {
  display: flex;
  flex-direction: column;
}

.season-date-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e5e7eb;
}

.season-meta {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.season-actions {
  display: flex;
  gap: 0.5rem;
}

.timeline-expand-btn,
.season-generate-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timeline-expand-btn:hover,
.season-generate-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.season-compact {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.season-compact-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.season-compact-moods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.season-mood-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #a78bfa;
}

.season-compact-patterns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.season-compact-pattern {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #9ca3af;
}

.season-compact-games {
  margin-top: 0.5rem;
}

.season-games-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.season-games-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.season-compact-game {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #d1d5db;
}

.season-game-rank {
  font-weight: 600;
  color: #f59e0b;
  min-width: 1.5rem;
}

.season-game-title {
  flex: 1;
  font-weight: 500;
}

.season-game-score {
  color: #9ca3af;
}

.season-compact-narrative {
  font-size: 0.875rem;
  color: #d1d5db;
  line-height: 1.4;
  font-style: italic;
  margin: 0;
}

.season-compact-milestones {
  margin-top: 0.5rem;
}

.season-milestones-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.season-milestones-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.season-compact-milestone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #d1d5db;
}

.season-milestone-icon {
  font-size: 1rem;
}

.season-milestone-title {
  font-weight: 500;
}

.season-expanded {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.season-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.season-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.75rem;
}

.season-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.season-overview-item {
  text-align: center;
  padding: 0.75rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 0.5rem;
}

.season-overview-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.season-overview-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e5e7eb;
}

.season-change {
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.season-change.positive {
  color: #10b981;
}

.season-change.negative {
  color: #ef4444;
}

.season-patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.season-pattern-item {
  background: rgba(34, 197, 94, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
}

.season-pattern-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.75rem;
}

.season-pattern-icon {
  font-size: 1.25rem;
}

.season-pattern-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.season-pattern-mood {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #d1d5db;
}

.season-pattern-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #d1d5db;
}

.season-games-expanded {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.season-game-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(55, 65, 81, 0.1);
  border-radius: 0.5rem;
}

.season-game-info {
  flex: 1;
}

.season-game-meta {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.season-milestones-expanded {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.season-milestone-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 0.5rem;
}

.season-milestone-info {
  flex: 1;
}

.season-milestone-title {
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.25rem;
}

.season-milestone-description {
  font-size: 0.875rem;
  color: #d1d5db;
  margin-bottom: 0.25rem;
}

.season-milestone-category {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.season-shifts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.season-shift-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(55, 65, 81, 0.1);
  border-radius: 0.5rem;
}

.season-shift-pattern {
  font-weight: 500;
  color: #e5e7eb;
}

.season-shift-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #d1d5db;
}

.season-shift-indicator {
  font-weight: 600;
}

.season-full-narrative {
  font-size: 0.875rem;
  color: #d1d5db;
  line-height: 1.5;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0;
}

.identity-seasons-empty {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.identity-seasons-empty h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.5rem;
}

.identity-seasons-empty p {
  color: #9ca3af;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto 0.5rem;
}
`;
document.head.appendChild(style);
