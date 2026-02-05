"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    testDir: './e2e',
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...test_1.devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...test_1.devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...test_1.devices['Desktop Safari'] },
        },
        {
            name: 'mobile-chrome',
            use: { ...test_1.devices['Pixel 5'] },
        },
        {
            name: 'tablet-safari',
            use: { ...test_1.devices['iPad Pro'] },
        },
    ],
    retries: 1,
    reporter: [
        ['list'],
        ['html'],
    ],
    timeout: 30000,
});
