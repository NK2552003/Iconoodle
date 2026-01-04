"use client"

import * as React from "react"
import type { DoodleModalPreviewProps } from "@/lib/types"

export function DoodleModalPreview({
  currentDoodle,
  variants,
  getSizedSvg,
  onVariantChange,
  size,
  displaySize,
  isWhite,
}: DoodleModalPreviewProps) {
  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ${isWhite ? "p-4 rounded-md bg-black" : ""}`}
      style={
        size === "100%"
          ? { width: "100%", height: "auto", maxWidth: "100%", maxHeight: "calc(100vh - 280px)" }
          : { width: displaySize, height: displaySize, maxWidth: "100%", maxHeight: "calc(100vh - 280px)" }
      }
    >
      {variants.length > 1 && (
        <div
          className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 w-16 overflow-y-auto no-scrollbar p-2 items-center z-20 rounded"
          style={
            size === "100%" ? { height: "auto", maxHeight: "calc(100vh - 280px)" } : { height: displaySize }
          }
        >
          {variants.map((v) => (
            <button
              key={v.style}
              onClick={() => currentDoodle.style !== v.style && onVariantChange(v)}
              className={`w-12 h-12 flex-shrink-0 flex items-center justify-center p-2 rounded-md transition-all overflow-hidden ${
                currentDoodle.style === v.style ? "ring-1 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`${v.style} variant`}
            >
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: v.svg }}
              />
            </button>
          ))}
        </div>
      )}
      <div
        className="w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: getSizedSvg(currentDoodle.svg) }}
      />
    </div>
  )
}
