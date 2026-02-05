"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraitCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TraitModal_1 = require("./TraitModal");
const TraitCard = ({ icon, label, value, description, theme }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const getTraitDetails = (label, value) => {
        const details = {
            'Intensity': {
                fullDescription: 'Intensity represents your energy level and engagement during gaming sessions. It reflects how deeply you immerse yourself in gameplay and how much mental and emotional energy you invest.',
                inference: 'We analyze this from your average session length, game completion patterns, and the types of games that keep you engaged for extended periods.',
                archetypeEffect: 'High intensity players often excel in competitive and challenging games, while lower intensity players prefer more relaxed experiences.',
                suggestedGames: value === 'High' ? ['Souls-like', 'Competitive FPS', 'Strategy Games'] : ['Casual Puzzle', 'Simulation', 'Story Games']
            },
            'Pacing': {
                fullDescription: 'Pacing describes your preferred session duration and how you structure your gaming time. It reveals whether you prefer short bursts or extended gaming marathons.',
                inference: 'This is determined by your typical play session lengths, frequency of gaming, and how you break up your gaming time.',
                archetypeEffect: 'Your pacing affects which game types feel most natural and enjoyable, matching your lifestyle and gaming habits.',
                suggestedGames: value === 'Burst' ? ['Mobile Games', 'Quick Match', 'Arcade'] : value === 'Flow' ? ['RPG', 'Adventure', 'Open World'] : ['MMO', 'Strategy', 'Sandbox']
            },
            'Social Style': {
                fullDescription: 'Social Style indicates your preference for multiplayer versus single-player experiences and how you interact with others in gaming environments.',
                inference: 'We assess this from your multiplayer game preferences, community engagement, and social gaming patterns.',
                archetypeEffect: 'This trait strongly influences which games will provide the most fulfilling experience based on your social needs.',
                suggestedGames: value === 'Solo' ? ['Single-Player RPG', 'Story Games', 'Puzzle'] : value === 'Coop' ? ['Co-op Campaigns', 'Team Games', 'MMO'] : ['Competitive', 'FPS', 'Sports']
            },
            'Challenge': {
                fullDescription: 'Challenge Tolerance reflects your comfort level with difficult gameplay mechanics and complex systems. It shows how much you enjoy being pushed to your limits.',
                inference: 'This is measured by the difficulty levels you choose, your persistence with challenging games, and your preference for complex mechanics.',
                archetypeEffect: 'Understanding your challenge tolerance helps recommend games that provide the right balance of difficulty and enjoyment.',
                suggestedGames: value === 'Experimental' ? ['Roguelikes', 'Strategy', 'Puzzle'] : value === 'Comfort' ? ['Casual', 'Simulation', 'Story'] : ['Action-Adventure', 'RPG', 'Strategy']
            },
            'Narrative': {
                fullDescription: 'Narrative Preference indicates how important story and character development are to your gaming experience. It reveals whether you prioritize plot or gameplay mechanics.',
                inference: 'We analyze this from your game library composition, completion rates of story-driven games, and engagement with narrative elements.',
                archetypeEffect: 'This trait helps determine whether story-rich games or gameplay-focused experiences will be more satisfying.',
                suggestedGames: ['RPG', 'Visual Novel', 'Adventure', 'Action-Adventure']
            }
        };
        return details[label] || details.Intensity;
    };
    const traitDetails = getTraitDetails(label, value);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: `glass-morphism rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${isHovered ? theme.bg : ''} border border-white/10`, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), onClick: () => setIsModalOpen(true), children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: `text-2xl mb-2 ${isHovered ? theme.accent : 'text-gray-400'} transition-colors`, children: icon }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400 mb-1 uppercase tracking-wider", children: label }), (0, jsx_runtime_1.jsx)("div", { className: `text-sm font-semibold ${isHovered ? 'text-white' : 'text-gray-200'} mb-1 transition-colors`, children: value }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 leading-relaxed", children: description })] }) }), (0, jsx_runtime_1.jsx)(TraitModal_1.TraitModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), trait: {
                    label,
                    value,
                    description,
                    icon,
                    ...traitDetails
                } })] }));
};
exports.TraitCard = TraitCard;
