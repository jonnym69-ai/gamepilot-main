"use strict";
// Google Analytics 4 Configuration
// Analytics package integration - install ga-gtag when analytics tracking is needed
// Command: npm install ga-gtag
// import { gtag } from 'ga-gtag'
Object.defineProperty(exports, "__esModule", { value: true });
exports.GA4Tracker = exports.initializeGA4 = exports.ga4Config = void 0;
exports.ga4Config = {
    measurementId: process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-XXXXXXXXX',
    trackingEnabled: process.env.NODE_ENV === 'production',
    debugMode: process.env.NODE_ENV === 'development',
    anonymizeIp: true,
    cookieDomain: 'auto',
    cookieFlags: 'SameSite=Lax;Secure',
    sendPageView: true,
    sampleRate: 100,
    siteSpeedSampleRate: 1,
    allowAdFeatures: false,
    allowAdPersonalizationSignals: false,
    allowGoogleSignals: false,
    cookieUpdate: true,
    cookieExpires: 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
};
// Initialize Google Analytics 4
const initializeGA4 = () => {
    if (!exports.ga4Config.trackingEnabled || !exports.ga4Config.measurementId) {
        return;
    }
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${exports.ga4Config.measurementId}`;
    document.head.appendChild(script);
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };
    // Configure gtag
    // gtag('js', new Date())
    // gtag('config', ga4Config.measurementId, {
    //   debug_mode: ga4Config.debugMode,
    //   anonymize_ip: ga4Config.anonymizeIp,
    //   cookie_domain: ga4Config.cookieDomain,
    //   cookie_flags: ga4Config.cookieFlags,
    //   send_page_view: ga4Config.sendPageView,
    //   sample_rate: ga4Config.sampleRate,
    //   site_speed_sample_rate: ga4Config.siteSpeedSampleRate,
    //   allow_ad_features: ga4Config.allowAdFeatures,
    //   allow_ad_personalization_signals: ga4Config.allowAdPersonalizationSignals,
    //   allow_google_signals: ga4Config.allowGoogleSignals,
    //   cookie_update: ga4Config.cookieUpdate,
    //   cookie_expires: ga4Config.cookieExpires
    // })
};
exports.initializeGA4 = initializeGA4;
// Custom Google Analytics 4 tracking utilities
class GA4Tracker {
    // Initialize tracker
    static initialize() {
        if (this.isInitialized) {
            return;
        }
        (0, exports.initializeGA4)();
        this.isInitialized = true;
    }
    // Track page view
    static trackPageView(_pagePath, _pageTitle) {
        if (!this.isInitialized) {
            return;
        }
        // gtag('event', 'page_view', {
        //   page_location: window.location.href,
        //   page_path: _pagePath || window.location.pathname,
        //   page_title: _pageTitle || document.title,
        //   send_to: ga4Config.measurementId
        // })
    }
    // Track custom event
    static trackEvent(_eventName, _parameters) {
        if (!this.isInitialized) {
            return;
        }
        // gtag('event', eventName, {
        //   send_to: ga4Config.measurementId,
        //   ...parameters
        // })
    }
    // Track user engagement
    static trackUserEngagement(action, category, label, value) {
        this.trackEvent('user_engagement', {
            event_category: category,
            event_action: action,
            event_label: label,
            value: value,
            engagement_time_msec: Date.now()
        });
    }
    // Track authentication events
    static trackAuth(action, method, userId) {
        this.trackEvent(action, {
            event_category: 'authentication',
            event_action: action,
            event_label: method,
            user_id: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track game library events
    static trackGameLibrary(action, gameId, gameTitle) {
        this.trackEvent('game_library', {
            event_category: 'game_library',
            event_action: action,
            event_label: gameTitle,
            game_id: gameId,
            timestamp: new Date().toISOString()
        });
    }
    // Track mood engine events
    static trackMoodEngine(action, mood, count) {
        this.trackEvent('mood_engine', {
            event_category: 'mood_engine',
            event_action: action,
            event_label: mood,
            recommendation_count: count,
            timestamp: new Date().toISOString()
        });
    }
    // Track search events
    static trackSearch(query, results, category) {
        this.trackEvent('search', {
            event_category: 'search',
            event_action: 'perform_search',
            event_label: category,
            search_term: query,
            search_results: results,
            timestamp: new Date().toISOString()
        });
    }
    // Track integration events
    static trackIntegration(platform, action, success) {
        this.trackEvent('integration', {
            event_category: 'integration',
            event_action: action,
            event_label: platform,
            success: success,
            timestamp: new Date().toISOString()
        });
    }
    // Track file upload events
    static trackFileUpload(fileName, fileSize, fileType, success) {
        this.trackEvent('file_upload', {
            event_category: 'file_upload',
            event_action: success ? 'upload_success' : 'upload_failure',
            event_label: fileName,
            file_size: fileSize,
            file_type: fileType,
            timestamp: new Date().toISOString()
        });
    }
    // Track WebSocket events
    static trackWebSocket(action, userId) {
        this.trackEvent('websocket', {
            event_category: 'websocket',
            event_action: action,
            event_label: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track performance metrics
    static trackPerformance(metric, value, unit) {
        this.trackEvent('performance', {
            event_category: 'performance',
            event_action: metric,
            event_label: unit,
            value: value,
            timestamp: new Date().toISOString()
        });
    }
    // Track error events
    static trackError(error, context, userId) {
        this.trackEvent('error', {
            event_category: 'error',
            event_action: 'javascript_error',
            event_label: context,
            error_message: error.message,
            error_stack: error.stack,
            user_id: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track user feedback
    static trackFeedback(rating, feedback, userId) {
        this.trackEvent('user_feedback', {
            event_category: 'feedback',
            event_action: 'submit_feedback',
            event_label: rating.toString(),
            feedback_text: feedback,
            user_id: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track feature usage
    static trackFeatureUsage(feature, action, userId) {
        this.trackEvent('feature_usage', {
            event_category: 'feature',
            event_action: action,
            event_label: feature,
            user_id: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track A/B test events
    static trackABTest(testName, variation, userId) {
        this.trackEvent('ab_test', {
            event_category: 'ab_test',
            event_action: 'view',
            event_label: testName,
            variation: variation,
            user_id: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track social sharing events
    static trackSocialShare(platform, content, userId) {
        this.trackEvent('social_share', {
            event_category: 'social',
            event_action: 'share',
            event_label: platform,
            content_type: content,
            user_id: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track purchase events (for future monetization)
    static trackPurchase(transactionId, value, currency, items, userId) {
        this.trackEvent('purchase', {
            event_category: 'ecommerce',
            event_action: 'purchase',
            event_label: transactionId,
            transaction_id: transactionId,
            value: value,
            currency: currency,
            items: items,
            user_id: userId,
            timestamp: new Date().toISOString()
        });
    }
    // Track custom conversion events
    static trackConversion(conversionName, value, currency) {
        this.trackEvent('conversion', {
            event_category: 'conversion',
            event_action: conversionName,
            event_label: 'conversion',
            value: value,
            currency: currency,
            timestamp: new Date().toISOString()
        });
    }
    // Track user properties
    static setUserProperty(_property, _value) {
        if (!this.isInitialized) {
            return;
        }
        // gtag('config', ga4Config.measurementId, {
        //   [_property]: _value
        // })
    }
    // Set user ID
    static setUserId(_userId) {
        if (!this.isInitialized) {
            return;
        }
        // gtag('config', ga4Config.measurementId, {
        //   user_id: _userId
        // })
    }
    // Track session metrics
    static trackSessionMetrics(sessionDuration, pageViews) {
        this.trackEvent('session_metrics', {
            event_category: 'session',
            event_action: 'session_end',
            session_duration: sessionDuration,
            page_views: pageViews,
            timestamp: new Date().toISOString()
        });
    }
    // Track scroll depth
    static trackScrollDepth(depth, pagePath) {
        this.trackEvent('scroll_depth', {
            event_category: 'engagement',
            event_action: 'scroll',
            event_label: pagePath || window.location.pathname,
            scroll_percentage: depth,
            timestamp: new Date().toISOString()
        });
    }
    // Track form interactions
    static trackFormInteraction(formName, action, step) {
        this.trackEvent('form_interaction', {
            event_category: 'form',
            event_action: action,
            event_label: formName,
            form_step: step,
            timestamp: new Date().toISOString()
        });
    }
    // Track content engagement
    static trackContentEngagement(contentType, contentId, duration) {
        this.trackEvent('content_engagement', {
            event_category: 'engagement',
            event_action: 'content_view',
            event_label: contentType,
            content_id: contentId,
            engagement_duration: duration,
            timestamp: new Date().toISOString()
        });
    }
    // Track outbound links
    static trackOutboundLink(url, linkText) {
        this.trackEvent('outbound_link', {
            event_category: 'outbound',
            event_action: 'click',
            event_label: url,
            link_text: linkText,
            timestamp: new Date().toISOString()
        });
    }
    // Track download events
    static trackDownload(fileName, fileType, fileSize) {
        this.trackEvent('download', {
            event_category: 'download',
            event_action: 'click',
            event_label: fileName,
            file_type: fileType,
            file_size: fileSize,
            timestamp: new Date().toISOString()
        });
    }
    // Track video events
    static trackVideoEvent(videoTitle, action, progress) {
        this.trackEvent('video', {
            event_category: 'video',
            event_action: action,
            event_label: videoTitle,
            video_progress: progress,
            timestamp: new Date().toISOString()
        });
    }
    // Track custom dimensions
    static trackCustomDimension(_dimension, _value) {
        if (!this.isInitialized) {
            return;
        }
        // gtag('config', ga4Config.measurementId, {
        //   [_dimension]: _value
        // })
    }
    // Track custom metrics
    static trackCustomMetric(_metric, _value) {
        if (!this.isInitialized) {
            return;
        }
        // gtag('config', ga4Config.measurementId, {
        //   [_metric]: _value
        // })
    }
    // Disable tracking
    static disableTracking() {
        if (!this.isInitialized) {
            return;
        }
        ;
        window['ga-disable-' + exports.ga4Config.measurementId] = true;
    }
    // Enable tracking
    static enableTracking() {
        if (!this.isInitialized) {
            return;
        }
        ;
        window['ga-disable-' + exports.ga4Config.measurementId] = false;
    }
    // Check if tracking is enabled
    static isTrackingEnabled() {
        return this.isInitialized && !window['ga-disable-' + exports.ga4Config.measurementId];
    }
    // Get current configuration
    static getConfig() {
        return { ...exports.ga4Config };
    }
    // Update configuration
    static updateConfig(config) {
        Object.assign(exports.ga4Config, config);
    }
}
exports.GA4Tracker = GA4Tracker;
GA4Tracker.isInitialized = false;
// Export default for easy import
exports.default = GA4Tracker;
