"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSelectDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MultiSelectDropdown = ({ options, selected, onChange, placeholder = 'Select options...', className = '' }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const dropdownRef = (0, react_1.useRef)(null);
    // Filter options based on search term
    const filteredOptions = options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selected.includes(option));
    // Close dropdown when clicking outside
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelectOption = (option) => {
        onChange([...selected, option]);
        setSearchTerm('');
    };
    const handleRemoveOption = (optionToRemove) => {
        onChange(selected.filter(option => option !== optionToRemove));
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && isOpen && filteredOptions.length > 0) {
            handleSelectOption(filteredOptions[0]);
        }
        else if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: `relative ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-pointer min-h-[42px] focus:outline-none focus:border-gaming-primary", onClick: () => setIsOpen(!isOpen), children: selected.length === 0 ? ((0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: placeholder })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: selected.map((option) => ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-gaming-primary/20 text-gaming-primary rounded text-sm", children: [option, (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    handleRemoveOption(option);
                                }, className: "hover:text-gaming-secondary transition-colors", children: "\u2715" })] }, option))) })) }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 border-b border-gray-700", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onKeyDown: handleKeyDown, className: "w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gaming-primary", autoFocus: true }) }), filteredOptions.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "p-3 text-gray-400 text-sm text-center", children: searchTerm ? 'No options found' : 'All options selected' })) : (filteredOptions.map((option) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => handleSelectOption(option), className: "px-3 py-2 hover:bg-gray-700 cursor-pointer text-white transition-colors", children: option }, option))))] }))] }));
};
exports.MultiSelectDropdown = MultiSelectDropdown;
