"use client"

import * as React from "react"
import type { Doodle, GroupedIcon } from "@/lib/data"
import type { IconVariant } from "@/lib/data"

// Import icon sources statically so they are bundled into the production build
import iconsJson from '@/lib/icons.json'
import handdrawnIcons from '@/lib/handdrawn-icons.json'
import handdrawnType2Icons from '@/lib/handdrawn-type-2-icons.json'
import handmadeDoodledIcons from '@/lib/handmade-doodled-icons.json'
import publicCoolicons from '@/lib/public-coolicons.json'
import publicIconly from '@/lib/public-iconly.json'
import publicSmooothIcons from '@/lib/public-smoooth-icons.json'
import publicSocialMedia from '@/lib/public-social-media.json'
import publicSocialMedia2 from '@/lib/public-social-media-2.json'
import publicFluentIcons from '@/lib/public-fluent-icons.json'
import candyIconsJson from '@/lib/candy-icons.json'
import carsIcons from '@/lib/cars-icons.json'
import naturalStampingElements from '@/lib/natural-stamping-elements.json'

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
  // on-demand loaders
  loadDoodleCategory: (name: string) => Promise<void>
  loadNextDoodleCategory: () => Promise<void>
  hasMoreAll: boolean
  loadingDoodles: boolean
  loadIcons: () => Promise<void>
  loadingIcons: boolean
  loadIllustrations: () => Promise<void>
  loadingIllustrations: boolean
} {
  // UI should render immediately but avoid showing the empty state before data loads
  // Keep `loading` true until at least one doodle category has been loaded to prevent
  // an initial flash of the "No assets found" empty state.
  const [loading, setLoading] = React.useState(true)

  // We'll load DOODLES on demand (they contain full SVG strings & are large)
  const [categories, setCategories] = React.useState<string[]>([])
  const [styles, setStyles] = React.useState<string[]>([])
  const [uniqueDoodles, setUniqueDoodles] = React.useState<Doodle[]>([])
  const [doodleSubcategories, setDoodleSubcategories] = React.useState<string[]>([])

  // Doodle loading control (per-category concurrent loads)
  // Track whether ANY doodle category loads are in progress via a Set of category names
  const [loadedDoodles, setLoadedDoodles] = React.useState(false)
  const [loadedDoodleMap, setLoadedDoodleMap] = React.useState<Map<string, Doodle[]>>(new Map())
  const [loadedDoodleOrder, setLoadedDoodleOrder] = React.useState<string[]>([])
  const [loadingDoodleCategories, setLoadingDoodleCategories] = React.useState<Set<string>>(new Set())
  const loadingDoodles = loadingDoodleCategories.size > 0
  const FILES: Array<{ name: string; path: string; normalizeToSimple?: boolean }> = [
    { name: 'simple-doodles', path: 'doodles.json', normalizeToSimple: true },
    { name: 'doodles-ai-icon-doodles', path: 'doodles-ai-icon-doodles.json' },
    { name: 'doodles-animal-doodles', path: 'doodles-animal-doodles.json' },
    { name: 'doodles-animals-doodle', path: 'doodles-animals-doodle.json' },
    { name: 'doodles-crispy-doodles', path: 'doodles-crispy-doodles.json' },
    { name: 'doodles-cute-animals', path: 'doodles-cute-animals.json' },
    { name: 'doodles-educational-doodles', path: 'doodles-educational-doodles.json' },
    { name: 'doodles-fast-food-doodle-art', path: 'doodles-fast-food-doodle-art.json' },
    { name: 'doodles-fruits-vegetables', path: 'doodles-fruits-vegetables-doodle.json' },
    { name: 'doodles-hand-drawn-doodle', path: 'doodles-hand-drawn-doodle.json' },
    { name: 'doodles-hand-drawn-doodles-scribbles', path: 'doodles-hand-drawn-doodles-scribbles.json' },
    { name: 'doodles-hand-drawn-lifestyle', path: 'doodles-hand-drawn-lifestyle-doodle.json' },
    { name: 'doodles-internet-network', path: 'doodles-internet-network-doodles.json' },
    { name: 'doodles-pot-plants', path: 'doodles-pot-plants-doodle-illustrations.json' },
    { name: 'doodles-the-doodle-library', path: 'doodles-the-doodle-library.json' },
    { name: 'doodles-3', path: 'doodles-3.json' },
    { name: 'nature-doodles', path: 'nature-doodles.json' },
    { name: '3d-like-shape-doodles', path: '3d-like-shape-doodles.json' },
    { name: 'wireframe-doodles', path: 'wireframe-doodles.json' },
    { name: 'brutalist-doodles', path: 'brutalist-doodles.json' },
  ]
  const DOODLE_CATEGORIES = FILES.map((f) => f.name)

  // Load a single doodle category on demand
  const loadDoodleCategory = React.useCallback(async (name: string) => {
    if (loadedDoodleMap.has(name) || loadingDoodleCategories.has(name)) return
    // mark this category as loading (allow other categories to load concurrently)
    setLoadingDoodleCategories((prev) => new Set(prev).add(name))
    try {
      const entry = FILES.find((f) => f.name === name)
      if (!entry) return

      const mod = await import(/* @vite-ignore */ `@/lib/${entry.path}`)
      const arr = (mod?.default || mod) as any[]
      if (!Array.isArray(arr)) return

      let items: Doodle[]
      if (entry.normalizeToSimple) {
        items = arr.map((d) => ({ ...(d || {}), subcategory: d?.category, category: 'simple-doodles' })) as Doodle[]
      } else {
        // force top-level category to the file name so filtering by sidebar category works reliably
        // If the file is a grouped-icon style (has `variants`), flatten variants into Doodle[] entries
        if (arr.length && (arr[0] as any).variants) {
          items = arr.flatMap((g: any) => Object.entries(g.variants || {}).map(([style, v]: any) => ({
            id: g.id,
            category: entry.name,
            style: v.style ?? style,
            src: v.src ?? '',
            svg: v.svg ?? '',
            viewBox: v.viewBox ?? '',
          }))) as Doodle[]
        } else {
          items = arr.map((d) => ({ ...(d || {}), category: entry.name })) as Doodle[]
        }
      }

      setLoadedDoodleMap((prev) => new Map(prev).set(name, items))
      setLoadedDoodleOrder((prev) => (prev.includes(name) ? prev : [...prev, name]))
      setLoadedDoodles(true)
      // First successful category load means we have assets — clear the initial loading flag
      setLoading(false)
    } finally {
      // unmark loading for this category
      setLoadingDoodleCategories((prev) => {
        const n = new Set(prev)
        n.delete(name)
        return n
      })
      // clear initial loading flag if still set to avoid permanent placeholders on error
      setLoading(false)
    }
  }, [loadedDoodleMap, loadingDoodleCategories])

  const loadNextDoodleCategory = React.useCallback(async () => {
    const next = FILES.map((f) => f.name).find((c) => !loadedDoodleOrder.includes(c))
    if (!next) return
    await loadDoodleCategory(next)
  }, [loadedDoodleOrder, loadDoodleCategory])

  const hasMoreAll = loadedDoodleOrder.length < FILES.length

  // Initialize UI quickly: populate categories so sidebar renders instantly
  React.useEffect(() => {
    setCategories(DOODLE_CATEGORIES.slice())
    // Keep `loading` true until the first doodle category is actually loaded
  }, [])

  // All doodles are the concatenation of loaded categories in the chosen order
  const allDoodles = React.useMemo(() => loadedDoodleOrder.flatMap((n) => loadedDoodleMap.get(n) || []), [loadedDoodleOrder, loadedDoodleMap])

  // Recompute derived doodle info when any doodle category loads
  React.useEffect(() => {
    setStyles(Array.from(new Set(allDoodles.map((d) => d.style))))
    const map = new Map<string, Doodle>()
    allDoodles.forEach((d) => {
      const key = `${d.id}-${d.subcategory ?? d.category}`
      if (!map.has(key) || d.style === "LINED") map.set(key, d)
    })
    setUniqueDoodles(Array.from(map.values()))

    const simple = loadedDoodleMap.get('simple-doodles') || []
    setDoodleSubcategories(Array.from(new Set(simple.map((d) => d.subcategory).filter((s): s is string => !!s))).sort())
  }, [allDoodles, loadedDoodleMap])

  // Icons & Illustrations (loaded on-demand)
  const [groupedIcons, setGroupedIcons] = React.useState<GroupedIcon[]>([])
  const [allIcons, setAllIcons] = React.useState<Doodle[]>([])
  const [candyIcons, setCandyIcons] = React.useState<Doodle[]>([])
  const [loadingIcons, setLoadingIcons] = React.useState(false)
  const [loadedIconSources, setLoadedIconSources] = React.useState<string[]>([])

  const [illustrations, setIllustrations] = React.useState<Doodle[]>([])
  const [loadingIllustrations, setLoadingIllustrations] = React.useState(false)
  const [loadedIllustrations, setLoadedIllustrations] = React.useState(false)

  // Helper: merge grouped icon sources (preserve existing variant merging behavior)
  const mergeGroupedSources = (sources: Array<{ items: GroupedIcon[]; source: string }>) => {
    const merged = new Map<string, GroupedIcon>()
    for (const { items, source } of sources) {
      if (!items) continue
      for (const g of items) {
        if (!g || !g.id) continue
        const existing = merged.get(g.id)
        if (!existing) {
          merged.set(g.id, { id: g.id, category: g.category, variants: { ...g.variants } })
          continue
        }

        if (!existing.category && g.category) existing.category = g.category

        for (const [k, v] of Object.entries(g.variants || {})) {
          if (!existing.variants[k]) {
            existing.variants[k] = v as IconVariant
          } else {
            let newKey = `${k}_${source.replace(/[^a-z0-9]/gi, '_')}`
            let i = 1
            while (existing.variants[newKey]) {
              newKey = `${k}_${source.replace(/[^a-z0-9]/gi, '_')}_${i++}`
            }
            existing.variants[newKey] = v as IconVariant
          }
        }
      }
    }
    return Array.from(merged.values())
  }

  // Create a "representative" item per grouped icon so the grid shows only one card per id
  const icons = React.useMemo(() => {
    const pref = ["BLACK", "ICON", "COLORED", "WHITE", "LINED"]
    return groupedIcons.map((g) => {
      let picked: any = null
      for (const p of pref) {
        if (g.variants && g.variants[p]) {
          picked = g.variants[p]
          break
        }
      }
      if (!picked) {
        const first = Object.values(g.variants || {})[0]
        picked = first
      }
      if (!picked) return null
      return { id: g.id, category: g.category ?? picked.category ?? '', style: picked.style ?? '', src: picked.src ?? '', svg: picked.svg ?? '', viewBox: picked.viewBox ?? '' }
    }).filter((i): i is Doodle => !!i)
  }, [groupedIcons])

  // Candy icons (flat list) and their categories
  const candyCategories = React.useMemo(() => Array.from(new Set(candyIcons.map((c) => c.category))).sort(), [candyIcons])

  // Top-level icon categories (group-level), e.g. "Simple Icons"
  const iconTopCategories = React.useMemo(() => Array.from(new Set(groupedIcons.map((g) => g.category).filter((c): c is string => !!c))).sort(), [groupedIcons])
  // Keep variant-level categories available if needed
  const iconCategories = React.useMemo(() => Array.from(new Set(allIcons.map((i) => i.category))).sort(), [allIcons])

  const illustrationCategories = React.useMemo(() => Array.from(new Set(illustrations.map((i) => i.category))).sort(), [illustrations])

  // Load all icon sources + candy icons (on-demand)
  const loadIcons = React.useCallback(async () => {
    if (loadingIcons || groupedIcons.length > 0 || allIcons.length > 0) return
    setLoadingIcons(true)
    try {
      const sources: Array<{ items: GroupedIcon[]; source: string }> = []

      // The static imports above guarantee these are available at build time in most bundlers.
      // Wrap each in a try/catch to be defensive in case one file isn't present in the bundle.
      try { sources.push({ items: (iconsJson as any) as GroupedIcon[], source: 'icons' }) } catch (e) { console.error('[useDoodles] icons.json missing', e) }
      try { sources.push({ items: (handdrawnIcons as any) as GroupedIcon[], source: 'handdrawn-icons' }) } catch (e) { console.error('[useDoodles] handdrawn-icons.json missing', e) }
      try { sources.push({ items: (handdrawnType2Icons as any) as GroupedIcon[], source: 'handdrawn-type-2-icons' }) } catch (e) { console.error('[useDoodles] handdrawn-type-2-icons.json missing', e) }
      try { sources.push({ items: (handmadeDoodledIcons as any) as GroupedIcon[], source: 'handmade-doodled-icons' }) } catch (e) { console.error('[useDoodles] handmade-doodled-icons.json missing', e) }
      try { sources.push({ items: (publicCoolicons as any) as GroupedIcon[], source: 'public-coolicons' }) } catch (e) { console.error('[useDoodles] public-coolicons.json missing', e) }
      try { sources.push({ items: (publicIconly as any) as GroupedIcon[], source: 'public-iconly' }) } catch (e) { console.error('[useDoodles] public-iconly.json missing', e) }
      try { sources.push({ items: (publicSmooothIcons as any) as GroupedIcon[], source: 'public-smoooth-icons' }) } catch (e) { console.error('[useDoodles] public-smoooth-icons.json missing', e) }
      try { sources.push({ items: (publicSocialMedia as any) as GroupedIcon[], source: 'public-social-media' }) } catch (e) { console.error('[useDoodles] public-social-media.json missing', e) }
      try { sources.push({ items: (publicSocialMedia2 as any) as GroupedIcon[], source: 'public-social-media-2' }) } catch (e) { console.error('[useDoodles] public-social-media-2.json missing', e) }
      try { sources.push({ items: (publicFluentIcons as any) as GroupedIcon[], source: 'public-fluent-icons' }) } catch (e) { console.error('[useDoodles] public-fluent-icons.json missing', e) }
      try { sources.push({ items: (carsIcons as any) as GroupedIcon[], source: 'cars-icons' }) } catch (e) { console.error('[useDoodles] cars-icons.json missing', e) }
      try { sources.push({ items: (naturalStampingElements as any) as GroupedIcon[], source: 'natural-stamping-elements' }) } catch (e) { console.error('[useDoodles] natural-stamping-elements.json missing', e) }

      if (sources.length === 0) {
        // nothing available — set empty arrays so UI shows 'No assets found' but avoid runtime crash
        // eslint-disable-next-line no-console
        console.error('[useDoodles] No icon sources available (static imports failed)')
        setGroupedIcons([])
        setAllIcons([])
        setCandyIcons([])
        return
      }

      const merged = mergeGroupedSources(sources)
      setGroupedIcons(merged)
      setAllIcons(merged.flatMap((g) => Object.entries(g.variants).map(([style, v]) => ({ id: g.id, category: v.category, style, src: v.src, svg: v.svg, viewBox: v.viewBox }))))

      // candy icons from static import
      try {
        const candy = (candyIconsJson as any) as Doodle[]
        setCandyIcons(Array.isArray(candy) ? candy : [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[useDoodles] Failed to parse candy-icons.json', e)
        setCandyIcons([])
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[useDoodles] Unexpected error while loading icons', e)
    } finally {
      setLoadingIcons(false)
    }
  }, [loadingIcons, groupedIcons.length, allIcons.length])

  // Load illustrations on demand
  const loadIllustrations = React.useCallback(async () => {
    if (loadingIllustrations || loadedIllustrations) return
    setLoadingIllustrations(true)
    try {
      const mod = await import('@/lib/data')
      const arr = (mod?.ILLUSTRATIONS || []) as Doodle[]
      setIllustrations(Array.isArray(arr) ? arr : [])
      setLoadedIllustrations(true)
    } finally {
      setLoadingIllustrations(false)
    }
  }, [loadingIllustrations, loadedIllustrations])

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

    // on-demand loaders
    loadDoodleCategory,
    loadNextDoodleCategory,
    hasMoreAll,
    // expose a boolean indicating whether any doodle category is loading
    loadingDoodles,
    loadIcons,
    loadingIcons,
    loadIllustrations,
    loadingIllustrations,
  }
}
