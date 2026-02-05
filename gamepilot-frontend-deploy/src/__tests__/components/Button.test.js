"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const vitest_1 = require("vitest");
const Button_1 = require("../../components/ui/Button");
describe('Button Component', () => {
    it('should render button with text', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Click me" }));
        const button = react_1.screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Click me');
    });
    it('should apply primary variant styles', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", children: "Primary Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('btn-primary');
    });
    it('should apply secondary variant styles', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "secondary", children: "Secondary Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('btn-secondary');
    });
    it('should apply small size styles', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { size: "small", children: "Small Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('btn-small');
    });
    it('should apply medium size styles', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { size: "medium", children: "Medium Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('btn-medium');
    });
    it('should apply large size styles', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { size: "large", children: "Large Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('btn-large');
    });
    it('should be disabled when disabled prop is true', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { disabled: true, children: "Disabled Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toBeDisabled();
    });
    it('should not be disabled when disabled prop is false', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { disabled: false, children: "Enabled Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).not.toBeDisabled();
    });
    it('should call onClick handler when clicked', () => {
        const handleClick = jest.fn();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleClick, children: "Click me" }));
        const button = react_1.screen.getByRole('button');
        react_1.fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it('should not call onClick handler when disabled', () => {
        const handleClick = jest.fn();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { disabled: true, onClick: handleClick, children: "Disabled Button" }));
        const button = react_1.screen.getByRole('button');
        react_1.fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });
    it('should apply custom className', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { className: "custom-class", children: "Custom Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });
    it('should render as button element by default', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button.tagName).toBe('BUTTON');
    });
    it('should render as link element when href is provided', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { href: "https://example.com", children: "Link" }));
        const link = react_1.screen.getByRole('link');
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', 'https://example.com');
    });
    it('should apply aria-label when provided', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { ariaLabel: "Custom label", children: "Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Custom label');
    });
    it('should apply aria-describedby when provided', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { ariaDescribedBy: "description-id", children: "Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveAttribute('aria-describedby', 'description-id');
    });
    it('should have proper focus management', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Focusable Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveAttribute('tabIndex', '0');
    });
    it('should have proper keyboard accessibility', () => {
        const handleClick = jest.fn();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleClick, children: "Keyboard Button" }));
        const button = react_1.screen.getByRole('button');
        // Test Enter key
        react_1.fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
        expect(handleClick).toHaveBeenCalledTimes(1);
        // Test Space key
        react_1.fireEvent.keyDown(button, { key: ' ', code: 'Space' });
        expect(handleClick).toHaveBeenCalledTimes(2);
    });
    it('should have proper ARIA attributes for disabled state', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { disabled: true, children: "Disabled Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveAttribute('aria-disabled', 'true');
    });
    it('should have proper type attribute for button', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { type: "submit", children: "Submit Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });
    it('should have proper type attribute for reset', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { type: "reset", children: "Reset Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'reset');
    });
    it('should have proper type attribute for button default', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Default Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'button');
    });
    it('should render children correctly', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: (0, jsx_runtime_1.jsx)("span", { "data-testid": "child", children: "Child Element" }) }));
        const child = react_1.screen.getByTestId('child');
        expect(child).toBeInTheDocument();
        expect(child).toHaveTextContent('Child Element');
    });
    it('should handle multiple click events', () => {
        const handleClick = vitest_1.vi.fn();
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleClick, children: "Multi Click" }));
        const button = react_1.screen.getByRole('button');
        react_1.fireEvent.click(button);
        react_1.fireEvent.click(button);
        react_1.fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(3);
    });
    it('should have proper hover states', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Hover Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('hover:scale-105');
    });
    it('should have proper focus states', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Focus Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('focus:outline-none');
        expect(button).toHaveClass('focus:ring-2');
    });
    it('should have proper active states', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Active Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('active:scale-95');
    });
    it('should have proper transition classes', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Button_1.Button, { children: "Transition Button" }));
        const button = react_1.screen.getByRole('button');
        expect(button).toHaveClass('transition-all');
        expect(button).toHaveClass('duration-200');
    });
});
