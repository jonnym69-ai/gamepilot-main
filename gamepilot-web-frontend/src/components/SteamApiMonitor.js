"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSteamApiStatus = exports.SteamApiMonitor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Toast_1 = require("./Toast");
const api_1 = require("../services/api");
const SteamApiMonitor = () => {
    const [status, setStatus] = (0, react_1.useState)({
        isOnline: true,
        lastCheck: new Date(),
        responseTime: 0,
        errorCount: 0,
        cacheInfo: { size: 0, keys: [] }
    });
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    // Monitor Steam API health
    (0, react_1.useEffect)(() => {
        const checkSteamApiHealth = async () => {
            const startTime = Date.now();
            try {
                // Try a lightweight API call to check health
                const token = localStorage.getItem('auth_token');
                if (!token)
                    return;
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api'}/steam/health`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const responseTime = Date.now() - startTime;
                const cacheInfo = api_1.SteamService.getCacheInfo();
                if (response.ok) {
                    setStatus(prev => ({
                        ...prev,
                        isOnline: true,
                        lastCheck: new Date(),
                        responseTime,
                        errorCount: 0,
                        lastError: undefined,
                        cacheInfo
                    }));
                }
                else {
                    const errorCount = status.errorCount + 1;
                    setStatus(prev => ({
                        ...prev,
                        isOnline: false,
                        lastCheck: new Date(),
                        responseTime,
                        errorCount,
                        lastError: `HTTP ${response.status}: ${response.statusText}`,
                        cacheInfo
                    }));
                    // Log error for monitoring
                    console.error('Steam API health check failed:', {
                        status: response.status,
                        statusText: response.statusText,
                        responseTime,
                        errorCount,
                        timestamp: new Date().toISOString()
                    });
                    // Show warning if multiple consecutive failures
                    if (errorCount >= 3) {
                        Toast_1.toast.warning('Steam API issues detected', 'Steam integration may be temporarily unavailable');
                    }
                }
            }
            catch (error) {
                const responseTime = Date.now() - startTime;
                const errorCount = status.errorCount + 1;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                setStatus(prev => ({
                    ...prev,
                    isOnline: false,
                    lastCheck: new Date(),
                    responseTime,
                    errorCount,
                    lastError: errorMessage,
                    cacheInfo: api_1.SteamService.getCacheInfo()
                }));
                // Log error for monitoring
                console.error('Steam API health check error:', {
                    error: errorMessage,
                    responseTime,
                    errorCount,
                    timestamp: new Date().toISOString()
                });
            }
        };
        // Check health every 30 seconds
        const interval = setInterval(checkSteamApiHealth, 30000);
        // Initial check
        checkSteamApiHealth();
        return () => clearInterval(interval);
    }, [status.errorCount]);
    // Log comprehensive error data
    const logErrorData = () => {
        const errorData = {
            steamApiStatus: status,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            cacheInfo: api_1.SteamService.getCacheInfo(),
            localStorage: {
                auth_token: localStorage.getItem('auth_token') ? 'present' : 'missing',
                user: localStorage.getItem('user') ? 'present' : 'missing'
            }
        };
        console.group('🔍 Steam API Debug Information');
        console.log('Status:', status);
        console.log('Cache Info:', api_1.SteamService.getCacheInfo());
        console.log('Full Debug Data:', errorData);
        console.groupEnd();
        // Copy to clipboard for easy sharing
        navigator.clipboard.writeText(JSON.stringify(errorData, null, 2));
        Toast_1.toast.info('Debug info copied', 'Steam API debug information copied to clipboard');
    };
    const clearCache = () => {
        api_1.SteamService.clearSteamCache();
        setStatus(prev => ({
            ...prev,
            cacheInfo: { size: 0, keys: [] }
        }));
    };
    const getStatusColor = () => {
        if (!status.isOnline)
            return 'text-red-400';
        if (status.responseTime > 2000)
            return 'text-yellow-400';
        return 'text-green-400';
    };
    const getStatusText = () => {
        if (!status.isOnline)
            return 'Offline';
        if (status.responseTime > 2000)
            return 'Slow';
        return 'Online';
    };
    // Only show in development or when manually toggled
    if (process.env.NODE_ENV !== 'development' && !isVisible) {
        return ((0, jsx_runtime_1.jsx)("button", { onClick: () => setIsVisible(true), className: "fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-lg opacity-50 hover:opacity-100 transition-opacity z-40", title: "Show Steam API Status", children: "\uD83C\uDFAE" }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-sm z-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold", children: "Steam API Status" }), process.env.NODE_ENV === 'development' && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setIsVisible(!isVisible), className: "text-gray-400 hover:text-white", children: isVisible ? '−' : '+' }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Status:" }), (0, jsx_runtime_1.jsx)("span", { className: getStatusColor(), children: getStatusText() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Response Time:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white", children: [status.responseTime, "ms"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Errors:" }), (0, jsx_runtime_1.jsx)("span", { className: status.errorCount > 0 ? 'text-red-400' : 'text-green-400', children: status.errorCount })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Cache Size:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white", children: [status.cacheInfo.size, " items"] })] }), status.lastError && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-2 bg-red-900/20 border border-red-700 rounded", children: (0, jsx_runtime_1.jsx)("span", { className: "text-red-400 text-xs", children: status.lastError }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: logErrorData, className: "px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700", children: "\uD83D\uDCCB Log Data" }), (0, jsx_runtime_1.jsx)("button", { onClick: clearCache, className: "px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700", children: "\uD83D\uDDD1\uFE0F Clear Cache" })] })] })] }));
};
exports.SteamApiMonitor = SteamApiMonitor;
// Hook for components to check Steam API status
const useSteamApiStatus = () => {
    const [isOnline, setIsOnline] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const checkStatus = () => {
            // Simple check - in production this would be more sophisticated
            const lastError = localStorage.getItem('steam_api_last_error');
            const errorTime = localStorage.getItem('steam_api_error_time');
            if (lastError && errorTime) {
                const errorAge = Date.now() - parseInt(errorTime);
                if (errorAge < 60000) { // Less than 1 minute ago
                    setIsOnline(false);
                }
                else {
                    setIsOnline(true);
                    localStorage.removeItem('steam_api_last_error');
                    localStorage.removeItem('steam_api_error_time');
                }
            }
        };
        const interval = setInterval(checkStatus, 10000);
        checkStatus();
        return () => clearInterval(interval);
    }, []);
    return { isOnline };
};
exports.useSteamApiStatus = useSteamApiStatus;
