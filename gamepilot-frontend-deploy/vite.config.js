"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, plugin_react_1.default)(),
        {
            name: 'custom-middleware',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    // Don't interfere with Vite's internal routes
                    if (req.url && (req.url.startsWith('/@') || // Vite HMR routes
                        req.url.startsWith('/node_modules') || // Node modules
                        req.url.startsWith('/src') || // Source files
                        req.url.includes('.') || // Files with extensions (CSS, JS, images, etc.)
                        req.url.startsWith('/api') // API routes
                    )) {
                        return next();
                    }
                    // Handle client-side routing fallback for non-file, non-API routes
                    if (req.url && !req.url.startsWith('/api')) {
                        req.url = '/index.html';
                    }
                    next();
                });
            }
        }
    ],
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
            '@shared': path_1.default.resolve(__dirname, '../../packages/shared/src'),
            '@gamepilot/ui': path_1.default.resolve(__dirname, '../../packages/ui/src'),
            '@gamepilot/types': path_1.default.resolve(__dirname, '../../packages/types/src'),
            '@gamepilot/static-data': path_1.default.resolve(__dirname, '../../packages/static-data/src'),
            '@gamepilot/integrations': path_1.default.resolve(__dirname, '../../packages/integrations/src'),
        },
        dedupe: ['react', 'react-dom'],
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
    optimizeDeps: {
        include: ['@gamepilot/ui', 'react-router-dom'],
    },
    build: {
        rollupOptions: {
            external: [],
            output: {
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            },
        },
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true,
        },
        chunkSizeWarningLimit: 500, // Set to 500KB which is reasonable for modern apps
        // Optimize assets during build
        assetsInlineLimit: 4096, // Inline small assets (< 4KB)
    },
    server: {
        host: true,
        port: 3002, // HARDCODED - NEVER CHANGE
        strictPort: true, // FORCE this port or fail
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            }
        }
    },
});
