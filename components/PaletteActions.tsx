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

  const buttons = [
    {
      key: "css",
      label: "CSS Variables",
      icon: "{ }",
      description: ":root {}",
      onClick: () => setModal("css"),
    },
    {
      key: "tailwind",
      label: "Tailwind Config",
      icon: "TW",
      description: "colors: {}",
      onClick: () => setModal("tailwind"),
    },
    {
      key: "download",
      label: downloading ? "Downloading…" : "Download PNG",
      icon: "↓",
      description: "palette strip",
      onClick: handleDownload,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={btn.onClick}
            disabled={downloading && btn.key === "download"}
            className={`
              group flex items-center gap-3 px-5 py-3 rounded-xl
              transition-all duration-300 text-sm font-medium cursor-pointer
              ${btn.key === "css"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20"
                : "bg-[--surface-alt] text-[--text-primary] hover:bg-[--surface-hover] hover:scale-105 hover:shadow-lg"
              }
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
            `}
          >
            <span
              className={`
                w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold
                ${btn.key === "css"
                  ? "bg-white/25 text-white"
                  : "bg-[--border] text-[--text-muted] group-hover:bg-[--accent] group-hover:text-white"
                }
              `}
            >
              {btn.icon}
            </span>
            <span className="leading-none">
              {btn.label}
              <span
                className={`block text-xs font-normal mt-0.5 ${
                  btn.key === "css" ? "text-white/60" : "text-[--text-muted]"
                }`}
              >
                {btn.description}
              </span>
            </span>
          </button>
        ))}
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
