import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // A02 OWASP: path alias keeps imports clean and avoids fragile relative paths
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                // A02 OWASP: Uses env var — override in .env.local
                target: process.env.VITE_API_URL ?? 'http://localhost:8080',
                changeOrigin: true,
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    // ─── Vitest configuration ───────────────────────────────
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/__tests__/setup.ts'],
        // Force Vitest to transform Axios through Vite (fixes CJS/ESM interop in jsdom)
        server: {
            deps: {
                inline: ['axios'],
            },
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/services/**', 'src/contexts/**', 'src/components/ProtectedRoute.tsx'],
            exclude: ['src/__tests__/**'],
        },
    },
});
