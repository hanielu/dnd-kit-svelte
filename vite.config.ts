import {defineConfig} from 'vitest/config';
import {sveltekit} from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	plugins: [UnoCSS(), sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
