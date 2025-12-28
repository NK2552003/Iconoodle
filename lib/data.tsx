export interface Doodle {
  id: string
  category: string
  subcategory?: string
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
import doodlesAiIconDoodles from './doodles-ai-icon-doodles.json'
import doodlesAnimalDoodles from './doodles-animal-doodles.json'
import doodlesAnimalsDoodle from './doodles-animals-doodle.json'
import doodlesCrispyDoodles from './doodles-crispy-doodles.json'
import doodlesCuteAnimals from './doodles-cute-animals.json'
import doodlesEducationalDoodles from './doodles-educational-doodles.json'
import doodlesFastFoodDoodleArt from './doodles-fast-food-doodle-art.json'
import doodlesFruitsVegetables from './doodles-fruits-vegetables-doodle.json'
import doodlesHandDrawnDoodle from './doodles-hand-drawn-doodle.json'
import doodlesHandDrawnScribbles from './doodles-hand-drawn-doodles-scribbles.json'
import doodlesHandDrawnLifestyle from './doodles-hand-drawn-lifestyle-doodle.json'
import doodlesInternetNetwork from './doodles-internet-network-doodles.json'
import doodlesPotPlants from './doodles-pot-plants-doodle-illustrations.json'
import doodlesTheDoodleLibrary from './doodles-the-doodle-library.json'
import groupedIcons from './icons.json'
import candyIcons from './candy-icons.json'
import handdrawnIcons from './handdrawn-icons.json'
import handdrawnType2Icons from './handdrawn-type-2-icons.json'
import illustrations from './illustrations.json' 
// Public folder generated per-subfolder JSONs
import publicCoolicons from './public-coolicons.json'
import publicIconly from './public-iconly.json'
import publicSmooothIcons from './public-smoooth-icons.json'
import publicSocialMedia from './public-social-media.json'
import publicSocialMedia2 from './public-social-media-2.json'
import publicFluentIcons from './public-fluent-icons.json'

// Normalize only the core `doodles.json` into top-level `simple-doodles` (keep its original category as `subcategory`)
// All other `doodles-*` files remain as their own top-level categories
const _toSimple = (arr: any[] | undefined) => (arr || []).map((d: any) => ({ ...(d || {}), subcategory: d?.category, category: 'simple-doodles' }))
const _asArray = (arr: any[] | undefined) => arr || []

export const DOODLES: Doodle[] = [
  ..._toSimple(doodles as Doodle[]),
  ..._asArray((doodlesAiIconDoodles as unknown) as Doodle[]),
  ..._asArray((doodlesAnimalDoodles as unknown) as Doodle[]),
  ..._asArray((doodlesAnimalsDoodle as unknown) as Doodle[]),
  ..._asArray((doodlesCrispyDoodles as unknown) as Doodle[]),
  ..._asArray((doodlesCuteAnimals as unknown) as Doodle[]),
  ..._asArray((doodlesEducationalDoodles as unknown) as Doodle[]),
  ..._asArray((doodlesFastFoodDoodleArt as unknown) as Doodle[]),
  ..._asArray((doodlesFruitsVegetables as unknown) as Doodle[]),
  ..._asArray((doodlesHandDrawnDoodle as unknown) as Doodle[]),
  ..._asArray((doodlesHandDrawnScribbles as unknown) as Doodle[]),
  ..._asArray((doodlesHandDrawnLifestyle as unknown) as Doodle[]),
  ..._asArray((doodlesInternetNetwork as unknown) as Doodle[]),
  ..._asArray((doodlesPotPlants as unknown) as Doodle[]),
  ..._asArray((doodlesTheDoodleLibrary as unknown) as Doodle[]),
] as Doodle[]

// Keep backward-compatible flat array available as `ICONS` for components that expect it
// Include handdrawn icons and public-folder icons so they show up in the Icons view and sidebar categories
// Merge groups by `id` so variants from different sources combine under the same grouped icon
const sources: Array<{ items: GroupedIcon[]; source: string }> = [
  { items: (groupedIcons as unknown) as GroupedIcon[], source: 'icons' },
  { items: ((handdrawnIcons as unknown) as GroupedIcon[]), source: 'handdrawn' },
  { items: ((handdrawnType2Icons as unknown) as GroupedIcon[]), source: 'handdrawn-type-2' },
  { items: ((publicCoolicons as unknown) as GroupedIcon[]), source: 'public-coolicons' },
  { items: ((publicIconly as unknown) as GroupedIcon[]), source: 'public-iconly' },
  { items: ((publicSmooothIcons as unknown) as GroupedIcon[]), source: 'public-smoooth-icons' },
  { items: ((publicSocialMedia as unknown) as GroupedIcon[]), source: 'public-social-media' },
  { items: ((publicSocialMedia2 as unknown) as GroupedIcon[]), source: 'public-social-media-2' },
  { items: ((publicFluentIcons as unknown) as GroupedIcon[]), source: 'public-fluent-icons' },
]

const merged = new Map<string, GroupedIcon>()
for (const { items, source } of sources) {
  if (!items) continue
  for (const g of items) {
    if (!g || !g.id) continue
    const existing = merged.get(g.id)
    if (!existing) {
      // clone to avoid mutating original imports
      merged.set(g.id, { id: g.id, category: g.category, variants: { ...g.variants } })
      continue
    }

    // merge category if missing
    if (!existing.category && g.category) existing.category = g.category

    // merge variants, avoid overwriting existing variant keys
    for (const [k, v] of Object.entries(g.variants || {})) {
      if (!existing.variants[k]) {
        existing.variants[k] = v as IconVariant
      } else {
        // create a unique variant key using source
        let newKey = `${k}_${source.replace(/[^a-z0-9]/gi, '_')}`
        let i = 1
        while (existing.variants[newKey]) {
          newKey = `${k}_${source.replace(/[^a-z0-9]/gi, '_')}_${i++}`
        }
        existing.variants[newKey] = v as IconVariant
      }
    }
  }
}

export const GROUPED_ICONS: GroupedIcon[] = Array.from(merged.values())

export const ICONS: Doodle[] = GROUPED_ICONS.flatMap((g) =>
  Object.entries(g.variants).map(([style, v]) => ({ id: g.id, category: v.category, style, src: v.src, svg: v.svg, viewBox: v.viewBox })),
)

// Candy Icons (flat list) — used as a separate icon set
export const CANDY_ICONS: Doodle[] = (candyIcons as unknown) as Doodle[]

export const ILLUSTRATIONS: Doodle[] = (illustrations as unknown) as Doodle[]
