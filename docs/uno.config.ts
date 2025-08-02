// import presetAnimations from 'unocss-preset-animations';
import {
	defineConfig,
	presetIcons,
	presetUno,
	presetWebFonts,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';
import {fontFamily} from '@unocss/preset-mini/theme';
import {customPreset, shadcnPreset} from './presets';

// https://unocss.dev
export default defineConfig({
	configDeps: ['./presets/my-preset.ts', './presets/shadcn-preset.ts'],
	content: {
		filesystem: ['./node_modules/bits-ui/dist/**/*.{html,js,svelte,ts}'],
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
	rules: [],
	shortcuts: [
		{
			'container-base': 'max-w-3xl mx-a',
			'droppable-container': 'bg-white p-3 rd-34px',
		},
		[/^area-(.*)$/, ([, v]) => `[grid-area:_${v}]`, {layer: 'default'}],
		[
			/^gta-(.*)$/,
			([, v]) =>
				`[grid-template-areas:_${v
					?.replace(/-/g, '_')
					.replace(/\|/g, ' ')
					.split(' ')
					.map((v) => '"' + v + '"')
					.join('_')}]`,
			{layer: 'default'},
		],
		[
			/^teeny-scrollbar-(w|h)-(\d+)$/,
			([, ax, dg]) => `
      scrollbar-f-thin-rgba(229,229,229,0.4)_rgba(229,229,229,0.04)
      scrollbar:${ax}-${dg}
      scrollbar-track:(rd-2.5 bg-neutral-2/4)
      scrollbar-thumb:(rd-2.5 bg-neutral-2/40)
      `,
		],
		[/^scroll-th-(.+)$/, ([, v]) => `scrollbar-thumb:${v}`],
	],
	variants: [],
	preflights: [],

	presets: [
		customPreset,
		shadcnPreset,
		presetUno(),
		// presetAnimations(),
		presetIcons({scale: 1.2}),
		presetWebFonts({
			fonts: {
				manrope: 'Manrope:400;500;600;700;800',
			},
		}),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
