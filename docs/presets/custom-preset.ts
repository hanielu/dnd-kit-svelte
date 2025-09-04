// my-preset.ts
import { definePreset } from 'unocss';
import { handler as h, variantGetParameter } from '@unocss/preset-mini/utils';

export default definePreset(() => ({
	name: 'custom-preset',

	rules: [
		['abs', { position: 'absolute' }],
		['flex|col', { display: 'flex', 'flex-direction': 'column' }]
	],

	shortcuts: [
		// [/^flex\|col$/, () => "flex flex-col", { layer: "default" }],
		[
			// flex-s stands for flex-shortcut
			// to avoid mixups with default flex utilities like flex-wrap
			/^(inline-)?flex-s-(start|center|between|evenly|around|end)(-(start|center|baseline|end))?(\|(col))?$/,
			([, i, justify, align, , col]) =>
				`${i || ''}flex justify-${justify} items${align || '-center'} ${col ? 'flex-col' : ''}`,
			{ layer: 'default' }
		],
		// use when width and height values are the same
		[/^s-(.*)$/, ([, v]) => `h-${v} w-${v}`, { layer: 'utilities' }],
		// use when min width and height values are the same
		[/^min-s-(.*)$/, ([, v]) => `min-h-${v} min-w-${v}`, { layer: 'utilities' }],

		[
			/^scrollbar-f-(thin)-(.*)$/,
			([, size, colors]) => `[scrollbar-width:${size}] [scrollbar-color:${colors}]`,
			{ layer: 'utilities' }
		],
		[
			/^teeny-scrollbar-(w|h)-(\d+)$/,
			([, ax, dg]) => `
      scrollbar:${ax}-${dg}
      scrollbar-track:(rd-xl bg-transparent)
      scrollbar-thumb:(rd-xl bg-grey-4)
      `
		]
	],

	variants: [
		{
			// adds support for "@min-[width]:class" and "@min-h-[width]:class"
			// or
			// "@min-width:class" and "@min-h-width:class"
			name: 'arbitrary-media-query',
			match(matcher, { theme }) {
				// prefix with @ to specify that it's a media query
				const minVariant = variantGetParameter('@min-', matcher, [':', '-']);
				const maxVariant = variantGetParameter('@max-', matcher, [':', '-']);
				const minHeightVariant = variantGetParameter('@min-h-', matcher, [':', '-']);
				const maxHeightVariant = variantGetParameter('@max-h-', matcher, [':', '-']);

				// the order that we check the variants is important
				// because we want to match the most specific one
				const matched =
					(minHeightVariant && {
						type: 'min-h',
						variant: minHeightVariant
					}) ||
					(maxHeightVariant && {
						type: 'max-h',
						variant: maxHeightVariant
					}) ||
					(minVariant && {
						type: 'min',
						variant: minVariant
					}) ||
					(maxVariant && {
						type: 'max',
						variant: maxVariant
					});

				if (matched?.variant) {
					const [match, rest] = matched.variant;
					// this is for extracting the value from the match and
					// makes sure it either has no brackets or has brackets
					const extractedValue =
						h.bracket(match) || (!match.startsWith('[') && !match.endsWith(']') && match) || '';
					const endsWithUnit = /^\d+(em|px|rem)$/.test(extractedValue);
					const isOnlyNum = /^\d+$/.test(extractedValue);

					if (endsWithUnit || isOnlyNum || theme['breakpoints'][extractedValue]) {
						return {
							matcher: rest,
							layer: 'utilities',
							handle: (input, next) =>
								next({
									...input,
									parent: `${input.parent ? `${input.parent} $$ ` : ''}@media (${
										matched.type == 'min'
											? 'min-width'
											: matched.type == 'max'
												? 'max-width'
												: matched.type == 'min-h'
													? 'min-height'
													: 'max-height'
									}:${
										endsWithUnit
											? extractedValue
											: isOnlyNum
												? extractedValue + 'px'
												: theme['breakpoints'][extractedValue]
									})`
								})
						};
					}
				}
			}
		},
		{
			name: 'firefox-only',
			match(matcher) {
				const ffVariant = variantGetParameter('@ff', matcher, [':']);
				if (ffVariant) {
					const [, rest] = ffVariant;
					return {
						matcher: rest,
						handle: (input, next) =>
							next({
								...input,
								parent: `${input.parent ? `${input.parent} $$ ` : ''}@-moz-document url-prefix()`
							})
					};
				}
			}
		},
		(matcher) => {
			const [m1, m2, m3] = ['scrollbar:', 'scrollbar-track:', 'scrollbar-thumb:'];
			let matchedStr = '';

			if (matcher.startsWith(m1)) {
				matchedStr = m1;
			} else if (matcher.startsWith(m2)) {
				matchedStr = m2;
			} else if (matcher.startsWith(m3)) {
				matchedStr = m3;
			} else {
				return matcher;
			}

			return {
				matcher: matcher.slice(matchedStr.length),
				selector: (s) =>
					`${s}::-webkit-scrollbar${matchedStr == m2 ? '-track' : matchedStr == m3 ? '-thumb' : ''}`,
				layer: 'default'
			};
		}
	]
}));

export function convertPalleteToHSL<T extends Record<string, Record<string, string>>>(obj: T) {
	const temp: Record<string, Record<string, string>> = {};
	for (const colorKey in obj) {
		for (const colorShadeKey in obj[colorKey]) {
			if (!temp[colorKey]) {
				temp[colorKey] = {
					[colorShadeKey]: hexToHSL(obj[colorKey][colorShadeKey])
				};
			} else {
				temp[colorKey][colorShadeKey] = hexToHSL(obj[colorKey][colorShadeKey]);
			}
		}
	}
	return temp as T;
}

export function hexToHSL(
	hex: string,
	options?: { justNums: boolean; satAndLight?: { s?: number; l?: number } }
) {
	const { satAndLight, justNums } = options || {
		satAndLight: undefined,
		justNums: false
	};

	// convert hex to rgb
	let r = 0,
		g = 0,
		b = 0;
	if (hex.length === 4) {
		r = +('0x' + hex[1] + hex[1]);
		g = +('0x' + hex[2] + hex[2]);
		b = +('0x' + hex[3] + hex[3]);
	} else if (hex.length === 7) {
		r = +('0x' + hex[1] + hex[2]);
		g = +('0x' + hex[3] + hex[4]);
		b = +('0x' + hex[5] + hex[6]);
	}

	// then to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	const cmin = Math.min(r, g, b);
	const cmax = Math.max(r, g, b);
	const delta = cmax - cmin;
	let h = 0;
	let s = 0;
	let l = 0;

	if (delta === 0) h = 0;
	else if (cmax === r) h = ((g - b) / delta) % 6;
	else if (cmax === g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;
	h = Math.round(h * 60);
	if (h < 0) h += 360;
	l = (cmax + cmin) / 2;
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	if (justNums) return `${h}, ${satAndLight?.s || s}%, ${satAndLight?.l || l}%`;

	return `hsl(${h}, ${satAndLight?.s || s}%, ${satAndLight?.l || l}%)`;
}

export function hexToRgba(hex: string, alpha: number) {
	const [r, g, b] = hex.match(/\w\w/g)!.map((h) => parseInt(h, 16));
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
