"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../store/authStore");
function Login() {
    const { login, isLoading, error, clearError } = (0, authStore_1.useAuth)();
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [fieldErrors, setFieldErrors] = (0, react_1.useState)({});
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const validateForm = () => {
        const errors = {};
        if (!username.trim()) {
            errors.username = 'Username or email is required';
        }
        if (!password) {
            errors.password = 'Password is required';
        }
        else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (isSubmitting || isLoading) {
            return;
        }
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            clearError();
            await login(username.trim(), password);
            navigate('/settings'); // Redirect to Settings instead of Library
        }
        catch (error) {
            // Error is handled by the store
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleSteamLogin = async () => {
        try {
            clearError();
            setFieldErrors({});
            window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/auth/steam`;
        }
        catch (err) {
            console.error('Login error:', err);
        }
    };
    const handleInputChange = (field) => {
        // Clear field-specific error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
        // Clear general error when user starts typing
        if (error) {
            clearError();
        }
    };
    const isFormValid = username.trim() && password && password.length >= 6 && Object.keys(fieldErrors).length === 0;
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-md w-full space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-white mb-2", children: "GamePilot" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold text-white/90", children: "Sign in to your account" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 mt-2", children: "Welcome back to your gaming universe" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleEmailLogin, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "username", className: "block text-sm font-medium text-white/90 mb-2", children: "Username or Email" }), (0, jsx_runtime_1.jsx)("input", { id: "username", type: "text", value: username, onChange: (e) => {
                                                setUsername(e.target.value);
                                                handleInputChange('username');
                                            }, className: `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.username ? 'border-red-500' : 'border-white/20'}`, placeholder: "Enter your username or email", required: true, disabled: isLoading }), fieldErrors.username && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: fieldErrors.username }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-white/90 mb-2", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { id: "password", type: showPassword ? 'text' : 'password', value: password, onChange: (e) => {
                                                        setPassword(e.target.value);
                                                        handleInputChange('password');
                                                    }, className: `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${fieldErrors.password ? 'border-red-500' : 'border-white/20'}`, placeholder: "Enter your password", required: true, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors", disabled: isLoading, children: showPassword ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) })) : ((0, jsx_runtime_1.jsxs)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }), fieldErrors.password && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: fieldErrors.password }))] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-500/20 border border-red-500/50 rounded-lg p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-200 text-sm", children: error }) })), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading || isSubmitting || !isFormValid, className: "w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]", children: isLoading || isSubmitting ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Signing in..."] })) : ('Sign in') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative my-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full border-t border-white/20" }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex justify-center text-sm", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 bg-transparent text-white/60", children: "Or continue with" }) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSteamLogin, disabled: isLoading, className: "w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin h-5 w-5", viewBox: "0 0 24 24", fill: "currentColor", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), (0, jsx_runtime_1.jsx)("span", { className: "ml-2", children: "Connecting..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", viewBox: "0 0 24 24", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M11.979 0C5.678 0 .511 5.254.5 11.577c0 2.347.744 4.521 2.009 6.298L.5 24l6.572-2.379c1.659.938 3.569 1.476 5.607 1.476 6.301 0 11.468-5.254 11.468-11.577C23.647 5.254 18.48 0 11.979 0zm6.489 14.5c-.318.879-1.732 1.637-3.492 1.822-1.76.185-3.492.185-4.713-.185-1.221-.37-2.068-1.113-2.068-1.856 0-.743.747-1.392 1.99-1.856 1.244-.464 2.975-.649 4.713-.649 1.739 0 3.492.185 4.713.649 1.221.464 1.99 1.113 1.99 1.856 0 .743-.747 1.486-2.068 1.856z" }) }), (0, jsx_runtime_1.jsx)("span", { children: "Continue with Steam" })] })) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-center", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-white/70", children: ["Don't have an account?", ' ', (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/register", className: "text-blue-400 hover:text-blue-300 font-medium transition-colors", children: "Sign up" })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "text-white/60 hover:text-white transition-colors", children: "\u2190 Back to Home" }) })] }) }));
}
