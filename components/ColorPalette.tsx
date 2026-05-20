"use client";

import React, { useState } from "react";
import ImageDropzone from "./ImageDropzone";
import ColorSwatch from "./ColorSwatch";
import PaletteActions from "./PaletteActions";
import { ColorInfo } from "../types/palette";

export function ColorPalette() {
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [_imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const handleColorsExtracted = (extracted: ColorInfo[], imageUrl: string) => {
    setColors(extracted);
    setImageDataUrl(imageUrl);
  };

  return (
    <div
      className="min-h-screen bg-[--bg] text-[--text-primary] font-sans"
      style={
        {
          "--bg": "#000000",
          "--surface": "#16161a",
          "--surface-alt": "#1e1e24",
          "--surface-hover": "#1e1e28",
          "--border": "#2a2a32",
          "--accent": "#6d5aff",
          "--accent-hover": "#5a48e0",
          "--text-primary": "#f0f0f4",
          "--text-muted": "#6b6b7a",
        } as React.CSSProperties
      }
    >
      {/* Background grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30 flex items-center justify-center text-lg">
                🎨
              </div>
              <span className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[--text-muted]">
                ColorPalette
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[--text-primary]">
              Extract colours
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                from any image.
              </span>
            </h1>
            <p className="mt-3 text-[--text-muted] text-base max-w-md leading-relaxed">
              Drop an image and instantly get dominant colours with one-click copy for HEX,
              RGB, HSL, or Tailwind. Zero external APIs.
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div className="mb-10">
          <ImageDropzone
            onColorsExtracted={handleColorsExtracted}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Results */}
        {colors.length > 0 && !isLoading && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Palette header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[--text-primary]">
                  Dominant colours
                </h2>
                <p className="text-sm text-[--text-muted] mt-0.5">
                  {colors.length} colours extracted · click any format to copy
                </p>
              </div>
              {/* Thin colour bar preview */}
              <div className="hidden sm:flex h-8 w-40 rounded-xl overflow-hidden shadow-lg">
                {colors.map((c) => (
                  <div
                    key={c.hex}
                    className="flex-1 transition-transform hover:scale-x-110"
                    style={{ backgroundColor: c.hex }}
                    title={c.hex}
                  />
                ))}
              </div>
            </div>

            {/* Swatches grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {colors.map((color, i) => (
                <ColorSwatch key={color.hex + i} color={color} index={i} />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-[--border]" />

            {/* Actions */}
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[--text-muted] mb-4">
                Export options
              </p>
              <PaletteActions colors={colors} />
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {colors.length === 0 && !isLoading && (
          <div className="text-center text-[--text-muted] text-sm mt-6 space-y-1">
            <p>You can also press <kbd className="px-1.5 py-0.5 rounded bg-[--surface-alt] text-xs font-mono">⌘V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[--surface-alt] text-xs font-mono">Ctrl+V</kbd> to paste an image directly</p>
          </div>
        )}

        {/* Footer */}
        <p className="mt-20 text-center text-[--text-muted] text-xs font-mono">
          built with canvas api · zero tracking · zero ads
        </p>
      </div>
    </div>
  );
}
