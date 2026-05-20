import { ColorInfo } from "../types/palette";

// ─── RGB ↔ HSL helpers ────────────────────────────────────────────────────────

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

// ─── K-means colour extraction ────────────────────────────────────────────────

interface Centroid {
  r: number;
  g: number;
  b: number;
  count: number;
}

function colorDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number }
): number {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
      Math.pow(a.g - b.g, 2) +
      Math.pow(a.b - b.b, 2)
  );
}

export function extractColors(
  canvas: HTMLCanvasElement,
  numColors: number = 5
): ColorInfo[] {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Sample every Nth pixel for performance
  const sampleRate = Math.max(1, Math.floor((width * height) / 10000));
  const sampledPixels: Array<{ r: number; g: number; b: number }> = [];

  for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    // Skip transparent and near-white/near-black pixels
    if (a < 128) continue;
    sampledPixels.push({ r, g, b });
  }

  if (sampledPixels.length === 0) return [];

  // Initialise centroids with k-means++ style seeding
  const centroids: Centroid[] = [];
  centroids.push({
    ...sampledPixels[Math.floor(Math.random() * sampledPixels.length)],
    count: 0,
  });

  for (let k = 1; k < numColors; k++) {
    const distances = sampledPixels.map((p) =>
      Math.min(...centroids.map((c) => colorDistance(p, c)))
    );
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalDist;
    let chosen = sampledPixels[0];
    for (let i = 0; i < distances.length; i++) {
      rand -= distances[i];
      if (rand <= 0) {
        chosen = sampledPixels[i];
        break;
      }
    }
    centroids.push({ ...chosen, count: 0 });
  }

  // Run k-means iterations
  for (let iter = 0; iter < 20; iter++) {
    const sums = centroids.map(() => ({ r: 0, g: 0, b: 0, count: 0 }));

    for (const pixel of sampledPixels) {
      let minDist = Infinity;
      let minIdx = 0;
      centroids.forEach((c, i) => {
        const d = colorDistance(pixel, c);
        if (d < minDist) {
          minDist = d;
          minIdx = i;
        }
      });
      sums[minIdx].r += pixel.r;
      sums[minIdx].g += pixel.g;
      sums[minIdx].b += pixel.b;
      sums[minIdx].count++;
    }

    sums.forEach((s, i) => {
      if (s.count > 0) {
        centroids[i] = {
          r: Math.round(s.r / s.count),
          g: Math.round(s.g / s.count),
          b: Math.round(s.b / s.count),
          count: s.count,
        };
      }
    });
  }

  const total = centroids.reduce((sum, c) => sum + c.count, 0);

  return centroids
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((c) => ({
      hex: rgbToHex(c.r, c.g, c.b),
      rgb: { r: c.r, g: c.g, b: c.b },
      hsl: rgbToHsl(c.r, c.g, c.b),
      percentage: Math.round((c.count / total) * 100),
    }));
}

// ─── Format helpers ───────────────────────────────────────────────────────────

export function formatColor(color: ColorInfo, format: string): string {
  switch (format) {
    case "hex":
      return color.hex;
    case "rgb":
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case "hsl":
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    case "tailwind":
      return findClosestTailwind(color);
    default:
      return color.hex;
  }
}

// ─── Tailwind colour matching ─────────────────────────────────────────────────

