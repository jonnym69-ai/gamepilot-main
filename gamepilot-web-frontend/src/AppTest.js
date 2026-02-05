"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function App() {
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            color: 'white',
            fontFamily: 'Arial, sans-serif'
        }, children: [(0, jsx_runtime_1.jsx)("h1", { children: "GamePilot - Test Page" }), (0, jsx_runtime_1.jsx)("p", { children: "The application is loading. If you see this page, the basic React setup is working." }), (0, jsx_runtime_1.jsx)("p", { children: "Next steps:" }), (0, jsx_runtime_1.jsxs)("ol", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Check browser console for any errors" }), (0, jsx_runtime_1.jsx)("li", { children: "Verify all component imports are working" }), (0, jsx_runtime_1.jsx)("li", { children: "Check if routes are properly configured" })] })] }));
}
exports.default = App;
