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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[--surface] to-[--surface-alt] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{title}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-[--accent]/20 text-[--accent] font-semibold">
              ✓ Ready to paste
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-[--surface-hover] transition-all cursor-pointer hover:scale-110"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[--border] to-transparent" />

        {/* Code block */}
        <div className="relative">
          <pre className="p-6 text-sm font-mono text-[--text-primary] overflow-x-auto max-h-[360px] leading-relaxed bg-[--bg]/50">
            <code>{code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium text-[--text-primary] bg-[--surface-alt] hover:bg-[--surface-hover] transition-all cursor-pointer hover:scale-105"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              copied
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg hover:shadow-violet-500/30"
            }`}
          >
            {copied ? "✓ Copied!" : "Copy to clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
