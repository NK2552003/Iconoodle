"use client"

import * as React from "react"
import { X, Copy, Download, Check, Monitor, Smartphone, Tablet } from "lucide-react"
import { GROUPED_ICONS } from "@/lib/data"
import { convertSvgToFormat, type ExportFormat } from "@/lib/svg-utils"
import { CustomDropdown } from "./custom-dropdown"


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
  const [displaySize, setDisplaySize] = React.useState(size)
  const [copyFormat, setCopyFormat] = React.useState<ExportFormat>("SVG")
  const [downloadFormat, setDownloadFormat] = React.useState<ExportFormat>("SVG")
  const [codeFormat, setCodeFormat] = React.useState<ExportFormat>("SVG")
  const [isWhite, setIsWhite] = React.useState(false) // Declare isWhite variable

  React.useEffect(() => {
    const update = () => {
      if (size === "100%") {
        setDisplaySize("100%")
        return
      }
      const requested = Number.parseInt(size.replace("px", ""), 10) || 128
      const maxAllowed = Math.max(64, Math.min(requested, window.innerWidth - 120))
      setDisplaySize(`${maxAllowed}px`)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [size])

  // Lock background scroll while modal is open and avoid layout shift from scrollbar disappearance
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollBarWidth) document.body.style.paddingRight = `${scrollBarWidth}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [])

  const variants = React.useMemo(() => {
    if (!currentDoodle) return []

    const prefOrder = ["LINED", "COLORED", "WHITE", "ICON", "BLACK"]

    const group = GROUPED_ICONS.find((g: any) => g.id === currentDoodle.id)
    if (group) {
      const arr = Object.entries(group.variants).map(([style, v]: any) => ({
        id: group.id,
        category: v.category,
        style,
        src: v.src,
        svg: v.svg,
        viewBox: v.viewBox,
      }))
      return arr.sort((a: any, b: any) => {
        const ai = prefOrder.indexOf(a.style as string)
        const bi = prefOrder.indexOf(b.style as string)
        if (ai === -1 && bi === -1) return 0
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })
    }

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

    return Array.from(seen.values()).sort((a, b) => {
      const ai = prefOrder.indexOf(a.style as string)
      const bi = prefOrder.indexOf(b.style as string)
      if (ai === -1 && bi === -1) return 0
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
  }, [allDoodles, doodle])

  const getSizedSvg = (baseSvg: string, includeBg = false) => {
    let svgStr = baseSvg
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(baseSvg, "image/svg+xml")
      const svgEl = doc.querySelector("svg")
      if (svgEl) {
        if (size !== "100%") {
          svgEl.setAttribute("width", size)
          svgEl.setAttribute("height", size)
        }
        svgEl.setAttribute("style", "max-width:100%;max-height:100%;height:auto;display:block")

        if (includeBg) {
          const w = svgEl.getAttribute("width") || svgEl.getAttribute("viewBox")?.split(" ")[2] || "48"
          const h = svgEl.getAttribute("height") || svgEl.getAttribute("viewBox")?.split(" ")[3] || "48"
          const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect")
          rect.setAttribute("x", "0")
          rect.setAttribute("y", "0")
          rect.setAttribute("width", String(w))
          rect.setAttribute("height", String(h))
          rect.setAttribute("fill", "black")
          const firstChild = svgEl.firstChild
          svgEl.insertBefore(rect, firstChild)
        }

        svgStr = new XMLSerializer().serializeToString(svgEl)
      }
    } catch (e) {
      // fallback
    }

    return svgStr
  }

  const handleCopy = (format: ExportFormat = copyFormat) => {
    const sized = getSizedSvg(currentDoodle.svg, false)
    const formattedCode = convertSvgToFormat(sized, format, currentDoodle.id)
    navigator.clipboard.writeText(formattedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (format: ExportFormat = downloadFormat) => {
    const sized = getSizedSvg(currentDoodle.svg, false)
    const formattedCode = convertSvgToFormat(sized, format, currentDoodle.id)

    const extensionMap: Record<ExportFormat, string> = {
      SVG: "svg",
      TSX: "tsx",
      JSX: "jsx",
      VUE: "vue",
      SVELTE: "svelte",
      ASTRO: "astro",
      REACT_NATIVE: "tsx",
      BASE64: "txt",
    }

    const mimeMap: Record<ExportFormat, string> = {
      SVG: "image/svg+xml",
      TSX: "text/typescript-jsx",
      JSX: "text/javascript-jsx",
      VUE: "text/vue",
      SVELTE: "text/svelte",
      ASTRO: "text/astro",
      REACT_NATIVE: "text/typescript-jsx",
      BASE64: "text/plain",
    }

    const blob = new Blob([formattedCode], { type: mimeMap[format] })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${currentDoodle.id.toLowerCase().replace(/\s+/g, "-")}.${extensionMap[format]}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formats: { label: string; value: ExportFormat }[] = [
    { label: "SVG", value: "SVG" },
    { label: "TSX", value: "TSX" },
    { label: "JSX", value: "JSX" },
    { label: "Vue", value: "VUE" },
    { label: "Svelte", value: "SVELTE" },
    { label: "Astro", value: "ASTRO" },
    { label: "React Native", value: "REACT_NATIVE" },
    { label: "Base64", value: "BASE64" },
  ]

  const formattedCode = React.useMemo(() => {
    try {
      return convertSvgToFormat(getSizedSvg(currentDoodle.svg), codeFormat, currentDoodle.id)
    } catch (e) {
      return getSizedSvg(currentDoodle.svg)
    }
  }, [currentDoodle, codeFormat, size])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[96vw] sm:max-w-4xl bg-background rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        style={{ maxHeight: "calc(100vh - 40px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="relative flex justify-end md:absolute right-4 top-4 p-2 rounded-full hover:bg-muted z-10 transition-colors"
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
                Code
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                className="text-xs bg-muted border-none rounded-md px-2 py-1 focus:ring-1 focus:ring-primary"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
                <option value="36px">36px</option>
                <option value="48px">48px</option>
                <option value="64px">64px</option>
                <option value="72px">72px</option>
                <option value="96px">96px</option>
                <option value="128px">128px</option>
                <option value="192px">192px</option>
                <option value="256px">256px</option>
                <option value="512px">512px</option>
                <option value="100%">Original</option>
              </select>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-8 overflow-auto no-scrollbar">
            {activeTab === "preview" ? (
              <div
                className={`flex items-center justify-center transition-all duration-300 ${isWhite ? "p-4 rounded-md bg-black" : ""}`}
                style={
                  size === "100%"
                    ? { width: "100%", height: "auto", maxWidth: "100%", maxHeight: "calc(100vh - 280px)" }
                    : { width: displaySize, height: displaySize, maxWidth: "100%", maxHeight: "calc(100vh - 280px)" }
                }
              >
                {variants.length > 1 && (
                  <div
                    className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 w-16 overflow-y-auto no-scrollbar p-2 items-center z-20 bg-background/70 rounded"
                    style={
                      size === "100%" ? { height: "auto", maxHeight: "calc(100vh - 280px)" } : { height: displaySize }
                    }
                  >
                    {variants.map((v) => (
                      <button
                        key={v.style}
                        onClick={() => currentDoodle.style !== v.style && setCurrentDoodle(v)}
                        className={`w-12 h-12 flex items-center justify-center p-1 rounded-md transition-all ${currentDoodle.style === v.style ? "ring-1 ring-primary" : "opacity-70 hover:opacity-100"}`}
                        aria-label={`${v.style} variant`}
                        dangerouslySetInnerHTML={{ __html: v.svg }}
                      />
                    ))}
                  </div>
                )}
                <div
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: getSizedSvg(currentDoodle.svg) }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-muted/50 rounded-xl p-4 overflow-auto">
                <div className="mb-3 flex items-center gap-2 flex-end justify-end sticky top-0">
                  <div className="flex items-center gap-2 border bg-background rounded-xl px-3 py-1">
                    <span className="text-sm text-muted-foreground">Format:</span>
                    <CustomDropdown
                      options={formats}
                      value={codeFormat}
                      onChange={(val) => setCodeFormat(val)}
                      triggerClassName="hover:bg-muted"
                    />
                  </div>
                </div>

                <pre
                  className="text-[10px] sm:text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all max-h-4xl overflow-auto overscroll-contain"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {formattedCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Info & Options */}
        <div className="w-full md:w-80 border-t md:border-l p-6 flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-2 py-1 rounded bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mb-2">
              {currentDoodle.subcategory || currentDoodle.category}
            </span>
            <h2 className="text-2xl font-bold truncate">{currentDoodle.id}</h2>
            <p className="text-sm text-muted-foreground mt-1">Ready to use in your design project.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex w-full group overflow-hidden rounded-xl border-2">
                <button
                  onClick={() => handleCopy(activeTab === 'code' ? codeFormat : copyFormat)}
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
                      Copy {(activeTab === 'code' ? codeFormat : copyFormat) === "SVG" ? "SVG" : (activeTab === 'code' ? codeFormat : copyFormat) === "REACT_NATIVE" ? "RN" : (activeTab === 'code' ? codeFormat : copyFormat)}
                    </>
                  )}
                </button>
                <CustomDropdown
                  options={formats}
                  value={copyFormat}
                  onChange={(val) => {
                    setCopyFormat(val)
                    handleCopy(val)
                  }}
                  triggerClassName="bg-primary text-primary-foreground border-primary-foreground/20 hover:bg-primary/90"
                />
              </div>

              <div className="flex w-full group overflow-hidden rounded-xl border-2">
                <button
                  onClick={() => handleDownload(activeTab === 'code' ? codeFormat : downloadFormat)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold hover:bg-muted transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download {(activeTab === 'code' ? codeFormat : downloadFormat) === "SVG" ? ".SVG" : (activeTab === 'code' ? codeFormat : downloadFormat) === "REACT_NATIVE" ? "RN" : (activeTab === 'code' ? codeFormat : downloadFormat)}
                </button>
                <CustomDropdown
                  options={formats}
                  value={downloadFormat}
                  onChange={(val) => {
                    setDownloadFormat(val)
                    handleDownload(val)
                  }}
                  triggerClassName="hover:bg-muted"
                />
              </div>
            </div>
          </div>

          {variants.length > 1 && (
            <div className="hidden md:block mb-8">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-3">
                Available Styles
              </h3>
              <div className="max-h-55 sm:max-h-80 overflow-y-auto p-2 no-scrollbar" aria-label="Available Styles">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
                  {variants.map((v) => (
                    <div
                      key={v.style}
                      onClick={() => currentDoodle.style !== v.style && setCurrentDoodle(v)}
                      className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${currentDoodle.style === v.style ? "border-primary ring-1 ring-primary" : "hover:border-primary/50 opacity-60"}`}
                    >
                      <div
                        className={`aspect-square flex items-center justify-center mb-1 scale-75 ${v.style === "WHITE" ? "p-2 rounded-md bg-black" : ""}`}
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
            </div>
          )}

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
        </div>
      </div>
    </div>
  )
}
