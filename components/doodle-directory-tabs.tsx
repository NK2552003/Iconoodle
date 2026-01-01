"use client"

import * as React from "react"
import { Loader } from "lucide-react"
import type { Doodle } from "@/lib/data"

interface TabsProps {
  selectedView: 'doodles' | 'icons' | 'illustrations'
  setSelectedView: (v: 'doodles' | 'icons' | 'illustrations') => void
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  loadingDoodles: boolean
  loadingIcons: boolean
  loadingIllustrations: boolean
  allDoodles: Doodle[]
  iconsTotal: number
  allIllustrations: Doodle[]
}

export function DoodleDirectoryTabs({
  selectedView,
  setSelectedView,
  selectedCategory,
  setSelectedCategory,
  loadingDoodles,
  loadingIcons,
  loadingIllustrations,
  allDoodles,
  iconsTotal,
  allIllustrations,
}: TabsProps) {
  return (
    <div className="hidden md:grid md:grid-cols-3 gap-3 p-2 md:mt-4 md:mx-2 rounded-xl md:sticky md:top-4 md:z-30 md:backdrop-blur-sm md:border">
      <button
        onClick={() => { setSelectedCategory("All"); setSelectedView('doodles') }}
        className={`w-full text-center px-3 py-2 rounded-lg text-sm transition-colors flex flex-col items-center gap-1 ${
          selectedView === 'doodles' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
        }`}
      >
        <div className=" md:text-lg lg:font-semibold min-w-0 truncate text-xl">Doodles</div>
        {loadingIcons ? (
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Loader className="w-3 h-3 animate-spin" /> <span className="ml-1">Loading</span></div>
        ) : (
          (allDoodles.length > 0 || selectedView === 'doodles') ? (
            <span className="text-xs text-muted-foreground mt-1">{allDoodles.length} assets</span>
          ) : <span className="text-xs text-muted-foreground mt-1">4280 icons</span>
        )}
      </button>
      <button
        onClick={() => { setSelectedCategory("All"); setSelectedView('icons') }}
        className={`w-full text-center px-3 py-2 rounded-lg text-sm transition-colors flex flex-col items-center gap-1 ${
          selectedView === 'icons' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
        }`}
      >
        <div className="md:text-lg md:font-semibold min-w-0 truncate text-xl">Icons</div>
        {loadingIcons ? (
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Loader className="w-3 h-3 animate-spin" /> <span className="ml-1">Loading</span></div>
        ) : (
          (iconsTotal > 0 || selectedView === 'icons') ? (
            <span className="text-xs text-muted-foreground mt-1">{iconsTotal} icons</span>
          ) : <span className="text-xs text-muted-foreground mt-1">5565 icons</span>
        )}
      </button>
      <button
        onClick={() => { setSelectedCategory("All"); setSelectedView('illustrations') }}
        className={`w-full text-center px-3 py-2 rounded-lg text-sm transition-colors flex flex-col items-center gap-1 ${
          selectedView === 'illustrations' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
        }`}
      >
        <div className="md:text-lg md:font-semibold min-w-0 truncate text-xl">Illustrations</div>
        {loadingIllustrations ? (
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Loader className="w-3 h-3 animate-spin" /> <span className="ml-1">Loading</span></div>
        ) : (
          (allIllustrations.length > 0 || selectedView === 'illustrations') ? (
            <span className="text-xs text-muted-foreground mt-1">{allIllustrations.length} assets</span>
          ) :   <span className="text-xs text-muted-foreground mt-1">1024 assets</span>
        )}
      </button>
    </div>
  )
}
