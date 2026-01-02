import type { ExportFormat } from "./svg-utils"

/**
 * Available export format options for dropdowns
 */
export const EXPORT_FORMATS: { label: string; value: ExportFormat }[] = [
  { label: "SVG", value: "SVG" },
  { label: "TSX", value: "TSX" },
  { label: "JSX", value: "JSX" },
  { label: "Vue", value: "VUE" },
  { label: "Svelte", value: "SVELTE" },
  { label: "Astro", value: "ASTRO" },
  { label: "React Native", value: "REACT_NATIVE" },
  { label: "Base64", value: "BASE64" },
]

/**
 * File extension mapping for each export format
 */
export const EXTENSION_MAP: Record<ExportFormat, string> = {
  SVG: "svg",
  TSX: "tsx",
  JSX: "jsx",
  VUE: "vue",
  SVELTE: "svelte",
  ASTRO: "astro",
  REACT_NATIVE: "tsx",
  BASE64: "txt",
}

/**
 * MIME type mapping for each export format
 */
export const MIME_MAP: Record<ExportFormat, string> = {
  SVG: "image/svg+xml",
  TSX: "text/typescript-jsx",
  JSX: "text/javascript-jsx",
  VUE: "text/vue",
  SVELTE: "text/svelte",
  ASTRO: "text/astro",
  REACT_NATIVE: "text/typescript-jsx",
  BASE64: "text/plain",
}

/**
 * Available size options for preview
 */
export const SIZE_OPTIONS = [
  "16px",
  "18px",
  "24px",
  "32px",
  "36px",
  "48px",
  "64px",
  "72px",
  "96px",
  "128px",
  "192px",
  "256px",
  "512px",
  "100%",
] as const

/**
 * Preferred order for variant styles
 */
export const VARIANT_STYLE_ORDER = ["LINED", "COLORED", "WHITE", "ICON", "BLACK"] as const
