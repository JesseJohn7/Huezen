"use client";

import React, { useState } from "react";
import ImageDropzone from "./ImageDropzone";
import ColorSwatch from "./ColorSwatch";
import PaletteActions from "./PaletteActions";
import { ColorInfo } from "../types/palette";

export default function ColorPalette() {
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [_imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const handleColorsExtracted = (extracted: ColorInfo[], imageUrl: string) => {
    setColors(extracted);
    setImageDataUrl(imageUrl);
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={
        {
          "--bg": "#ffffff",
          "--bg-subtle": "#f5f5f7",
          "--surface": "#ffffff",
          "--surface-alt": "#f0f0f5",
          "--border": "#e2e2ea",
          "--border-light": "#ebebf2",
          "--accent": "#4f46e5",
          "--accent-hover": "#4338ca",
          "--accent-soft": "#ede9fe",
          "--text-primary": "#111118",
          "--text-secondary": "#44444f",
          "--text-muted": "#8888a0",
          backgroundColor: "var(--bg)",
          color: "var(--text-primary)",
        } as React.CSSProperties
      }
    >
      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-14 border-b"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6d5aff 0%, #f05aff 100%)" }}
          >
            C
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
            ColorPalette
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <a href="#" className="hover:text-[--text-primary] transition-colors">Extract</a>
          <a href="#" className="hover:text-[--text-primary] transition-colors">Explore</a>
          <a href="#" className="hover:text-[--text-primary] transition-colors">Docs</a>
        </nav>
        <a
          href="#"
          className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
          style={{
            backgroundColor: "var(--accent)",
            color: "#fff",
          }}
        >
          Try free
        </a>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-14 px-4">
        {/* Decorative sample colour strips flanking (desktop only) */}
        <div
          className="hidden lg:flex absolute left-0 top-0 h-full w-44 flex-col"
          aria-hidden="true"
          style={{ opacity: 0.9 }}
        >
          {[
            "#f87171", "#fb923c", "#facc15", "#4ade80",
            "#34d399", "#22d3ee", "#60a5fa", "#a78bfa",
          ].map((c) => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div
          className="hidden lg:flex absolute right-0 top-0 h-full w-44 flex-col"
          aria-hidden="true"
          style={{ opacity: 0.9 }}
        >
          {[
            "#e879f9", "#f472b6", "#fb7185", "#f97316",
            "#eab308", "#84cc16", "#10b981", "#3b82f6",
          ].map((c) => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Hero copy */}
        <div className="relative max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
            Zero APIs · 100% local canvas
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-4"
            style={{ color: "var(--text-primary)", fontFamily: "'Georgia', serif" }}
          >
            Color palette generator
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #6d5aff 0%, #f05aff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              from image.
            </span>
          </h1>

          <p
            className="text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Upload a photo to extract dominant colours and get instant HEX, RGB, HSL &amp; Tailwind values.
          </p>

          {/* Keyboard shortcut hint */}
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
            Press{" "}
            <kbd
              className="px-1.5 py-0.5 rounded font-mono text-xs mx-0.5"
              style={{ backgroundColor: "var(--surface-alt)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              ⌘V
            </kbd>
            {" "}or{" "}
            <kbd
              className="px-1.5 py-0.5 rounded font-mono text-xs mx-0.5"
              style={{ backgroundColor: "var(--surface-alt)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              Ctrl+V
            </kbd>{" "}
            to paste an image directly
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        {/* Upload box */}
        <div
          className="rounded-2xl overflow-hidden mb-10"
          style={{
            border: "1.5px dashed var(--border)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <ImageDropzone
            onColorsExtracted={handleColorsExtracted}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: "var(--accent-soft)", borderTopColor: "var(--accent)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Extracting colours…</p>
          </div>
        )}

        {/* Results */}
        {colors.length > 0 && !isLoading && (
          <div
            className="space-y-10"
            style={{ animation: "fadeUp 0.4s ease both" }}
          >
            {/* Palette header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Dominant colours
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {colors.length} colours extracted · click any format to copy
                </p>
              </div>

              {/* Thin colour bar */}
              <div className="hidden sm:flex h-9 w-48 rounded-xl overflow-hidden shadow-sm border" style={{ borderColor: "var(--border)" }}>
                {colors.map((c) => (
                  <div
                    key={c.hex}
                    className="flex-1 transition-transform hover:scale-x-110 origin-center"
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
            <div className="border-t" style={{ borderColor: "var(--border)" }} />

            {/* Export */}
            <div>
              <p
                className="text-xs font-mono uppercase tracking-widest mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Export options
              </p>
              <PaletteActions colors={colors} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {colors.length === 0 && !isLoading && (
          <div className="text-center mt-2">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Supports JPEG, PNG, WebP · up to 40 MB
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t py-6 text-center text-xs font-mono"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        built with canvas api · zero tracking · zero ads
      </footer>

      {/* keyframe */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}