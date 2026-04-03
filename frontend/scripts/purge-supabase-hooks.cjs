/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const hooksRoot = path.join(__dirname, '..', 'src', 'hooks');

/** Minimal stubs: named exports must match what pages import. */
const STUBS = {
  'useUserRole.tsx': `import { useSimpleRole } from './useSimpleRole';
import type { SimpleRoleState } from './useSimpleRole';

export type SPRole = 'community_manager' | 'lawyer' | 'super_admin';

export function useUserRole(): SimpleRoleState & {
  primaryRole: string | null;
  roles: string[];
  canValidatePublications: boolean;
  canRejectPublications: boolean;
  canEditOwnContent: boolean;
  canEditAllCabinetContent: boolean;
  canCreatePublications: boolean;
  isSuperAdmin: boolean;
} {
  const s = useSimpleRole();
  return {
    ...s,
    primaryRole: s.effectiveRole,
    roles: s.effectiveRole ? [s.effectiveRole] : [],
    canValidatePublications: s.canValidateContent,
    canRejectPublications: s.canRejectContent,
    canEditOwnContent: s.canEditContent,
    canEditAllCabinetContent: s.isLawyer || s.isAdmin,
    canCreatePublications: s.canCreateContent,
    isSuperAdmin: s.isAdmin,
  };
}
`,
};

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(e.name)) files.push(p);
  }
  return files;
}

const all = walk(hooksRoot);
let n = 0;
for (const file of all) {
  const rel = path.relative(hooksRoot, file).replace(/\\/g, '/');
  const base = path.basename(file);
  const content = fs.readFileSync(file, 'utf8');
  if (base === 'usePublications.tsx') continue;

  if (
    !content.includes('@/integrations/supabase/client') &&
    !content.includes('@supabase/supabase-js')
  ) {
    continue;
  }
  if (STUBS[base]) {
    fs.writeFileSync(file, STUBS[base], 'utf8');
    n++;
    console.log('stubbed (custom)', rel);
    continue;
  }
  const name = base.replace(/\.tsx?$/, '');
  const exportName = name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  const stub = `// Stub: Supabase removed — return empty data for REST MVP.
export function ${exportName}() {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {},
  };
}
`;
  fs.writeFileSync(file, stub, 'utf8');
  n++;
  console.log('stubbed', rel);
}
console.log('Total stubbed:', n);
