"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../store/authStore");
function ProtectedRoute({ children }) {
    const location = (0, react_router_dom_1.useLocation)();
    const { isAuthenticated, isLoading } = (0, authStore_1.useAuth)();
    // TEMPORARY BYPASS: Skip authentication for development
    const isDevelopmentBypass = true; // Set to false to re-enable auth
    // Show loading while checking authentication
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-screen", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-white" }) });
    }
    // Redirect to login if not authenticated (and not bypassed)
    if (!isAuthenticated && !isDevelopmentBypass) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    // Render children if authenticated or bypassed
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
