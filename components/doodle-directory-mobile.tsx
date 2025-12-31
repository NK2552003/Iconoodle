"use client"

import * as React from "react"
import { Search, Loader } from "lucide-react"
import type { Doodle } from "@/lib/data"

export interface MobileProps {
  searchQuery: string
  setSearchQuery: (v: string) => void
  selectedView: 'doodles' | 'icons' | 'illustrations'
  setSelectedView: (v: 'doodles' | 'icons' | 'illustrations') => void
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  loadingDoodles: boolean
  loadingIcons: boolean
  loadingIllustrations: boolean
  iconsTotal: number
  allDoodles: Doodle[]
  allIllustrations: Doodle[]
  candyOpen: boolean
  setCandyOpen: React.Dispatch<React.SetStateAction<boolean>>
  simpleOpen: boolean
  setSimpleOpen: React.Dispatch<React.SetStateAction<boolean>>
  candyCategories: string[]
  doodleSubcategories: string[]
  iconTopCategories: string[]
  illustrationCategories: string[]
  categories: string[]
  loadDoodleCategory: (name: string) => void
}

export function DoodleDirectoryMobile({
  searchQuery,
  setSearchQuery,
  selectedView,
  setSelectedView,
  selectedCategory,
  setSelectedCategory,
  loadingDoodles,
  loadingIcons,
  loadingIllustrations,
  iconsTotal,
  allDoodles,
  allIllustrations,
  candyOpen,
  setCandyOpen,
  simpleOpen,
  setSimpleOpen,
  candyCategories,
  doodleSubcategories,
  iconTopCategories,
  illustrationCategories,
  categories,
  loadDoodleCategory,
}: MobileProps) {
  return (
    <div className="md:hidden sticky top-16 z-30 bg-background/95 backdrop-blur border-b">
      <div className="px-4 py-2">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <button
            onClick={() => { setSelectedCategory("All"); setSelectedView('doodles') }}
            className={`w-full text-center px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-center ${
              selectedView === 'doodles' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
            }`}
          >
            <div className="font-medium">Doodles</div>
            {loadingDoodles ? (
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
            ) : (
              <div className="text-xs text-muted-foreground">3951 assets</div>
            )}
          </button>
          <button
            onClick={() => { setSelectedCategory("All"); setSelectedView('icons') }}
            className={`w-full text-center px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-center ${
              selectedView === 'icons' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
            }`}
          >
            <div className="font-medium">Icons</div>
            {loadingIcons ? (
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
            ) : (
              (iconsTotal > 0 || selectedView === 'icons') ? (
                <div className="text-xs text-muted-foreground">5487 icons</div>
              ) : null
            )}
          </button>
          <button
            onClick={() => { setSelectedCategory("All"); setSelectedView('illustrations') }}
            className={`w-full text-center px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-center ${
              selectedView === 'illustrations' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
            }`}
          >
            <div className="font-medium">Illustrations</div>
            {loadingIllustrations ? (
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
            ) : (
              (allIllustrations.length > 0 || selectedView === 'illustrations') ? (
                <div className="text-xs text-muted-foreground">899 assets</div>
              ) : null
            )}
          </button>
        </div>

        <div className="mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search doodles..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {selectedView === 'icons' ? (
          <div className="overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              <>
                <button
                  key="All"
                  onClick={() => { setSelectedCategory("All"); setSelectedView('icons') }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === "All" ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                  }`}
                >
                  All
                </button>

                <button
                  key="Candy Icons"
                  onClick={() => { setCandyOpen((s) => !s); setSelectedCategory("Candy Icons"); setSelectedView('icons') }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === "Candy Icons" ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                  }`}
                >
                  Candy Icons
                </button>

                {candyOpen && (
                  <div className="flex gap-2 whitespace-nowrap">
                    {candyCategories.map((cat: string) => (
                      <button
                        key={`candy-${cat}`}
                        onClick={() => { setSelectedCategory(cat); setSelectedView('icons') }}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors pl-3 ${
                          selectedCategory === cat ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                        }`}
                      >
                        {cat
                          .split("-")
                          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </button>
                    ))}
                  </div>
                )}

                {iconTopCategories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setSelectedView('icons') }}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                    }`}
                  >
                    {category
                      .split("-")
                      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                ))}
              </>
            </div>
          </div>
        ) : selectedView === 'illustrations' ? (
          <div className="overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              {["All", ...illustrationCategories].map((category: string) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setSelectedView('illustrations') }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                  }`}
                >
                  {category
                    .split("-")
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              <button
                key="All"
                onClick={() => { setSelectedCategory("All"); setSelectedView('doodles'); loadDoodleCategory('simple-doodles') }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === "All" ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                }`}
              >
                All
              </button>

              <button
                key="simple-doodles"
                onClick={() => { setSimpleOpen((s) => !s); setSelectedCategory('simple-doodles'); setSelectedView('doodles') }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === "simple-doodles" ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                }`}
              >
                Simple Doodles
              </button>

              {simpleOpen && (
                <>
                  {doodleSubcategories.map((cat: string) => (
                    <button
                      key={`doodle-${cat}`}
                      onClick={() => { setSelectedCategory(cat); setSelectedView('doodles') }}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors pl-3 ${
                        selectedCategory === cat ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                      }`}
                    >
                      {cat
                        .split("-")
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </button>
                  ))}
                </>
              )}

              {categories.filter((c) => c !== 'simple-doodles').map((category: string) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setSelectedView('doodles'); loadDoodleCategory(category) }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
                  }`}
                >
                  {category
                    .split("-")
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
