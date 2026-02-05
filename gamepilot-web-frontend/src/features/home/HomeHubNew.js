"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeHub = HomeHub;
const jsx_runtime_1 = require("react/jsx-runtime");
const useGamePilotStore_1 = require("../../stores/useGamePilotStore");
const useLibraryStore_1 = require("../../stores/useLibraryStore");
const authStore_1 = require("../../store/authStore");
const react_router_dom_1 = require("react-router-dom");
const ErrorBoundary_1 = require("../../components/ErrorBoundary");
const Loading_1 = require("../../components/Loading");
const api_1 = require("../../config/api");
function HomeHub() {
    const { user, isLoading: userLoading, error: userError } = (0, authStore_1.useAuthStore)();
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const { integrations } = (0, useGamePilotStore_1.useGamePilotStore)();
    // Mock recently played data using games from library
    const recentlyPlayed = (games || [])?.slice(0, 5).map(game => ({
        id: game?.id || '',
        title: game?.title || 'Unknown Game',
        coverImage: game?.coverImage || (0, api_1.createApiUrl)('/placeholder/cover/default.jpg'),
        hoursPlayed: Math.floor(Math.random() * 120), // Mock playtime
    }));
    if (userLoading)
        return (0, jsx_runtime_1.jsx)(HomeHubLoading, {});
    if (userError)
        return (0, jsx_runtime_1.jsx)(HomeHubError, { message: userError });
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-8 p-6", children: [(0, jsx_runtime_1.jsxs)("header", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("img", { src: user?.avatar || (0, api_1.createApiUrl)('/placeholder/avatar/default.jpg'), alt: user?.username || user?.displayName || 'User', className: "w-16 h-16 rounded-full object-cover border-2 border-gaming-primary/50" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl font-bold text-white", children: ["Welcome back, ", user?.username || user?.displayName || 'Gamer'] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Your gaming universe at a glance" })] })] }), (0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold mb-3 text-white", children: "Integrations" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsx)(IntegrationCard, { name: "Steam", to: "/integrations/steam", icon: "\uD83C\uDFAE", connected: integrations?.steam?.connected || false }), (0, jsx_runtime_1.jsx)(IntegrationCard, { name: "Discord", to: "/integrations/discord", icon: "\uD83D\uDCAC", connected: integrations?.discord?.connected || false }), (0, jsx_runtime_1.jsx)(IntegrationCard, { name: "YouTube", to: "/integrations/youtube", icon: "\uD83D\uDCFA", connected: integrations?.youtube?.connected || false }), (0, jsx_runtime_1.jsx)(IntegrationCard, { name: "Twitch", to: "/integrations/twitch", icon: "\uD83C\uDFA5" })] })] }), (0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold mb-3 text-white", children: "Recently Played" }), (recentlyPlayed && recentlyPlayed.length > 0) && ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-4 overflow-x-auto pb-2", children: recentlyPlayed.map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "min-w-[160px] glass-morphism rounded-lg p-3 border border-white/10", children: [(0, jsx_runtime_1.jsx)("img", { src: game.coverImage || (0, api_1.createApiUrl)('/placeholder/cover/default.jpg'), alt: game.title, className: "rounded mb-2 w-full h-20 object-cover" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: game.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400", children: [game.hoursPlayed || 0, " hours played"] })] }, game.id))) }))] }), (0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold mb-3 text-white", children: "Recommended for You" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsx)(PlaceholderRecommendation, { title: "Try something atmospheric", description: "Immersive worlds with stunning visuals and ambient soundtracks" }), (0, jsx_runtime_1.jsx)(PlaceholderRecommendation, { title: "Games with strong narrative", description: "Compelling stories that will keep you engaged for hours" }), (0, jsx_runtime_1.jsx)(PlaceholderRecommendation, { title: "Fast\u2011paced action picks", description: "Adrenaline-pumping gameplay for competitive sessions" })] })] })] }) }));
}
/* -------------------------
   SUPPORTING COMPONENTS
-------------------------- */
function IntegrationCard({ name, to, icon, connected }) {
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: to, className: `glass-morphism hover:bg-white/10 transition-all duration-200 rounded-lg p-4 flex flex-col items-center justify-center font-medium text-white border ${connected ? 'border-green-500/50 bg-green-500/10' : 'border-white/10'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl mb-2", children: icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: name }), connected && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-green-400 mt-1", children: "Connected" }))] }));
}
function PlaceholderRecommendation({ title, description }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-lg p-4 border border-white/10", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium mb-1 text-white", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mb-2", children: description }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gaming-primary", children: "Smart recommendations coming in Phase 5" })] }));
}
function HomeHubLoading() {
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(Loading_1.Loading, { message: "Loading your dashboard\u2026", size: "xl" }) }) }));
}
function HomeHubError({ message }) {
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8 max-w-md w-full border border-red-500/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDFE0" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white mb-4", children: "Home Hub Error" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300 mb-6", children: ["Something went wrong loading your dashboard: ", message] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "w-full px-6 py-3 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors", children: "\uD83D\uDD04 Reload Dashboard" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "w-full px-6 py-3 bg-gaming-secondary text-white rounded-lg hover:bg-gaming-secondary/80 transition-colors block text-center", children: "\uD83C\uDFE0 Go Home" })] })] }) }) }) }));
}
