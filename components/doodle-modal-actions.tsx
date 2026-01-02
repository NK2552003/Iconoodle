"use client"

import * as React from "react"
import { Copy, Download, Check } from "lucide-react"
import { CustomDropdown } from "./custom-dropdown"
import type { ExportFormat } from "@/lib/svg-utils"
import type { DoodleModalActionsProps } from "@/lib/types"

export function DoodleModalActions({
  copied,
  copyFormat,
  downloadFormat,
  activeTab,
  codeFormat,
  formats,
  onCopy,
  onDownload,
  onCopyFormatChange,
  onDownloadFormatChange,
}: DoodleModalActionsProps) {
  const getActiveFormat = (type: "copy" | "download") => {
    return activeTab === "code" ? codeFormat : type === "copy" ? copyFormat : downloadFormat
  }

  const getFormatLabel = (format: ExportFormat) => {
    if (format === "SVG") return "SVG"
    if (format === "REACT_NATIVE") return "RN"
    return format
  }

  return (
    <div className="space-y-4">
      {/* Copy Button */}
      <div className="flex w-full group overflow-hidden rounded-xl border-2">
        <button
          onClick={() => onCopy(getActiveFormat("copy"))}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy {getFormatLabel(getActiveFormat("copy"))}
            </>
          )}
        </button>
        <CustomDropdown
          options={formats}
          value={copyFormat}
          onChange={(val) => {
            onCopyFormatChange(val)
            onCopy(val)
          }}
          triggerClassName="bg-primary text-primary-foreground border-primary-foreground/20 hover:bg-primary/90"
        />
      </div>

      {/* Download Button */}
      <div className="flex w-full group overflow-hidden rounded-xl border-2">
        <button
          onClick={() => onDownload(getActiveFormat("download"))}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold hover:bg-muted transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          Download {getFormatLabel(getActiveFormat("download")) === "SVG" ? ".SVG" : getFormatLabel(getActiveFormat("download"))}
        </button>
        <CustomDropdown
          options={formats}
          value={downloadFormat}
          onChange={(val) => {
            onDownloadFormatChange(val)
            onDownload(val)
          }}
          triggerClassName="hover:bg-muted"
        />
      </div>
    </div>
  )
}
