"use client"

import * as React from "react"
import { SCROLL_DEBOUNCE_MS, INTERSECTION_ROOT_MARGIN, INTERSECTION_THRESHOLD } from "@/lib/constants"

/**
 * Options for configuring infinite scroll behavior
 */
export interface UseInfiniteScrollOptions {
  /** Whether more items are available to load */
  hasMore: boolean
  /** Whether currently fetching more items */
  isFetching: boolean
  /** Whether the view is currently loading initial data */
  isLoading: boolean
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Intersection threshold for intersection observer */
  threshold?: number
  /** Debounce time for fetch operations in milliseconds */
  debounceMs?: number
}

/**
 * Custom hook for managing infinite scroll pagination with Intersection Observer.
 * Provides automatic loading of more items when user scrolls near the end of the list.
 * 
 * @param onLoadMore - Callback to load more items
 * @param options - Configuration options
 * @returns Sentinel ref to attach to the scroll trigger element
 */
export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: UseInfiniteScrollOptions
) {
  const {
    hasMore,
    isFetching,
    isLoading,
    rootMargin = INTERSECTION_ROOT_MARGIN,
    threshold = INTERSECTION_THRESHOLD,
    debounceMs = SCROLL_DEBOUNCE_MS,
  } = options

  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    // Don't observe if loading initial data
    if (isLoading) return

    const node = sentinelRef.current
    if (!node || !hasMore || isFetching) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetching) {
            // Clear any pending timeout
            if (timeoutRef.current) {
              window.clearTimeout(timeoutRef.current)
            }

            // Debounce the load operation
            timeoutRef.current = window.setTimeout(() => {
              onLoadMore()
            }, debounceMs)
          }
        })
      },
      { root: null, rootMargin, threshold }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [hasMore, isFetching, isLoading, onLoadMore, rootMargin, threshold, debounceMs])

  return sentinelRef
}
