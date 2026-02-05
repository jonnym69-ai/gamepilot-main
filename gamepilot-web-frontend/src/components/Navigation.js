"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../store/authStore");
const Navigation = ({ isAuthenticated, user }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, react_1.useState)(false);
    const [isScrolled, setIsScrolled] = (0, react_1.useState)(false);
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { logout } = (0, authStore_1.useAuth)();
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Logout error:', error);
        }
    };
    // Handle scroll effect for mobile navigation
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // Close mobile menu when route changes
    (0, react_1.useEffect)(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);
    const navigationItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/library', label: 'Library', icon: '📚' },
        { path: '/analytics', label: 'Analytics', icon: '📊' },
        // Development-only insights dashboard
        ...(process.env.NODE_ENV === 'development' ? [
            { path: '/insights', label: 'Insights', icon: '🔍' }
        ] : []),
        { path: '/identity', label: 'Identity', icon: '👤' },
        { path: '/integrations', label: 'Integrations', icon: '🔗' },
        { path: '/customisation', label: 'Customisation', icon: '🎨' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/')
            return true;
        return location.pathname.startsWith(path) && path !== '/';
    };
    // Mock user for development mode
    const displayUser = user;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("nav", { className: `
        hidden md:block glass-morphism border-b border-white/10 fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'py-2' : 'py-4'}
      `, children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-8", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "flex items-center space-x-3 hover:opacity-80 transition-opacity", children: [(0, jsx_runtime_1.jsx)("img", { src: "/logo/a 3_4 angled disc lo.png", alt: "GamePilot", className: "h-8 w-auto object-contain" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl font-gaming bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent", children: "GamePilot" })] }), (0, jsx_runtime_1.jsx)("div", { className: "hidden lg:flex items-center space-x-6", children: navigationItems.map((item) => ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: item.path, className: `
                      flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
                      ${isActive(item.path)
                                                ? 'bg-gaming-primary/20 text-gaming-primary border border-gaming-primary/30'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10'}
                    `, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { children: item.label })] }, item.path))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [isAuthenticated ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "hidden sm:block", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-white/70 text-sm", children: ["Welcome, ", displayUser?.username] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, className: "px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all", children: "Logout" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", className: "px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all", children: "Login" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/register", className: "px-4 py-2 text-sm font-medium bg-gaming-primary text-white hover:bg-gaming-primary/80 rounded-lg transition-all", children: "Register" })] })), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors", "aria-label": "Toggle menu", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-6 h-6 flex flex-col justify-center space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: `block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}` }), (0, jsx_runtime_1.jsx)("span", { className: `block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}` }), (0, jsx_runtime_1.jsx)("span", { className: `block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}` })] }) })] })] }) }) }), isMobileMenuOpen && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 z-40 lg:hidden", onClick: () => setIsMobileMenuOpen(false) }), (0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 right-0 z-50 lg:hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "flex items-center space-x-3 hover:opacity-80 transition-opacity", children: [(0, jsx_runtime_1.jsx)("img", { src: "/logo/a 3_4 angled disc lo.png", alt: "GamePilot", className: "h-8 w-auto object-contain" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-gaming bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent", children: "GamePilot" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsMobileMenuOpen(false), className: "p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors", "aria-label": "Close menu", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-white/5 rounded-lg border border-white/10", children: isAuthenticated ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-gaming-primary rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white font-bold", children: displayUser?.username?.charAt(0)?.toUpperCase() || 'U' }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: displayUser?.username }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Welcome back!" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, className: "px-3 py-1 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all", children: "Logout" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium mb-2", children: "Welcome to GamePilot" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-2", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", onClick: () => setIsMobileMenuOpen(false), className: "w-full px-4 py-2 text-center text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all", children: "Login" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/register", onClick: () => setIsMobileMenuOpen(false), className: "w-full px-4 py-2 text-center text-sm font-medium bg-gaming-primary text-white hover:bg-gaming-primary/80 rounded-lg transition-all", children: "Register" })] })] })) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: navigationItems.map((item) => ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: item.path, onClick: () => setIsMobileMenuOpen(false), className: `
                        flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
                        ${isActive(item.path)
                                                ? 'bg-gaming-primary/20 text-gaming-primary border border-gaming-primary/30'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10'}
                      `, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: item.label }), isActive(item.path) && ((0, jsx_runtime_1.jsx)("span", { className: "ml-auto", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 text-gaming-primary", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) }) }))] }, item.path))) })] }) }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "h-16 md:h-20" })] }));
};
exports.Navigation = Navigation;
