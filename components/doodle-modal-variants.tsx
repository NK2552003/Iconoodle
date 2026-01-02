"use client"

import * as React from "react"
import type { DoodleModalVariantsProps } from "@/lib/types"

export function DoodleModalVariants({ variants, currentDoodle, onVariantChange }: DoodleModalVariantsProps) {
  if (variants.length <= 1) return null

  return (
    <div className="hidden md:block mb-8">
      <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-3">
        Available Styles
      </h3>
      <div className="max-h-55 sm:max-h-80 overflow-y-auto p-2 no-scrollbar" aria-label="Available Styles">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
          {variants.map((v) => (
            <div
              key={v.style}
              onClick={() => currentDoodle.style !== v.style && onVariantChange(v)}
              className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
                currentDoodle.style === v.style
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-primary/50 opacity-60"
              }`}
            >
              <div
                className={`aspect-square flex items-center justify-center mb-1 scale-75 ${
                  v.style === "WHITE" ? "p-2 rounded-md bg-black" : ""
                }`}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: v.svg }}
                />
              </div>
              <p className="text-[10px] text-center font-bold">{v.style}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
