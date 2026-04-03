const fs = require('fs');
const path = require('path');

const BRAND = new Set(['Linkedin', 'Instagram', 'Facebook', 'Twitter']);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}

function processFile(filePath) {
  let s = fs.readFileSync(filePath, 'utf8');
  if (!s.includes('lucide-react')) return false;
  if (![...BRAND].some((b) => new RegExp(`\\b${b}\\b`).test(s))) return false;
  if (filePath.replace(/\\/g, '/').includes('brand-icons')) return false;

  const importRe = /^import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']\s*;?$/gm;
  let changed = false;
  s = s.replace(importRe, (full, inner) => {
    const parts = inner.split(',').map((x) => x.trim()).filter(Boolean);
    const keep = [];
    const take = [];
    for (const p of parts) {
      const base = p.split(/\s+as\s+/)[0].trim();
      if (BRAND.has(base)) take.push(p);
      else keep.push(p);
    }
    if (take.length === 0) return full;
    changed = true;
    const lines = [];
    if (keep.length) lines.push(`import { ${keep.join(', ')} } from "lucide-react";`);
    lines.push(`import { ${take.join(', ')} } from "@/lib/brand-icons";`);
    return lines.join('\n');
  });
  if (changed) fs.writeFileSync(filePath, s);
  return changed;
}

const root = path.join(__dirname, '..', 'src');
let n = 0;
for (const f of walk(root)) {
  if (processFile(f)) n++;
}
console.log('Updated files:', n);
