"use client";

import React, { useCallback, useRef, useState } from "react";
import { extractColors } from "../lib/colorUtils";
import { ColorInfo } from "../types/palette";

interface ImageDropzoneProps {
  onColorsExtracted: (colors: ColorInfo[], imageDataUrl: string) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

export default function ImageDropzone({
  onColorsExtracted,
  isLoading,
  setIsLoading,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback(
    (file: File | null, dataUrl?: string) => {
      const url = dataUrl;
      if (!url && !file) return;

      setIsLoading(true);

      const loadUrl = url || "";
      const img = new Image();

      const handleLoad = () => {
        const canvas = canvasRef.current!;
        const MAX = 800;
        const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const colors = extractColors(canvas, 5);
        onColorsExtracted(colors, loadUrl);
        setIsLoading(false);
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreview(result);
          img.onload = handleLoad;
          img.src = result;
        };
        reader.readAsDataURL(file);
      } else if (url) {
        img.onload = handleLoad;
        img.src = url;
      }
    },
    [onColorsExtracted, setIsLoading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        processImage(file);
      }
    },
    [processImage]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (imageItem) {
        const file = imageItem.getAsFile();
        if (file) processImage(file);
      }
    },
    [processImage]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="hidden" />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        className={`
          group relative flex flex-col items-center justify-center
          rounded-2xl border-2 border-dashed transition-all duration-300
          cursor-pointer outline-none min-h-[280px]
          ${isDragging
            ? "border-[--accent] bg-[--accent]/5 scale-[1.01]"
            : "border-[--border] hover:border-[--accent]/60 hover:bg-[--surface-hover]"
          }
          ${isLoading ? "opacity-60 pointer-events-none" : ""}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={preview}
              alt="Uploaded"
              className="max-h-[220px] max-w-full rounded-xl object-contain shadow-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-medium text-sm tracking-wide">Click to change image</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[--surface-alt] flex items-center justify-center text-3xl shadow-inner">
              🎨
            </div>
            <div>
              <p className="text-[--text-primary] font-semibold text-lg">
                Drop an image here
              </p>
              <p className="text-[--text-muted] text-sm mt-1">
                or click to browse · paste from clipboard works too
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              {["PNG", "JPG", "WEBP", "SVG", "GIF"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 rounded-md bg-[--surface-alt] text-[--text-muted] text-xs font-mono"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[--bg]/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-[--text-primary]">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm font-medium">Extracting colours…</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
