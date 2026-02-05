"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
// Import feature components
const Home_1 = require("./pages/Home");
const LibrarySimple_1 = require("./features/library/LibrarySimple");
const GameDetailsPage_1 = require("./features/library/pages/GameDetailsPage");
const Identity_1 = require("./pages/Identity");
const Integrations_1 = require("./features/integrations/Integrations");
const Analytics_1 = require("./pages/Analytics");
const InsightsDashboard_1 = require("./pages/InsightsDashboard");
const authStore_1 = require("./store/authStore");
const useLibraryStore_1 = require("./stores/useLibraryStore");
const ProtectedRoute_1 = __importDefault(require("./components/ProtectedRoute"));
const SteamCallback_1 = __importDefault(require("./pages/SteamCallback"));
const Login_1 = __importDefault(require("./pages/Login"));
const Register_1 = __importDefault(require("./pages/Register"));
const Navigation_1 = require("./components/Navigation");
const MobileLayout_1 = require("./components/MobileLayout");
const ToastProvider_1 = require("./components/ui/ToastProvider");
const ErrorBoundary_1 = require("./components/ErrorBoundary");
const TourManager_1 = __importDefault(require("./components/TourManager"));
const HelpDocumentation_1 = __importDefault(require("./features/help/HelpDocumentation"));
const HelpButton_1 = __importDefault(require("./components/HelpButton"));
const LoadingManager_1 = require("./components/LoadingManager");
const CustomisationProvider_1 = require("./features/customisation/CustomisationProvider");
const CustomisationPage_1 = require("./features/customisation/CustomisationPage");
const SplashScreen_1 = __importDefault(require("./components/SplashScreen"));
const BetaOnboarding_1 = require("./components/onboarding/BetaOnboarding");
const BetaFeedback_1 = require("./components/feedback/BetaFeedback");
const personaTestConsole_1 = require("./utils/personaTestConsole");
require("./utils/debugGameData");
require("./utils/quickGenreFix");
require("./App.css");
// Lazy load heavy components
const Settings = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/Settings'))).then(module => ({ default: module.Settings })));
const queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
function App() {
    const { isAuthenticated, user, isLoading, initializeAuth } = (0, authStore_1.useAuth)();
    const [showSplash, setShowSplash] = (0, react_1.useState)(true);
    const [showBetaOnboarding, setShowBetaOnboarding] = (0, react_1.useState)(false);
    const [showFeedback, setShowFeedback] = (0, react_1.useState)(false);
    // Initialize authentication on app load
    (0, react_1.useEffect)(() => {
        // Initialize persona test console for development
        if (process.env.NODE_ENV === 'development') {
            (0, personaTestConsole_1.initializePersonaTestConsole)();
        }
        // Initialize authentication (will use mock user in development)
        initializeAuth();
        // Check if user has completed beta onboarding
        const hasCompletedOnboarding = localStorage.getItem('beta_onboarding_completed');
        if (!hasCompletedOnboarding) {
            setShowBetaOnboarding(true);
        }
    }, []);
    const handleSplashComplete = () => {
        setShowSplash(false);
        // Removed localStorage setting
    };
    const handleBetaOnboardingComplete = () => {
        setShowBetaOnboarding(false);
        localStorage.setItem('beta_onboarding_completed', 'true');
    };
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { onError: (error, errorInfo) => {
            console.error('Global App Error:', error, errorInfo);
            // In production, this would send to error tracking service
        }, children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsx)(LoadingManager_1.LoadingProvider, { children: (0, jsx_runtime_1.jsx)(ToastProvider_1.ToastProvider, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: showSplash ? ((0, jsx_runtime_1.jsx)(SplashScreen_1.default, { onComplete: handleSplashComplete })) : showBetaOnboarding ? ((0, jsx_runtime_1.jsx)(BetaOnboarding_1.BetaOnboarding, { onComplete: handleBetaOnboardingComplete, skipOnboarding: false })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AppContent, { isAuthenticated: isAuthenticated, user: user, isLoading: isLoading, initializeAuth: initializeAuth }), (0, jsx_runtime_1.jsx)(TourManager_1.default, {}), (0, jsx_runtime_1.jsx)(LoadingManager_1.GlobalLoadingOverlay, {}), (0, jsx_runtime_1.jsx)(BetaFeedback_1.FeedbackButton, { onClick: () => setShowFeedback(true) }), (0, jsx_runtime_1.jsx)(BetaFeedback_1.BetaFeedback, { isOpen: showFeedback, onClose: () => setShowFeedback(false), userId: user?.id })] })) }) }) }) }) }));
}
function AppContent({ isAuthenticated, user, isLoading, initializeAuth }) {
    const [hasAttemptedFetch, setHasAttemptedFetch] = (0, react_1.useState)(false);
    const { actions: libraryActions } = (0, useLibraryStore_1.useLibraryStore)();
    (0, react_1.useEffect)(() => {
        // Only fetch once on initial load if not loading and no user
        if (!isLoading && !user && !hasAttemptedFetch) {
            setHasAttemptedFetch(true);
            initializeAuth();
        }
    }, [isLoading, user, hasAttemptedFetch, initializeAuth]);
    // Load library when user is authenticated
    (0, react_1.useEffect)(() => {
        // Load games for development (with or without authentication)
        console.log('🎮 Loading library...');
        libraryActions.loadGames();
    }, [libraryActions]);
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(ToastProvider_1.ToastProvider, { children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen", children: [(0, jsx_runtime_1.jsx)(Navigation_1.Navigation, { isAuthenticated: isAuthenticated, user: user }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(Login_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/register", element: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(Register_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/auth/callback/steam", element: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(SteamCallback_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(Home_1.Home, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/library", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(LibrarySimple_1.LibrarySimple, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/library/add", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(LibrarySimple_1.LibrarySimple, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/library/game/:gameId", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(GameDetailsPage_1.GameDetailsPage, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/identity", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(Identity_1.Identity, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/analytics", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(Analytics_1.Analytics, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/insights", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(InsightsDashboard_1.InsightsDashboard, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/integrations", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(Integrations_1.Integrations, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/settings", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Loading..." }), children: (0, jsx_runtime_1.jsx)(Settings, {}) }) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/customisation", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(CustomisationPage_1.CustomisationPage, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/help", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MobileLayout_1.MobileLayout, { showNavigation: false, children: (0, jsx_runtime_1.jsx)(CustomisationProvider_1.CustomisationProvider, { children: (0, jsx_runtime_1.jsx)(HelpDocumentation_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/", replace: true }) })] }), (0, jsx_runtime_1.jsx)(HelpButton_1.default, {})] }) }) }) }));
}
exports.default = App;
