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
      className="min-h-screen bg-[--bg] text-[--text-primary]"
      style={
        {
          "--bg": "#000000",
          "--surface": "#0a0a0a",
          "--surface-alt": "#1a1a1a",
          "--surface-hover": "#262626",
          "--border": "#1a1a1a",
          "--accent": "#6d5aff",
          "--accent-hover": "#5a48e0",
          "--text-primary": "#ffffff",
          "--text-muted": "#999999",
        } as React.CSSProperties
      }
    >
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Navigation — no border */}
      <nav className="fixed top-0 w-full z-50 bg-[--bg]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            
            <span className="text-sm font-semibold hidden sm:inline">Huezen</span>
          </div>

          {/* GitHub Star Button */}
          <a
            href="https://github.com/JesseJohn7/Huezen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[--surface-alt] hover:bg-[--surface-hover] rounded-lg text-sm font-semibold transition border border-[--border]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Star on GitHub
          </a>
        </div>
      </nav>

      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[--text-muted] mb-4">
              Extract colors instantly
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-tight whitespace-normal">
              Extract colours
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent block">
                from any image.
              </span>
            </h1>
            <p className="text-[--text-muted] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16 px-2">
              Drop an image and instantly get dominant colours with one-click copy for HEX, RGB, HSL, or Tailwind. Zero external APIs.
            </p>
          </div>

          {/* Dropzone */}
          <div className="mb-12">
            <ImageDropzone
              onColorsExtracted={handleColorsExtracted}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="relative">
          {colors.length > 0 && !isLoading && (
            <div className="space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Palette header */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-[--text-primary]">
                      Dominant colours
                    </h2>
                    <p className="text-sm text-[--text-muted] mt-2">
                      {colors.length} colours extracted · click any format to copy
                    </p>
                  </div>
                  {/* Thin colour bar preview */}
                  <div className="w-full sm:w-auto h-10 rounded-xl overflow-hidden shadow-lg flex">
                    {colors.map((c) => (
                      <div
                        key={c.hex}
                        className="flex-1 transition-transform hover:scale-y-110"
                        style={{ backgroundColor: c.hex }}
                        title={c.hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Swatches grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {colors.map((color, i) => (
                    <ColorSwatch key={color.hex + i} color={color} index={i} />
                  ))}
                </div>
              </div>

              {/* Actions — no divider */}
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[--text-muted] mb-6">
                  Export options
                </p>
                <PaletteActions colors={colors} />
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {colors.length === 0 && !isLoading && (
            <div className="text-center text-[--text-muted] text-sm mt-8 space-y-3 max-w-4xl mx-auto px-4">
              <p className="text-base">Upload an image or paste one to get started</p>
              <p className="text-xs">You can also press <kbd className="px-2 py-1 rounded bg-[--surface-alt] text-[--text-primary] font-mono inline">⌘V</kbd> / <kbd className="px-2 py-1 rounded bg-[--surface-alt] text-[--text-primary] font-mono inline">Ctrl+V</kbd></p>
            </div>
          )}

          {/* Footer — no top border */}
          <div className="max-w-6xl mx-auto mt-16 md:mt-24 pt-12">
            <p className="text-center text-[--text-muted] text-xs font-mono">
              built with canvas api · zero tracking · zero ads · 100% offline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}