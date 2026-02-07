"use client"

import * as React from "react"
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants"

/**
 * Custom hook for debouncing a value.
 * Useful for optimizing search input and reducing unnecessary re-renders/computations.
 * 
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: SEARCH_DEBOUNCE_MS)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = SEARCH_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
