#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
(async ()=>{
  const dir = path.resolve(process.cwd(), 'lib', 'generated');
  const files = (await fs.readdir(dir)).filter(f => /^human-muscular-system-view-.*\.json$/.test(f));
  if(files.length === 0){
    console.error('No view files found in', dir);
    process.exit(1);
  }
  const combined = [];
  for(const f of files){
    const full = path.join(dir, f);
    try{
      const data = await fs.readFile(full, 'utf8');
      const parsed = JSON.parse(data);
      if(Array.isArray(parsed)) combined.push(...parsed);
      else if(parsed && typeof parsed === 'object') combined.push(parsed);
    }catch(err){
      console.error('Failed to read/parse', full, err.message);
    }
  }
  const outFile = path.join(dir, 'human-muscular-system-views.json');
  await fs.writeFile(outFile, JSON.stringify(combined, null, 2));
  // remove original files
  for(const f of files){
    const full = path.join(dir, f);
    await fs.unlink(full);
  }
  console.log('Wrote', outFile, 'items:', combined.length, 'and removed', files.length, 'files');
})();