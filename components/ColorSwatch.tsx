"use client";

import React, { useState } from "react";
import { ColorInfo, CopyFormat } from "../types/palette";
import { formatColor, findClosestTailwind } from "../lib/colorUtils";

interface ColorSwatchProps {
  color: ColorInfo;
  index: number;
}

const FORMATS: { key: CopyFormat; label: string }[] = [
  { key: "hex", label: "HEX" },
  { key: "rgb", label: "RGB" },
  { key: "hsl", label: "HSL" },
  { key: "tailwind", label: "TW" },
];

export default function ColorSwatch({ color, index }: ColorSwatchProps) {
  const [copied, setCopied] = useState<CopyFormat | null>(null);

  const handleCopy = async (format: CopyFormat) => {
    const value = formatColor(color, format);
    await navigator.clipboard.writeText(value);
    setCopied(format);
    setTimeout(() => setCopied(null), 1500);
  };

  const isLight = color.hsl.l > 60;
  const textColor = isLight ? "#1a1a1a" : "#ffffff";
  const mutedColor = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)";

  return (
    <div
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Main swatch */}
      <div
        className="relative flex flex-col justify-end p-5 min-h-[200px]"
        style={{ backgroundColor: color.hex }}
      >
        {/* Percentage badge */}
        <div
          className="absolute top-3 right-3 text-xs font-mono font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.18)",
            color: textColor,
          }}
        >
          {color.percentage}%
        </div>

        {/* Colour values */}
        <div className="space-y-0.5">
          <p className="font-mono font-bold text-xl tracking-wider" style={{ color: textColor }}>
            {color.hex}
          </p>
          <p className="font-mono text-xs" style={{ color: mutedColor }}>
            rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
          </p>
          <p className="font-mono text-xs" style={{ color: mutedColor }}>
            hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
          </p>
          <p className="font-mono text-xs" style={{ color: mutedColor }}>
            {findClosestTailwind(color)}
          </p>
        </div>
      </div>

      {/* Copy buttons */}
      <div className="grid grid-cols-4 gap-2 bg-gradient-to-b from-[--surface]/50 to-[--surface] p-3">
        {FORMATS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleCopy(key)}
            className={`
              py-3 px-2 text-xs font-mono font-semibold transition-all duration-200 rounded-lg cursor-pointer
              transform hover:scale-105
              ${copied === key
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-[--surface-hover] text-[--text-muted] hover:bg-[--accent]/20 hover:text-[--accent] hover:shadow-lg hover:shadow-[--accent]/20"
              }
            `}
          >
            {copied === key ? "✓" : label}
          </button>
        ))}
      </div>
    </div>
  );
}
