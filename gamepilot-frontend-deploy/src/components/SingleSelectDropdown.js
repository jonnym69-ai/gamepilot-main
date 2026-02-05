"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleSelectDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SingleSelectDropdown = ({ options, value, onChange, placeholder = 'Select an option...', className = '' }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const dropdownRef = (0, react_1.useRef)(null);
    // Close dropdown when clicking outside
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelectOption = (option) => {
        onChange(option);
        setIsOpen(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: `relative ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-pointer focus:outline-none focus:border-gaming-primary", onClick: () => setIsOpen(!isOpen), onKeyDown: handleKeyDown, tabIndex: 0, children: value || (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: placeholder }) }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto", children: options.map((option) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => handleSelectOption(option), className: `px-3 py-2 cursor-pointer text-white transition-colors ${option === value ? 'bg-gaming-primary/20 text-gaming-primary' : 'hover:bg-gray-700'}`, children: option }, option))) }))] }));
};
exports.SingleSelectDropdown = SingleSelectDropdown;
