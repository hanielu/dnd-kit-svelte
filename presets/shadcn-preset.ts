import {Preset} from 'unocss';

export const shadcnPreset: Preset = {
	name: 'shadcn',

	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		colors: {
			border: 'hsl(var(--border) / <alpha-value>)',
			input: 'hsl(var(--input) / <alpha-value>)',
			ring: 'hsl(var(--ring) / <alpha-value>)',
			background: 'hsl(var(--background) / <alpha-value>)',
			foreground: 'hsl(var(--foreground) / <alpha-value>)',
			primary: {
				DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
				foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
				foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
				foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
			},
			muted: {
				DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
				foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
			},
			accent: {
				DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
				foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
			},
			popover: {
				DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
				foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
			},
			card: {
				DEFAULT: 'hsl(var(--card) / <alpha-value>)',
				foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
			},
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
		},
		fontFamily: {
			// sans: ["Inter", ...fontFamily.sans],
		},
	},

	preflights: [
		// commented out because I put the CSS in app.css
		// also, I'm making use of this extension https://marketplace.visualstudio.com/items?itemName=dexxiez.shadcn-color-preview#:~:text=The%20shadcn%20HSL%20Preview%20extension,directly%20in%20your%20CSS%20files.
		//   {
		//     layer: 'default',
		//     getCSS: () => `:root {
		//   --background: 0 0% 100%;
		//   --foreground: 224 71.4% 4.1%;
		//   --muted: 220 14.3% 95.9%;
		//   --muted-foreground: 220 8.9% 46.1%;
		//   --popover: 0 0% 100%;
		//   --popover-foreground: 224 71.4% 4.1%;
		//   --card: 0 0% 100%;
		//   --card-foreground: 224 71.4% 4.1%;
		//   --border: 220 13% 91%;
		//   --input: 220 13% 91%;
		//   --primary: 220.9 39.3% 11%;
		//   --primary-foreground: 210 20% 98%;
		//   --secondary: 220 14.3% 95.9%;
		//   --secondary-foreground: 220.9 39.3% 11%;
		//   --accent: 220 14.3% 95.9%;
		//   --accent-foreground: 220.9 39.3% 11%;
		//   --destructive: 0 72.2% 50.6%;
		//   --destructive-foreground: 210 20% 98%;
		//   --ring: 224 71.4% 4.1%;
		//   --radius: 0.5rem;
		// }`,
		//   },
	],
};
