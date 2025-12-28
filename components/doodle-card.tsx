"use client"

import * as React from "react"
import { Download, Copy, Maximize2 } from "lucide-react"

interface DoodleCardProps {
  doodle: any
  allDoodles: any[]
  viewMode: "grid" | "list"
  onClick: () => void
  isCandy?: boolean
}

export function DoodleCard({ doodle, allDoodles, viewMode, onClick, isCandy }: DoodleCardProps) {
  const isGrid = viewMode === "grid"
  const [activeStyle, setActiveStyle] = React.useState(doodle.style)

  const currentDoodle = React.useMemo(() => {
    return (
      allDoodles.find((d) => d.id === doodle.id && d.category === doodle.category && d.style === activeStyle) || doodle
    )
  }, [allDoodles, doodle, activeStyle])

  const hasColored = React.useMemo(() => {
    return allDoodles.some((d) => d.id === doodle.id && d.category === doodle.category && d.style === "COLORED")
  }, [allDoodles, doodle])

  // If the currently selected style is WHITE, show a black background behind the svg so it remains visible
  const isWhite = currentDoodle?.style === "WHITE"

  return (
    <div
      className={`group relative ${isCandy ? 'bg-black text-white' : 'bg-muted/30'} rounded-xl border transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden ${
        isGrid ? "aspect-square" : "flex items-center gap-6 p-4"
      }`}
    >
      <div
        onClick={onClick}
        className={`flex items-center justify-center cursor-pointer ${isGrid ? "w-full h-full p-6" : "w-16 h-16 shrink-0"}`}
      >
        {/* Add a black rounded background when rendering WHITE style icons or Candy Icons */}
        <div className={`w-full h-full flex items-center justify-center transition-transform group-hover:scale-110 overflow-auto no-scrollbar ${(isWhite || isCandy) ? 'p-4 rounded-md bg-black' : ''}`}>
          <div
            className={`w-full h-full flex items-center justify-center ${isCandy ? 'text-white' : 'text-foreground'} ${isWhite ? 'contrast-more' : ''}`}
            dangerouslySetInnerHTML={{ __html: currentDoodle.svg }}
          />
        </div>
      </div>

      {/* Style switcher on the card itself */}
      {hasColored && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveStyle("LINED")
            }}
            className={`w-5 h-5 rounded-full border text-[8px] flex items-center justify-center font-bold ${activeStyle === "LINED" ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            L
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveStyle("COLORED")
            }}
            className={`w-5 h-5 rounded-full border text-[8px] flex items-center justify-center font-bold ${activeStyle === "COLORED" ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            C
          </button>
        </div>
      )}

      {!isGrid && (
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{doodle.id}</h4>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {doodle.category} • {currentDoodle.style}
          </p>
        </div>
      )}

      {/* Hover Overlay - Only for Grid */}
      {isGrid && (
        <div
          onClick={onClick}
          className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 cursor-pointer"
        >
          <p className="text-xs font-medium text-center truncate w-full mb-2">{doodle.id}</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!isGrid && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-md hover:bg-background border transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md hover:bg-background border transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
