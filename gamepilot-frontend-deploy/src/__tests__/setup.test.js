"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
// import { PageErrorBoundary } from '../../components/ErrorBoundary'
// Simple test to verify Jest setup
describe('Jest Setup Test', () => {
    it('should render without crashing', () => {
        (0, react_1.render)(react_2.default.createElement('div', {}, 'Test Component'));
        expect(react_1.screen.getByText('Test Component')).toBeInTheDocument();
    });
    it('should have access to testing library', () => {
        expect(react_1.screen).toBeInTheDocument();
    });
});
