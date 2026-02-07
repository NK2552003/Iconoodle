"use client"

import * as React from "react"
import type { Doodle } from "@/lib/data"

/**
 * Biology data files configuration
 */
const BIOLOGY_FILES: Array<{ name: string; path: string }> = [
  { name: 'human-muscular-system-muscles', path: 'Human/human-muscular-system-muscles.json' },
  { name: 'human-muscular-system-views', path: 'Human/human-muscular-system-views.json' },
  { name: 'human-muscular-system', path: 'Human/human-muscular-system.json' },
  { name: 'human-organs', path: 'Human/human-organs.json' },
  { name: 'human-skeletal-system', path: 'Human/human-skeletal-system.json' },
  { name: 'human-skin', path: 'Human/human-skin.json' },
]

/**
 * Custom hook for managing biology data loading and state.
 * Handles on-demand loading of biology categories with parallel loading support.
 * 
 * @returns Biology data, categories, loading state, and load functions
 */
export function useBiologyData() {
  const [biologyCategories] = React.useState<string[]>(
    BIOLOGY_FILES.map((f) => f.name)
  )
  const [loadedBiologyMap, setLoadedBiologyMap] = React.useState<Map<string, Doodle[]>>(new Map())
  const [loadedBiologyOrder, setLoadedBiologyOrder] = React.useState<string[]>([])
  const [loadingBiologyCategories, setLoadingBiologyCategories] = React.useState<Set<string>>(new Set())
  
  const loadingBiology = loadingBiologyCategories.size > 0
  const hasMoreBiology = loadedBiologyOrder.length < BIOLOGY_FILES.length

  /**
   * Process raw biology data and transform it into Doodle format.
   * Handles both variant-based and flat data structures.
   */
  const processBiologyData = React.useCallback((arr: any[], categoryName: string): Doodle[] => {
    if (!Array.isArray(arr) || arr.length === 0) return []

    // Check if data has variants structure
    if (arr[0] && (arr[0] as any).variants) {
      return arr.flatMap((g: any) => 
        Object.entries(g.variants || {}).map(([style, v]: any) => ({
          id: g.id,
          category: categoryName,
          style: v.style ?? style,
          src: v.src ?? '',
          svg: v.svg ?? '',
          viewBox: v.viewBox ?? '',
        }))
      ) as Doodle[]
    }

    // Flat data structure
    return arr.map((d) => ({ 
      ...(d || {}), 
      category: categoryName 
    })) as Doodle[]
  }, [])

  /**
   * Load a single biology category on demand with parallel loading support.
   * Uses dynamic imports to avoid bundling large JSON files.
   */
  const loadBiologyCategory = React.useCallback(async (name: string) => {
    if (loadedBiologyMap.has(name) || loadingBiologyCategories.has(name)) return
    
    setLoadingBiologyCategories((prev) => new Set(prev).add(name))
    
    try {
      const entry = BIOLOGY_FILES.find((f) => f.name === name)
      if (!entry) return

      const mod = await import(/* @vite-ignore */ `@/lib/${entry.path}`)
      const arr = (mod?.default || mod) as any[]
      
      const items = processBiologyData(arr, entry.name)
      
      setLoadedBiologyMap((prev) => new Map(prev).set(name, items))
      setLoadedBiologyOrder((prev) => 
        prev.includes(name) ? prev : [...prev, name]
      )
    } catch (error) {
      console.error(`[useBiologyData] Failed to load ${name}:`, error)
    } finally {
      setLoadingBiologyCategories((prev) => {
        const n = new Set(prev)
        n.delete(name)
        return n
      })
    }
  }, [loadedBiologyMap, loadingBiologyCategories, processBiologyData])

  /**
   * Load multiple biology categories in parallel for improved performance.
   */
  const loadBiologyCategories = React.useCallback(async (names: string[]) => {
    await Promise.all(names.map(name => loadBiologyCategory(name)))
  }, [loadBiologyCategory])

  /**
   * Load the next unloaded biology category.
   */
  const loadNextBiologyCategory = React.useCallback(async () => {
    const next = BIOLOGY_FILES.map((f) => f.name).find(
      (c) => !loadedBiologyOrder.includes(c)
    )
    if (!next) return
    await loadBiologyCategory(next)
  }, [loadedBiologyOrder, loadBiologyCategory])

  /**
   * Load all remaining biology categories in parallel.
   */
  const loadAllBiologyCategories = React.useCallback(async () => {
    const remaining = BIOLOGY_FILES.map((f) => f.name).filter(
      (c) => !loadedBiologyOrder.includes(c)
    )
    await loadBiologyCategories(remaining)
  }, [loadedBiologyOrder, loadBiologyCategories])

  // Aggregate all loaded biology data
  const allBiology = React.useMemo(
    () => loadedBiologyOrder.flatMap((n) => loadedBiologyMap.get(n) || []),
    [loadedBiologyOrder, loadedBiologyMap]
  )

  return {
    biology: allBiology,
    allBiology,
    biologyCategories,
    loadingBiology,
    hasMoreBiology,
    loadBiologyCategory,
    loadBiologyCategories,
    loadNextBiologyCategory,
    loadAllBiologyCategories,
  }
}
