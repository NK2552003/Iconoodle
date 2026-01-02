import type { ExportFormat } from "./svg-utils"

/**
 * Base doodle/icon structure
 */
export interface Doodle {
  id: string
  category: string
  subcategory?: string
  style: string
  src: string
  svg: string
  viewBox: string
}

/**
 * Icon variant structure
 */
export interface IconVariant {
  category: string
  style: string
  src: string
  svg: string
  viewBox: string
}

/**
 * Grouped icon with multiple variants
 */
export interface GroupedIcon {
  id: string
  category?: string
  variants: Record<string, IconVariant>
}

/**
 * Dropdown option structure
 */
export interface DropdownOption {
  label: string
  value: string
}

/**
 * Custom dropdown props
 */
export interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: any) => void
  triggerClassName?: string
}

/**
 * Doodle card props
 */
export interface DoodleCardProps {
  doodle: any
  allDoodles: any[]
  viewMode: "grid" | "list"
  onClick: () => void
  isCandy?: boolean
}

/**
 * Directory tabs props
 */
export interface TabsProps {
  selectedView: 'doodles' | 'icons' | 'illustrations'
  setSelectedView: (v: 'doodles' | 'icons' | 'illustrations') => void
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  loadingDoodles: boolean
  loadingIcons: boolean
  loadingIllustrations: boolean
  allDoodles: Doodle[]
  iconsTotal: number
  allIllustrations: Doodle[]
}

/**
 * Directory header props
 */
export interface HeaderProps {
  selectedView: 'doodles' | 'icons' | 'illustrations'
  selectedCategory: string
  loadingDoodles: boolean
  loadingIcons: boolean
  loadingIllustrations: boolean
  visibleCount: number
  totalCount: number
  viewMode: "grid" | "list"
  setViewMode: (m: "grid" | "list") => void
}

/**
 * Directory grid props
 */
export interface GridProps {
  showLoadingPlaceholders: boolean
  visibleItems: any[]
  isFetchingMore: boolean
  filteredLength: number
  viewMode: "grid" | "list"
  candyIcons: any[]
  setSelectedDoodle: (d: Doodle) => void
  /** optional array to pass through as the allDoodles prop for each card */
  allDoodlesParent?: any[]
  /** sentinel ref used by parent or null if parent manages observer */
  sentinelRef?: React.RefObject<HTMLDivElement | null>
}

/**
 * Mobile directory props
 */
export interface MobileProps {
  searchQuery: string
  setSearchQuery: (v: string) => void
  selectedView: 'doodles' | 'icons' | 'illustrations'
  setSelectedView: (v: 'doodles' | 'icons' | 'illustrations') => void
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  loadingDoodles: boolean
  loadingIcons: boolean
  loadingIllustrations: boolean
  iconsTotal: number
  allDoodles: Doodle[]
  allIllustrations: Doodle[]
  candyOpen: boolean
  setCandyOpen: React.Dispatch<React.SetStateAction<boolean>>
  simpleOpen: boolean
  setSimpleOpen: React.Dispatch<React.SetStateAction<boolean>>
  candyCategories: string[]
  doodleSubcategories: string[]
  iconCategories: string[]
  illustrationCategories: string[]
  iconTopCategories: string[]
  categories: string[]
  loadDoodleCategory: (name: string) => void
}

/**
 * Modal props
 */
export interface DoodleModalProps {
  doodle: Doodle
  onClose: () => void
  allDoodles: Doodle[]
}

/**
 * Preview component props
 */
export interface DoodleModalPreviewProps {
  currentDoodle: Doodle
  variants: Doodle[]
  getSizedSvg: (baseSvg: string, includeBg?: boolean) => string
  onVariantChange: (variant: Doodle) => void
  size: string
  displaySize: string
  isWhite: boolean
}

/**
 * Code view component props
 */
export interface DoodleModalCodeProps {
  formattedCode: string
  codeFormat: ExportFormat
  onFormatChange: (format: ExportFormat) => void
  formats: { label: string; value: ExportFormat }[]
  isMobile: boolean
  isSmallDevice: boolean
}

/**
 * Actions component props
 */
export interface DoodleModalActionsProps {
  copied: boolean
  copyFormat: ExportFormat
  downloadFormat: ExportFormat
  activeTab: "preview" | "code"
  codeFormat: ExportFormat
  formats: { label: string; value: ExportFormat }[]
  onCopy: (format: ExportFormat) => void
  onDownload: (format: ExportFormat) => void
  onCopyFormatChange: (format: ExportFormat) => void
  onDownloadFormatChange: (format: ExportFormat) => void
}

/**
 * Info component props
 */
export interface DoodleModalInfoProps {
  currentDoodle: Doodle
}

/**
 * Variants grid component props
 */
export interface DoodleModalVariantsProps {
  variants: Doodle[]
  currentDoodle: Doodle
  onVariantChange: (variant: Doodle) => void
}

/**
 * Tabs component props
 */
export interface DoodleModalTabsProps {
  activeTab: "preview" | "code"
  onTabChange: (tab: "preview" | "code") => void
  size: string
  onSizeChange: (size: string) => void
}
