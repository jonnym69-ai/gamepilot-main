"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LogoutButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../store/authStore");
function LogoutButton() {
    const { logout, user } = (0, authStore_1.useAuthStore)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return ((0, jsx_runtime_1.jsxs)("button", { onClick: handleLogout, className: "flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20", title: `Logout ${user?.username}`, children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Logout" })] }));
}