const TAILWIND_COLORS: Record<string, string> = {
  "slate-50": "#f8fafc",
  "slate-100": "#f1f5f9",
  "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8",
  "slate-500": "#64748b",
  "slate-600": "#475569",
  "slate-700": "#334155",
  "slate-800": "#1e293b",
  "slate-900": "#0f172a",
  "gray-50": "#f9fafb",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "red-50": "#fef2f2",
  "red-100": "#fee2e2",
  "red-200": "#fecaca",
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-800": "#991b1b",
  "red-900": "#7f1d1d",
  "orange-50": "#fff7ed",
  "orange-100": "#ffedd5",
  "orange-200": "#fed7aa",
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "orange-700": "#c2410c",
  "orange-800": "#9a3412",
  "orange-900": "#7c2d12",
  "yellow-50": "#fefce8",
  "yellow-100": "#fef9c3",
  "yellow-200": "#fef08a",
  "yellow-300": "#fde047",
  "yellow-400": "#facc15",
  "yellow-500": "#eab308",
  "yellow-600": "#ca8a04",
  "yellow-700": "#a16207",
  "yellow-800": "#854d0e",
  "yellow-900": "#713f12",
  "green-50": "#f0fdf4",
  "green-100": "#dcfce7",
  "green-200": "#bbf7d0",
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "green-700": "#15803d",
  "green-800": "#166534",
  "green-900": "#14532d",
  "blue-50": "#eff6ff",
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",
  "blue-900": "#1e3a8a",
  "indigo-50": "#eef2ff",
  "indigo-100": "#e0e7ff",
  "indigo-200": "#c7d2fe",
  "indigo-300": "#a5b4fc",
  "indigo-400": "#818cf8",
  "indigo-500": "#6366f1",
  "indigo-600": "#4f46e5",
  "indigo-700": "#4338ca",
  "indigo-800": "#3730a3",
  "indigo-900": "#312e81",
  "violet-50": "#f5f3ff",
  "violet-100": "#ede9fe",
  "violet-200": "#ddd6fe",
  "violet-300": "#c4b5fd",
  "violet-400": "#a78bfa",
  "violet-500": "#8b5cf6",
  "violet-600": "#7c3aed",
  "violet-700": "#6d28d9",
  "violet-800": "#5b21b6",
  "violet-900": "#4c1d95",
  "pink-50": "#fdf2f8",
  "pink-100": "#fce7f3",
  "pink-200": "#fbcfe8",
  "pink-300": "#f9a8d4",
  "pink-400": "#f472b6",
  "pink-500": "#ec4899",
  "pink-600": "#db2777",
  "pink-700": "#be185d",
  "pink-800": "#9d174d",
  "pink-900": "#831843",
  "teal-50": "#f0fdfa",
  "teal-100": "#ccfbf1",
  "teal-200": "#99f6e4",
  "teal-300": "#5eead4",
  "teal-400": "#2dd4bf",
  "teal-500": "#14b8a6",
  "teal-600": "#0d9488",
  "teal-700": "#0f766e",
  "teal-800": "#115e59",
  "teal-900": "#134e4a",
  "cyan-50": "#ecfeff",
  "cyan-100": "#cffafe",
  "cyan-200": "#a5f3fc",
  "cyan-300": "#67e8f9",
  "cyan-400": "#22d3ee",
  "cyan-500": "#06b6d4",
  "cyan-600": "#0891b2",
  "cyan-700": "#0e7490",
  "cyan-800": "#155e75",
  "cyan-900": "#164e63",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function findClosestTailwind(color: ColorInfo): string {
  let minDist = Infinity;
  let closest = "gray-500";

  for (const [name, hex] of Object.entries(TAILWIND_COLORS)) {
    const tw = hexToRgb(hex);
    const dist = colorDistance(color.rgb, tw);
    if (dist < minDist) {
      minDist = dist;
      closest = name;
    }
  }
  return closest;
}

// ─── CSS / Tailwind code generators ──────────────────────────────────────────

export function generateCssVariables(colors: ColorInfo[]): string {
  const vars = colors
    .map(
      (c, i) =>
        `  --color-${i + 1}: ${c.hex};\n  --color-${i + 1}-rgb: ${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b};`
    )
    .join("\n");
  return `:root {\n${vars}\n}`;
}

export function generateTailwindConfig(colors: ColorInfo[]): string {
  const entries = colors
    .map((c, i) => `      'brand-${i + 1}': '${c.hex}',`)
    .join("\n");
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      },\n    },\n  },\n};`;
}

// ─── Palette PNG download ─────────────────────────────────────────────────────

export function downloadPalettePng(colors: ColorInfo[], filename = "palette.png") {
  const swatchW = 200;
  const swatchH = 300;
  const labelH = 80;
  const totalW = swatchW * colors.length;
  const totalH = swatchH + labelH;

  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d")!;

  colors.forEach((color, i) => {
    const x = i * swatchW;

    // Swatch
    ctx.fillStyle = color.hex;
    ctx.fillRect(x, 0, swatchW, swatchH);

    // Label background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(x, swatchH, swatchW, labelH);

    // Hex label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(color.hex, x + swatchW / 2, swatchH + 28);

    // RGB label
    ctx.fillStyle = "#aaaaaa";
    ctx.font = "12px monospace";
    ctx.fillText(
      `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
      x + swatchW / 2,
      swatchH + 50
    );

    // HSL label
    ctx.fillText(
      `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
      x + swatchW / 2,
      swatchH + 68
    );
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
