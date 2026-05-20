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
      <div className="flex flex-wrap gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={btn.onClick}
            disabled={downloading && btn.key === "download"}
            className={`
              group flex items-center gap-3 px-4 py-3 rounded-xl border
              transition-all duration-200 text-sm font-medium
              ${btn.key === "css"
                ? "bg-[--accent] text-white border-[--accent] hover:bg-[--accent-hover] hover:border-[--accent-hover] shadow-sm"
                : "bg-[--surface] text-[--text-primary] border-[--border] hover:bg-[--surface-hover] hover:border-[--accent]/40"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span
              className={`
                w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                ${btn.key === "css"
                  ? "bg-white/20 text-white"
                  : "bg-[--surface-alt] text-[--text-muted] group-hover:text-[--accent]"
                }
              `}
            >
              {btn.icon}
            </span>
            <span className="leading-none">
              {btn.label}
              <span
                className={`block text-xs font-normal mt-0.5 ${
                  btn.key === "css" ? "text-white/70" : "text-[--text-muted]"
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
