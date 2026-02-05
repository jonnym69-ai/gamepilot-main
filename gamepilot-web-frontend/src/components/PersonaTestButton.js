"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaTestButton = PersonaTestButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const personaTest_1 = require("../utils/personaTest");
function PersonaTestButton() {
    const [isRunning, setIsRunning] = (0, react_1.useState)(false);
    const [results, setResults] = (0, react_1.useState)('');
    const runTest = async () => {
        setIsRunning(true);
        setResults('Running comprehensive persona engine test...\n\n');
        try {
            // Capture console output
            const originalLog = console.log;
            const logs = [];
            console.log = (...args) => {
                logs.push(args.join(' '));
                originalLog(...args);
                setResults(logs.join('\n'));
            };
            await personaTest_1.personaTester.runFullTest();
            // Restore console.log
            console.log = originalLog;
            setResults(prev => prev + '\n\n✅ Test completed! Check console for full report.');
        }
        catch (error) {
            setResults(prev => prev + `\n\n❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            setIsRunning(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-4 right-4 z-50", children: [(0, jsx_runtime_1.jsx)("button", { onClick: runTest, disabled: isRunning, className: "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-lg shadow-lg transition-colors", children: isRunning ? '🧪 Testing...' : '🧪 Test Persona Engine' }), results && ((0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-full right-0 mb-2 w-96 max-h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl", children: (0, jsx_runtime_1.jsx)("pre", { className: "text-xs text-green-400 whitespace-pre-wrap", children: results }) }))] }));
}
