"use client"

import * as React from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { SIZE_OPTIONS } from "@/lib/constants"
import type { DoodleModalTabsProps } from "@/lib/types"

export function DoodleModalTabs({ activeTab, onTabChange, size, onSizeChange }: DoodleModalTabsProps) {
  return (
    <div className="p-6 border-b flex items-center justify-between bg-background">
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => onTabChange("preview")}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeTab === "preview" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => onTabChange("code")}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeTab === "code" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Code
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="text-xs bg-muted border-none rounded-md px-2 py-1 focus:ring-1 focus:ring-primary"
          value={size}
          onChange={(e) => onSizeChange(e.target.value)}
        >
          {SIZE_OPTIONS.map((sizeOption) => (
            <option key={sizeOption} value={sizeOption}>
              {sizeOption === "100%" ? "Original" : sizeOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function DoodleModalFooter() {
  return (
    <div className="hidden md:flex mt-auto pt-6 border-t items-center justify-between text-muted-foreground">
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <Monitor className="w-4 h-4" aria-hidden={true} />
          <span className="sr-only">Desktop Ready</span>
        </div>
        <div className="flex items-center gap-1">
          <Tablet className="w-4 h-4" aria-hidden={true} />
          <span className="sr-only">Tablet Ready</span>
        </div>
        <div className="flex items-center gap-1">
          <Smartphone className="w-4 h-4" aria-hidden={true} />
          <span className="sr-only">Mobile Ready</span>
        </div>
      </div>
    </div>
  )
}
