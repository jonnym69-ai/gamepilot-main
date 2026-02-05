"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const SplashScreen_1 = require("../SplashScreen");
// Mock framer-motion
vitest_1.vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => (0, jsx_runtime_1.jsx)("div", { ...props, children: children }),
        h1: ({ children, ...props }) => (0, jsx_runtime_1.jsx)("h1", { ...props, children: children }),
        p: ({ children, ...props }) => (0, jsx_runtime_1.jsx)("p", { ...props, children: children }),
        button: ({ children, ...props }) => (0, jsx_runtime_1.jsx)("button", { ...props, children: children }),
        img: ({ ...props }) => (0, jsx_runtime_1.jsx)("img", { ...props })
    }
}));
(0, vitest_1.describe)('SplashScreen', () => {
    const mockOnComplete = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)('renders the splash screen with GamePilot logo', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(SplashScreen_1.SplashScreen, { onComplete: mockOnComplete }));
        (0, vitest_1.expect)(react_1.screen.getByAltText('GamePilot')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('GamePilot')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('Your Gaming Journey Starts Here')).toBeInTheDocument();
    });
    (0, vitest_1.it)('calls onComplete after 1.8 seconds', async () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(SplashScreen_1.SplashScreen, { onComplete: mockOnComplete }));
        (0, vitest_1.expect)(mockOnComplete).not.toHaveBeenCalled();
        // Fast-forward time
        vitest_1.vi.advanceTimersByTime(1800);
        await (0, react_1.waitFor)(() => {
            (0, vitest_1.expect)(mockOnComplete).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.it)('shows skip button', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(SplashScreen_1.SplashScreen, { onComplete: mockOnComplete }));
        const skipButton = react_1.screen.getByText('Skip →');
        (0, vitest_1.expect)(skipButton).toBeInTheDocument();
    });
    (0, vitest_1.it)('calls onComplete when skip button is clicked', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(SplashScreen_1.SplashScreen, { onComplete: mockOnComplete }));
        const skipButton = react_1.screen.getByText('Skip →');
        skipButton.click();
        (0, vitest_1.expect)(mockOnComplete).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)('has proper accessibility attributes', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(SplashScreen_1.SplashScreen, { onComplete: mockOnComplete }));
        const logo = react_1.screen.getByAltText('GamePilot');
        (0, vitest_1.expect)(logo).toHaveAttribute('src', '/logo/a 3_4 angled disc lo.png');
    });
});
