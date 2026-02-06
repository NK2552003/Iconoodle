#!/usr/bin/env node
/*
  generate-json.js

  Scans the `public/` folder and generates JSON files for leaf folders containing SVGs.

  Rules:
  - If path includes "Human" (case-insensitive) -> collect all SVGs under that folder into a single `lib/human.json` file (illustration format array)
  - If path contains "illustration" (case-insensitive) -> use illustration format (like `illustrations.json`)
  - If a leaf folder contains variant subfolders (e.g., "Color", "Black", "White"), treat it as icons and group by base filename into an entry with `variants`
  - Otherwise, treat folder as illustrations (illustration format)

  Outputs are written to `lib/generated/<kebab-path>.json` (one per leaf) and `lib/human.json` (single file)

  Usage: node scripts/generate-json.js [--public ./public] [--out ./lib/generated] [--dry]
*/

const fs = require('fs').promises;
const {existsSync} = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opts = {
  publicDir: (args[args.indexOf('--public') + 1]) || path.resolve(process.cwd(), 'public'),
  outDir: (args[args.indexOf('--out') + 1]) || path.resolve(process.cwd(), 'lib', 'generated'),
  dry: args.includes('--dry')
};

function kebab(s) {
  return s.replace(/\\/g, '/').split('/').filter(Boolean).join('-').replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
}

async function walk(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const nested = await walk(full);
      files.push(...nested);
    } else {
      files.push(full);
    }
  }
  return files;
}

async function listDirsWithSvg(root) {
  const dirs = new Map();
  async function recurse(dir) {
    const entries = await fs.readdir(dir, {withFileTypes: true});
    let hasSvg = false;
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        await recurse(full);
      } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.svg')) {
        hasSvg = true;
      }
    }
    // consider leaf dirs: directory that contains svg files OR contains subdirs with SVGs BUT we still want to emit for leafs (directories that have svg files directly)
    if (hasSvg) {
      dirs.set(dir, true);
    }
  }
  await recurse(root);
  return Array.from(dirs.keys());
}

