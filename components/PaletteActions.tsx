"use client";

import React, { useState } from "react";
import { ColorInfo } from "../types/palette";
import {
  generateCssVariables,
  generateTailwindConfig,
  downloadPalettePng,
} from "../lib/colorUtils";
import CodeOutput from "./CodeOutput";

interface PaletteActionsProps {
  colors: ColorInfo[];
}

type ModalType = "css" | "tailwind" | null;

export default function PaletteActions({ colors }: PaletteActionsProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      downloadPalettePng(colors);
      setDownloading(false);
    }, 100);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">

        {/* CSS Variables */}
        <button
          onClick={() => setModal("css")}
          className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300 text-sm font-medium cursor-pointer"
        >
          {/* CSS icon */}
          <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
              <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
            </svg>
          </span>
          <span className="leading-none">
            CSS Variables
            <span className="block text-xs font-normal mt-0.5 text-white/60">:root {"{}"}</span>
          </span>
        </button>

        {/* Tailwind Config */}
        <button
          onClick={() => setModal("tailwind")}
          className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-[--surface-alt] text-[--text-primary] hover:bg-[--surface-hover] hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm font-medium cursor-pointer"
        >
          {/* Tailwind icon */}
          <span className="w-6 h-6 rounded-lg bg-[--border] flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 transition-colors">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[--text-muted] group-hover:fill-sky-400 transition-colors">
              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
            </svg>
          </span>
          <span className="leading-none">
            Tailwind Config
            <span className="block text-xs font-normal mt-0.5 text-[--text-muted]">colors: {"{}"}</span>
          </span>
        </button>

        {/* Download PNG — green */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {/* Download icon */}
          <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            {downloading ? (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4h14v-2H5v2z"/>
              </svg>
            )}
          </span>
          <span className="leading-none">
            {downloading ? "Downloading…" : "Download PNG"}
            <span className="block text-xs font-normal mt-0.5 text-white/60">palette strip</span>
          </span>
        </button>
      </div>

      {modal === "css" && (
        <CodeOutput
          title="CSS Variables"
          code={generateCssVariables(colors)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "tailwind" && (
        <CodeOutput
          title="Tailwind Config"
          code={generateTailwindConfig(colors)}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}