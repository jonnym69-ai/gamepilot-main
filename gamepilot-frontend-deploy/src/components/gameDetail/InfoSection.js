"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const InfoSection = ({ releaseDate, developers, publishers, genres, platforms, achievements }) => {
    const getPlatformIcon = (platform, available) => {
        if (!available)
            return null;
        switch (platform) {
            case 'windows':
                return (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83E\uDE9F" });
            case 'mac':
                return (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83C\uDF4E" });
            case 'linux':
                return (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDC27" });
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: "Release Date" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: releaseDate })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: "Developer & Publisher" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Developer:" }), " ", developers.join(', ')] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Publisher:" }), " ", publishers.join(', ')] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: "Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: genres.map((genre) => ((0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gaming-primary/20 border border-gaming-primary/30 rounded-full text-sm text-gaming-primary", children: genre.description }, genre.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: "Available Platforms" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [getPlatformIcon('windows', platforms.windows), getPlatformIcon('mac', platforms.mac), getPlatformIcon('linux', platforms.linux)] })] }), achievements && achievements.total > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: "Achievements" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold", children: achievements.total }), " achievements"] })] }))] }));
};
exports.InfoSection = InfoSection;
