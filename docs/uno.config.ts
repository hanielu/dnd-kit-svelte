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

export default defineConfig({
	theme: {
		colors: {
			orange: "#FF3E00",
		},
		fontFamily: {
			manrope: ["Manrope", fontFamily.sans],
		},
	},
	shortcuts: [
		{
			"container-base": "max-w-3xl mx-a",
			"droppable-container": "bg-white p-3 rd-34px",
		},
	],
	configDeps: ["./presets/custom-preset.ts", "./presets/shadcn-preset.ts"],
	presets: [
		customPreset(),
		shadcnPreset(),
		presetWind3(),
		presetIcons({ scale: 1.2 }),
		presetWebFonts({
			fonts: {
				manrope: "Manrope:400;500;600;700;800",
			},
		}),
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
