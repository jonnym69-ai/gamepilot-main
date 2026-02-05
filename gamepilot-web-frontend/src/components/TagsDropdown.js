"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsDropdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
const TagsDropdown = ({ selected, onChange, placeholder = 'Select tags...', className = '' }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [customTag, setCustomTag] = (0, react_1.useState)('');
    const dropdownRef = (0, react_1.useRef)(null);
    // Filter available tags based on search
    const filteredTags = static_data_1.TAGS.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selected.includes(tag.name));
    // Close dropdown when clicking outside
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
                setCustomTag('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelectTag = (tagName) => {
        onChange([...selected, tagName]);
        setSearchTerm('');
    };
    const handleRemoveTag = (tagToRemove) => {
        onChange(selected.filter(tag => tag !== tagToRemove));
    };
    const handleAddCustomTag = () => {
        const trimmedTag = customTag.trim();
        if (trimmedTag && !selected.includes(trimmedTag)) {
            onChange([...selected, trimmedTag]);
            setCustomTag('');
            setSearchTerm('');
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredTags.length === 0 && customTag.trim()) {
                handleAddCustomTag();
            }
            else if (filteredTags.length > 0) {
                handleSelectTag(filteredTags[0].name);
            }
        }
        else if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
            setCustomTag('');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: `relative ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-pointer min-h-[42px] focus:outline-none focus:border-gaming-primary", onClick: () => setIsOpen(!isOpen), children: selected.length === 0 ? ((0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: placeholder })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: selected.map((tag) => ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-gaming-primary/20 text-gaming-primary rounded text-sm", children: [tag, (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(tag);
                                }, className: "hover:text-gaming-secondary transition-colors", children: "\u2715" })] }, tag))) })) }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 border-b border-gray-700", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search or add custom tag...", value: customTag || searchTerm, onChange: (e) => {
                                const value = e.target.value;
                                if (value.startsWith('+') || value.startsWith('#')) {
                                    setCustomTag(value);
                                    setSearchTerm('');
                                }
                                else {
                                    setSearchTerm(value);
                                    setCustomTag('');
                                }
                            }, onKeyDown: handleKeyDown, className: "w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gaming-primary", autoFocus: true }) }), customTag && ((0, jsx_runtime_1.jsxs)("div", { className: "px-3 py-2 text-xs text-gray-400 border-b border-gray-700", children: ["Press Enter to add custom tag: \"", customTag, "\""] })), filteredTags.length === 0 && !customTag ? ((0, jsx_runtime_1.jsx)("div", { className: "p-3 text-gray-400 text-sm text-center", children: searchTerm ? 'No tags found' : 'All tags selected' })) : (filteredTags.map((tag) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handleSelectTag(tag.name), className: "px-3 py-2 hover:bg-gray-700 cursor-pointer text-white transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: tag.name }), (0, jsx_runtime_1.jsx)("span", { className: `text-xs px-2 py-1 rounded ${tag.color} bg-gray-900`, children: tag.category.charAt(0).toUpperCase() })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400 mt-1", children: tag.description })] }, tag.id))))] }))] }));
};
exports.TagsDropdown = TagsDropdown;
