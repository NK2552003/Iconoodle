export interface Doodle {
  id: string
  category: string
  style: string
  src: string
  svg: string
  viewBox: string
}

export interface IconVariant {
  category: string
  style: string
  src: string
  svg: string
  viewBox: string
}

export interface GroupedIcon {
  id: string
  category?: string
  variants: Record<string, IconVariant>
}

import doodles from './doodles.json'
import groupedIcons from './icons.json'
import candyIcons from './candy-icons.json'
import handdrawnIcons from './handdrawn-icons.json'
import handdrawnType2Icons from './handdrawn-type-2-icons.json'
import illustrations from './illustrations.json'
export const DOODLES: Doodle[] = doodles as Doodle[]

// Keep backward-compatible flat array available as `ICONS` for components that expect it
// Include handdrawn icons so they show up in the Icons view and sidebar categories
// Prevent ID clashes by appending a short source suffix to duplicate ids (e.g. "Airbnb (handdrawn-type-2)")
const _rawGrouped: Array<GroupedIcon & { __source?: string }> = [
  ...(groupedIcons as unknown as GroupedIcon[]).map((g) => ({ ...g, __source: 'icons' })),
  ...((handdrawnIcons as unknown) as GroupedIcon[]).map((g) => ({ ...g, __source: 'handdrawn' })),
  ...((handdrawnType2Icons as unknown) as GroupedIcon[]).map((g) => ({ ...g, __source: 'handdrawn-type-2' })),
]

const _idCounts = new Map<string, number>()
export const GROUPED_ICONS: GroupedIcon[] = _rawGrouped.map((g) => {
  const baseId = g.id
  const count = _idCounts.get(baseId) ?? 0
  _idCounts.set(baseId, count + 1)

  if (count === 0) {
    const { __source, ...rest } = g
    return rest
  }

  const suffix = g.__source ?? 'dup'
  const newId = `${baseId} (${suffix}${count > 1 ? `-${count}` : ''})`
  const { __source, ...rest } = g
  return { ...rest, id: newId }
})

export const ICONS: Doodle[] = GROUPED_ICONS.flatMap((g) =>
  Object.entries(g.variants).map(([style, v]) => ({ id: g.id, category: v.category, style, src: v.src, svg: v.svg, viewBox: v.viewBox })),
)

// Candy Icons (flat list) — used as a separate icon set
export const CANDY_ICONS: Doodle[] = (candyIcons as unknown) as Doodle[]

export const ILLUSTRATIONS: Doodle[] = (illustrations as unknown) as Doodle[]
