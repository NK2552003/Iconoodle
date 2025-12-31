"use client"

import * as React from "react"
import { DoodleModal } from "@/components/doodle-modal"
import { DoodleSidebar } from "@/components/doodle-sidebar"
import { DoodleDirectoryMobile } from "@/components/doodle-directory-mobile"
import { DoodleDirectoryHeader } from "@/components/doodle-directory-header"
import { DoodleDirectoryGrid } from "@/components/doodle-directory-grid"
import { DoodleDirectoryEmpty } from "@/components/doodle-directory-empty"
import { DoodleDirectoryTabs } from "@/components/doodle-directory-tabs"
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
    const matches = (item: any) => item.id.toLowerCase().includes(term) || (item.category || '').toLowerCase().includes(term)

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
        (ill.category || '').toLowerCase().includes(searchQuery.toLowerCase())
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
      // If the main area is scrollable (desktop), scroll its internal scroll to top;
      // otherwise fall back to scrolling the element into view (mobile / when not overflowable).
      try {
        // Use smooth scroll where supported
        (el as any).scrollTo ? (el as any).scrollTo({ top: 0, behavior: 'smooth' }) : el.scrollTop = 0
      } catch (e) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
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
    <div className="flex flex-col md:h-screen md:overflow-hidden">


      <DoodleDirectoryMobile
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        loadingDoodles={loadingDoodles}
        loadingIcons={loadingIcons}
        loadingIllustrations={loadingIllustrations}
        iconsTotal={iconsTotal}
        allDoodles={allDoodles}
        allIllustrations={allIllustrations}
        candyOpen={candyOpen}
        setCandyOpen={setCandyOpen}
        simpleOpen={simpleOpen}
        setSimpleOpen={setSimpleOpen}
        candyCategories={candyCategories}
        doodleSubcategories={doodleSubcategories}
        iconTopCategories={iconTopCategories}
        illustrationCategories={illustrationCategories}
        categories={categories}
        loadDoodleCategory={loadDoodleCategory}
      />

      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">


        {/* Sidebar Filters */}
        <DoodleSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          candyOpen={candyOpen}
          setCandyOpen={setCandyOpen}
          simpleOpen={simpleOpen}
          setSimpleOpen={setSimpleOpen}
          categories={categories}
          doodleSubcategories={doodleSubcategories}
          candyCategories={candyCategories}
          iconTopCategories={iconTopCategories}
          illustrationCategories={illustrationCategories}
          candyIcons={candyIcons}
          allDoodles={allDoodles}
          allIllustrations={allIllustrations}
          loadingIcons={loadingIcons}
          loadingIllustrations={loadingIllustrations}
          iconsTotal={iconsTotal}
          loadDoodleCategory={loadDoodleCategory}
        />
<div className="flex-1 flex flex-col md:overflow-hidden">
    <DoodleDirectoryTabs
      selectedView={selectedView}
      setSelectedView={setSelectedView}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      loadingDoodles={loadingDoodles}
      loadingIcons={loadingIcons}
      loadingIllustrations={loadingIllustrations}
      allDoodles={allDoodles}
      iconsTotal={iconsTotal}
      allIllustrations={allIllustrations}
    />
        <main ref={mainRef} className="flex-1 p-6 md:p-8 md:px-8 md:pt-4 scroll-mt-20 md:scroll-mt-16 flex flex-col md:overflow-auto">

          <DoodleDirectoryHeader
            selectedView={selectedView}
            selectedCategory={selectedCategory}
            loadingDoodles={loadingDoodles}
            loadingIcons={loadingIcons}
            loadingIllustrations={loadingIllustrations}
            visibleCount={visibleItems.length}
            totalCount={filteredItems.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <DoodleDirectoryGrid
            showLoadingPlaceholders={showLoadingPlaceholders}
            visibleItems={visibleItems}
            isFetchingMore={isFetchingMore}
            filteredLength={filteredItems.length}
            viewMode={viewMode}
            candyIcons={candyIcons}
            setSelectedDoodle={(d) => setSelectedDoodle(d)}
            allDoodlesParent={selectedView === 'icons' ? allIcons : selectedView === 'illustrations' ? allIllustrations : allDoodles}
            sentinelRef={sentinelRef}
          />

          {!showLoadingPlaceholders && filteredItems.length === 0 && (
            <DoodleDirectoryEmpty onClear={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedView('doodles') }} />
          )}
        </main>
</div>
      </div>

      {selectedDoodle && (
        <DoodleModal doodle={selectedDoodle} onClose={() => setSelectedDoodle(null)} allDoodles={selectedView === 'icons' ? allIcons : selectedView === 'illustrations' ? allIllustrations : allDoodles} />
      )}
    </div>
  )
}
