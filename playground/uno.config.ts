import {defineConfig, presetTypography, presetWind3, transformerDirectives, transformerVariantGroup} from 'unocss';
import shadcnPreset from './presets/shadcn-preset';
import customPreset from './presets/custom-preset';

export default defineConfig({
	content: {
		filesystem: [
			'./node_modules/bits-ui/dist/**/*.{html,js,svelte,ts}',
			'./node_modules/@tauri-controls/svelte/**/*.{js,svelte,ts}',
		],
		pipeline: {
			include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/],
		},
	},
	shortcuts: {},
	configDeps: ['./presets/custom-preset.ts', './presets/shadcn-preset.ts'],
	presets: [
		// shadcnPreset,
		customPreset,
		presetWind3(),
		// presetWind4({ preflights: { reset: true } }),
		presetTypography({
			cssExtend: {
				'p:first-child,div:first-child': {
					'margin-top': '0',
				},
				'p:last-child,div:last-child': {
					'margin-bottom': '0',
				},
			},
		}),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
