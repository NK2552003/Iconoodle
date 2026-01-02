"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { DoodleCard } from "@/components/doodle-card"
import type { Doodle } from "@/lib/data"
import type { GridProps } from "@/lib/types"

export function DoodleDirectoryGrid({ showLoadingPlaceholders, visibleItems, isFetchingMore, filteredLength, viewMode, candyIcons, setSelectedDoodle, allDoodlesParent, sentinelRef }: GridProps) {
  if (showLoadingPlaceholders) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div
        className={`grid ${
          viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" : "grid-cols-1"
        } gap-4`}
      >
        {visibleItems.map((item: any, index: number) => (
          <DoodleCard
            key={`${item.id}-${item.category}-${item.subcategory ?? ''}-${item.style || ''}-${item.src ?? index}`}
            doodle={item}
            isCandy={candyIcons.some((c: any) => c.id === item.id && c.category === item.category)}
            allDoodles={allDoodlesParent ?? []}
            viewMode={viewMode}
            onClick={() => { setSelectedDoodle(item) }}
          />
        ))}

        {isFetchingMore && (
          <>
            {[...Array(viewMode === "grid" ? 6 : 3)].map((_, i) => (
              viewMode === "grid" ? (
                <div key={`loading-${i}`} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ) : (
                <div key={`loading-${i}`} className="h-12 bg-muted animate-pulse rounded-md" />
              )
            ))}
          </>
        )}
      </div>

      {/* Sentinel / Loader */}
      <div ref={sentinelRef as any} aria-hidden className="w-full flex items-center justify-center py-6">
        {isFetchingMore ? (
          <div className="text-sm text-muted-foreground">Loading more...</div>
        ) : visibleItems.length < filteredLength ? (
          <div className="text-sm text-muted-foreground">Scroll to load more</div>
        ) : (
          <div className="text-sm text-muted-foreground">No more assets</div>
        )}
      </div>
    </>
  )
}
