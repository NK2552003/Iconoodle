"use client"

import * as React from "react"
import type { Doodle } from "@/lib/data"
import { useDebounce } from "./use-debounce"

/**
 * Options for filtering views
 */
export interface FilterOptions {
  searchQuery: string
  selectedCategory: string
  selectedView: 'doodles' | 'icons' | 'illustrations' | 'biology'
}

/**
 * Custom hook for filtering different view types (doodles, icons, illustrations, biology).
 * Provides optimized filtering with debounced search and memoization.
 * 
 * @param items - Array of items to filter
 * @param options - Filter configuration
 * @returns Filtered items array
 */
export function useFilteredView(items: Doodle[], options: FilterOptions): Doodle[] {
  const { searchQuery, selectedCategory, selectedView } = options
  
  // Debounce search query to reduce unnecessary filtering operations
  const debouncedSearchQuery = useDebounce(searchQuery)

  return React.useMemo(() => {
    const term = debouncedSearchQuery.toLowerCase()
    
    return items.filter((item) => {
      // Search filter
      const matchesSearch =
        item.id.toLowerCase().includes(term) ||
        (item.category || '').toLowerCase().includes(term) ||
        (item.subcategory || '').toLowerCase().includes(term)

      // Category filter
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory ||
        item.subcategory === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [items, debouncedSearchQuery, selectedCategory])
}

/**
 * Hook for filtering icons with special handling for grouped icons and candy icons.
 * 
 * @param icons - Representative icons (one per group)
 * @param allIcons - All icon variants
 * @param candyIcons - Candy icon collection
 * @param iconTopCategories - Top-level icon categories
 * @param options - Filter configuration
 * @returns Filtered icons array
 */
export function useFilteredIcons(
  icons: Doodle[],
  allIcons: Doodle[],
  candyIcons: Doodle[],
  iconTopCategories: string[],
  options: FilterOptions
): Doodle[] {
  const { searchQuery, selectedCategory, selectedView } = options
  const debouncedSearchQuery = useDebounce(searchQuery)

  return React.useMemo(() => {
    if (selectedView !== 'icons') return []
    
    const term = debouncedSearchQuery.toLowerCase()
    const matches = (item: Doodle) =>
      item.id.toLowerCase().includes(term) ||
      (item.category || '').toLowerCase().includes(term)

    // Candy Icons parent: show all candy icons
    if (selectedCategory === 'Candy Icons') {
      return candyIcons.filter(matches)
    }

    // All selected: show representatives + candy
    if (selectedCategory === 'All') {
      return [...icons, ...candyIcons].filter(matches)
    }

    // Top-level icon group selected
    if (iconTopCategories.includes(selectedCategory)) {
      const representatives = icons.filter(
        (i) => i.category === selectedCategory
      )
      const candyMatches = candyIcons.filter(
        (c) => c.category === selectedCategory
      )
      return [...representatives, ...candyMatches].filter(matches)
    }

    // Variant-level category or candy subcategory
    const allIconItems = [...allIcons, ...candyIcons]
    return allIconItems.filter(
      (icon) => matches(icon) && (selectedCategory === 'All' || icon.category === selectedCategory)
    )
  }, [
    icons,
    allIcons,
    candyIcons,
    iconTopCategories,
    debouncedSearchQuery,
    selectedCategory,
    selectedView,
  ])
}
