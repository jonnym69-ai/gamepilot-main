"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibleBadge = exports.AccessibleAlert = exports.AccessibleProgress = exports.AccessibleCard = exports.AccessibleSkipLinks = exports.AccessibleAccordion = exports.AccessibleTabs = exports.AccessibleModal = exports.AccessibleFormField = exports.AccessibleButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// Accessible Components for GamePilot - WCAG 2.1 AA Compliance
const react_1 = require("react");
const useAccessibility_1 = require("../hooks/useAccessibility");
exports.AccessibleButton = (0, react_1.forwardRef)(({ children, variant = 'primary', size = 'medium', loading = false, icon, iconPosition = 'left', fullWidth = false, disabled = false, className = '', onClick, ...props }, ref) => {
    const { announcePolite } = (0, useAccessibility_1.useScreenReaderAnnouncements)();
    const { getAriaAttributes } = (0, useAccessibility_1.useAriaAttributes)();
    const isFocusVisible = (0, useAccessibility_1.useFocusVisible)();
    const handleClick = (event) => {
        if (loading || disabled)
            return;
        if (onClick) {
            onClick(event);
        }
        // Announce button action for screen readers
        const buttonText = typeof children === 'string' ? children : 'Button';
        announcePolite(`${buttonText} activated`);
    };
    const getVariantClasses = () => {
        const baseClasses = 'btn-accessible transition-all duration-200 ease-out';
        const variantClasses = {
            primary: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
            secondary: 'bg-white/10 text-white border border-white/20',
            danger: 'bg-red-500 text-white'
        };
        const sizeClasses = {
            small: 'px-3 py-2 text-sm',
            medium: 'px-4 py-3 text-base',
            large: 'px-6 py-4 text-lg'
        };
        return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;
    };
    const ariaAttrs = getAriaAttributes({
        'aria-busy': loading ? 'true' : 'false',
        'aria-disabled': disabled ? 'true' : 'false'
    });
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, className: `
        ${getVariantClasses()}
        ${isFocusVisible ? 'focus-visible' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `, disabled: disabled || loading, onClick: handleClick, ...ariaAttrs, ...props, children: [loading && ((0, jsx_runtime_1.jsx)("span", { className: "loading-spinner-accessible mr-2", "aria-hidden": "true" })), icon && iconPosition === 'left' && ((0, jsx_runtime_1.jsx)("span", { className: "mr-2", "aria-hidden": "true", children: icon })), (0, jsx_runtime_1.jsx)("span", { className: "flex items-center justify-center", children: children }), icon && iconPosition === 'right' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-2", "aria-hidden": "true", children: icon }))] }));
});
exports.AccessibleButton.displayName = 'AccessibleButton';
const AccessibleFormField = ({ label, id, type = 'text', placeholder, required = false, disabled = false, error, helperText, value, onChange, onBlur, className = '' }) => {
    const { announcePolite } = (0, useAccessibility_1.useScreenReaderAnnouncements)();
    const { hasError } = (0, useAccessibility_1.useAccessibleForm)();
    const { getAriaAttributes } = (0, useAccessibility_1.useAriaAttributes)();
    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    };
    const handleBlur = () => {
        if (onBlur) {
            onBlur();
        }
        // Announce field validation status
        if (error) {
            announcePolite(`${label} field has error: ${error}`);
        }
    };
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;
    const ariaAttrs = getAriaAttributes({
        'aria-required': required ? 'true' : 'false',
        'aria-invalid': !!error ? 'true' : 'false',
        'aria-describedby': [
            error ? errorId : null,
            helperText ? helperId : null
        ].filter(Boolean).join(' ')
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: `form-field ${className}`, children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: fieldId, className: "form-label", children: [label, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-400 ml-1", "aria-label": "required", children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { id: fieldId, type: type, placeholder: placeholder, value: value, onChange: handleChange, onBlur: handleBlur, disabled: disabled, className: `form-control ${hasError(fieldId) ? 'border-red-500' : ''}`, ...ariaAttrs }), error && ((0, jsx_runtime_1.jsx)("div", { id: errorId, className: "form-error", role: "alert", children: error })), helperText && !error && ((0, jsx_runtime_1.jsx)("div", { id: helperId, className: "text-sm text-gray-400 mt-1", children: helperText }))] }));
};
exports.AccessibleFormField = AccessibleFormField;
const AccessibleModal = ({ isOpen, onClose, title, children, size = 'medium', closeOnEscape = true, closeOnBackdrop = true }) => {
    const { trapFocus, restoreFocus } = (0, useAccessibility_1.useFocusManagement)();
    const { announcePolite } = (0, useAccessibility_1.useScreenReaderAnnouncements)();
    const modalRef = (0, react_1.useRef)(null);
    const previousFocusRef = (0, react_1.useRef)(null);
    const getSizeClasses = () => {
        const sizes = {
            small: 'max-w-md',
            medium: 'max-w-2xl',
            large: 'max-w-4xl'
        };
        return sizes[size];
    };
    (0, react_1.useEffect)(() => {
        if (isOpen && modalRef.current) {
            // Store previous focus
            previousFocusRef.current = document.activeElement;
            // Trap focus within modal
            const cleanup = trapFocus(modalRef.current);
            // Announce modal opening
            announcePolite(`${title} modal opened`);
            return cleanup;
        }
        else if (!isOpen && previousFocusRef.current) {
            // Restore focus when modal closes
            restoreFocus();
        }
    }, [isOpen, trapFocus, restoreFocus, announcePolite, title]);
    (0, react_1.useEffect)(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, closeOnEscape, onClose]);
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget && closeOnBackdrop) {
            onClose();
        }
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "modal-accessible", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", ref: modalRef, children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm", onClick: handleBackdropClick }), (0, jsx_runtime_1.jsxs)("div", { className: `modal-content-accessible ${getSizeClasses()}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { id: "modal-title", className: "text-2xl font-bold text-white", children: title }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "modal-close-accessible", "aria-label": "Close modal", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-white", children: children })] })] }));
};
exports.AccessibleModal = AccessibleModal;
const AccessibleTabs = ({ tabs, defaultTab, className = '' }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)(defaultTab || tabs[0]?.id || '');
    const currentTab = defaultTab || activeTab;
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsx)("div", { className: "tablist-accessible", role: "tablist", "aria-orientation": "horizontal", children: tabs.map((tab) => ((0, jsx_runtime_1.jsx)("button", { role: "tab", "aria-selected": currentTab === tab.id, "aria-controls": `tabpanel-${tab.id}`, id: `tab-${tab.id}`, className: `tab-accessible ${currentTab === tab.id ? 'font-semibold' : ''}`, onClick: () => handleTabChange(tab.id), children: tab.label }, tab.id))) }), tabs.map((tab) => ((0, jsx_runtime_1.jsx)("div", { role: "tabpanel", id: `tabpanel-${tab.id}`, "aria-labelledby": `tab-${tab.id}`, className: `tabpanel-accessible ${currentTab === tab.id ? 'block' : 'hidden'}`, hidden: currentTab !== tab.id, children: tab.content }, tab.id)))] }));
};
exports.AccessibleTabs = AccessibleTabs;
const AccessibleAccordion = ({ items, allowMultiple = false, defaultOpen = [], className = '' }) => {
    const [openItems, setOpenItems] = (0, react_1.useState)(new Set(defaultOpen));
    const { announcePolite } = (0, useAccessibility_1.useScreenReaderAnnouncements)();
    const toggleItem = (itemId) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (allowMultiple) {
                if (newSet.has(itemId)) {
                    newSet.delete(itemId);
                    announcePolite(`Section ${items.find(i => i.id === itemId)?.title} collapsed`);
                }
                else {
                    newSet.add(itemId);
                    announcePolite(`Section ${items.find(i => i.id === itemId)?.title} expanded`);
                }
            }
            else {
                if (newSet.has(itemId)) {
                    newSet.clear();
                    announcePolite(`Section ${items.find(i => i.id === itemId)?.title} collapsed`);
                }
                else {
                    newSet.clear();
                    newSet.add(itemId);
                    announcePolite(`Section ${items.find(i => i.id === itemId)?.title} expanded`);
                }
            }
            return newSet;
        });
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: className, children: items.map((item) => ((0, jsx_runtime_1.jsxs)("div", { className: "accordion-accessible", children: [(0, jsx_runtime_1.jsxs)("button", { "aria-expanded": openItems.has(item.id), "aria-controls": `accordion-content-${item.id}`, id: `accordion-header-${item.id}`, className: "accordion-header-accessible", onClick: () => toggleItem(item.id), children: [(0, jsx_runtime_1.jsx)("span", { children: item.title }), (0, jsx_runtime_1.jsx)("span", { className: `transform transition-transform duration-200 ${openItems.has(item.id) ? 'rotate-180' : ''}`, "aria-hidden": "true", children: "\u25BC" })] }), (0, jsx_runtime_1.jsx)("div", { id: `accordion-content-${item.id}`, "aria-labelledby": `accordion-header-${item.id}`, className: `accordion-content-accessible ${openItems.has(item.id) ? 'block' : 'hidden'}`, hidden: !openItems.has(item.id), children: item.content })] }, item.id))) }));
};
exports.AccessibleAccordion = AccessibleAccordion;
const AccessibleSkipLinks = ({ links, className = '' }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: className, children: links.map((link) => ((0, jsx_runtime_1.jsx)("a", { href: link.target, className: "skip-link", onClick: (e) => {
                e.preventDefault();
                const target = document.querySelector(link.target);
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            }, children: link.label }, link.id))) }));
};
exports.AccessibleSkipLinks = AccessibleSkipLinks;
const AccessibleCard = ({ children, title, description, onClick, focusable = false, className = '' }) => {
    const { getAriaAttributes } = (0, useAccessibility_1.useAriaAttributes)();
    const isFocusVisible = (0, useAccessibility_1.useFocusVisible)();
    const CardComponent = focusable ? 'button' : 'div';
    const cardProps = focusable ? {
        onClick,
        type: 'button',
        'aria-label': title || description
    } : {};
    const ariaAttrs = getAriaAttributes({
        ...(description && { 'aria-describedby': 'card-description' })
    });
    return ((0, jsx_runtime_1.jsxs)(CardComponent, { className: `card-accessible ${isFocusVisible ? 'focus-visible' : ''} ${className}`, ...cardProps, ...ariaAttrs, children: [title && (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: title }), description && ((0, jsx_runtime_1.jsx)("p", { id: "card-description", className: "text-white/80 text-sm", children: description })), children] }));
};
exports.AccessibleCard = AccessibleCard;
const AccessibleProgress = ({ value, max, label, showValue = true, className = '' }) => {
    const percentage = Math.round((value / max) * 100);
    const { announcePolite } = (0, useAccessibility_1.useScreenReaderAnnouncements)();
    (0, react_1.useEffect)(() => {
        announcePolite(`Progress: ${percentage} percent`);
    }, [percentage, announcePolite]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [label && ((0, jsx_runtime_1.jsxs)("div", { className: "progress-label-accessible", children: [label, showValue && (0, jsx_runtime_1.jsxs)("span", { className: "ml-2", children: ["(", percentage, "%)"] })] })), (0, jsx_runtime_1.jsx)("div", { className: "progress-accessible", role: "progressbar", "aria-valuenow": value, "aria-valuemin": 0, "aria-valuemax": max, "aria-label": label || `Progress: ${percentage} percent`, children: (0, jsx_runtime_1.jsx)("div", { className: "progress-bar-accessible", style: { width: `${percentage}%` } }) })] }));
};
exports.AccessibleProgress = AccessibleProgress;
const AccessibleAlert = ({ type, message, dismissible = false, onDismiss, className = '' }) => {
    const { announcePolite } = (0, useAccessibility_1.useScreenReaderAnnouncements)();
    (0, react_1.useEffect)(() => {
        announcePolite(`${type}: ${message}`);
    }, [message, type, announcePolite]);
    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        }
        announcePolite('Alert dismissed');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `alert-accessible alert-${type} ${className}`, role: "alert", "aria-live": "polite", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsxs)("span", { className: "mr-2", children: [type === 'success' && '✓', type === 'warning' && '⚠', type === 'error' && '✕', type === 'info' && 'ℹ'] }), (0, jsx_runtime_1.jsx)("span", { children: message })] }), dismissible && ((0, jsx_runtime_1.jsx)("button", { onClick: handleDismiss, className: "ml-auto text-white/60 hover:text-white", "aria-label": "Dismiss alert", children: "\u00D7" }))] }));
};
exports.AccessibleAlert = AccessibleAlert;
const AccessibleBadge = ({ count, max = 99, label, className = '' }) => {
    const { announcePolite } = (0, useAccessibility_1.useScreenReaderAnnouncements)();
    const displayCount = count > max ? `${max}+` : count.toString();
    (0, react_1.useEffect)(() => {
        if (label) {
            announcePolite(`${label}: ${displayCount}`);
        }
    }, [count, label, displayCount, announcePolite]);
    if (count === 0)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: `badge-accessible ${className}`, "aria-label": `${label || 'Badge'}: ${displayCount}`, children: displayCount }));
};
exports.AccessibleBadge = AccessibleBadge;
exports.default = {
    AccessibleButton: exports.AccessibleButton,
    AccessibleFormField: exports.AccessibleFormField,
    AccessibleModal: exports.AccessibleModal,
    AccessibleTabs: exports.AccessibleTabs,
    AccessibleAccordion: exports.AccessibleAccordion,
    AccessibleSkipLinks: exports.AccessibleSkipLinks,
    AccessibleCard: exports.AccessibleCard,
    AccessibleProgress: exports.AccessibleProgress,
    AccessibleAlert: exports.AccessibleAlert,
    AccessibleBadge: exports.AccessibleBadge
};
