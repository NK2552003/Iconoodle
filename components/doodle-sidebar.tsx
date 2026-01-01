import * as React from "react"
import Link from "next/link"
import { Search, Loader, Star, Github, Share2 } from "lucide-react"
import { useState } from "react"

type Props = {
  searchQuery: string
  setSearchQuery: (s: string) => void
  selectedView: 'doodles' | 'icons' | 'illustrations'
  setSelectedView: (v: 'doodles' | 'icons' | 'illustrations') => void
  selectedCategory: string
  setSelectedCategory: (s: string) => void
  candyOpen: boolean
  setCandyOpen: React.Dispatch<React.SetStateAction<boolean>>
  simpleOpen: boolean
  setSimpleOpen: React.Dispatch<React.SetStateAction<boolean>>
  categories: string[]
  doodleSubcategories: string[]
  candyCategories: string[]
  iconTopCategories: string[]
  illustrationCategories: string[]
  candyIcons: any[]
  allDoodles: any[]
  allIllustrations: any[]
  loadingIcons: boolean
  loadingIllustrations: boolean
  iconsTotal: number
  loadDoodleCategory: (name: string) => void
}
const REPO = 'https://github.com/nk2552003/Iconoodle'
const SITE_URL = 'https://nk2552003.github.io/Iconoodle/'

export function DoodleSidebar({
  searchQuery,
  setSearchQuery,
  selectedView,
  setSelectedView,
  selectedCategory,
  setSelectedCategory,
  candyOpen,
  setCandyOpen,
  simpleOpen,
  setSimpleOpen,
  categories,
  doodleSubcategories,
  candyCategories,
  iconTopCategories,
  illustrationCategories,
  candyIcons,
  allDoodles,
  allIllustrations,
  loadingIcons,
  loadingIllustrations,
  iconsTotal,
  loadDoodleCategory,
}: Props) {
      const [feedback, setFeedback] = useState<string | null>(null)
    
      async function handleShare() {
        try {
          if (navigator.share) {
            await navigator.share({ title: 'Iconoodle', text: 'Iconoodle — Doodles & icons', url: SITE_URL })
            setFeedback('Shared!')
          } else {
            await navigator.clipboard.writeText(SITE_URL)
            setFeedback('Link copied!')
          }
        } catch (err) {
          setFeedback('Could not share')
        }
    
        window.setTimeout(() => setFeedback(null), 2000)
      }
    

  return (
    <aside className="hidden md:block w-full md:w-64 pl-4 py-4 shrink-0 md:sticky md:top-0 md:h-[calc(100vh)]">
      <div className="bg-background/90 backdrop-blur border border-border rounded-xl px-4 pt-4 flex flex-col space-y-3 h-full overflow-hidden">
          <Link href="/" className="flex flex-col items-center gap-1 mx-auto no-underline">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-lg text-accent-foreground">
              {/* Simple inline logo */}
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 13c1.333-1 2-3 4-3 1.5 0 2.5 1 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 8h2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-xl font-extrabold text-foreground text-center">Iconoodle</span>
          </Link>

          <div className="flex items-center gap-1 justify-center pb-3">
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
            aria-label="Open Iconoodle GitHub repository"
          >
            <Star className="w-4 h-4" />
          </a>

          <a
            href={`${REPO}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
            aria-label="How to contribute to Iconoodle"
          >
            <Github className="w-4 h-4" />
          </a>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 p-2 rounded-md text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
            aria-label="Share Iconoodle site"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {feedback ? (
            <span className="ml-2 text-sm text-muted-foreground">{feedback}</span>
          ) : null}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search doodles..."
            className="w-full h-10 pl-10 pr-4 rounded-md bg-muted/80 border border-transparent hover:border-border focus:border-primary outline-none placeholder:text-muted-foreground text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>


            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Categories</h3>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4">
        {selectedView === 'icons' ? (
          <section>
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
                  <span className="text-xs text-muted-foreground">{allDoodles.length}</span>
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
      </div>
    </aside>
  )
}
