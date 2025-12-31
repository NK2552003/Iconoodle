"use client"

import * as React from "react"
import { Search } from "lucide-react"

export function DoodleDirectoryEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No assets found</h3>
      <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
      <button
        onClick={onClear}
        className="mt-4 text-primary font-medium hover:underline"
      >
        Clear all filters
      </button>
    </div>
  )
}
