// src/pages/Media.tsx — Media library (REST-wired upload)
import { useRef } from 'react';
import { uploadMedia } from '@/services/mediaService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function Media() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      try {
        await uploadMedia(file);
        toast({ title: `${file.name} uploadé` });
      } catch {
        toast({ variant: 'destructive', title: `Erreur upload: ${file.name}` });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ImageIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Médiathèque</h1>
      </div>
      <Card
        className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <CardContent className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <Upload className="h-10 w-10" />
          <p className="font-medium">Cliquez ou glissez un fichier pour l'uploader</p>
          <p className="text-xs">Images, vidéos (max 50 Mo)</p>
        </CardContent>
      </Card>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        <Upload className="h-4 w-4 mr-2" />Uploader un fichier
      </Button>
    </div>
  );
}
