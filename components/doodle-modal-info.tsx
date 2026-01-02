"use client"

import * as React from "react"
import type { DoodleModalInfoProps } from "@/lib/types"

export function DoodleModalInfo({ currentDoodle }: DoodleModalInfoProps) {
  return (
    <div className="mb-6">
      <span className="inline-block px-2 py-1 rounded bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mb-2">
        {currentDoodle.subcategory || currentDoodle.category}
      </span>
      <h2 className="text-2xl font-bold truncate">{currentDoodle.id}</h2>
      <p className="text-sm text-muted-foreground mt-1">Ready to use in your design project.</p>
    </div>
  )
}
