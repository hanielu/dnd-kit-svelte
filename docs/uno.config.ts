import { fontFamily } from "@unocss/preset-mini/theme";
import {
	defineConfig,
	presetIcons,
	presetWebFonts,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";
import customPreset from "./presets/custom-preset";
import shadcnPreset from "./presets/shadcn-preset";

/** A color from `app.css`, where it has a light and a dark value. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default defineConfig({
	theme: {
		colors: {
			orange: "#FF3E00",
			brand: token("brand"),
			page: token("page"),
			surface: token("surface"),
			zone: token("zone"),
			item: token("item"),
			line: token("line"),
			ink: { DEFAULT: token("ink"), soft: token("ink-soft"), faint: token("ink-faint") },
		},
		fontFamily: {
			manrope: ["Manrope", fontFamily.sans],
			inter: ["Inter", fontFamily.sans],
			mono: ["Geist Mono", fontFamily.mono],
		},
	},
	shortcuts: [
		{
			"container-base": "max-w-3xl mx-a",
			"droppable-container": "bg-surface p-3 rd-34px",
		},
	],
	configDeps: ["./presets/custom-preset.ts", "./presets/shadcn-preset.ts"],
	presets: [
		customPreset(),
		shadcnPreset(),
		presetWind3({ dark: "class" }),
		presetIcons({ scale: 1.2 }),
		presetWebFonts({
			fonts: {
				manrope: "Manrope:400;500;600;700;800",
				inter: "Inter:400;500;600",
				mono: "Geist Mono:400;500",
			},
		}),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
