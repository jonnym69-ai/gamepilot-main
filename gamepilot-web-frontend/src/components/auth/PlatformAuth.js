"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAuth = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const authStore_1 = require("../../store/authStore");
const Button_1 = require("../ui/Button");
const Card_1 = require("../ui/Card");
const Badge_1 = require("../ui/Badge");
const PlatformAuth = () => {
    const { user, isAuthenticated, isLoading, error, loginWithSteam, logout } = (0, authStore_1.useAuth)();
    const handleSteamAuth = async () => {
        try {
            loginWithSteam();
        }
        catch (error) {
            console.error('Steam auth error:', error);
        }
    };
    const handleLogout = async () => {
        try {
            logout();
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)(Card_1.Card, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Platform Authentication" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Steam" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Connect your Steam account" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: user?.integrations?.find((i) => i.platform === 'steam') ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Badge_1.Badge, { variant: "success", children: "Connected" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", onClick: handleLogout, disabled: isLoading, children: "Disconnect" })] })) : ((0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleSteamAuth, disabled: isLoading, children: isLoading ? 'Connecting...' : 'Connect Steam' })) })] }) }), error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: error }) })), isAuthenticated && user && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 p-4 bg-green-50 border border-green-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-green-800", children: "Authenticated" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-green-600", children: ["Welcome, ", user.displayName || user.username, "!"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-green-500 mt-1", children: [user.integrations.length, " platform(s) connected"] })] }))] }) }));
};
exports.PlatformAuth = PlatformAuth;
