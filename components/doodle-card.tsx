"use client"

import * as React from "react"
import { Download, Copy, Maximize2, Check } from "lucide-react"
import type { DoodleCardProps } from "@/lib/types"
import { CustomDropdown } from "./custom-dropdown"
import { convertSvgToFormat, type ExportFormat } from "@/lib/svg-utils"
import { EXPORT_FORMATS, EXTENSION_MAP, MIME_MAP } from "@/lib/constants"

export function DoodleCard({ doodle, allDoodles, viewMode, onClick, isCandy }: DoodleCardProps) {
  const isGrid = viewMode === "grid"
  const [activeStyle, setActiveStyle] = React.useState(doodle.style)
  const [copied, setCopied] = React.useState(false)
  const [copyFormat, setCopyFormat] = React.useState<ExportFormat>("SVG")
  const [downloadFormat, setDownloadFormat] = React.useState<ExportFormat>("SVG")

  const currentDoodle = React.useMemo(() => {
    return (
      allDoodles.find((d) => {
        if (d.id !== doodle.id) return false
        if (d.style !== activeStyle) return false
        
        // For doodles with subcategories, prefer matching by subcategory
        if (d.subcategory && doodle.subcategory) {
          return d.subcategory === doodle.subcategory
        }
        
        // For icons without subcategories, just match by id and style
        return true
      }) || doodle
    )
  }, [allDoodles, doodle, activeStyle])

  // Get all available styles for this doodle/icon (max 3)
  const availableStyles = React.useMemo(() => {
    const styles = new Set<string>()
    allDoodles.forEach((d) => {
      // Match by id - this works for both doodles and icons
      if (d.id !== doodle.id) return
      
      // For doodles with subcategories, match by subcategory
      if (d.subcategory && doodle.subcategory) {
        if (d.subcategory === doodle.subcategory && d.style) {
          styles.add(d.style)
        }
      } 
      // Otherwise just match by id (works for icons)
      else if (d.style) {
        styles.add(d.style)
      }
    })
    return Array.from(styles).slice(0, 3) // Limit to 3 variants
  }, [allDoodles, doodle])

  const hasMultipleStyles = availableStyles.length > 1

  // If the currently selected style is WHITE, show a black background behind the svg so it remains visible
  const isWhite = currentDoodle?.style === "WHITE"

  // Special case: some categories are white assets — show black card background in grid
  const lowerCat = ((doodle?.category || doodle?.subcategory) || '').toLowerCase()
  const hasWhiteVariant = allDoodles.some((d) => d.id === doodle.id && d.style === 'WHITE')
  const isEducationalCategory = lowerCat.includes('educational') || lowerCat.includes('education')
  // Treat any category that contains the fast-food identifier as a black-background category
  const isBlackBackgroundCategory = isGrid && (
    lowerCat.includes('coolicons') ||
    lowerCat.includes('fast-food-doodle-art') ||
    (isEducationalCategory && (hasWhiteVariant || currentDoodle?.style === 'WHITE'))
  )

  // Copy functionality
  const handleCopy = async (format: ExportFormat = copyFormat) => {
    try {
      const content = await convertSvgToFormat(currentDoodle.svg, format, currentDoodle.id)
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Download functionality
  const handleDownload = async (format: ExportFormat = downloadFormat) => {
    try {
      const content = await convertSvgToFormat(currentDoodle.svg, format, currentDoodle.id)
      const blob = new Blob([content], { type: MIME_MAP[format] })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentDoodle.id}.${EXTENSION_MAP[format]}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download:", err)
    }
  }

  return (
    <div
      className={`group relative ${(isCandy || isBlackBackgroundCategory) ? 'bg-black text-white' : 'bg-card'} rounded-2xl border border-border/50 transition-all duration-300 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5 overflow-hidden ${
        isGrid ? "aspect-square" : "flex items-center gap-4 p-4"
      }`}
    >
      {/* Main Content Area - Full card clickable */}
      <div
        onClick={onClick}
        className={`flex items-center justify-center cursor-pointer relative ${isGrid ? "w-full h-full p-8" : "w-16 h-16 shrink-0"}`}
      >
        {/* Doodle Preview Container */}
        <div className={`w-full h-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 overflow-auto no-scrollbar svg-fit ${(isWhite || isCandy) ? 'p-4 rounded-xl bg-black' : ''}`}>
          <div
            className={`w-full h-full flex items-center justify-center ${isCandy ? 'text-white' : 'text-foreground'} ${isWhite ? 'contrast-more' : ''}`}
            dangerouslySetInnerHTML={{ __html: currentDoodle.svg }}
          />
        </div>
      </div>

      {/* Grid View - Quick Action Button */}
      {isGrid && (
        <div className="absolute top-3 left-3 opacity-0 md:group-hover:opacity-100 transition-all duration-200 z-10">
          <button 
            onClick={onClick}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 shadow-sm ${
              (isCandy || isBlackBackgroundCategory)
                ? 'bg-white/90 text-black border border-white/50 hover:bg-white hover:border-white'
                : 'bg-background/90 text-foreground border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary'
            }`}
            title="View Details"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid View - Style Switcher - Top Right */}
      {hasMultipleStyles && isGrid && (
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 md:group-hover:opacity-100 transition-all duration-200 z-10">
          {availableStyles.map((style, index) => {
            // Get a short label for the style
            const getStyleLabel = (s: string) => {
              if (s === 'OUTLINE_STICKER') return 'OS'
              if (s === 'OUTLINE_WHITE') return 'OW'
              if (s.includes('_')) return s.split('_').map(p => p[0]).join('')
              return s.charAt(0)
            }
            
            return (
              <button
                key={style}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveStyle(style)
                }}
                className={`w-7 h-7 rounded-lg text-[9px] flex items-center justify-center font-semibold transition-all duration-200 ${
                  activeStyle === style 
                    ? "bg-primary text-primary-foreground shadow-md scale-105 border border-primary" 
                    : (isCandy || isBlackBackgroundCategory)
                      ? "bg-white/90 text-black backdrop-blur-sm hover:bg-white hover:scale-105 border border-white/50"
                      : "bg-background/90 text-foreground backdrop-blur-sm hover:bg-background hover:scale-105 border border-border"
                }`}
                title={`${style.charAt(0)}${style.slice(1).toLowerCase().replace(/_/g, ' ')} Style`}
              >
                {getStyleLabel(style)}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid View - Bottom Label Overlay */}
      {isGrid && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          {/* Background and blur - appears instantly */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {/* Gradient background - fades from bottom to top */}
            <div className={`absolute inset-0 ${
              (isCandy || isBlackBackgroundCategory)
                ? 'bg-gradient-to-t from-white/95 via-white/40 to-transparent'
                : 'bg-gradient-to-t from-background/95 via-background/40 to-transparent'
            }`} />
            
            {/* Blur layer - only at bottom, masks out at top */}
            <div className="absolute inset-0 backdrop-blur-md" style={{ maskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)' }} />
          </div>
          
          {/* Text content - slides up */}
          <div className="relative z-10 p-4 pt-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <h4 className={`font-semibold text-sm text-center truncate mb-1 ${
              (isCandy || isBlackBackgroundCategory) ? 'text-black' : 'text-foreground'
            }`}>
              {doodle.id}
            </h4>
            <p className={`text-xs text-center uppercase tracking-wider ${
              (isCandy || isBlackBackgroundCategory) ? 'text-gray-700' : 'text-muted-foreground'
            }`}>
              {currentDoodle.style}
            </p>
          </div>
        </div>
      )}

      {/* List View Content */}
      {!isGrid && (
        <>
          <div className="flex-1 min-w-0" onClick={onClick}>
            <h4 className="font-semibold text-base truncate mb-1 cursor-pointer">{doodle.id}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {(doodle.subcategory || doodle.category)} • {currentDoodle.style}
            </p>
          </div>

          {/* List View - Action Buttons with Dropdowns */}
          <div className="flex items-center gap-2 opacity-0 md:group-hover:opacity-100 transition-all duration-200 hidden md:inline-flex">
            {/* Variant Switcher for List View */}
            {hasMultipleStyles && (
              <div className="hidden sm:flex items-center gap-1 mr-2">
                {availableStyles.map((style) => {
                  const getStyleLabel = (s: string) => {
                    if (s === 'OUTLINE_STICKER') return 'OS'
                    if (s === 'OUTLINE_WHITE') return 'OW'
                    if (s.includes('_')) return s.split('_').map(p => p[0]).join('')
                    return s.charAt(0)
                  }
                  
                  return (
                    <button
                      key={style}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveStyle(style)
                      }}
                      className={`w-7 h-7 rounded-lg text-[9px] flex items-center justify-center font-semibold transition-all duration-200 ${
                        activeStyle === style 
                          ? "bg-primary text-primary-foreground shadow-md scale-105 border border-primary" 
                          : "bg-muted text-foreground hover:bg-muted/80 hover:scale-105 border border-border"
                      }`}
                      title={`${style.charAt(0)}${style.slice(1).toLowerCase().replace(/_/g, ' ')} Style`}
                    >
                      {getStyleLabel(style)}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Copy Button with Dropdown */}
            <div className="flex overflow-hidden rounded-lg border">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy(copyFormat)
                }}
                className="p-2 hover:bg-muted transition-all duration-200 hover:scale-105"
                title={`Copy ${copyFormat}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <CustomDropdown
                options={EXPORT_FORMATS}
                value={copyFormat}
                onChange={(val) => {
                  setCopyFormat(val)
                  handleCopy(val)
                }}
                triggerClassName="hover:bg-muted border-border/50"
              />
            </div>

            {/* Download Button with Dropdown */}
            <div className="flex overflow-hidden rounded-lg border">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(downloadFormat)
                }}
                className="p-2 hover:bg-muted transition-all duration-200 hover:scale-105"
                title={`Download ${downloadFormat}`}
              >
                <Download className="w-4 h-4" />
              </button>
              <CustomDropdown
                options={EXPORT_FORMATS}
                value={downloadFormat}
                onChange={(val) => {
                  setDownloadFormat(val)
                  handleDownload(val)
                }}
                triggerClassName="hover:bg-muted border-border/50"
              />
            </div>

            {/* View Details Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
              className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground border border-border/50 transition-all duration-200 hover:scale-105"
              title="View Details"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
