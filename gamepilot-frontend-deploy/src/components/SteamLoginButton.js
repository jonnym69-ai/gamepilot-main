"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamLoginButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const authStore_1 = require("../store/authStore");
const SteamLoginButton = () => {
    const { user, loginWithSteam } = (0, authStore_1.useAuth)();
    if (user) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("img", { src: user.avatar, alt: user.displayName, className: "w-8 h-8 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: user.displayName }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`, className: "px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors", children: "Logout" })] }));
    }
    return ((0, jsx_runtime_1.jsx)("button", { onClick: loginWithSteam, className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Sign in with Steam" }));
};
exports.SteamLoginButton = SteamLoginButton;
