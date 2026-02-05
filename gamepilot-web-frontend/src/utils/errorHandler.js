"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandler = exports.handleAsyncError = exports.handleAuthError = exports.handleSteamError = exports.handleGameLibraryError = exports.UserFriendlyErrorHandler = void 0;
const Toast_1 = require("../components/Toast");
class UserFriendlyErrorHandler {
    static getErrorMessage(error, context) {
        // Network errors
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            return {
                userMessage: 'Connection issue detected',
                technicalMessage: 'Unable to connect to the server',
                action: {
                    label: 'Retry',
                    onClick: () => window.location.reload()
                },
                severity: 'medium'
            };
        }
        // Authentication errors
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
            return {
                userMessage: 'Please sign in to continue',
                technicalMessage: 'Authentication required',
                action: {
                    label: 'Sign In',
                    onClick: () => {
                        // Navigate to login page
                        window.location.href = '/login';
                    }
                },
                severity: 'high'
            };
        }
        // Permission errors
        if (error.message.includes('403') || error.message.includes('forbidden')) {
            return {
                userMessage: 'You don\'t have permission to do this',
                technicalMessage: 'Access denied',
                severity: 'medium'
            };
        }
        // Not found errors
        if (error.message.includes('404') || error.message.includes('not found')) {
            return {
                userMessage: 'The requested content wasn\'t found',
                technicalMessage: 'Resource not found',
                severity: 'low'
            };
        }
        // Server errors
        if (error.message.includes('500') || error.message.includes('internal server')) {
            return {
                userMessage: 'Something went wrong on our end',
                technicalMessage: 'Server error occurred',
                action: {
                    label: 'Try Again',
                    onClick: () => window.location.reload()
                },
                severity: 'high'
            };
        }
        // Steam API errors
        if (error.message.includes('steam') || error.message.includes('api')) {
            return {
                userMessage: 'Steam services are temporarily unavailable',
                technicalMessage: 'Steam API error',
                action: {
                    label: 'Try Later',
                    onClick: () => {
                        // Could implement retry logic here
                        Toast_1.toast.info('Steam services will be available soon');
                    }
                },
                severity: 'medium'
            };
        }
        // Game library errors
        if (context?.includes('library') || context?.includes('game')) {
            return {
                userMessage: 'Unable to load your game library',
                technicalMessage: 'Library operation failed',
                action: {
                    label: 'Refresh Library',
                    onClick: () => {
                        // Trigger library refresh
                        window.location.reload();
                    }
                },
                severity: 'medium'
            };
        }
        // Generic error
        return {
            userMessage: 'An unexpected error occurred',
            technicalMessage: error.message,
            action: {
                label: 'Try Again',
                onClick: () => window.location.reload()
            },
            severity: 'medium'
        };
    }
    static handleError(error, context) {
        const errorContext = this.getErrorMessage(error, context);
        // Show appropriate toast based on severity
        switch (errorContext.severity) {
            case 'high':
                Toast_1.toast.error(errorContext.userMessage, errorContext.technicalMessage);
                break;
            case 'medium':
                Toast_1.toast.warning(errorContext.userMessage, errorContext.technicalMessage);
                break;
            case 'low':
                Toast_1.toast.info(errorContext.userMessage, errorContext.technicalMessage);
                break;
        }
        // Log technical details for debugging
        console.group('🚨 User-Friendly Error Handler');
        console.error('Original Error:', error);
        console.info('Context:', context);
        console.info('User Message:', errorContext.userMessage);
        console.info('Technical Message:', errorContext.technicalMessage);
        console.info('Severity:', errorContext.severity);
        console.groupEnd();
        return errorContext;
    }
}
exports.UserFriendlyErrorHandler = UserFriendlyErrorHandler;
_a = UserFriendlyErrorHandler;
UserFriendlyErrorHandler.handleAsyncError = async (asyncOperation, context, options) => {
    try {
        return await asyncOperation();
    }
    catch (error) {
        const errorObj = error;
        if (options?.customHandler) {
            options.customHandler(errorObj);
        }
        else if (options?.showToast !== false) {
            _a.handleError(errorObj, context);
        }
        throw errorObj;
    }
};
UserFriendlyErrorHandler.createRetryableOperation = async (operation, maxRetries = 3, context) => {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries) {
                // Final attempt failed, show error
                _a.handleError(lastError, `${context} (attempt ${attempt}/${maxRetries})`);
                throw lastError;
            }
            // Show retry message
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            Toast_1.toast.warning('Temporary issue detected', `Retrying in ${delay / 1000}s... (attempt ${attempt}/${maxRetries})`);
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
};
// Convenience functions for common operations
const handleGameLibraryError = (error) => {
    UserFriendlyErrorHandler.handleError(error, 'game library');
};
exports.handleGameLibraryError = handleGameLibraryError;
const handleSteamError = (error) => {
    UserFriendlyErrorHandler.handleError(error, 'steam integration');
};
exports.handleSteamError = handleSteamError;
const handleAuthError = (error) => {
    UserFriendlyErrorHandler.handleError(error, 'authentication');
};
exports.handleAuthError = handleAuthError;
const handleAsyncError = (error, context, options) => {
    UserFriendlyErrorHandler.handleError(error, context);
};
exports.handleAsyncError = handleAsyncError;
// React hook for error handling
const useErrorHandler = () => {
    const handleError = (error, context) => {
        return UserFriendlyErrorHandler.handleError(error, context);
    };
    const handleAsyncError = async (asyncOperation, context, options) => {
        return UserFriendlyErrorHandler.handleAsyncError(asyncOperation, context, options);
    };
    const createRetryableOperation = async (operation, maxRetries, context) => {
        return UserFriendlyErrorHandler.createRetryableOperation(operation, maxRetries, context);
    };
    return {
        handleError,
        handleAsyncError,
        createRetryableOperation
    };
};
exports.useErrorHandler = useErrorHandler;
