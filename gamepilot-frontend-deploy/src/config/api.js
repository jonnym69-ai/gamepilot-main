"use strict";
/**
 * API Configuration for GamePilot Web
 * Provides centralized API URL configuration with environment-based switching
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetch = exports.API_URL = exports.API_CONFIG = exports.createApiUrl = void 0;
// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
exports.API_URL = API_URL;
// Helper function to construct full API endpoints
const createApiUrl = (endpoint) => {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    // Remove trailing slash from API_URL if present
    const cleanBaseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${cleanBaseUrl}/${cleanEndpoint}`;
};
exports.createApiUrl = createApiUrl;
// Default API configuration for fetch calls
exports.API_CONFIG = {
    baseURL: API_URL,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
};
// Helper for making API calls with consistent configuration
const apiFetch = async (endpoint, options = {}) => {
    const url = (0, exports.createApiUrl)(endpoint);
    const config = {
        ...exports.API_CONFIG,
        ...options,
        headers: {
            ...exports.API_CONFIG.headers,
            ...options.headers,
        },
    };
    return fetch(url, config);
};
exports.apiFetch = apiFetch;
