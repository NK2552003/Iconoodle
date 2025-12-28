"use client"

import * as React from "react"
import { X, Copy, Download, Heart, Check, Monitor, Smartphone, Tablet } from "lucide-react"
import { GROUPED_ICONS } from "@/lib/data"

interface DoodleModalProps {
  doodle: any
  onClose: () => void
  allDoodles: any[]
}

export function DoodleModal({ doodle, onClose, allDoodles }: DoodleModalProps) {
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview")
  const [size, setSize] = React.useState("128px")
  const [currentDoodle, setCurrentDoodle] = React.useState(doodle)

  // Gather all variants for this asset
  // - For grouped icons, prefer using GROUPED_ICONS to get the exact available styles
  // - Otherwise, use existing doodle logic (match by id+category then id only)
  const variants = React.useMemo(() => {
    if (!currentDoodle) return []

    const prefOrder = ["LINED", "COLORED", "WHITE", "ICON", "BLACK"]

    // If this id exists in grouped icons, build variants directly from the group
    const group = GROUPED_ICONS.find((g: any) => g.id === currentDoodle.id)
    if (group) {
      const arr = Object.entries(group.variants).map(([style, v]: any) => ({ id: group.id, category: v.category, style, src: v.src, svg: v.svg, viewBox: v.viewBox }))
      return arr.sort((a: any, b: any) => {
        const ai = prefOrder.indexOf(a.style as string)
        const bi = prefOrder.indexOf(b.style as string)
        if (ai === -1 && bi === -1) return 0
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })
    }

    // Fallback: doodles (and flat icons) logic
    // Prefer matching variants within the same subcategory when available (for simple-doodles), otherwise match by category
    let matches = [] as any[]
    if (currentDoodle.subcategory) {
      matches = allDoodles.filter((d) => d.id === currentDoodle.id && d.subcategory === currentDoodle.subcategory)
    } else {
      matches = allDoodles.filter((d) => d.id === currentDoodle.id && d.category === currentDoodle.category)
    }
    if (matches.length === 0) matches = allDoodles.filter((d) => d.id === currentDoodle.id)

    const seen = new Map<string, any>()
    matches.forEach((m) => {
      if (!seen.has(m.style)) seen.set(m.style, m)
    })

    const sorted = Array.from(seen.values()).sort((a, b) => {
      const ai = prefOrder.indexOf(a.style as string)
      const bi = prefOrder.indexOf(b.style as string)
      if (ai === -1 && bi === -1) return 0
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })

    return sorted
  }, [allDoodles, currentDoodle.id, currentDoodle.category, currentDoodle.subcategory])

  // If the currently selected style is WHITE, show a black background behind the svg in the modal preview
  const isWhite = currentDoodle?.style === "WHITE"

  // Return an SVG string that respects the selected size (unless size === '100%')
  const getSizedSvg = (baseSvg: string, includeBg = false) => {
    let svgStr = baseSvg
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(baseSvg, "image/svg+xml")
      const svgEl = doc.querySelector("svg")
      if (svgEl) {
        // If a size was chosen, set width/height attributes
        if (size !== "100%") {
          svgEl.setAttribute("width", size)
          svgEl.setAttribute("height", size)
        }

        // If requested, inject a black rect background so WHITE icons export with a visible bg
        if (includeBg) {
          const w = svgEl.getAttribute("width") || svgEl.getAttribute("viewBox")?.split(" ")[2] || "48"
          const h = svgEl.getAttribute("height") || svgEl.getAttribute("viewBox")?.split(" ")[3] || "48"
          const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect")
          rect.setAttribute("x", "0")
          rect.setAttribute("y", "0")
          rect.setAttribute("width", String(w))
          rect.setAttribute("height", String(h))
          rect.setAttribute("fill", "black")
          // Insert as first child so it sits behind icon paths
          const firstChild = svgEl.firstChild
          svgEl.insertBefore(rect, firstChild)
        }

        // Serialize only the outer <svg> element to avoid duplicating xml header
        svgStr = new XMLSerializer().serializeToString(svgEl)
      }
    } catch (e) {
      // fallback to original svg string
    }

    return svgStr
  }

  const handleCopy = () => {
    // Copy the raw SVG without the black background rect so user gets the original SVG
    const sized = getSizedSvg(currentDoodle.svg, false)
    navigator.clipboard.writeText(sized)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // Download the raw SVG without the black background rect
    const sized = getSizedSvg(currentDoodle.svg, false)
    const blob = new Blob([sized], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${currentDoodle.id.toLowerCase().replace(/\s+/g, "-")}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-background rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted z-10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Preview Area */}
        <div className="flex-1 bg-muted/20 flex flex-col min-h-75 md:min-h-0">
          <div className="p-6 border-b flex items-center justify-between bg-background">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "preview" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "code" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                SVG Code
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                className="text-xs bg-muted border-none rounded-md px-2 py-1 focus:ring-1 focus:ring-primary"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="64px">64px</option>
                <option value="128px">128px</option>
                <option value="256px">256px</option>
                <option value="100%">Original</option>
              </select>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 overflow-auto no-scrollbar">
            {activeTab === "preview" ? (
              <div
                className={`flex items-center justify-center transition-all duration-300 ${isWhite ? 'p-4 rounded-md bg-black' : ''}`}
                style={{ width: size, height: size }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: getSizedSvg(currentDoodle.svg) }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-muted/50 rounded-xl p-4 overflow-auto">
                <pre className="text-[10px] sm:text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                  {currentDoodle.svg}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Info & Options */}
        <div className="w-full md:w-80 border-l p-6 flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-2 py-1 rounded bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mb-2">
              {currentDoodle.subcategory || currentDoodle.category}
            </span>
            <h2 className="text-2xl font-bold truncate">{currentDoodle.id}</h2>
            <p className="text-sm text-muted-foreground mt-1">Ready to use in your design project.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy SVG String
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold hover:bg-muted transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download .SVG
              </button>
            </div>
          </div>

          {variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-3">
                Available Styles
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {variants.map((v) => (
                  <div
                    key={v.style}
                    onClick={() => currentDoodle.style !== v.style && setCurrentDoodle(v)}
                    className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${currentDoodle.style === v.style ? "border-primary ring-1 ring-primary" : "hover:border-primary/50 opacity-60"}`}
                  >
                    <div
                      className={`aspect-square flex items-center justify-center mb-1 scale-75 ${v.style === 'WHITE' ? 'p-2 rounded-md bg-black' : ''}`}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: v.svg }}
                      />
                    </div>
                    <p className="text-[10px] text-center font-bold">{v.style}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 border-t flex items-center justify-between text-muted-foreground">
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
            <button className="hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