async function readSvg(fullPath) {
  const src = await fs.readFile(fullPath, 'utf8');
  const svgText = src.trim();
  const m = svgText.match(/viewBox=\"([^\"]+)\"/i);
  const viewBox = m ? m[1] : null;
  // create src path relative to public root (leading slash)
  return {svg: svgText, viewBox};
}

function styleKeyFromFolder(name) {
  const n = name.toLowerCase();
  if (n === 'color') return {key: 'ICON', category: 'color', style: 'ICON'};
  if (n === 'black') return {key: 'BLACK', category: 'black', style: 'BLACK'};
  if (n === 'white') return {key: 'WHITE', category: 'white', style: 'WHITE'};
  // fallback: uppercase name as key
  return {key: name.toUpperCase(), category: name.toLowerCase(), style: name.toUpperCase()};
}

async function generateForFolder(folder, publicRoot, outDir, isHuman) {
  // detect if folder contains variant subfolders
  const entries = await fs.readdir(folder, {withFileTypes: true});
  const subdirs = entries.filter(e => e.isDirectory()).map(d => d.name);
  const svgFilesHere = entries.filter(e => e.isFile() && e.name.toLowerCase().endsWith('.svg')).map(e => e.name);

  const isIllustration = /illustration/i.test(folder) || svgFilesHere.length > 0 && subdirs.length === 0;
  const isIconVariants = subdirs.length > 0 && subdirs.some(sd => {
    // variant subfolders like Color, Black, White or typical style folders
    const n = sd.toLowerCase();
    return ['color','black','white','icon','icons'].includes(n) || (/^[a-z]+$/i.test(sd));
  });

  if (isHuman) {
    // collect all svg files recursively under folder and write a single JSON array in illustration format
    const allFiles = await walk(folder);
    const svgs = allFiles.filter(f => f.toLowerCase().endsWith('.svg'));
    const items = [];
    for (const f of svgs) {
      const rel = '/' + path.relative(publicRoot, f).split(path.sep).join('/');
      const {svg, viewBox} = await readSvg(f);
      items.push({id: path.basename(f, '.svg'), category: 'Illustration', style: 'ILLUSTRATION', src: rel, svg, viewBox});
    }
    const outFile = path.join(path.dirname(outDir), 'human.json');
    if (!opts.dry) {
      await fs.mkdir(path.dirname(outFile), {recursive:true});
      await fs.writeFile(outFile, JSON.stringify(items, null, 2));
    }
    return [{outFile, count: items.length}];
  }

  if (isIconVariants) {
    // read each subfolder's svg files and group by base name
    const variantsMap = new Map();
    for (const sd of subdirs) {
      const sdFull = path.join(folder, sd);
      const files = (await fs.readdir(sdFull, {withFileTypes:true})).filter(e => e.isFile() && e.name.toLowerCase().endsWith('.svg'));
      if (files.length === 0) continue;
      const style = styleKeyFromFolder(sd);
      for (const f of files) {
        const base = path.basename(f.name, '.svg');
        const entryKey = base;
        if (!variantsMap.has(entryKey)) variantsMap.set(entryKey, {id: base, category: path.basename(folder), variants: {}});
        const rel = '/' + path.relative(publicRoot, path.join(sdFull, f.name)).split(path.sep).join('/');
        const {svg, viewBox} = await readSvg(path.join(sdFull, f.name));
        variantsMap.get(entryKey).variants[style.key] = {category: style.category, style: style.style, src: rel, svg, viewBox};
      }
    }

    // write each base as object in array
    const items = Array.from(variantsMap.values());
    const name = kebab(path.relative(publicRoot, folder) || path.basename(folder));
    const outFile = path.join(outDir, `${name}.json`);
    if (!opts.dry) {
      await fs.mkdir(outDir, {recursive:true});
      await fs.writeFile(outFile, JSON.stringify(items, null, 2));
    }
    return [{outFile, count: items.length}];
  }

  // fallback: illustration format for the svg files directly in folder
  const files = svgFilesHere;
  const items = [];
  for (const f of files) {
    const full = path.join(folder, f);
    const rel = '/' + path.relative(publicRoot, full).split(path.sep).join('/');
    const {svg, viewBox} = await readSvg(full);
    items.push({id: path.basename(f, '.svg'), category: 'Illustration', style: 'ILLUSTRATION', src: rel, svg, viewBox});
  }
  const name = kebab(path.relative(publicRoot, folder) || path.basename(folder));
  const outFile = path.join(outDir, `${name}.json`);
  if (!opts.dry) {
    await fs.mkdir(outDir, {recursive:true});
    await fs.writeFile(outFile, JSON.stringify(items, null, 2));
  }
  return [{outFile, count: items.length}];
}

async function main() {
  const publicRoot = path.resolve(opts.publicDir);
  const outDir = path.resolve(opts.outDir);

  if (!existsSync(publicRoot)) {
    console.error('Public folder not found:', publicRoot);
    process.exit(1);
  }

  const leafDirs = await listDirsWithSvg(publicRoot);

  // ensure output dir
  if (!opts.dry) await fs.mkdir(outDir, {recursive:true});

  // handle Human specially
  const humanRoot = leafDirs.find(d => /\\bHuman\\b/i.test(d) || /\\bHuman\//i.test(d));
  const reports = [];
  if (humanRoot) {
    const r = await generateForFolder(humanRoot, publicRoot, outDir, true);
    reports.push(...r);
  }

  // process other leaf dirs (skip ones under Human)
  const other = leafDirs.filter(d => !(humanRoot && d.startsWith(humanRoot)));
  for (const folder of other) {
    const report = await generateForFolder(folder, publicRoot, outDir, false);
    reports.push(...report);
  }

  console.log('\nGeneration complete. Reports:');
  for (const r of reports) console.log(' -', r.outFile, 'items:', r.count);
  console.log('\nFiles written to', outDir, opts.dry ? '(dry run, nothing written)' : '');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
