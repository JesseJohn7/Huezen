export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  percentage: number;
}

export interface Palette {
  id?: string;
  colors: ColorInfo[];
  createdAt?: string;
  imageUrl?: string;
}

export type CopyFormat = "hex" | "rgb" | "hsl" | "tailwind";
