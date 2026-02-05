"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAsync = exports.useRetry = void 0;
const react_1 = require("react");
const useRetry = (asyncFunction, options = {}) => {
    const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000, backoffFactor = 2, onRetry, shouldRetry = (error) => {
        // Retry on network errors and 5xx server errors
        return (error.name === 'NetworkError' ||
            error.name === 'TypeError' ||
            (error.message.includes('status') && parseInt(error.message.match(/\d+/)?.[0] || '0') >= 500));
    } } = options;
    const [retryState, setRetryState] = (0, react_1.useState)({
        attempt: 0,
        isRetrying: false
    });
    const timeoutRef = (0, react_1.useRef)();
    const calculateDelay = (0, react_1.useCallback)((attempt) => {
        const delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
        return Math.min(delay, maxDelay);
    }, [baseDelay, backoffFactor, maxDelay]);
    const executeWithRetry = (0, react_1.useCallback)(async (...args) => {
        try {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setRetryState({ attempt: 0, isRetrying: false });
            return await asyncFunction(...args);
        }
        catch (error) {
            const err = error;
            // Check if we should retry
            if (!shouldRetry(err) || retryState.attempt >= maxAttempts) {
                setRetryState(prev => ({
                    ...prev,
                    isRetrying: false,
                    lastError: err
                }));
                throw err;
            }
            // Calculate delay and retry
            const delay = calculateDelay(retryState.attempt + 1);
            const nextAttempt = retryState.attempt + 1;
            setRetryState(prev => ({
                ...prev,
                attempt: nextAttempt,
                isRetrying: true,
                lastError: err
            }));
            // Call retry callback
            onRetry?.(nextAttempt, err);
            // Wait before retrying
            await new Promise(resolve => {
                timeoutRef.current = setTimeout(resolve, delay);
            });
            // Recursive retry
            return executeWithRetry(...args);
        }
    }, [asyncFunction, shouldRetry, maxAttempts, calculateDelay, onRetry, retryState.attempt]);
    const reset = (0, react_1.useCallback)(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setRetryState({ attempt: 0, isRetrying: false });
    }, []);
    return {
        executeWithRetry,
        reset,
        retryState
    };
};
exports.useRetry = useRetry;
// Utility function for simple retry without React hook
const retryAsync = async (asyncFunction, options = {}) => {
    const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000, backoffFactor = 2, onRetry, shouldRetry = (error) => {
        return (error.name === 'NetworkError' ||
            error.name === 'TypeError' ||
            (error.message.includes('status') && parseInt(error.message.match(/\d+/)?.[0] || '0') >= 500));
    } } = options;
    let attempt = 0;
    let lastError;
    while (attempt < maxAttempts) {
        try {
            return await asyncFunction();
        }
        catch (error) {
            lastError = error;
            attempt++;
            if (!shouldRetry(lastError) || attempt >= maxAttempts) {
                throw lastError;
            }
            const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
            onRetry?.(attempt, lastError);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
};
exports.retryAsync = retryAsync;
