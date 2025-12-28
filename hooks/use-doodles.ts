"use client"

import * as React from "react"
import { DOODLES, ICONS, GROUPED_ICONS, CANDY_ICONS, ILLUSTRATIONS, type Doodle, type GroupedIcon } from "@/lib/data"

export function useDoodles(): {
  doodles: Doodle[]
  allDoodles: Doodle[]
  categories: string[]
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

  const categories = React.useMemo(() => {
    return Array.from(new Set(DOODLES.map((d) => d.category))).sort()
  }, [])

  const styles = React.useMemo(() => {
    return Array.from(new Set(DOODLES.map((d) => d.style)))
  }, [])

  // To match user's request: Display doodles as "unique" items on main page
  // The style switching happens INSIDE the card/modal
  const uniqueDoodles = React.useMemo(() => {
    const map = new Map<string, Doodle>()
    DOODLES.forEach((d) => {
      const key = `${d.id}-${d.category}`
      if (!map.has(key) || d.style === "LINED") {
        map.set(key, d)
      }
    })
    return Array.from(map.values())
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
        const first = Object.values(g.variants)[0]
        picked = first
      }
      // Use top-level group category when present (e.g. "Simple Icons") so the UI shows top categories, not variant categories
      return { id: g.id, category: g.category ?? picked.category, style: picked.style, src: picked.src, svg: picked.svg, viewBox: picked.viewBox }
    })
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

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return {
    doodles: uniqueDoodles,
    allDoodles: DOODLES,
    categories,
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
