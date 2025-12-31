"use client"

import * as React from "react"
import { Search, Grid, List, Loader } from "lucide-react"
import { DoodleCard } from "@/components/doodle-card"
import { DoodleModal } from "@/components/doodle-modal"
import { useDoodles } from "@/hooks/use-doodles"
import type { Doodle } from "@/lib/data"

export function DoodleDirectory() {
  const { doodles, allDoodles, categories, doodleSubcategories, loading, icons, allIcons, groupedIcons, iconTopCategories, candyIcons, candyCategories, illustrations, allIllustrations, illustrationCategories, loadDoodleCategory, loadNextDoodleCategory, hasMoreAll, loadingDoodles, loadIcons, loadingIcons, loadIllustrations, loadingIllustrations } = useDoodles()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [candyOpen, setCandyOpen] = React.useState(false)
  const [simpleOpen, setSimpleOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [selectedDoodle, setSelectedDoodle] = React.useState<Doodle | null>(null)
  const [selectedView, setSelectedView] = React.useState<'doodles' | 'icons' | 'illustrations'>('doodles')
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  // Count all icon variants + candy icons
  const iconsTotal = React.useMemo(() => allIcons.length + candyIcons.length, [allIcons, candyIcons])

  const filteredDoodles = React.useMemo(() => {
    return doodles.filter((doodle: Doodle) => {
      const matchesSearch =
        doodle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doodle.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doodle.subcategory || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || doodle.category === selectedCategory || doodle.subcategory === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [doodles, searchQuery, selectedCategory])

  const filteredIcons = React.useMemo(() => {
    if (selectedView !== 'icons') return []
    const term = searchQuery.toLowerCase()
    const matches = (item: any) => item.id.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)

    // Candy Icons parent: show all candy icons (and support their subcategories)
    if (selectedCategory === 'Candy Icons') {
      return candyIcons.filter((c: any) => matches(c))
    }

    // When All is selected, show a representative list (one-per-group) + candy
    if (selectedCategory === 'All') {
      return [...icons, ...candyIcons].filter((i: any) => matches(i))
    }

    // If a top-level icon group is selected, show one representative per grouped icon (not all variants)
    if (iconTopCategories.includes(selectedCategory)) {
      const representatives = (icons as any).filter((i: any) => i.category === selectedCategory)
      // include any candy icons that have the same category name
      const candyMatches = candyIcons.filter((c: any) => c.category === selectedCategory)
      return [...representatives, ...candyMatches].filter((i: any) => matches(i))
    }

    // Otherwise treat selectedCategory as a variant-level category (e.g., 'black', 'color', or candy subcategory)
    const allIconItems = [...allIcons, ...candyIcons]
    return allIconItems.filter((icon: any) => matches(icon) && (selectedCategory === 'All' || icon.category === selectedCategory))
  }, [icons, candyIcons, searchQuery, selectedCategory, selectedView, groupedIcons, allIcons, iconTopCategories])

  const filteredIllustrations = React.useMemo(() => {
    return illustrations.filter((ill: Doodle) => {
      const matchesSearch =
        ill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ill.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || ill.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [illustrations, searchQuery, selectedCategory])

  // Pagination / Infinite Scroll
  const PAGE_SIZE = 20
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  const [isFetchingMore, setIsFetchingMore] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  const mainRef = React.useRef<HTMLElement | null>(null)

  // Reset when filters/search/view change
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery, selectedCategory, viewMode])

  // Scroll main grid into view when filters, view mode, or category toggles change
  React.useEffect(() => {
    const el = mainRef.current
    if (!el) return
    // slight delay to allow layout to update
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => window.clearTimeout(t)
  }, [selectedCategory, selectedView, viewMode, searchQuery, candyOpen])

  // When the user switches views, load the corresponding JSON on demand
  React.useEffect(() => {
    if (selectedView === 'doodles') {
      // If user selected a top-level doodle file category, load that file; otherwise load 'simple-doodles' (subcategories live inside it)
      let nameToLoad = 'simple-doodles'
      if (selectedCategory !== 'All') {
        if (categories.includes(selectedCategory)) {
          nameToLoad = selectedCategory
        } else {
          nameToLoad = 'simple-doodles'
        }
      }
      loadDoodleCategory(nameToLoad)
    }
    if (selectedView === 'icons') {
      loadIcons()
    }
    if (selectedView === 'illustrations') {
      loadIllustrations()
    }
  }, [selectedView, selectedCategory, loadDoodleCategory, loadIcons, loadIllustrations])

  // Combine doodles/icons/illustrations into a single view depending on selectedView
  const filteredItems = React.useMemo(() => {
    if (selectedView === 'icons') return filteredIcons
    if (selectedView === 'illustrations') return filteredIllustrations
    return filteredDoodles
  }, [selectedView, filteredDoodles, filteredIcons, filteredIllustrations])
  const visibleItems = React.useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount])

  // Only show the full-grid loading placeholders when the view is actively loading AND there are no items to show yet
  const viewLoading = (selectedView === 'doodles' && loadingDoodles) || (selectedView === 'icons' && loadingIcons) || (selectedView === 'illustrations' && loadingIllustrations) || loading
  const showLoadingPlaceholders = viewLoading && filteredItems.length === 0

  React.useEffect(() => {
    if (showLoadingPlaceholders) return
    const currentTotal = selectedView === 'icons' ? filteredIcons.length : selectedView === 'illustrations' ? filteredIllustrations.length : filteredDoodles.length
    if (currentTotal <= visibleCount) return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetchingMore) {
            setIsFetchingMore(true)
            // If in Doodles view, try loading the next doodle category (if any) to progressively fill "All"
            if (selectedView === 'doodles' && hasMoreAll) {
              loadNextDoodleCategory()
            }
            // emulate async fetch
            setTimeout(() => {
              setVisibleCount((v) => Math.min(v + PAGE_SIZE, currentTotal))
              setIsFetchingMore(false)
            }, 300)
          }
        })
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [showLoadingPlaceholders, filteredIcons.length, filteredDoodles.length, filteredIllustrations.length, visibleCount, isFetchingMore, selectedView])

  return (
    <div className="flex flex-col min-h-screen">


      {/* Mobile Category Bar */}
      <div className="md:hidden sticky top-16 z-30 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-2">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              onClick={() => { setSelectedCategory("All"); setSelectedView('doodles') }}
              className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-start ${
                selectedView === 'doodles' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
              }`}
            >
              <div className="font-medium">Doodles</div>
              {loadingDoodles ? (
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
              ) : (
                <div className="text-xs text-muted-foreground">{allDoodles.length} assets</div>
              )}
            </button>
            <button
              onClick={() => { setSelectedCategory("All"); setSelectedView('icons') }}
              className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-start ${
                selectedView === 'icons' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
              }`}
            >
              <div className="font-medium">Icons</div>
              {loadingIcons ? (
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
              ) : (
                (iconsTotal > 0 || selectedView === 'icons') ? (
                  <div className="text-xs text-muted-foreground">{iconsTotal} icons</div>
                ) : null
              )}
            </button>
            <button
              onClick={() => { setSelectedCategory("All"); setSelectedView('illustrations') }}
              className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-start ${
                selectedView === 'illustrations' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
              }`}
            >
              <div className="font-medium">Illustrations</div>
              {loadingIllustrations ? (
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
              ) : (
                (allIllustrations.length > 0 || selectedView === 'illustrations') ? (
                  <div className="text-xs text-muted-foreground">{allIllustrations.length} assets</div>
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

                {/* render any other top-level categories if present */}
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

      <div className="flex-1 flex flex-col md:flex-row">


        {/* Sidebar Filters */}
        <aside className="hidden md:block w-full md:w-64 p-6 border-r shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-auto">
          <div className="space-y-8">
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

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSelectedCategory("All"); setSelectedView('doodles') }}
                className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-start ${
                  selectedView === 'doodles' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
                }`}
              >
                <div className="font-medium">Doodles</div>
                <div className="text-xs text-muted-foreground">{allDoodles.length} assets</div>
              </button>
              <button
                onClick={() => { setSelectedCategory("All"); setSelectedView('icons') }}
                className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-start ${
                  selectedView === 'icons' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
                }`}
              >
                <div className="font-medium">Icons</div>
                {loadingIcons ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
                ) : (
                  (iconsTotal > 0 || selectedView === 'icons') ? (
                    <div className="text-xs text-muted-foreground">{iconsTotal} icons</div>
                  ) : null
                )}
              </button>
              <button
                onClick={() => { setSelectedCategory("All"); setSelectedView('illustrations') }}
                className={`col-span-2 w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex flex-col items-start ${
                  selectedView === 'illustrations' ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 hover:bg-muted/20"
                }`}
              >
                <div className="font-medium">Illustrations</div>
                {loadingIllustrations ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /> Loading</div>
                ) : (
                  (allIllustrations.length > 0 || selectedView === 'illustrations') ? (
                    <div className="text-xs text-muted-foreground">{allIllustrations.length} assets</div>
                  ) : null
                )}
              </button>
            </div>

            {selectedView === 'icons' ? (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
                <div className="space-y-1">
                  {/* All */}
                  <button
                    onClick={() => { setSelectedCategory("All"); setSelectedView('icons') }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === "All" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    All
                  </button>

                  {/* Candy Icons parent */}
                  <div>
                    <button
                      onClick={() => { setCandyOpen((s) => !s); setSelectedCategory("Candy Icons"); setSelectedView('icons') }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === "Candy Icons" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="font-medium">Candy Icons</span>
                      {(loadingIcons || candyIcons.length > 0 || selectedCategory === "Candy Icons" || selectedView === 'icons') && (
                        <span className="text-xs text-muted-foreground">{candyIcons.length} icons</span>
                      )}
                    </button>

                    {candyOpen && (
                      <div className="mt-1 space-y-1">
                        {candyCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setSelectedView('icons') }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors pl-6 ${
                              selectedCategory === cat ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
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
                  </div>

                  {/* existing top-level icon groups */}
                  <div className="mt-2 space-y-1">
                    {iconTopCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => { setSelectedCategory(category); setSelectedView('icons') }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-foreground"
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
              </section>
            ) : selectedView === 'illustrations' ? (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
                <div className="space-y-1">
                  {["All", ...illustrationCategories].map((category) => (
                    <button
                      key={category}
                      onClick={() => { setSelectedCategory(category); setSelectedView('illustrations') }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {category
                        .split("-")
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
                <div className="space-y-1">
                  {/* All */}
                  <button
                    onClick={() => { setSelectedCategory("All"); setSelectedView('doodles') }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === "All" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    All
                  </button>

                  {/* Simple Doodles parent */}
                  <div>
                    <button
                      onClick={() => { setSimpleOpen((s) => !s); setSelectedCategory("simple-doodles"); setSelectedView('doodles') }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                        selectedCategory === "simple-doodles" ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="font-medium">Simple Doodles</span>
                      <span className="text-xs text-muted-foreground">{allDoodles.length} assets</span>
                    </button>

                    {simpleOpen && (
                      <div className="mt-1 space-y-1">
                        {doodleSubcategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setSelectedView('doodles'); loadDoodleCategory('simple-doodles') }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors pl-6 ${
                              selectedCategory === cat ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
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
                  </div>

                  {/* other top-level categories if any */}
                  {categories.filter((c) => c !== 'simple-doodles').map((category) => (
                    <button
                      key={category}
                      onClick={() => { setSelectedCategory(category); setSelectedView('doodles'); loadDoodleCategory(category) }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {category
                        .split("-")
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main ref={mainRef} className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h2 className="text-3xl font-bold tracking-tight mb-2 truncate">
                {selectedView === 'icons' ? (selectedCategory === "All" ? "Icons" : selectedCategory) : selectedView === 'illustrations' ? (selectedCategory === "All" ? "Illustrations" : selectedCategory) : (selectedCategory === "All" ? "Discover All Doodles" : selectedCategory)}
                {(selectedView === 'icons' && loadingIcons) || (selectedView === 'illustrations' && loadingIllustrations) || (selectedView === 'doodles' && loadingDoodles) ? <Loader className="inline-block w-4 h-4 animate-spin ml-2 text-muted-foreground" /> : null}
              </h2>
              <p className="text-muted-foreground">
                Free, editable SVGs to spice up your designs. Showing {visibleItems.length} of {filteredItems.length} {selectedView === 'icons' ? "icons" : selectedView === 'illustrations' ? "illustrations" : "doodles"}.
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

          {showLoadingPlaceholders ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <div
                className={`grid ${
                  viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" : "grid-cols-1"
                } gap-4`}
              >
              {visibleItems.map((item: any, index: number) => (
                  <DoodleCard
                    key={`${item.id}-${item.category}-${item.subcategory ?? ''}-${item.style || ''}-${item.src ?? index}`}
                    doodle={item}
                    isCandy={candyIcons.some((c: any) => c.id === item.id && c.category === item.category)}
                    allDoodles={selectedView === 'icons' ? allIcons : selectedView === 'illustrations' ? allIllustrations : allDoodles} // Use icon variants when in Icons view
                    viewMode={viewMode}
                    onClick={() => { setSelectedDoodle(item) }}
                  />
                ))}

                {/* Inline small loading placeholders (rendered inside the main grid so they start right after the last card) */}
                {isFetchingMore && (
                  <>
                    {[...Array(viewMode === "grid" ? 6 : 3)].map((_, i) => (
                      viewMode === "grid" ? (
                        <div key={`loading-${i}`} className="aspect-square bg-muted animate-pulse rounded-xl" />
                      ) : (
                        <div key={`loading-${i}`} className="h-12 bg-muted animate-pulse rounded-md" />
                      )
                    ))}
                  </>
                )}
              </div>

              {/* Sentinel / Loader */}
              <div ref={sentinelRef as any} aria-hidden className="w-full flex items-center justify-center py-6">
                {isFetchingMore ? (
                  <div className="text-sm text-muted-foreground">Loading more...</div>
                ) : visibleItems.length < filteredItems.length ? (
                  <div className="text-sm text-muted-foreground">Scroll to load more</div>
                ) : (
                  <div className="text-sm text-muted-foreground">No more assets</div>
                )}
              </div>


            </>
          )}

          {!showLoadingPlaceholders && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No assets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedView('doodles')
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {selectedDoodle && (
        <DoodleModal doodle={selectedDoodle} onClose={() => setSelectedDoodle(null)} allDoodles={selectedView === 'icons' ? allIcons : selectedView === 'illustrations' ? allIllustrations : allDoodles} />
      )}
    </div>
  )
}
