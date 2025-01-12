import adapter from '@sveltejs/adapter-vercel';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess({script: true}),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),

		alias: {
			$core: 'src/lib/core/src',
			$helpers: 'src/lib/helpers.js',
			$utilities: 'src/lib/utilities/src/index.js',
			$accessibility: 'src/lib/accessibility/src/index.js',
			$sortable: 'src/lib/sortable/src/index.js',
			'svelte-dnd-kit': 'src/lib',
		},
	},
};

export default config;
