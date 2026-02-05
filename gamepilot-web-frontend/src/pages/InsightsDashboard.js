"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const RecommendationTuningPanel_1 = require("../components/RecommendationTuningPanel");
// Simple chart components
const BarChart = ({ data, title, color = '#3b82f6' }) => {
    const maxValue = Math.max(...Object.values(data));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-3", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(data).map(([key, value]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm w-24 truncate", children: key }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 bg-gray-700 rounded-full h-4 relative overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full transition-all duration-300", style: {
                                    width: `${(value / maxValue) * 100}%`,
                                    backgroundColor: color
                                } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm w-8 text-right", children: value })] }, key))) })] }));
};
const PieChart = ({ data, title }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-3", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(data).map(([key, value], index) => {
                    const percentage = total > 0 ? (value / total) * 100 : 0;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: colors[index % colors.length] } }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm flex-1", children: key }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-300 text-sm", children: [percentage.toFixed(1), "%"] })] }, key));
                }) })] }));
};
const LineChart = ({ data, title }) => {
    const maxValue = Math.max(...Object.values(data));
    const timeSlots = ['morning', 'afternoon', 'evening', 'late-night'];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-3", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end justify-between h-32 gap-2", children: timeSlots.map(slot => {
                    const value = data[slot] || 0;
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-t relative", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300", style: { height: `${height}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-xs mt-1", children: slot }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-xs", children: value })] }, slot));
                }) })] }));
};
const InsightsDashboard = () => {
    const [events, setEvents] = (0, react_1.useState)([]);
    const [stats, setStats] = (0, react_1.useState)({
        contextualShown: 0,
        personaShown: 0,
        contextualClicked: 0,
        personaClicked: 0,
        sessionLengthUsage: {},
        moodUsage: {},
        timeOfDayUsage: {},
        personaEffectiveness: {}
    });
    // Load analytics data from localStorage
    (0, react_1.useEffect)(() => {
        const loadAnalytics = () => {
            try {
                const storedEvents = localStorage.getItem('analytics_events');
                const storedStats = localStorage.getItem('analytics_stats');
                if (storedEvents) {
                    const parsedEvents = JSON.parse(storedEvents);
                    setEvents(parsedEvents.slice(-50)); // Show last 50 events
                }
                if (storedStats) {
                    setStats(JSON.parse(storedStats));
                }
            }
            catch (error) {
                console.warn('Failed to load analytics data:', error);
            }
        };
        loadAnalytics();
        // Refresh every 5 seconds for live updates
        const interval = setInterval(loadAnalytics, 5000);
        return () => clearInterval(interval);
    }, []);
    // Calculate derived metrics
    const contextualCTR = stats.contextualShown > 0
        ? (stats.contextualClicked / stats.contextualShown * 100).toFixed(1)
        : '0.0';
    const personaCTR = stats.personaShown > 0
        ? (stats.personaClicked / stats.personaShown * 100).toFixed(1)
        : '0.0';
    // Clear analytics data
    const clearAnalytics = () => {
        localStorage.removeItem('analytics_events');
        localStorage.removeItem('analytics_stats');
        setEvents([]);
        setStats({
            contextualShown: 0,
            personaShown: 0,
            contextualClicked: 0,
            personaClicked: 0,
            sessionLengthUsage: {},
            moodUsage: {},
            timeOfDayUsage: {},
            personaEffectiveness: {}
        });
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-white mb-2", children: "\uD83D\uDCCA Insights Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Real-time analytics for contextual and persona recommendation systems" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors", children: "\u2190 Back to Home" }), (0, jsx_runtime_1.jsx)("button", { onClick: clearAnalytics, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors", children: "Clear Data" })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-300 text-sm mb-2", children: "Contextual Shown" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-white", children: stats.contextualShown })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-300 text-sm mb-2", children: "Contextual CTR" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-3xl font-bold text-green-400", children: [contextualCTR, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-300 text-sm mb-2", children: "Persona Shown" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-white", children: stats.personaShown })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-300 text-sm mb-2", children: "Persona CTR" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-3xl font-bold text-purple-400", children: [personaCTR, "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)(BarChart, { data: stats.moodUsage, title: "Most Selected Moods", color: "#8b5cf6" }), (0, jsx_runtime_1.jsx)(PieChart, { data: stats.sessionLengthUsage, title: "Session Length Distribution" }), (0, jsx_runtime_1.jsx)(LineChart, { data: stats.timeOfDayUsage, title: "Time-of-Day Engagement" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-3", children: "Persona Effectiveness" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: Object.entries(stats.personaEffectiveness).map(([gameId, data]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 text-sm truncate flex-1", children: gameId }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-xs", children: [data.impressions, " imp"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-xs", children: [data.clicks, " clicks"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-green-400 text-sm font-medium", children: [data.impressions > 0 ? (data.clicks / data.impressions * 100).toFixed(1) : 0, "%"] })] })] }, gameId))) })] })] }), process.env.NODE_ENV === 'development' && ((0, jsx_runtime_1.jsx)("div", { className: "mb-8", children: (0, jsx_runtime_1.jsx)(RecommendationTuningPanel_1.RecommendationTuningPanel, {}) })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-4", children: "Live Event Stream (Last 20)" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: events.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-center py-8", children: "No events recorded yet" })) : (events.slice(-20).reverse().map((event, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-black/20 rounded p-3 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-400 font-medium", children: event.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-xs", children: new Date(event.timestamp).toLocaleTimeString() })] }), (0, jsx_runtime_1.jsx)("pre", { className: "text-gray-300 text-xs overflow-x-auto", children: JSON.stringify(event.payload, null, 2) })] }, index)))) })] })] }) }));
};
exports.InsightsDashboard = InsightsDashboard;
