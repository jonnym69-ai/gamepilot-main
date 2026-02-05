"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePerformanceTracking = exports.usePageTracking = exports.useAnalyticsContext = exports.AnalyticsProvider = exports.useAnalytics = exports.trackError = exports.trackPerformance = exports.trackOnboardingStep = exports.trackBetaFeedback = exports.trackGameInteraction = exports.trackMoodRecommendation = exports.trackSteamImport = exports.trackUserInteraction = exports.trackEvent = exports.trackPageView = exports.initializeGA4 = exports.GA4_MEASUREMENT_ID = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
exports.GA4_MEASUREMENT_ID = process.env.VITE_GA4_MEASUREMENT_ID || 'GA-MEASUREMENT-ID';
// Initialize Google Analytics 4
const initializeGA4 = () => {
    if (typeof window === 'undefined' || !exports.GA4_MEASUREMENT_ID) {
        console.warn('📊 Google Analytics 4 not initialized - missing measurement ID');
        return;
    }
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    // Configure gtag
    window.gtag('js', new Date());
    window.gtag('config', exports.GA4_MEASUREMENT_ID, {
        debug_mode: process.env.NODE_ENV === 'development',
        send_page_view: false // We'll handle page views manually
    });
    console.log('📊 Google Analytics 4 initialized');
};
exports.initializeGA4 = initializeGA4;
// Track page views
const trackPageView = (path, title) => {
    if (typeof window === 'undefined' || !window.gtag || !exports.GA4_MEASUREMENT_ID)
        return;
    window.gtag('pageview', path, {
        page_title: title || document.title
    });
};
exports.trackPageView = trackPageView;
// Track custom events
const trackEvent = (eventName, parameters) => {
    if (typeof window === 'undefined' || !window.gtag || !exports.GA4_MEASUREMENT_ID)
        return;
    window.gtag('event', eventName, parameters);
};
exports.trackEvent = trackEvent;
// Track user interactions
const trackUserInteraction = (_action, category, label, value) => {
    (0, exports.trackEvent)('user_interaction', {
        event_category: category,
        event_label: label,
        value: value
    });
};
exports.trackUserInteraction = trackUserInteraction;
// Track Steam import events
const trackSteamImport = (action, gameCount, errorType) => {
    (0, exports.trackEvent)('steam_import', {
        event_category: 'steam',
        event_label: action,
        value: gameCount,
        custom_parameters: {
            error_type: errorType
        }
    });
};
exports.trackSteamImport = trackSteamImport;
// Track mood recommendations
const trackMoodRecommendation = (mood, gameCount, recommendationType) => {
    (0, exports.trackEvent)('mood_recommendation', {
        event_category: 'recommendations',
        event_label: mood,
        value: gameCount,
        custom_parameters: {
            recommendation_type: recommendationType
        }
    });
};
exports.trackMoodRecommendation = trackMoodRecommendation;
// Track game interactions
const trackGameInteraction = (action, gameTitle, category) => {
    (0, exports.trackEvent)('game_interaction', {
        event_category: category || 'games',
        event_label: action,
        custom_parameters: {
            game_title: gameTitle
        }
    });
};
exports.trackGameInteraction = trackGameInteraction;
// Track beta feedback
const trackBetaFeedback = (feedbackType, category) => {
    (0, exports.trackEvent)('beta_feedback', {
        event_category: 'beta',
        event_label: feedbackType,
        custom_parameters: {
            feedback_category: category
        }
    });
};
exports.trackBetaFeedback = trackBetaFeedback;
// Track onboarding steps
const trackOnboardingStep = (step, stepName, completed) => {
    (0, exports.trackEvent)('onboarding', {
        event_category: 'user_journey',
        event_label: stepName,
        value: step,
        custom_parameters: {
            completed: completed
        }
    });
};
exports.trackOnboardingStep = trackOnboardingStep;
// Track performance metrics
const trackPerformance = (metricName, value, unit) => {
    (0, exports.trackEvent)('performance', {
        event_category: 'technical',
        event_label: metricName,
        value: value,
        custom_parameters: {
            unit: unit
        }
    });
};
exports.trackPerformance = trackPerformance;
// Track errors
const trackError = (errorName, errorMessage, context) => {
    (0, exports.trackEvent)('error', {
        event_category: 'technical',
        event_label: errorName,
        custom_parameters: {
            error_message: errorMessage,
            context: context
        }
    });
};
exports.trackError = trackError;
// Custom hook for analytics
const useAnalytics = () => {
    (0, react_1.useEffect)(() => {
        (0, exports.initializeGA4)();
    }, []);
    return {
        trackPageView: exports.trackPageView,
        trackEvent: exports.trackEvent,
        trackUserInteraction: exports.trackUserInteraction,
        trackSteamImport: exports.trackSteamImport,
        trackMoodRecommendation: exports.trackMoodRecommendation,
        trackGameInteraction: exports.trackGameInteraction,
        trackBetaFeedback: exports.trackBetaFeedback,
        trackOnboardingStep: exports.trackOnboardingStep,
        trackPerformance: exports.trackPerformance,
        trackError: exports.trackError
    };
};
exports.useAnalytics = useAnalytics;
// Analytics Provider Component
const react_2 = require("react");
const AnalyticsContext = (0, react_2.createContext)(null);
const AnalyticsProvider = ({ children }) => {
    const analytics = (0, exports.useAnalytics)();
    return ((0, jsx_runtime_1.jsx)(AnalyticsContext.Provider, { value: analytics, children: children }));
};
exports.AnalyticsProvider = AnalyticsProvider;
const useAnalyticsContext = () => {
    const context = (0, react_2.useContext)(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
    }
    return context;
};
exports.useAnalyticsContext = useAnalyticsContext;
// Enhanced page tracking hook
const usePageTracking = (path, title) => {
    const { trackPageView } = (0, exports.useAnalyticsContext)();
    (0, react_1.useEffect)(() => {
        trackPageView(path, title);
    }, [path, title, trackPageView]);
};
exports.usePageTracking = usePageTracking;
// Performance monitoring hook
const usePerformanceTracking = () => {
    const { trackPerformance, trackError } = (0, exports.useAnalyticsContext)();
    (0, react_1.useEffect)(() => {
        // Track page load time
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    const navEntry = entry;
                    const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
                    trackPerformance('page_load_time', Math.round(loadTime), 'milliseconds');
                }
            }
        });
        observer.observe({ entryTypes: ['navigation'] });
        return () => observer.disconnect();
    }, [trackPerformance, trackError]);
    // Track vitals
    (0, react_1.useEffect)(() => {
        const vitalsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    const lcpEntry = entry;
                    trackPerformance('largest_contentful_paint', Math.round(lcpEntry.startTime), 'milliseconds');
                }
                if (entry.entryType === 'first-contentful-paint') {
                    const fcpEntry = entry;
                    trackPerformance('first_contentful_paint', Math.round(fcpEntry.startTime), 'milliseconds');
                }
            }
        });
        vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-contentful-paint'] });
        return () => vitalsObserver.disconnect();
    }, [trackPerformance]);
};
exports.usePerformanceTracking = usePerformanceTracking;
