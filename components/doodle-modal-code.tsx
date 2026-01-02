"use client"

import * as React from "react"
import { CustomDropdown } from "./custom-dropdown"
import type { DoodleModalCodeProps } from "@/lib/types"

export function DoodleModalCode({
  formattedCode,
  codeFormat,
  onFormatChange,
  formats,
  isMobile,
  isSmallDevice,
}: DoodleModalCodeProps) {
  return (
    <div className={`w-full h-full bg-muted/50 rounded-xl p-4 flex flex-col overflow-hidden ${isSmallDevice ? "mt-36" : ""}`}>
      <div className="mb-3 flex items-center gap-2 flex-end justify-end shrink-0">
        <div className="flex items-center gap-2 border bg-background rounded-xl px-3 py-1">
          <span className="text-sm text-muted-foreground">Format:</span>
          <CustomDropdown
            options={formats}
            value={codeFormat}
            onChange={onFormatChange}
            triggerClassName="hover:bg-muted"
          />
        </div>
      </div>

      <div className={`flex-1 min-h-0 ${isMobile ? "overflow-y-auto overflow-x-auto" : "overflow-y-auto"}`}>
        <pre
          className={`text-[10px] sm:text-xs font-mono text-muted-foreground ${
            isMobile ? "whitespace-pre" : "whitespace-pre-wrap break-all max-w-full"
          }`}
        >
          {formattedCode}
        </pre>
      </div>
    </div>
  )
}
