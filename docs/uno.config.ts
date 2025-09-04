import {
	defineConfig,
	presetIcons,
	presetWebFonts,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';
import {fontFamily} from '@unocss/preset-mini/theme';
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
	theme: {
		colors: {
			orange: '#FF3E00',
		},
		fontFamily: {
			manrope: ['Manrope', fontFamily.sans],
		},
	},
	shortcuts: [
		{
			'container-base': 'max-w-3xl mx-a',
			'droppable-container': 'bg-white p-3 rd-34px',
		},
	],
	configDeps: ['./presets/custom-preset.ts', './presets/shadcn-preset.ts'],
	presets: [
		customPreset(),
		shadcnPreset(),
		presetWind3(),
		presetIcons({scale: 1.2}),
		presetWebFonts({
			fonts: {
				manrope: 'Manrope:400;500;600;700;800',
			},
		}),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
