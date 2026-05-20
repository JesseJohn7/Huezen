"use client";

import React, { useState } from "react";

interface CodeOutputProps {
  title: string;
  code: string;
  onClose: () => void;
}

export default function CodeOutput({ title, code, onClose }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-[--surface] border border-[--border] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-[--text-primary]">{title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[--surface-alt] text-[--text-muted] font-mono">
              ready to paste
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-alt] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Code block */}
        <div className="relative">
          <pre className="p-5 text-sm font-mono text-[--text-primary] overflow-x-auto max-h-[360px] leading-relaxed bg-[--bg]">
            <code>{code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[--border] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-alt] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              copied
                ? "bg-green-500 text-white"
                : "bg-[--accent] text-white hover:bg-[--accent-hover]"
            }`}
          >
            {copied ? "✓ Copied!" : "Copy to clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
