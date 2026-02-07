"use client"

import * as React from "react"
import { Grid, List, Loader, Search } from "lucide-react"
import type { HeaderProps } from "@/lib/types"

export function DoodleDirectoryHeader({ selectedView, selectedCategory, loadingDoodles, loadingIcons, loadingIllustrations, loadingBiology, visibleCount, totalCount, viewMode, setViewMode, searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div className="min-w-0 hidden md:block">
        <h2 className="text-3xl font-bold tracking-tight mb-2 truncate">
          {selectedView === 'icons' ? (selectedCategory === "All" ? "Icons" : selectedCategory) : selectedView === 'illustrations' ? (selectedCategory === "All" ? "Illustrations" : selectedCategory) : selectedView === 'biology' ? (selectedCategory === "All" ? "Biology" : selectedCategory) : (selectedCategory === "All" ? "Discover All Doodles" : selectedCategory)}
          {(selectedView === 'icons' && loadingIcons) || (selectedView === 'illustrations' && loadingIllustrations) || (selectedView === 'doodles' && loadingDoodles) || (selectedView === 'biology' && loadingBiology) ? <Loader className="inline-block w-4 h-4 animate-spin ml-2 text-muted-foreground" /> : null}
        </h2>
        <p className="text-muted-foreground">
          Free, editable SVGs to spice up your designs. Showing {visibleCount} of {totalCount} {selectedView === 'icons' ? "icons" : selectedView === 'illustrations' ? "illustrations" : selectedView === 'biology' ? "biology assets" : "doodles"}.
        </p>
      </div>

      {/* Mobile: show search on the left and view toggles on the right */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 block md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search doodles..."
                className="w-full h-9 pl-10 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
      </div>
    </div>
  )
}
