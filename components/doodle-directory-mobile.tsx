"use client"

import * as React from "react"
import { Loader } from "lucide-react"
import type { Doodle } from "@/lib/data"
import type { MobileProps } from "@/lib/types"

export const DoodleDirectoryMobile = React.memo(function DoodleDirectoryMobile({
  searchQuery,
  setSearchQuery,
  selectedView,
  setSelectedView,
  selectedCategory,
  setSelectedCategory,
  loadingDoodles,
  loadingIcons,
  loadingIllustrations,
  loadingBiology,
  iconsTotal,
  allDoodles,
  allIllustrations,
  allBiology,
  candyOpen,
  setCandyOpen,
  simpleOpen,
  setSimpleOpen,
  candyCategories,
  doodleSubcategories,
  iconTopCategories,
  illustrationCategories,
  biologyCategories,
  categories,
  loadDoodleCategory,
  loadBiologyCategory,
}: MobileProps) {
  // Helpers
  const formatCategory = React.useCallback((cat: string) => {
    return cat
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }, [])

  const btnClass = React.useCallback((active: boolean, extra = "") => {
    return `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
      active ? "bg-primary text-primary-foreground font-medium" : "bg-muted/10 text-foreground hover:bg-muted/20"
    } ${extra}`
  }, [])

  // Memoized formatted lists to avoid recomputation on each render
  const formattedIconTop = React.useMemo(() => iconTopCategories.map((c) => ({ key: c, label: formatCategory(c), raw: c })), [iconTopCategories, formatCategory])
  const formattedCandy = React.useMemo(() => candyCategories.map((c) => ({ key: c, label: formatCategory(c), raw: c })), [candyCategories, formatCategory])
  const formattedIllustrations = React.useMemo(() => ["All", ...illustrationCategories].map((c) => ({ key: c, label: formatCategory(c), raw: c })), [illustrationCategories, formatCategory])
  const formattedBiology = React.useMemo(() => biologyCategories.map((c) => ({ key: c, label: formatCategory(c), raw: c })), [biologyCategories, formatCategory])
  const formattedDoodles = React.useMemo(() => doodleSubcategories.map((c) => ({ key: c, label: formatCategory(c), raw: c })), [doodleSubcategories, formatCategory])
  const formattedCategories = React.useMemo(() => categories.filter((c) => c !== 'simple-doodles').map((c) => ({ key: c, label: formatCategory(c), raw: c })), [categories, formatCategory])

  // Stable handlers
  const select = React.useCallback((category: string, view: 'doodles' | 'icons' | 'illustrations' | 'biology', opts?: { load?: boolean; loadFn?: (c: string) => void }) => {
    setSelectedCategory(category)
    setSelectedView(view)
    if (opts?.load && opts.loadFn) opts.loadFn(category)
  }, [setSelectedCategory, setSelectedView])

  const toggleCandy = React.useCallback(() => {
    setCandyOpen((s) => !s)
    setSelectedCategory("Candy Icons")
    setSelectedView('icons')
  }, [setCandyOpen, setSelectedCategory, setSelectedView])

  const toggleSimple = React.useCallback(() => {
    setSimpleOpen((s) => !s)
    setSelectedCategory('simple-doodles')
    setSelectedView('doodles')
  }, [setSimpleOpen, setSelectedCategory, setSelectedView])

  return (
    <div className="md:hidden sticky top-16 z-30 bg-background/95 backdrop-blur border-b">
      <div className="px-4 py-2">
        <div className="overflow-x-auto mb-2">
          <div className="flex gap-2 whitespace-nowrap">
            <button
              onClick={() => select("All", 'doodles', { load: false })}
              className={btnClass(selectedView === 'doodles')}
            >
              <div className="font-medium">Doodles</div>
              {loadingDoodles ? (
                <div className="text-xs flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /></div>
              ) : (
                <div className="text-xs">3951</div>
              )}
            </button>

            <button
              onClick={() => select("All", 'icons')}
              className={btnClass(selectedView === 'icons')}
            >
              <div className="font-medium">Icons</div>
              {loadingIcons ? (
                <div className="text-xs flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /></div>
              ) : (
                (iconsTotal > 0 || selectedView === 'icons') ? (
                  <div className="text-xs">5487</div>
                ) : null
              )}
            </button>

            <button
              onClick={() => select("All", 'illustrations')}
              className={btnClass(selectedView === 'illustrations')}
            >
              <div className="font-medium">Illustrations</div>
              {loadingIllustrations ? (
                <div className="text-xs flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /></div>
              ) : (
                (allIllustrations.length > 0 || selectedView === 'illustrations') ? (
                  <div className="text-xs">899</div>
                ) : null
              )}
            </button>

            <button
              onClick={() => select("All", 'biology')}
              className={btnClass(selectedView === 'biology')}
            >
              <div className="font-medium">Biology</div>
              {loadingBiology ? (
                <div className="text-xs flex items-center gap-1"><Loader className="w-3 h-3 animate-spin" /></div>
              ) : (
                (allBiology.length > 0 || selectedView === 'biology') ? (
                  <div className="text-xs">{allBiology.length}</div>
                ) : null
              )}
            </button>
          </div>
        </div>

        {selectedView === 'icons' ? (
          <div className="overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              <>
                <button
                  key="All"
                  onClick={() => select("All", 'icons')}
                  className={btnClass(selectedCategory === "All")}
                >
                  All
                </button>

                <button
                  key="Candy Icons"
                  onClick={toggleCandy}
                  className={btnClass(selectedCategory === "Candy Icons")}
                >
                  Candy Icons
                </button>

                {candyOpen && (
                  <div className="flex gap-2 whitespace-nowrap">
                    {formattedCandy.map((cat) => (
                      <button
                        key={`candy-${cat.key}`}
                        onClick={() => select(cat.raw, 'icons')}
                        className={btnClass(selectedCategory === cat.raw, 'pl-3')}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}

                {formattedIconTop.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => select(category.raw, 'icons')}
                    className={btnClass(selectedCategory === category.raw)}
                  >
                    {category.label}
                  </button>
                ))}
              </>
            </div>
          </div>
        ) : selectedView === 'illustrations' ? (
          <div className="overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              {formattedIllustrations.map((category) => (
                <button
                  key={category.key}
                  onClick={() => select(category.raw, 'illustrations')}
                  className={btnClass(selectedCategory === category.raw)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        ) : selectedView === 'biology' ? (
          <div className="overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              <button
                key="All"
                onClick={() => select("All", 'biology')}
                className={btnClass(selectedCategory === "All")}
              >
                All
              </button>

              {formattedBiology.map((category) => (
                <button
                  key={category.key}
                  onClick={() => select(category.raw, 'biology', { load: true, loadFn: loadBiologyCategory })}
                  className={btnClass(selectedCategory === category.raw)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap">
              <button
                key="All"
                onClick={() => select("All", 'doodles', { load: true, loadFn: loadDoodleCategory })}
                className={btnClass(selectedCategory === "All")}
              >
                All
              </button>

              <button
                key="simple-doodles"
                onClick={toggleSimple}
                className={btnClass(selectedCategory === "simple-doodles")}
              >
                Simple Doodles
              </button>

              {simpleOpen && (
                <>
                  {formattedDoodles.map((cat) => (
                    <button
                      key={`doodle-${cat.key}`}
                      onClick={() => select(cat.raw, 'doodles')}
                      className={btnClass(selectedCategory === cat.raw, 'pl-3')}
                    >
                      {cat.label}
                    </button>
                  ))}
                </>
              )}

              {formattedCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => select(category.raw, 'doodles', { load: true, loadFn: loadDoodleCategory })}
                  className={btnClass(selectedCategory === category.raw)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
