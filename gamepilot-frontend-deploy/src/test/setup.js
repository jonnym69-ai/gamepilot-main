"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const vitest_1 = require("vitest");
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vitest_1.vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vitest_1.vi.fn(), // deprecated
        removeListener: vitest_1.vi.fn(), // deprecated
        addEventListener: vitest_1.vi.fn(),
        removeEventListener: vitest_1.vi.fn(),
        dispatchEvent: vitest_1.vi.fn(),
    })),
});
// Mock ResizeObserver
global.ResizeObserver = vitest_1.vi.fn().mockImplementation(() => ({
    observe: vitest_1.vi.fn(),
    unobserve: vitest_1.vi.fn(),
    disconnect: vitest_1.vi.fn(),
}));
// Mock IntersectionObserver
global.IntersectionObserver = vitest_1.vi.fn().mockImplementation(() => ({
    observe: vitest_1.vi.fn(),
    unobserve: vitest_1.vi.fn(),
    disconnect: vitest_1.vi.fn(),
}));
// Setup cleanup
(0, vitest_1.beforeAll)(() => {
    // Global test setup
});
(0, vitest_1.afterEach)(() => {
    // Cleanup after each test
    vitest_1.vi.clearAllMocks();
});
(0, vitest_1.afterAll)(() => {
    // Global cleanup
});
