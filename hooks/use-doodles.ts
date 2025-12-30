"use client"

import * as React from "react"
import { ICONS, GROUPED_ICONS, CANDY_ICONS, ILLUSTRATIONS, type Doodle, type GroupedIcon } from "@/lib/data"

export function useDoodles(): {
  doodles: Doodle[]
  allDoodles: Doodle[]
  categories: string[]
  doodleSubcategories: string[]
  styles: string[]
  icons: Doodle[]
  groupedIcons: GroupedIcon[]
  allIcons: Doodle[]
  iconCategories: string[]
  iconTopCategories: string[]
  candyIcons: Doodle[]
  candyCategories: string[]
  illustrations: Doodle[]
  allIllustrations: Doodle[]
  illustrationCategories: string[]
  loading: boolean
} {
  const [loading, setLoading] = React.useState(true)

  // We'll load DOODLES lazily (they contain full SVG strings & are large)
  const [allDoodles, setAllDoodles] = React.useState<Doodle[]>([])
  const [categories, setCategories] = React.useState<string[]>([])
  const [styles, setStyles] = React.useState<string[]>([])
  const [uniqueDoodles, setUniqueDoodles] = React.useState<Doodle[]>([])
  const [doodleSubcategories, setDoodleSubcategories] = React.useState<string[]>([])

  // Load DOODLES asynchronously to avoid bundling them into the initial client chunk
  React.useEffect(() => {
    let mounted = true
    const start = Date.now()

    const load = async () => {
      try {
        const mod = await import("@/lib/data")
        if (!mounted) return
        const DOODLES = (mod.DOODLES || []) as Doodle[]

        setAllDoodles(DOODLES)

        setCategories(Array.from(new Set(DOODLES.map((d) => d.category))).sort())
        setStyles(Array.from(new Set(DOODLES.map((d) => d.style))))

        const map = new Map<string, Doodle>()
        DOODLES.forEach((d) => {
          const key = `${d.id}-${d.subcategory ?? d.category}`
          if (!map.has(key) || d.style === "LINED") {
            map.set(key, d)
          }
        })
        setUniqueDoodles(Array.from(map.values()))

        setDoodleSubcategories(
          Array.from(new Set(DOODLES.filter((d) => d.category === "simple-doodles").map((d) => d.subcategory).filter((s): s is string => !!s))).sort(),
        )

        const elapsed = Date.now() - start
        const minWait = Math.max(0, 200 - elapsed)
        setTimeout(() => {
          if (mounted) setLoading(false)
        }, minWait)
      } catch (e) {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  // Create a "representative" item per grouped icon so the grid shows only one card per id
  const icons = React.useMemo(() => {
    // Preferred style order when choosing representative
    const pref = ["BLACK", "ICON", "COLORED", "WHITE", "LINED"]
    return GROUPED_ICONS.map((g) => {
      let picked: any = null
      for (const p of pref) {
        if (g.variants && g.variants[p]) {
          picked = g.variants[p]
          break
        }
      }
      // fallback to first variant
      if (!picked) {
        const first = Object.values(g.variants || {})[0]
        picked = first
      }

      // skip groups with no variants
      if (!picked) return null

      // Use top-level group category when present (e.g. "Simple Icons") so the UI shows top categories, not variant categories
      return { id: g.id, category: g.category ?? picked.category ?? '', style: picked.style ?? '', src: picked.src ?? '', svg: picked.svg ?? '', viewBox: picked.viewBox ?? '' }
    }).filter((i): i is Doodle => !!i)
  }, [])

  const groupedIcons = React.useMemo(() => GROUPED_ICONS, [])
  const allIcons = React.useMemo(() => ICONS, [])
  // Candy icons (flat list) and their categories
  const candyIcons = React.useMemo(() => CANDY_ICONS, [])
  const candyCategories = React.useMemo(() => Array.from(new Set(candyIcons.map((c) => c.category))).sort(), [candyIcons])

  // Top-level icon categories (group-level), e.g. "Simple Icons"
  const iconTopCategories = React.useMemo(() => Array.from(new Set(groupedIcons.map((g) => g.category).filter((c): c is string => !!c))).sort(), [groupedIcons])
  // Keep variant-level categories available if needed
  const iconCategories = React.useMemo(() => Array.from(new Set(allIcons.map((i) => i.category))).sort(), [allIcons])

  // Illustrations
  const illustrations = React.useMemo(() => ILLUSTRATIONS, [])
  const illustrationCategories = React.useMemo(() => Array.from(new Set(illustrations.map((i) => i.category))).sort(), [illustrations])

  // (Loading handled by the async importer above)

  return {
    doodles: uniqueDoodles,
    allDoodles,
    categories,
    doodleSubcategories,
    styles,
    icons,
    groupedIcons,
    allIcons,
    iconCategories,
    iconTopCategories,
    candyIcons,
    candyCategories,
    illustrations,
    allIllustrations: illustrations,
    illustrationCategories,
    loading,
  }
}
