"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityAura = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const IdentityAura = ({ primaryArchetype, currentMood }) => {
    const [animationPhase, setAnimationPhase] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setAnimationPhase(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    const getAuraConfig = (archetype) => {
        const configs = {
            'Achiever': {
                gradient: 'from-yellow-600/20 via-amber-500/15 to-orange-500/10',
                pulseColor: 'rgba(251, 191, 36, 0.3)',
                effect: 'pulse',
                animation: ''
            },
            'Explorer': {
                gradient: 'from-teal-600/20 via-cyan-500/15 to-blue-500/10',
                pulseColor: 'rgba(20, 184, 166, 0.3)',
                effect: 'fog',
                animation: ''
            },
            'Strategist': {
                gradient: 'from-blue-800/20 via-indigo-600/15 to-purple-500/10',
                pulseColor: 'rgba(59, 130, 246, 0.3)',
                effect: 'geometric',
                animation: ''
            },
            'Socializer': {
                gradient: 'from-pink-500/20 via-rose-400/15 to-red-400/10',
                pulseColor: 'rgba(236, 72, 153, 0.3)',
                effect: 'ripple',
                animation: ''
            },
            'Immersive': {
                gradient: 'from-purple-700/20 via-violet-600/15 to-indigo-500/10',
                pulseColor: 'rgba(147, 51, 234, 0.3)',
                effect: 'vignette',
                animation: ''
            }
        };
        return configs[archetype] || configs.Explorer;
    };
    const getMoodModifier = (mood) => {
        if (!mood)
            return {};
        const moodModifiers = {
            'Chill': { opacity: 0.6, blur: 'blur-xl' },
            'Focused': { opacity: 0.8, blur: 'blur-md' },
            'Energetic': { opacity: 1.0, blur: 'blur-sm' },
            'Creative': { opacity: 0.9, blur: 'blur-md' },
            'Competitive': { opacity: 0.95, blur: 'blur-sm' }
        };
        return moodModifiers[mood] || {};
    };
    const auraConfig = getAuraConfig(primaryArchetype);
    const moodModifier = getMoodModifier(currentMood);
    const renderAuraEffect = () => {
        switch (auraConfig.effect) {
            case 'pulse':
                return ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: (0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 rounded-full ${auraConfig.animation}`, style: {
                            background: `radial-gradient(circle at 50% 50%, ${auraConfig.pulseColor} 0%, transparent 70%)`,
                            transform: `scale(${1 + animationPhase * 0.1})`,
                            transition: 'transform 3s ease-in-out'
                        } }) }));
            case 'fog':
                return ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: (0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 ${auraConfig.animation}`, style: {
                            background: `linear-gradient(${45 + animationPhase * 45}deg, ${auraConfig.pulseColor} 0%, transparent 50%, ${auraConfig.pulseColor} 100%)`,
                            opacity: 0.6,
                            filter: 'blur(40px)'
                        } }) }));
            case 'geometric':
                return ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: (0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 ${auraConfig.animation}`, style: {
                            background: `
                  conic-gradient(from ${animationPhase * 90}deg at 50% 50%, 
                    ${auraConfig.pulseColor} 0deg, 
                    transparent 60deg, 
                    ${auraConfig.pulseColor} 120deg, 
                    transparent 180deg, 
                    ${auraConfig.pulseColor} 240deg, 
                    transparent 300deg, 
                    ${auraConfig.pulseColor} 360deg)
                `,
                            opacity: 0.4,
                            filter: 'blur(30px)'
                        } }) }));
            case 'ripple':
                return ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: [0, 1, 2].map((index) => ((0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 rounded-full ${auraConfig.animation}`, style: {
                            background: `radial-gradient(circle at 50% 50%, ${auraConfig.pulseColor} 0%, transparent 60%)`,
                            transform: `scale(${1 + (animationPhase + index) * 0.3})`,
                            opacity: 0.3 - index * 0.1,
                            transition: 'transform 3s ease-in-out, opacity 3s ease-in-out'
                        } }, index))) }));
            case 'vignette':
                return ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: (0, jsx_runtime_1.jsx)("div", { className: `absolute inset-0 ${auraConfig.animation}`, style: {
                            background: `radial-gradient(ellipse at center, transparent 30%, ${auraConfig.pulseColor} 100%)`,
                            opacity: 0.7
                        } }) }));
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 pointer-events-none z-0 overflow-hidden", style: moodModifier, children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", style: {
                    background: `linear-gradient(135deg, ${auraConfig.gradient})`
                } }), renderAuraEffect(), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0", children: [...Array(6)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: "absolute w-1 h-1 bg-white/20 rounded-full", style: {
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '3s'
                    } }, i))) })] }));
};
exports.IdentityAura = IdentityAura;
