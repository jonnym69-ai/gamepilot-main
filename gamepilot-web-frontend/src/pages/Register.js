"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Register;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../store/authStore");
function Register() {
    const [username, setUsername] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [displayName, setDisplayName] = (0, react_1.useState)('');
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, react_1.useState)(false);
    const [fieldErrors, setFieldErrors] = (0, react_1.useState)({});
    const { register, isLoading, error, clearError } = (0, authStore_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const validateForm = () => {
        const errors = {};
        if (!username.trim()) {
            errors.username = 'Username is required';
        }
        else if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }
        if (!displayName.trim()) {
            errors.displayName = 'Display name is required';
        }
        else if (displayName.length < 1) {
            errors.displayName = 'Display name cannot be empty';
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!password) {
            errors.password = 'Password is required';
        }
        else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }
        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        }
        else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            clearError();
            await register(username.trim(), email.trim(), password, displayName.trim());
            navigate('/library');
        }
        catch (error) {
            // Error is handled by the store
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
    const isFormValid = username.trim().length >= 3 &&
        displayName.trim().length >= 1 &&
        email.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        password &&
        password.length >= 8 &&
        confirmPassword &&
        password === confirmPassword &&
        Object.keys(fieldErrors).length === 0;
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-md w-full space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-white mb-2", children: "GamePilot" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold text-white/90", children: "Create your account" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 mt-2", children: "Join the gaming universe" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "username", className: "block text-sm font-medium text-white/90 mb-2", children: "Username" }), (0, jsx_runtime_1.jsx)("input", { id: "username", type: "text", value: username, onChange: (e) => {
                                                setUsername(e.target.value);
                                                handleInputChange('username');
                                            }, className: `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.username ? 'border-red-500' : 'border-white/20'}`, placeholder: "Choose a username", required: true, disabled: isLoading }), fieldErrors.username && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: fieldErrors.username }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "displayName", className: "block text-sm font-medium text-white/90 mb-2", children: "Display Name" }), (0, jsx_runtime_1.jsx)("input", { id: "displayName", type: "text", value: displayName, onChange: (e) => {
                                                setDisplayName(e.target.value);
                                                handleInputChange('displayName');
                                            }, className: `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.displayName ? 'border-red-500' : 'border-white/20'}`, placeholder: "How others will see you", required: true, disabled: isLoading }), fieldErrors.displayName && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: fieldErrors.displayName }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-white/90 mb-2", children: "Email" }), (0, jsx_runtime_1.jsx)("input", { id: "email", type: "email", value: email, onChange: (e) => {
                                                setEmail(e.target.value);
                                                handleInputChange('email');
                                            }, className: `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.email ? 'border-red-500' : 'border-white/20'}`, placeholder: "Enter your email", required: true, disabled: isLoading }), fieldErrors.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: fieldErrors.email }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-white/90 mb-2", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { id: "password", type: showPassword ? 'text' : 'password', value: password, onChange: (e) => {
                                                        setPassword(e.target.value);
                                                        handleInputChange('password');
                                                    }, className: `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${fieldErrors.password ? 'border-red-500' : 'border-white/20'}`, placeholder: "Create a password (min. 8 characters)", required: true, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors", disabled: isLoading, children: showPassword ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) })) : ((0, jsx_runtime_1.jsxs)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }), fieldErrors.password && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: fieldErrors.password }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-white/90 mb-2", children: "Confirm Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { id: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', value: confirmPassword, onChange: (e) => {
                                                        setConfirmPassword(e.target.value);
                                                        handleInputChange('confirmPassword');
                                                    }, className: `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-white/20'}`, placeholder: "Confirm your password", required: true, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors", disabled: isLoading, children: showConfirmPassword ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) })) : ((0, jsx_runtime_1.jsxs)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }), fieldErrors.confirmPassword && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: fieldErrors.confirmPassword }))] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-500/20 border border-red-500/50 rounded-lg p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-200 text-sm", children: error }) })), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading || !isFormValid, className: "w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]", children: isLoading ? ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center justify-center", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Creating account..."] })) : ('Create account') })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-center", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-white/70", children: ["Already have an account?", ' ', (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", className: "text-blue-400 hover:text-blue-300 font-medium transition-colors", children: "Sign in" })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-white/50 text-sm", children: ["By creating an account, you agree to our", ' ', (0, jsx_runtime_1.jsx)("a", { href: "#", className: "text-blue-400 hover:text-blue-300 transition-colors", children: "Terms of Service" }), ' ', "and", ' ', (0, jsx_runtime_1.jsx)("a", { href: "#", className: "text-blue-400 hover:text-blue-300 transition-colors", children: "Privacy Policy" })] }) })] }) }));
}
