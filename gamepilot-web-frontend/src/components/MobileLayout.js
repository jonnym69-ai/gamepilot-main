"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Navigation_1 = require("./Navigation");
const authStore_1 = require("../store/authStore");
const MobileLayout = ({ children, showNavigation = true, className = '' }) => {
    const { isAuthenticated, user } = (0, authStore_1.useAuth)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: `min-h-screen ${className}`, children: [showNavigation && isAuthenticated && ((0, jsx_runtime_1.jsx)(Navigation_1.Navigation, { isAuthenticated: isAuthenticated, user: user })), (0, jsx_runtime_1.jsx)("main", { className: "bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full", children: children }) }), showNavigation && isAuthenticated && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-0 left-0 right-0 z-40 lg:hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism border-t border-white/10", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-5 gap-1 p-2", children: [
                            { path: '/', icon: '🏠', label: 'Home' },
                            { path: '/library', icon: '📚', label: 'Library' },
                            { path: '/identity', icon: '👤', label: 'Identity' },
                            { path: '/integrations', icon: '🔗', label: 'Links' },
                            { path: '/settings', icon: '⚙️', label: 'Settings' },
                        ].map((item) => ((0, jsx_runtime_1.jsxs)("a", { href: item.path, className: "flex flex-col items-center space-y-1 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: item.label })] }, item.path))) }) }) })), showNavigation && isAuthenticated && ((0, jsx_runtime_1.jsx)("div", { className: "h-20 lg:hidden" }))] }));
};
exports.MobileLayout = MobileLayout;
