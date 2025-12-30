export type ExportFormat = "SVG" | "TSX" | "JSX" | "VUE" | "SVELTE" | "ASTRO" | "REACT_NATIVE" | "BASE64"

function sanitizeSvgForJsx(raw: string) {
  // strip xml declaration
  let s = raw.replace(/<\?xml[\s\S]*?\?>\s*/g, "")

  // Inline <style> parsing: extract class rules and then remove the style block
  const classRules: Record<string, Record<string, string>> = {}
  const styleMatch = s.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  if (styleMatch && styleMatch[1]) {
    const css = styleMatch[1]
    const ruleRegex = /(\.[A-Za-z0-9_-]+)\s*\{([^}]+)\}/g
    let m: RegExpExecArray | null
    while ((m = ruleRegex.exec(css))) {
      const cls = m[1].slice(1)
      const decls = (m[2] || "").split(";").map((d) => d.trim()).filter(Boolean)
      classRules[cls] = {}
      decls.forEach((d) => {
        const [prop, val] = d.split(":").map((p) => p && p.trim())
        if (prop && val) {
          classRules[cls][prop] = val
        }
      })
    }
    // remove the entire style block
    s = s.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  }

  // Replace class attributes by inlining properties from class rules (if present)
  s = s.replace(/(class(Name)?=)("[^"]+"|'[^']+')/g, (match, _eq, _name, quoted) => {
    // quoted should be the captured value like "cls-3" or 'cls-3'
    if (!quoted) return ''
    const content = quoted.slice(1, -1)
    const classes = content.split(/\s+/).filter(Boolean)
    let attrs = ""
    classes.forEach((c: string) => {
      const rules = classRules[c]
      if (rules) {
        for (const [prop, val] of Object.entries(rules)) {
          // convert property names to attribute form (keep as-is, later replacements will camelCase where needed)
          const safeVal = val.replace(/"/g, '&quot;')
          attrs += ` ${prop}="${safeVal}"`
        }
      }
    })
    return attrs
  })

  // common attribute fixes
  s = s.replace(/class=/g, "className=")
  s = s.replace(/xmlns:xlink/g, "xmlnsXlink")
  s = s.replace(/xlink:href/g, "xlinkHref")
  s = s.replace(/fill-rule/g, "fillRule")
  s = s.replace(/clip-rule/g, "clipRule")
  s = s.replace(/stroke-width/g, "strokeWidth")
  s = s.replace(/stroke-linecap/g, "strokeLinecap")
  s = s.replace(/stroke-linejoin/g, "strokeLinejoin")
  s = s.replace(/stroke-miterlimit/g, "strokeMiterlimit")
  // remove inline style attributes to avoid TSX prop type issues
  s = s.replace(/\sstyle="[^"]*"/g, "")
  return s
}

export function convertSvgToFormat(svg: string, format: ExportFormat, name: string): string {
  const componentName = name
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")

  switch (format) {
    case "TSX": {
      const jsx = sanitizeSvgForJsx(svg)
      return `import React from 'react';

export const ${componentName}Icon = () => (
  ${jsx}
);`
    }

    case "JSX": {
      const jsx = sanitizeSvgForJsx(svg)
      return `export const ${componentName}Icon = () => (
  ${jsx}
);`
    }

    case "VUE": {
      const tpl = svg.replace(/<\?xml[\s\S]*?\?>\s*/g, "")
      return `<template>\n  ${tpl}\n</template>\n\n<script>\nexport default {\n  name: '${componentName}Icon'\n}\n</script>`
    }

    case "SVELTE": {
      // Svelte accepts raw SVG
      return svg.replace(/<\?xml[\s\S]*?\?>\s*/g, "")
    }

    case "ASTRO": {
      const tpl = svg.replace(/<\?xml[\s\S]*?\?>\s*/g, "")
      return `---\n---\n${tpl}`
    }

    case "REACT_NATIVE": {
      // Remove xml declaration, style blocks, and class attributes, then convert tags/attrs for react-native-svg
      let rnSvg = svg.replace(/<\?xml[\s\S]*?\?>\s*/g, "")
      rnSvg = rnSvg.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      rnSvg = rnSvg.replace(/\s(class|className)=("[^"]*"|'[^']*')/gi, "")
      // remove xmlns declarations (not needed in RN)
      rnSvg = rnSvg.replace(/\sxmlns(:\w+)?="[^"]*"/gi, "")
      rnSvg = rnSvg
        .replace(/<svg/g, "<Svg")
        .replace(/<\/svg>/g, "</Svg>")
        .replace(/<path/g, "<Path")
        .replace(/<\/path>/g, "</Path>")
        .replace(/<circle/g, "<Circle")
        .replace(/<\/circle>/g, "</Circle>")
        .replace(/<rect/g, "<Rect")
        .replace(/<\/rect>/g, "</Rect>")
        // camelCase attributes
        .replace(/fill-rule/g, "fillRule")
        .replace(/clip-rule/g, "clipRule")
        .replace(/stroke-width/g, "strokeWidth")
        .replace(/stroke-linecap/g, "strokeLinecap")
        .replace(/stroke-linejoin/g, "strokeLinejoin")
        .replace(/stroke-miterlimit/g, "strokeMiterlimit")
        .replace(/style="[^"]*"/g, "")

      return `import React from 'react';\nimport Svg, { Path, Circle, Rect } from 'react-native-svg';\n\nexport const ${componentName}Icon = () => (\n  ${rnSvg}\n);`
    }

    case "BASE64": {
      const stripped = svg.replace(/<\?xml[\s\S]*?\?>\s*/g, "")
      return `data:image/svg+xml;base64,${btoa(stripped)}`
    }

    case "SVG":
    default:
      return svg
  }
}
