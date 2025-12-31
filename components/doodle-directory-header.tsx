"use client"

import * as React from "react"
import { Grid, List, Loader } from "lucide-react"

interface HeaderProps {
  selectedView: 'doodles' | 'icons' | 'illustrations'
  selectedCategory: string
  loadingDoodles: boolean
  loadingIcons: boolean
  loadingIllustrations: boolean
  visibleCount: number
  totalCount: number
  viewMode: "grid" | "list"
  setViewMode: (m: "grid" | "list") => void
}

export function DoodleDirectoryHeader({ selectedView, selectedCategory, loadingDoodles, loadingIcons, loadingIllustrations, visibleCount, totalCount, viewMode, setViewMode }: HeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div className="min-w-0">
        <h2 className="text-3xl font-bold tracking-tight mb-2 truncate">
          {selectedView === 'icons' ? (selectedCategory === "All" ? "Icons" : selectedCategory) : selectedView === 'illustrations' ? (selectedCategory === "All" ? "Illustrations" : selectedCategory) : (selectedCategory === "All" ? "Discover All Doodles" : selectedCategory)}
          {(selectedView === 'icons' && loadingIcons) || (selectedView === 'illustrations' && loadingIllustrations) || (selectedView === 'doodles' && loadingDoodles) ? <Loader className="inline-block w-4 h-4 animate-spin ml-2 text-muted-foreground" /> : null}
        </h2>
        <p className="text-muted-foreground">
          Free, editable SVGs to spice up your designs. Showing {visibleCount} of {totalCount} {selectedView === 'icons' ? "icons" : selectedView === 'illustrations' ? "illustrations" : "doodles"}.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"}`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"}`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
