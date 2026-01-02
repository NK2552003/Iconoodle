"use client"

import * as React from "react"
import { X } from "lucide-react"
import { useDoodles } from "@/hooks/use-doodles"
import { useIsMobile } from "@/hooks/use-mobile"
import { convertSvgToFormat, type ExportFormat } from "@/lib/svg-utils"
import { EXPORT_FORMATS, EXTENSION_MAP, MIME_MAP, VARIANT_STYLE_ORDER } from "@/lib/constants"
import type { DoodleModalProps } from "@/lib/types"
import { DoodleModalPreview } from "./doodle-modal-preview"
import { DoodleModalCode } from "./doodle-modal-code"
import { DoodleModalActions } from "./doodle-modal-actions"
import { DoodleModalInfo } from "./doodle-modal-info"
import { DoodleModalVariants } from "./doodle-modal-variants"
import { DoodleModalTabs, DoodleModalFooter } from "./doodle-modal-tabs"

export function DoodleModal({ doodle, onClose, allDoodles }: DoodleModalProps) {
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview")
  const [size, setSize] = React.useState("128px")
  const [currentDoodle, setCurrentDoodle] = React.useState(doodle)
  const [displaySize, setDisplaySize] = React.useState(size)
  const [copyFormat, setCopyFormat] = React.useState<ExportFormat>("SVG")
  const [downloadFormat, setDownloadFormat] = React.useState<ExportFormat>("SVG")
  const [codeFormat, setCodeFormat] = React.useState<ExportFormat>("SVG")
  const isMobile = useIsMobile()
  const [isWhite, setIsWhite] = React.useState(false) // Declare isWhite variable
  const [isSmallDevice, setIsSmallDevice] = React.useState(false)

  React.useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth <= 375 || window.innerHeight <= 667)
    }
    checkDeviceSize()
    window.addEventListener("resize", checkDeviceSize)
    return () => window.removeEventListener("resize", checkDeviceSize)
  }, [])

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
    document.body.setAttribute('data-modal-open', 'true')
    if (scrollBarWidth) document.body.style.paddingRight = `${scrollBarWidth}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
      document.body.removeAttribute('data-modal-open')
    }
  }, [])

  const { groupedIcons } = useDoodles()

  const variants = React.useMemo(() => {
    if (!currentDoodle) return []

    const prefOrder = [...VARIANT_STYLE_ORDER] as string[]

    const group = groupedIcons.find((g: any) => g.id === currentDoodle.id)
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

    const blob = new Blob([formattedCode], { type: MIME_MAP[format] })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${currentDoodle.id.toLowerCase().replace(/\s+/g, "-")}.${EXTENSION_MAP[format]}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formats = EXPORT_FORMATS

  const formattedCode = React.useMemo(() => {
    try {
      return convertSvgToFormat(getSizedSvg(currentDoodle.svg), codeFormat, currentDoodle.id)
    } catch (e) {
      return getSizedSvg(currentDoodle.svg)
    }
  }, [currentDoodle, codeFormat, size])

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
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
          <DoodleModalTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            size={size}
            onSizeChange={setSize}
          />

          <div className="relative flex-1 flex items-center justify-center p-8 overflow-auto no-scrollbar">
            {activeTab === "preview" ? (
              <DoodleModalPreview
                currentDoodle={currentDoodle}
                variants={variants}
                getSizedSvg={getSizedSvg}
                onVariantChange={setCurrentDoodle}
                size={size}
                displaySize={displaySize}
                isWhite={isWhite}
              />
            ) : (
              <DoodleModalCode
                formattedCode={formattedCode}
                codeFormat={codeFormat}
                onFormatChange={setCodeFormat}
                formats={formats}
                isMobile={isMobile}
                isSmallDevice={isSmallDevice}
              />
            )}
          </div>
        </div>

        {/* Right Side: Info & Options */}
        <div className="w-full md:w-80 border-t md:border-l p-6 flex flex-col">
          <DoodleModalInfo currentDoodle={currentDoodle} />

          <div className="mb-8">
            <DoodleModalActions
              copied={copied}
              copyFormat={copyFormat}
              downloadFormat={downloadFormat}
              activeTab={activeTab}
              codeFormat={codeFormat}
              formats={formats}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onCopyFormatChange={setCopyFormat}
              onDownloadFormatChange={setDownloadFormat}
            />
          </div>

          <DoodleModalVariants
            variants={variants}
            currentDoodle={currentDoodle}
            onVariantChange={setCurrentDoodle}
          />

          <DoodleModalFooter />
        </div>
      </div>
    </div>
  )
}
