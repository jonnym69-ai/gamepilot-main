"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmulatorConfig = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const types_1 = require("@gamepilot/types");
const emulatorService_1 = require("../services/emulatorService");
// Helper function to get valid ROM extensions for each platform
const getValidExtensionsForPlatform = (platform) => {
    const extensions = {
        'steam': ['exe'],
        'xbox': ['exe'],
        'playstation': ['iso', 'bin'],
        'nintendo': ['nes', 'smc', 'gba', 'nds'],
        'epic': ['exe'],
        'gog': ['exe'],
        'origin': ['exe'],
        'uplay': ['exe'],
        'battlenet': ['exe'],
        'discord': ['exe'],
        'itch': ['exe'],
        'humble': ['exe'],
        'custom': ['exe'],
        'retroarch': ['zip'],
        'dolphin': ['iso', 'rvz', 'gcz'],
        'project64': ['n64', 'z64', 'v64'],
        'pcsx2': ['iso', 'bin', 'cue'],
        'rpcs3': ['pkg'],
        'cemu': ['wua', 'wud'],
        'yuzu': ['nsp', 'xci'],
        'ryujinx': ['nsp', 'xci'],
        'mame': ['zip'],
        'dosbox': ['exe'],
        'scummvm': ['exe'],
        'vita3k': ['vpk'],
        'xemu': ['iso'],
        'melonds': ['nds', 'zip'],
        'ppsspp': ['iso', 'cso'],
        'citra': ['3ds', '3dz', 'cci', 'cxi'],
        'desmume': ['nds', 'zip']
    };
    return extensions[platform] || [];
};
const EmulatorConfig = ({ isOpen, onClose, onSave }) => {
    const [configs, setConfigs] = (0, react_1.useState)([emulatorService_1.emulatorService.getEmulatorConfig(types_1.PlatformCode.DOLPHIN), emulatorService_1.emulatorService.getEmulatorConfig(types_1.PlatformCode.PROJECT64)].filter(Boolean).map((config) => ({
        platform: config.platform,
        executablePath: '',
        customArgs: config.defaultArgs || [],
        isEnabled: true
    })));
    const [selectedPlatform, setSelectedPlatform] = (0, react_1.useState)(null);
    const [isScanning, setIsScanning] = (0, react_1.useState)(false);
    const handleBrowse = async (platform) => {
        // Create a file input element for browser compatibility
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.exe,.app,.sh';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                // In browser environment, we can't get the full path, so use the file name
                const filePath = file.name;
                updateConfig(platform, 'executablePath', filePath);
            }
        };
        input.click();
    };
    const updateConfig = (platform, field, value) => {
        setConfigs(prev => prev.map(config => config.platform === platform
            ? { ...config, [field]: value }
            : config));
    };
    const handleScanDirectory = async () => {
        if (!selectedPlatform)
            return;
        setIsScanning(true);
        try {
            // For browser compatibility, create a directory input element
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.onchange = async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                    try {
                        // Convert FileList to array for processing
                        const fileArray = Array.from(files);
                        // Filter ROM files by platform
                        const validRoms = fileArray.filter(file => {
                            const extension = file.name.split('.').pop()?.toLowerCase();
                            const validExtensions = getValidExtensionsForPlatform(selectedPlatform);
                            return validExtensions.includes(extension || '');
                        });
                        if (validRoms.length > 0) {
                            console.log(`🎮 Found ${validRoms.length} valid ROMs for ${selectedPlatform}:`, validRoms.map(f => f.name));
                            // Add games to library (this would integrate with the library store)
                            // For now, just show success message
                            alert(`Found ${validRoms.length} valid ROM files for ${selectedPlatform}!\n\nFiles:\n${validRoms.map(f => `• ${f.name}`).join('\n')}`);
                        }
                        else {
                            alert(`No valid ROM files found for ${selectedPlatform}.\n\nValid extensions: ${getValidExtensionsForPlatform(selectedPlatform).join(', ')}`);
                        }
                    }
                    catch (error) {
                        console.error('Failed to process ROM files:', error);
                        alert('Failed to process ROM files. Please check the console for details.');
                    }
                }
            };
            input.click();
        }
        catch (error) {
            console.error('Failed to scan directory:', error);
        }
        finally {
            setIsScanning(false);
        }
    };
    const handleSave = () => {
        const activeConfigs = configs.filter(c => c.isEnabled);
        onSave(activeConfigs.map(c => ({
            platform: c.platform,
            name: emulatorService_1.emulatorService.getEmulatorConfig(c.platform)?.name || '',
            executablePath: c.executablePath,
            romExtensions: emulatorService_1.emulatorService.getEmulatorConfig(c.platform)?.romExtensions || [],
            supportedSystems: emulatorService_1.emulatorService.getEmulatorConfig(c.platform)?.supportedSystems || [],
            defaultArgs: c.customArgs
        })));
        onClose();
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Emulator Configuration" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Select Emulator Platform" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [emulatorService_1.emulatorService.getEmulatorConfig(types_1.PlatformCode.DOLPHIN), emulatorService_1.emulatorService.getEmulatorConfig(types_1.PlatformCode.PROJECT64)].filter(Boolean).map((config) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedPlatform(config.platform), className: `p-4 rounded-lg border transition-all ${selectedPlatform === config.platform
                                            ? 'border-gaming-accent bg-gaming-accent/20'
                                            : 'border-gray-700 hover:border-gray-600'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: config.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: config.supportedSystems.join(', ') }), (0, jsx_runtime_1.jsxs)("div", { className: "text-gray-500 text-xs mt-1", children: [config.romExtensions.slice(0, 3).join(', '), config.romExtensions.length > 3 && '...'] })] }, config.platform))) })] }), selectedPlatform && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "space-y-4 border-t border-gray-700 pt-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white", children: [emulatorService_1.emulatorService.getEmulatorConfig(selectedPlatform)?.name, " Settings"] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Executable Path" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: configs.find(c => c.platform === selectedPlatform)?.executablePath || '', onChange: (e) => updateConfig(selectedPlatform, 'executablePath', e.target.value), placeholder: "Path to emulator executable", className: "flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBrowse(selectedPlatform), className: "px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium", children: "Browse" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Custom Arguments" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: configs.find(c => c.platform === selectedPlatform)?.customArgs?.join(' ') || '', onChange: (e) => updateConfig(selectedPlatform, 'customArgs', e.target.value.split(' ').filter(Boolean)), placeholder: "Additional command line arguments", className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "ROM Directory" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleScanDirectory, disabled: isScanning, className: "px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed", children: isScanning ? 'Scanning...' : 'Scan ROMs' }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm self-center", children: configs.find(c => c.platform === selectedPlatform)?.isEnabled ? 'Enabled' : 'Disabled' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-300", children: "Enable this emulator" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateConfig(selectedPlatform, 'isEnabled', !configs.find(c => c.platform === selectedPlatform)?.isEnabled), title: `Toggle emulator ${configs.find(c => c.platform === selectedPlatform)?.isEnabled ? 'off' : 'on'}`, className: `w-12 h-6 rounded-full transition-colors ${configs.find(c => c.platform === selectedPlatform)?.isEnabled
                                                ? 'bg-gaming-accent'
                                                : 'bg-gray-700'}`, children: (0, jsx_runtime_1.jsx)("div", { className: `w-5 h-5 bg-white rounded-full transition-transform ${configs.find(c => c.platform === selectedPlatform)?.isEnabled
                                                    ? 'translate-x-6'
                                                    : 'translate-x-0.5'}` }) })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, className: "px-6 py-3 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-colors font-medium", children: "Save Configuration" })] })] })] }) }));
};
exports.EmulatorConfig = EmulatorConfig;
