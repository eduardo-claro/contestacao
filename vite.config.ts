import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const basePath = env.VITE_BASE_PATH || '/';

	return {
		base: basePath,
		plugins: [react(), tailwindcss()],
		server: {
			port: 3000,
		},
		build: {
			outDir: basePath.replace(/\//g, ''),
		},
	};
});
