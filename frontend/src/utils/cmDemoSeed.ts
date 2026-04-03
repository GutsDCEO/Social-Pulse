export interface CMDemoSeedResult {
  success: boolean;
  message: string;
  stats?: { firms: number; publications: number };
}

/** Demo seed désactivé (pas de Supabase) — réponse stable pour l’UI. */
export async function seedCMDemoData(): Promise<CMDemoSeedResult> {
  return {
    success: false,
    message: 'Données de démo non disponibles en mode API REST.',
  };
}

export async function clearCMDemoData(): Promise<CMDemoSeedResult> {
  return { success: true, message: 'Rien à supprimer.' };
}

export async function runCMDemoSeed(): Promise<void> {
  return;
}
