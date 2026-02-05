"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackButton = exports.BetaFeedback = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Toast_1 = require("../Toast");
const BetaFeedback = ({ isOpen, onClose, userId }) => {
    const [feedbackType, setFeedbackType] = (0, react_1.useState)('general');
    const [title, setTitle] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [isSubmitted, setIsSubmitted] = (0, react_1.useState)(false);
    const feedbackTypes = [
        { value: 'bug', label: 'Bug Report', icon: '🐛', color: 'bg-red-600' },
        { value: 'feature', label: 'Feature Request', icon: '💡', color: 'bg-blue-600' },
        { value: 'improvement', label: 'Improvement', icon: '⚡', color: 'bg-green-600' },
        { value: 'general', label: 'General Feedback', icon: '💬', color: 'bg-purple-600' }
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            Toast_1.toast.error('Please fill in all required fields');
            return;
        }
        setIsSubmitting(true);
        try {
            const feedbackData = {
                type: feedbackType,
                title: title.trim(),
                description: description.trim(),
                email: email.trim(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userId
            };
            // Send feedback to API
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData)
            });
            if (response.ok) {
                setIsSubmitted(true);
                Toast_1.toast.success('Thank you for your feedback! 🎉');
                // Reset form after 2 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                    setTitle('');
                    setDescription('');
                    setEmail('');
                    onClose();
                }, 2000);
            }
            else {
                throw new Error('Failed to submit feedback');
            }
        }
        catch (error) {
            console.error('Feedback submission error:', error);
            Toast_1.toast.error('Failed to submit feedback. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Beta Feedback" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: "Help us improve GamePilot with your feedback" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", title: "Close feedback form", "aria-label": "Close feedback form", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: isSubmitted ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDF89" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white mb-2", children: "Feedback Submitted!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Thank you for helping us improve GamePilot. We'll review your feedback carefully." })] })) : ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-3", children: "Feedback Type" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: feedbackTypes.map(({ value, label, icon, color }) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setFeedbackType(value), className: `p-3 rounded-lg border-2 transition-all ${feedbackType === value
                                                ? `${color} border-transparent`
                                                : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: label })] }) }, value))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-300 mb-2", children: "Title *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "title", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Brief description of your feedback", className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-300 mb-2", children: "Description *" }), (0, jsx_runtime_1.jsx)("textarea", { id: "description", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Please provide detailed information about your feedback...", rows: 6, className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-300 mb-2", children: "Email (optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", className: "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: "We'll only contact you if we need more information about your feedback" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-900/30 border border-blue-500/30 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-blue-400 font-semibold mb-2", children: "Beta Program Info" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300", children: "Your feedback helps us shape the future of GamePilot. We review all feedback carefully and use it to prioritize improvements and new features." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors", children: isSubmitting ? 'Submitting...' : 'Submit Feedback' })] })] })) })] }) }));
};
exports.BetaFeedback = BetaFeedback;
// Feedback Button Component
const FeedbackButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: "fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40", title: "Send Feedback", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center", children: "\u03B2" }), isHovered && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap", children: ["Send Beta Feedback", (0, jsx_runtime_1.jsx)("div", { className: "absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" })] }))] }) }));
};
exports.FeedbackButton = FeedbackButton;
