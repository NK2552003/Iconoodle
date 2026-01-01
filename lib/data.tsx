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
import doodles3 from './doodles-3.json'
import natureDoodles from './nature-doodles.json'
import groupedIcons from './icons.json'
import candyIcons from './candy-icons.json'
import handdrawnIcons from './handdrawn-icons.json'
import handdrawnType2Icons from './handdrawn-type-2-icons.json'
import handmadeDoodledIcons from './handmade-doodled-icons.json'
import illustrations from './illustrations.json' 
import publicCoolicons from './public-coolicons.json'
import publicIconly from './public-iconly.json'
import publicSmooothIcons from './public-smoooth-icons.json'
import publicSocialMedia from './public-social-media.json'
import publicSocialMedia2 from './public-social-media-2.json'
import publicFluentIcons from './public-fluent-icons.json'
import threeDLikeShapeDoodles from './3d-like-shape-doodles.json'
import carsIcons from './cars-icons.json'
import naturalStampingElements from './natural-stamping-elements.json'
import christmasIllustration from './christmas-illustration.json'
import funnyCharacterIllustrations from './funny-character-illustrations.json'
import racingIllustrations from './racing-illustrations.json'
import valentinesIllustration from './valentines-illustration.json'
import wireframeDoodles from './wireframe-doodles.json'

// Normalize only the core `doodles.json` into top-level `simple-doodles` (keep its original category as `subcategory`)
// All other `doodles-*` files remain as their own top-level categories
const _toSimple = (arr: any[] | undefined) => (arr || []).map((d: any) => ({ ...(d || {}), subcategory: d?.category, category: 'simple-doodles' }))
const _asArray = (arr: any[] | undefined) => arr || []
// Ensure files that don't include a top-level `category` get one (used for sidebar grouping)
const _withCategory = (arr: any[] | undefined, cat: string) => (arr || []).map((d: any) => ({ ...(d || {}), category: d?.category ?? cat }))


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
  ..._withCategory((doodles3 as unknown) as Doodle[], 'doodles-3'),
  ..._withCategory((natureDoodles as unknown) as Doodle[], 'nature-doodles'),
  ..._withCategory((threeDLikeShapeDoodles as unknown) as Doodle[], '3d-like-shape-doodles'),
  ..._withCategory((wireframeDoodles as unknown) as Doodle[], 'wireframe-doodles'),
] as Doodle[]

// Keep backward-compatible flat array available as `ICONS` for components that expect it
// Include handdrawn icons and public-folder icons so they show up in the Icons view and sidebar categories
// Merge groups by `id` so variants from different sources combine under the same grouped icon
const sources: Array<{ items: GroupedIcon[]; source: string }> = [
  { items: (groupedIcons as unknown) as GroupedIcon[], source: 'icons' },
  { items: ((handdrawnIcons as unknown) as GroupedIcon[]), source: 'handdrawn' },
  { items: ((handdrawnType2Icons as unknown) as GroupedIcon[]), source: 'handdrawn-type-2' },
  { items: ((handmadeDoodledIcons as unknown) as GroupedIcon[]), source: 'handmade-doodled' },
  { items: ((publicCoolicons as unknown) as GroupedIcon[]), source: 'public-coolicons' },
  { items: ((publicIconly as unknown) as GroupedIcon[]), source: 'public-iconly' },
  { items: ((publicSmooothIcons as unknown) as GroupedIcon[]), source: 'public-smoooth-icons' },
  { items: ((publicSocialMedia as unknown) as GroupedIcon[]), source: 'public-social-media' },
  { items: ((publicSocialMedia2 as unknown) as GroupedIcon[]), source: 'public-social-media-2' },
  { items: ((publicFluentIcons as unknown) as GroupedIcon[]), source: 'public-fluent-icons' },
  { items: (carsIcons as unknown) as GroupedIcon[], source: 'cars-icons' },
  { items: (naturalStampingElements as unknown) as GroupedIcon[], source: 'natural-stamping-elements' },
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

// Normalize illustration imports (handle both flat Doodle[] and grouped-style sources with `variants`)
const _toDoodleArray = (arr: any[] | undefined, defaultCat?: string) => {
  if (!arr) return []
  // grouped format (id + variants)
  if (arr.length && (arr[0] as any).variants) {
    return (arr as any[]).flatMap((g: any) => Object.entries(g.variants || {}).map(([style, v]: any) => ({
      id: g.id,
      category: g.category ?? defaultCat ?? '',
      style: v.style ?? style,
      src: v.src ?? '',
      svg: v.svg ?? '',
      viewBox: v.viewBox ?? '',
    }))) as Doodle[]
  }
  return arr as Doodle[]
}

export const ILLUSTRATIONS: Doodle[] = [
  ..._toDoodleArray((illustrations as unknown) as any[],'illustrations'),
  ..._toDoodleArray((christmasIllustration as unknown) as any[],'christmas-illustration'),
  ..._toDoodleArray((funnyCharacterIllustrations as unknown) as any[],'funny-character-illustrations'),
  ..._toDoodleArray((racingIllustrations as unknown) as any[],'racing-illustrations'),
  ..._toDoodleArray((valentinesIllustration as unknown) as any[],'valentines-illustration'),
] as Doodle[]
