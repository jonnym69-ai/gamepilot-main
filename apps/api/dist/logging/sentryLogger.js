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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentryLogger = exports.SentryLogger = void 0;
exports.initializeSentry = initializeSentry;
exports.sentryErrorHandler = sentryErrorHandler;
exports.sentryRequestHandler = sentryRequestHandler;
const Sentry = __importStar(require("@sentry/node"));
class SentryLogger {
    constructor() {
        this.isInitialized = false;
    }
    static getInstance() {
        if (!SentryLogger.instance) {
            SentryLogger.instance = new SentryLogger();
        }
        return SentryLogger.instance;
    }
    initialize(config) {
        if (this.isInitialized) {
            return;
        }
        if (!config.dsn) {
            console.warn('Sentry DSN not provided, skipping initialization');
            return;
        }
        Sentry.init({
            dsn: config.dsn,
            environment: config.environment || process.env.NODE_ENV || 'development',
            release: config.release || process.env.npm_package_version || '1.0.0',
            tracesSampleRate: config.tracesSampleRate || 0.1,
            integrations: [
                new Sentry.Integrations.Http({ tracing: true }),
                new Sentry.Integrations.Express({ app: null }),
                new Sentry.Integrations.OnUncaughtException(),
                new Sentry.Integrations.OnUnhandledRejection(),
            ],
            beforeSend(event) {
                // Filter out certain errors in development
                if (process.env.NODE_ENV === 'development') {
                    // Don't send certain errors in development
                    if (event.exception?.message?.includes('EADDRINUSE')) {
                        return null;
                    }
                }
                return event;
            }
        });
        this.isInitialized = true;
        console.log('✅ Sentry initialized');
    }
    captureException(error, context) {
        if (!this.isInitialized) {
            console.error('Sentry not initialized, falling back to console:', error);
            return;
        }
        const scope = new Sentry.Scope();
        // Add request context
        if (context?.request) {
            scope.setUser({
                id: context.userId || 'anonymous',
                ip: context.request.ip,
                userAgent: context.request.get('User-Agent')
            });
            scope.setTags({
                method: context.request.method,
                url: context.request.url,
                requestId: context.request.requestId || 'unknown'
            });
            scope.setExtra('headers', context.request.headers);
            scope.setExtra('query', context.request.query);
            scope.setExtra('params', context.request.params);
        }
        // Add custom tags and extra data
        if (context?.tags) {
            scope.setTags(context.tags);
        }
        if (context?.extra) {
            Object.keys(context.extra).forEach(key => {
                scope.setExtra(key, context.extra[key]);
            });
        }
        Sentry.captureException(error, scope);
    }
    captureMessage(message, level = 'info', context) {
        if (!this.isInitialized) {
            console.log(`Sentry not initialized, falling back to console: [${level}] ${message}`);
            return;
        }
        const scope = new Sentry.Scope();
        // Add request context
        if (context?.request) {
            scope.setUser({
                id: context.userId || 'anonymous',
                ip: context.request.ip,
                userAgent: context.request.get('User-Agent')
            });
            scope.setTags({
                method: context.request.method,
                url: context.request.url,
                requestId: context.request.requestId || 'unknown'
            });
        }
        // Add custom tags and extra data
        if (context?.tags) {
            scope.setTags(context.tags);
        }
        if (context?.extra) {
            Object.keys(context.extra).forEach(key => {
                scope.setExtra(key, context.extra[key]);
            });
        }
        Sentry.captureMessage(message, level, scope);
    }
    setUser(user) {
        if (!this.isInitialized) {
            return;
        }
        Sentry.setUser(user);
    }
    clearUser() {
        if (!this.isInitialized) {
            return;
        }
        Sentry.setUser(null);
    }
    setTags(tags) {
        if (!this.isInitialized) {
            return;
        }
        Sentry.setTags(tags);
    }
    setExtra(key, value) {
        if (!this.isInitialized) {
            return;
        }
        Sentry.setExtra(key, value);
    }
    addBreadcrumb(breadcrumb) {
        if (!this.isInitialized) {
            return;
        }
        Sentry.addBreadcrumb(breadcrumb);
    }
    // Security event logging
    captureSecurityEvent(event, severity = 'warning', context) {
        this.captureMessage(`SECURITY: ${event}`, severity, {
            ...context,
            tags: {
                security: 'true',
                ...context?.tags
            },
            extra: {
                ...context?.details,
                timestamp: new Date().toISOString()
            }
        });
    }
    // Performance monitoring
    startTransaction(name, operation) {
        if (!this.isInitialized) {
            return undefined;
        }
        return Sentry.startTransaction({
            name,
            op: operation || 'http.server'
        });
    }
    // Check if Sentry is available
    isReady() {
        return this.isInitialized;
    }
}
exports.SentryLogger = SentryLogger;
// Export singleton instance
exports.sentryLogger = SentryLogger.getInstance();
// Initialize Sentry if DSN is available
function initializeSentry() {
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
        exports.sentryLogger.initialize({
            dsn,
            environment: process.env.NODE_ENV || 'development',
            release: process.env.npm_package_version || '1.0.0',
            tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1')
        });
    }
    else {
        console.log('ℹ️ Sentry DSN not found, error monitoring disabled');
    }
}
// Express middleware for Sentry
function sentryErrorHandler(error, req, res, next) {
    if (exports.sentryLogger.isReady()) {
        exports.sentryLogger.captureException(error, {
            request: req,
            tags: {
                express: 'error_handler'
            }
        });
    }
    next(error);
}
// Request middleware for Sentry
function sentryRequestHandler(req, res, next) {
    if (exports.sentryLogger.isReady()) {
        exports.sentryLogger.addBreadcrumb({
            category: 'request',
            message: `${req.method} ${req.url}`,
            level: 'info',
            data: {
                method: req.method,
                url: req.url,
                headers: req.headers
            }
        });
    }
    next();
}
//# sourceMappingURL=sentryLogger.js.map