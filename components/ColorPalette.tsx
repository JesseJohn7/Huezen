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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-[--border] bg-[--bg]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-lg">
              🎨
            </div>
            <span className="text-sm font-semibold hidden sm:inline">ColorPalette</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[--text-muted] hover:text-[--text-primary] transition">
              Features
            </a>
            <a href="#docs" className="text-sm text-[--text-muted] hover:text-[--text-primary] transition">
              Docs
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[--text-primary]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[--border] bg-[--bg] p-4 space-y-2">
            <a href="#features" className="block text-sm text-[--text-muted] hover:text-[--text-primary] transition py-2">
              Features
            </a>
            <a href="#docs" className="block text-sm text-[--text-muted] hover:text-[--text-primary] transition py-2">
              Docs
            </a>
          </div>
        )}
      </nav>

      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[--text-muted] mb-4">
              Extract colors instantly
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">
              Extract colours
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 inline-block">
                from any image.
              </span>
            </h1>
            <p className="text-[--text-muted] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10 px-2">
              Drop an image and instantly get dominant colours with one-click copy for HEX, RGB, HSL, or Tailwind. Zero external APIs.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16 px-2">
            <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg transition transform hover:scale-105">
              Get Started
            </button>
            <button className="w-full sm:w-auto px-8 py-3 bg-[--surface-alt] hover:bg-[--surface-hover] text-[--text-primary] font-semibold rounded-lg transition border border-[--border]">
              Learn More
            </button>
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

            {/* Divider */}
            <div className="border-t border-[--border]" />

            {/* Actions */}
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

        {/* Footer */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-[--border]">
          <p className="text-center text-[--text-muted] text-xs font-mono">
            built with canvas api · zero tracking · zero ads · 100% offline
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
