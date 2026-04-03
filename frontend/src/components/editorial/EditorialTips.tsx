import type { SocialPlatform } from '@/hooks/usePublications';

interface EditorialTipsProps {
  className?: string;
}

export function EditorialTips({ className }: EditorialTipsProps) {
  return (
    <p className={className ? className : 'text-sm text-muted-foreground'}>
      Conseils éditoriaux : adaptez le ton à votre audience et citez vos sources.
    </p>
  );
}

/** Compact tips row for preview panels. */
export function EditorialTipsInline({ platform: _platform }: { platform: SocialPlatform }) {
  return (
    <p className="text-xs text-muted-foreground border-t pt-2 mt-2">
      Pensez à un accroche claire et à un appel à l&apos;action adapté à votre barreau.
    </p>
  );
}
