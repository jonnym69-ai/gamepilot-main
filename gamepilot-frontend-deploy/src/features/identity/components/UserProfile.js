"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const localStorage_1 = require("../services/localStorage");
const UserProfile = ({ onProfileUpdate }) => {
    const localStorageService = new localStorage_1.LocalStorageService();
    const [profile, setProfile] = (0, react_1.useState)(null);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editForm, setEditForm] = (0, react_1.useState)({});
    const [customFields, setCustomFields] = (0, react_1.useState)([]);
    const [showAddCustomField, setShowAddCustomField] = (0, react_1.useState)(false);
    const [newCustomField, setNewCustomField] = (0, react_1.useState)({
        name: '',
        value: '',
        type: 'text',
        isPublic: false,
        order: 0
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const loadProfile = () => {
            const userProfile = localStorageService.getUserProfile();
            if (userProfile) {
                setProfile(userProfile);
                setEditForm(userProfile);
                setCustomFields(userProfile.customFields || []);
            }
            else {
                // Initialize with default data
                const defaultProfile = localStorageService.initializeDefaultData().profile;
                setProfile(defaultProfile);
                setEditForm(defaultProfile);
                setCustomFields(defaultProfile.customFields || []);
            }
            setIsLoading(false);
        };
        loadProfile();
    }, []);
    const handleSave = () => {
        if (!profile)
            return;
        const updatedProfile = { ...profile, ...editForm, lastActive: new Date().toISOString(), customFields };
        localStorageService.setUserProfile(updatedProfile);
        setProfile(updatedProfile);
        setIsEditing(false);
        setShowAddCustomField(false);
        onProfileUpdate?.(updatedProfile);
    };
    const handleCancel = () => {
        if (profile) {
            setEditForm(profile);
        }
        setIsEditing(false);
    };
    const handleInputChange = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleAddCustomField = () => {
        if (!newCustomField.name?.trim())
            return;
        const field = {
            id: `custom-${Date.now()}`,
            name: newCustomField.name.trim(),
            value: newCustomField.value || '',
            type: newCustomField.type || 'text',
            isPublic: newCustomField.isPublic || false,
            order: customFields.length
        };
        setCustomFields([...customFields, field]);
        setNewCustomField({
            name: '',
            value: '',
            type: 'text',
            isPublic: false,
            order: 0
        });
        setShowAddCustomField(false);
    };
    const handleUpdateCustomField = (fieldId, updates) => {
        setCustomFields(customFields.map(field => field.id === fieldId ? { ...field, ...updates } : field));
    };
    const handleRemoveCustomField = (fieldId) => {
        setCustomFields(customFields.filter(field => field.id !== fieldId));
    };
    const handleReorderCustomFields = (fromIndex, toIndex) => {
        const reordered = [...customFields];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        // Update order values
        const updated = reordered.map((field, index) => ({ ...field, order: index }));
        setCustomFields(updated);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83D\uDC64" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Loading profile..." })] }));
    }
    if (!profile) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\u26A0\uFE0F" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Unable to load profile" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-semibold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDC64" }), "User Profile"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => isEditing ? handleCancel() : setIsEditing(true), className: "px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity", children: isEditing ? 'Cancel' : 'Edit Profile' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-full mx-auto mb-4 flex items-center justify-center", children: profile.avatar ? ((0, jsx_runtime_1.jsx)("img", { src: profile.avatar, alt: profile.displayName, className: "w-full h-full rounded-full object-cover" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-5xl", children: "\uD83D\uDC64" })) }), isEditing && ((0, jsx_runtime_1.jsx)("button", { className: "absolute bottom-4 right-0 w-8 h-8 bg-gaming-accent rounded-full flex items-center justify-center text-white text-sm hover:opacity-90 transition-opacity", children: "\uD83D\uDCF7" }))] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-1", children: isEditing ? ((0, jsx_runtime_1.jsx)("input", { type: "text", value: editForm.displayName || '', onChange: (e) => handleInputChange('displayName', e.target.value), className: "bg-gray-800 border border-gray-700 rounded px-2 py-1 text-center text-white", placeholder: "Display Name" })) : (profile.displayName) }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400 mb-4", children: ["@", isEditing ? ((0, jsx_runtime_1.jsx)("input", { type: "text", value: editForm.username || '', onChange: (e) => handleInputChange('username', e.target.value), className: "bg-gray-800 border border-gray-700 rounded px-2 py-1 text-center text-gray-400", placeholder: "username" })) : (profile.username)] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Joined:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: formatDate(profile.joinedAt) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Last Active:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white", children: formatDate(profile.lastActive) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Profile:" }), (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded text-xs ${profile.isPublic
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-gray-500/20 text-gray-400'}`, children: profile.isPublic ? 'Public' : 'Private' })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2 space-y-4", children: isEditing ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Email" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: editForm.email || '', onChange: (e) => handleInputChange('email', e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gaming-accent focus:outline-none", placeholder: "your@email.com" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Bio" }), (0, jsx_runtime_1.jsx)("textarea", { value: editForm.bio || '', onChange: (e) => handleInputChange('bio', e.target.value), rows: 4, className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gaming-accent focus:outline-none resize-none", placeholder: "Tell us about your gaming style..." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Location" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editForm.location || '', onChange: (e) => handleInputChange('location', e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gaming-accent focus:outline-none", placeholder: "City, Country" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-1", children: "Website" }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: editForm.website || '', onChange: (e) => handleInputChange('website', e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-gaming-accent focus:outline-none", placeholder: "https://yourwebsite.com" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-3 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: editForm.isPublic || false, onChange: (e) => handleInputChange('isPublic', e.target.checked), className: "w-4 h-4 text-gaming-accent bg-gray-800 border-gray-600 rounded focus:ring-gaming-accent" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: "Make my profile public" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Public profiles can be discovered by other users" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-700 pt-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Custom Fields" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowAddCustomField(true), className: "px-3 py-1 bg-gaming-accent text-white rounded-lg hover:opacity-90 transition-opacity text-sm", children: "+ Add Field" })] }), customFields.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3 mb-4", children: customFields.map((field, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 grid grid-cols-1 md:grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: field.name, onChange: (e) => handleUpdateCustomField(field.id, { name: e.target.value }), className: "px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Field name" }), field.type === 'textarea' ? ((0, jsx_runtime_1.jsx)("textarea", { value: field.value, onChange: (e) => handleUpdateCustomField(field.id, { value: e.target.value }), className: "px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none", placeholder: "Field value", rows: 2 })) : ((0, jsx_runtime_1.jsx)("input", { type: field.type, value: field.value, onChange: (e) => handleUpdateCustomField(field.id, { value: e.target.value }), className: "px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Field value" }))] }), (0, jsx_runtime_1.jsxs)("select", { value: field.type, onChange: (e) => handleUpdateCustomField(field.id, { type: e.target.value }), className: "px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "text", children: "Text" }), (0, jsx_runtime_1.jsx)("option", { value: "email", children: "Email" }), (0, jsx_runtime_1.jsx)("option", { value: "url", children: "URL" }), (0, jsx_runtime_1.jsx)("option", { value: "textarea", children: "Textarea" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-1 text-xs text-gray-300", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: field.isPublic, onChange: (e) => handleUpdateCustomField(field.id, { isPublic: e.target.checked }), className: "w-3 h-3" }), "Public"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [index > 0 && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleReorderCustomFields(index, index - 1), className: "px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs", children: "\u2191" })), index < customFields.length - 1 && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleReorderCustomFields(index, index + 1), className: "px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs", children: "\u2193" })), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleRemoveCustomField(field.id), className: "px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs", children: "\u00D7" })] })] }, field.id))) })), showAddCustomField && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg border border-gray-700", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-white mb-3", children: "Add New Custom Field" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: newCustomField.name || '', onChange: (e) => setNewCustomField({ ...newCustomField, name: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Field name" }), newCustomField.type === 'textarea' ? ((0, jsx_runtime_1.jsx)("textarea", { value: newCustomField.value || '', onChange: (e) => setNewCustomField({ ...newCustomField, value: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none", placeholder: "Field value", rows: 2 })) : ((0, jsx_runtime_1.jsx)("input", { type: newCustomField.type || 'text', value: newCustomField.value || '', onChange: (e) => setNewCustomField({ ...newCustomField, value: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Field value" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-3", children: [(0, jsx_runtime_1.jsxs)("select", { value: newCustomField.type || 'text', onChange: (e) => setNewCustomField({ ...newCustomField, type: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "text", children: "Text" }), (0, jsx_runtime_1.jsx)("option", { value: "email", children: "Email" }), (0, jsx_runtime_1.jsx)("option", { value: "url", children: "URL" }), (0, jsx_runtime_1.jsx)("option", { value: "textarea", children: "Textarea" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: newCustomField.isPublic || false, onChange: (e) => setNewCustomField({ ...newCustomField, isPublic: e.target.checked }), className: "w-4 h-4" }), "Public"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 ml-auto", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                                                        setShowAddCustomField(false);
                                                                        setNewCustomField({ name: '', value: '', type: 'text', isPublic: false, order: 0 });
                                                                    }, className: "px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleAddCustomField, disabled: !newCustomField.name?.trim(), className: "px-3 py-1 bg-gaming-accent text-white rounded hover:opacity-90 transition-opacity text-sm disabled:opacity-50", children: "Add Field" })] })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleSave, className: "px-6 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity", children: "Save Changes" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleCancel, className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [profile.email && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-1", children: "Email" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white", children: profile.email })] })), profile.bio && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-1", children: "Bio" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-100 leading-relaxed", children: profile.bio })] })), profile.location && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-1", children: "Location" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-white flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCCD" }), profile.location] })] })), profile.website && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-1", children: "Website" }), (0, jsx_runtime_1.jsxs)("a", { href: profile.website, target: "_blank", rel: "noopener noreferrer", className: "text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD17" }), profile.website.replace(/^https?:\/\//, '')] })] })), profile.customFields && profile.customFields.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-2", children: "Custom Fields" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: profile.customFields
                                                .sort((a, b) => a.order - b.order)
                                                .map((field) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsxs)("h5", { className: "text-sm font-medium text-white min-w-0", children: [field.name, ":"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 min-w-0", children: field.type === 'url' && field.value ? ((0, jsx_runtime_1.jsx)("a", { href: field.value, target: "_blank", rel: "noopener noreferrer", className: "text-accent-400 hover:text-accent-300 transition-colors break-all", children: field.value })) : field.type === 'textarea' ? ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-100 whitespace-pre-wrap break-all", children: field.value })) : field.type === 'email' && field.value ? ((0, jsx_runtime_1.jsx)("a", { href: `mailto:${field.value}`, className: "text-accent-400 hover:text-accent-300 transition-colors break-all", children: field.value })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-100 break-all", children: field.value || (0, jsx_runtime_1.jsx)("span", { className: "text-gray-500", children: "Not set" }) })) }), field.isPublic && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded", children: "Public" }))] }, field.id))) })] })), !profile.email && !profile.bio && !profile.location && !profile.website && (!profile.customFields || profile.customFields.length === 0) && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "No additional information added yet. Click \"Edit Profile\" to personalize your profile." }) }))] })) })] })] }));
};
exports.UserProfile = UserProfile;
