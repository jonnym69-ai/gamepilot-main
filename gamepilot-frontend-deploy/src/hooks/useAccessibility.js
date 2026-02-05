"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccessibilityTesting = exports.useAccessibleAccordion = exports.useAccessibleTabs = exports.useAccessibleModal = exports.useAccessibleForm = exports.useFocusVisible = exports.useTouchDetection = exports.useHighContrast = exports.useReducedMotion = exports.useColorContrast = exports.useAriaAttributes = exports.useSkipLinks = exports.useScreenReaderAnnouncements = exports.useKeyboardNavigation = exports.useFocusManagement = void 0;
// Accessibility Hooks for React Components - WCAG 2.1 AA Compliance
const react_1 = require("react");
// Focus Management Hook
const useFocusManagement = (initialFocusRef) => {
    const [focusedElement, setFocusedElement] = (0, react_1.useState)(null);
    const containerRef = (0, react_1.useRef)(null);
    const setFocus = (0, react_1.useCallback)((element) => {
        if (element) {
            element.focus();
            setFocusedElement(element);
        }
    }, []);
    const trapFocus = (0, react_1.useCallback)((container) => {
        const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length === 0)
            return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const handleTabKey = (event) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                }
                else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };
        container.addEventListener('keydown', handleTabKey);
        // Set initial focus
        if (initialFocusRef?.current) {
            initialFocusRef.current.focus();
        }
        else {
            firstElement.focus();
        }
        return () => {
            container.removeEventListener('keydown', handleTabKey);
        };
    }, [initialFocusRef]);
    const restoreFocus = (0, react_1.useCallback)(() => {
        if (focusedElement) {
            focusedElement.focus();
        }
    }, [focusedElement]);
    return {
        containerRef,
        setFocus,
        trapFocus,
        restoreFocus,
        focusedElement
    };
};
exports.useFocusManagement = useFocusManagement;
// Keyboard Navigation Hook
const useKeyboardNavigation = (items, onSelect) => {
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(-1);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const handleKeyDown = (0, react_1.useCallback)((event) => {
        if (!isOpen)
            return;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setSelectedIndex(() => {
                    const next = selectedIndex + 1;
                    return next >= items.length ? 0 : next;
                });
                break;
            case 'ArrowUp':
                event.preventDefault();
                setSelectedIndex(() => {
                    const prev = selectedIndex - 1;
                    return prev < 0 ? items.length - 1 : prev;
                });
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (selectedIndex >= 0 && onSelect) {
                    onSelect(items[selectedIndex].id);
                }
                break;
            case 'Escape':
                event.preventDefault();
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    }, [isOpen, items, selectedIndex, onSelect]);
    (0, react_1.useEffect)(() => {
        if (selectedIndex >= 0 && items[selectedIndex]?.element) {
            items[selectedIndex].element?.focus();
        }
    }, [selectedIndex, items]);
    const open = (0, react_1.useCallback)(() => {
        setIsOpen(true);
        setSelectedIndex(0);
    }, []);
    const close = (0, react_1.useCallback)(() => {
        setIsOpen(false);
        setSelectedIndex(-1);
    }, []);
    return {
        selectedIndex,
        isOpen,
        handleKeyDown,
        open,
        close
    };
};
exports.useKeyboardNavigation = useKeyboardNavigation;
// Screen Reader Announcements Hook
const useScreenReaderAnnouncements = () => {
    const [announcements, setAnnouncements] = (0, react_1.useState)([]);
    const announcementRef = (0, react_1.useRef)(null);
    const announce = (0, react_1.useCallback)((message) => {
        setAnnouncements(prev => [...prev, message]);
        // Clear announcement after it's read
        setTimeout(() => {
            setAnnouncements(prev => prev.slice(1));
        }, 1000);
    }, []);
    const announcePolite = (0, react_1.useCallback)((message) => {
        announce(message);
    }, [announce]);
    const announceAssertive = (0, react_1.useCallback)((message) => {
        announce(message);
    }, [announce]);
    return {
        announcementRef,
        announcements,
        announce,
        announcePolite,
        announceAssertive
    };
};
exports.useScreenReaderAnnouncements = useScreenReaderAnnouncements;
// Skip Links Hook
const useSkipLinks = () => {
    const [skipLinks, setSkipLinks] = (0, react_1.useState)([]);
    const addSkipLink = (0, react_1.useCallback)((id, label, target) => {
        setSkipLinks(prev => [...prev, { id, label, target }]);
    }, []);
    const removeSkipLink = (0, react_1.useCallback)((id) => {
        setSkipLinks(prev => prev.filter(link => link.id !== id));
    }, []);
    return {
        skipLinks,
        addSkipLink,
        removeSkipLink
    };
};
exports.useSkipLinks = useSkipLinks;
// ARIA Attributes Hook
const useAriaAttributes = () => {
    const [ariaAttributes, setAriaAttributes] = (0, react_1.useState)({});
    const setAriaAttribute = (0, react_1.useCallback)((attribute, value) => {
        setAriaAttributes(prev => ({ ...prev, [attribute]: value }));
    }, []);
    const removeAriaAttribute = (0, react_1.useCallback)((attribute) => {
        setAriaAttributes(prev => {
            const newAttrs = { ...prev };
            delete newAttrs[attribute];
            return newAttrs;
        });
    }, []);
    const getAriaAttributes = (0, react_1.useCallback)((baseAttrs = {}) => {
        return { ...baseAttrs, ...ariaAttributes };
    }, [ariaAttributes]);
    return {
        ariaAttributes,
        setAriaAttribute,
        removeAriaAttribute,
        getAriaAttributes
    };
};
exports.useAriaAttributes = useAriaAttributes;
// Color Contrast Hook
const useColorContrast = () => {
    const [contrastRatio, setContrastRatio] = (0, react_1.useState)(0);
    const [contrastLevel, setContrastLevel] = (0, react_1.useState)('fail');
    const calculateContrast = (0, react_1.useCallback)((color1, color2) => {
        // Simple contrast calculation (in real implementation, use a proper library)
        const getLuminance = (color) => {
            // Convert hex to RGB
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16) / 255;
            const g = parseInt(hex.substr(2, 2), 16) / 255;
            const b = parseInt(hex.substr(4, 2), 16) / 255;
            // Calculate relative luminance
            const sRGB = [r, g, b].map(val => {
                return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
        };
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
        setContrastRatio(ratio);
        // Determine WCAG compliance
        if (ratio >= 7) {
            setContrastLevel('AAA');
        }
        else if (ratio >= 4.5) {
            setContrastLevel('AA');
        }
        else {
            setContrastLevel('fail');
        }
        return ratio;
    }, []);
    return {
        contrastRatio,
        contrastLevel,
        calculateContrast
    };
};
exports.useColorContrast = useColorContrast;
// Reduced Motion Hook
const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = (e) => {
            setPrefersReducedMotion(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return prefersReducedMotion;
};
exports.useReducedMotion = useReducedMotion;
// High Contrast Hook
const useHighContrast = () => {
    const [prefersHighContrast, setPrefersHighContrast] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        setPrefersHighContrast(mediaQuery.matches);
        const handleChange = (e) => {
            setPrefersHighContrast(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return prefersHighContrast;
};
exports.useHighContrast = useHighContrast;
// Touch Detection Hook
const useTouchDetection = () => {
    const [isTouchDevice, setIsTouchDevice] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(hasTouch);
    }, []);
    return isTouchDevice;
};
exports.useTouchDetection = useTouchDetection;
// Focus Visible Hook
const useFocusVisible = () => {
    const [isFocusVisible, setIsFocusVisible] = (0, react_1.useState)(false);
    const [isKeyboardFocus, setIsKeyboardFocus] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const handleMouseDown = () => {
            setIsKeyboardFocus(false);
            setIsFocusVisible(false);
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Tab') {
                setIsKeyboardFocus(true);
                setIsFocusVisible(true);
            }
        };
        const handleFocus = () => {
            if (isKeyboardFocus) {
                setIsFocusVisible(true);
            }
        };
        const handleBlur = () => {
            setIsFocusVisible(false);
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('focus', handleFocus, true);
        document.addEventListener('blur', handleBlur, true);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('focus', handleFocus, true);
            document.removeEventListener('blur', handleBlur, true);
        };
    }, [isKeyboardFocus]);
    return isFocusVisible;
};
exports.useFocusVisible = useFocusVisible;
// Accessible Form Hook
const useAccessibleForm = () => {
    const [errors, setErrors] = (0, react_1.useState)({});
    const [touched, setTouched] = (0, react_1.useState)(new Set());
    const setError = (0, react_1.useCallback)((field, message) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    }, []);
    const clearError = (0, react_1.useCallback)((field) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);
    const setTouchedField = (0, react_1.useCallback)((field) => {
        setTouched(prev => new Set(prev).add(field));
    }, []);
    const validateField = (0, react_1.useCallback)((field, value, rules) => {
        for (const rule of rules) {
            const error = rule(value);
            if (error) {
                setError(field, error);
                return false;
            }
        }
        clearError(field);
        return true;
    }, [setError, clearError]);
    const hasError = (0, react_1.useCallback)((field) => {
        return touched.has(field) && !!errors[field];
    }, [touched, errors]);
    const getErrorMessage = (0, react_1.useCallback)((field) => {
        return hasError(field) ? errors[field] : '';
    }, [hasError, errors]);
    return {
        errors,
        touched,
        setError,
        clearError,
        setTouchedField,
        validateField,
        hasError,
        getErrorMessage
    };
};
exports.useAccessibleForm = useAccessibleForm;
// Accessible Modal Hook
const useAccessibleModal = () => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { trapFocus, restoreFocus } = (0, exports.useFocusManagement)();
    const { announcePolite } = (0, exports.useScreenReaderAnnouncements)();
    const open = (0, react_1.useCallback)(() => {
        setIsOpen(true);
        announcePolite('Modal opened');
    }, [announcePolite]);
    const close = (0, react_1.useCallback)(() => {
        setIsOpen(false);
        restoreFocus();
        announcePolite('Modal closed');
    }, [restoreFocus, announcePolite]);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            const cleanup = trapFocus(document.body);
            return cleanup;
        }
    }, [isOpen, trapFocus]);
    return {
        isOpen,
        open,
        close
    };
};
exports.useAccessibleModal = useAccessibleModal;
// Accessible Tabs Hook
const useAccessibleTabs = (tabs) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)(tabs[0]?.id || '');
    const { announcePolite } = (0, exports.useScreenReaderAnnouncements)();
    const selectTab = (0, react_1.useCallback)((tabId) => {
        setActiveTab(tabId);
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            announcePolite(`Tab ${tab.label} selected`);
        }
    }, [tabs, announcePolite]);
    return {
        activeTab,
        selectTab,
        tabs
    };
};
exports.useAccessibleTabs = useAccessibleTabs;
// Accessible Accordion Hook
const useAccessibleAccordion = (items) => {
    const [openItems, setOpenItems] = (0, react_1.useState)(new Set());
    const { announcePolite } = (0, exports.useScreenReaderAnnouncements)();
    const toggleItem = (0, react_1.useCallback)((itemId) => {
        const item = items.find(i => i.id === itemId);
        if (!item)
            return;
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
                announcePolite(`Section ${item.label} collapsed`);
            }
            else {
                newSet.add(itemId);
                announcePolite(`Section ${item.label} expanded`);
            }
            return newSet;
        });
    }, [items, announcePolite]);
    const isItemOpen = (0, react_1.useCallback)((itemId) => {
        return openItems.has(itemId);
    }, [openItems]);
    return {
        openItems,
        toggleItem,
        isItemOpen
    };
};
exports.useAccessibleAccordion = useAccessibleAccordion;
// Accessibility Testing Hook
const useAccessibilityTesting = () => {
    const [isTestingMode, setIsTestingMode] = (0, react_1.useState)(false);
    const enableTestingMode = (0, react_1.useCallback)(() => {
        setIsTestingMode(true);
        document.body.classList.add('a11y-test-outline');
    }, []);
    const disableTestingMode = (0, react_1.useCallback)(() => {
        setIsTestingMode(false);
        document.body.classList.remove('a11y-test-outline');
    }, []);
    const testContrast = (0, react_1.useCallback)(() => {
        document.body.classList.add('a11y-test-contrast');
        setTimeout(() => {
            document.body.classList.remove('a11y-test-contrast');
        }, 3000);
    }, []);
    const testReducedMotion = (0, react_1.useCallback)(() => {
        document.body.classList.add('a11y-test-reduced-motion');
        setTimeout(() => {
            document.body.classList.remove('a11y-test-reduced-motion');
        }, 3000);
    }, []);
    return {
        isTestingMode,
        enableTestingMode,
        disableTestingMode,
        testContrast,
        testReducedMotion
    };
};
exports.useAccessibilityTesting = useAccessibilityTesting;
exports.default = {
    useFocusManagement: exports.useFocusManagement,
    useKeyboardNavigation: exports.useKeyboardNavigation,
    useScreenReaderAnnouncements: exports.useScreenReaderAnnouncements,
    useSkipLinks: exports.useSkipLinks,
    useAriaAttributes: exports.useAriaAttributes,
    useColorContrast: exports.useColorContrast,
    useReducedMotion: exports.useReducedMotion,
    useHighContrast: exports.useHighContrast,
    useTouchDetection: exports.useTouchDetection,
    useFocusVisible: exports.useFocusVisible,
    useAccessibleForm: exports.useAccessibleForm,
    useAccessibleModal: exports.useAccessibleModal,
    useAccessibleTabs: exports.useAccessibleTabs,
    useAccessibleAccordion: exports.useAccessibleAccordion,
    useAccessibilityTesting: exports.useAccessibilityTesting
};
