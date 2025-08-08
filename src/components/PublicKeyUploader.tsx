import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PublicKeyUploader: React.FC = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [keyName, setKeyName] = useState<string | null>(null);
  const [jwt, setJwt] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const validateKey = (text: string) => {
    const trimmed = text.trim();
    if (/PRIVATE KEY/.test(trimmed) || /BEGIN CERTIFICATE/.test(trimmed)) return false;
    const pemRegex = /-----BEGIN (?:RSA |EC )?PUBLIC KEY-----[\s\S]+?-----END (?:RSA |EC )?PUBLIC KEY-----/;
    const sshRegex = /^(ssh-(rsa|ed25519)|ecdsa-sha2-nistp256)\s+[A-Za-z0-9+/=]+(?:\s+.+)?$/m;
    return pemRegex.test(trimmed) || sshRegex.test(trimmed);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    const text = await file.text();
    if (validateKey(text)) {
      setKeyName(file.name);
      toast({ title: 'Clave pública válida', description: `${file.name} cargada correctamente.` });
    } else {
      setKeyName(null);
      toast({ title: 'Archivo inválido', description: 'El archivo no es una clave pública válida.', variant: 'destructive' });
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    onFiles(e.dataTransfer.files);
  };

  const onSaveJwt = () => {
    if (!jwt.trim()) {
      toast({ title: 'Token vacío', description: 'Ingresa un JWT válido.', variant: 'destructive' });
      return;
    }
    toast({ title: 'JWT guardado', description: 'El token se ha registrado en memoria temporal.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Clave pública y JWT</CardTitle>
        <CardDescription>Sube tu clave pública (.pem/.pub) y agrega tu JWT.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center border rounded-md p-6 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed bg-muted/50'}`}
        >
          <Upload className="h-5 w-5 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Arrastra y suelta tu clave pública aquí, o
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={() => fileRef.current?.click()}
          >
            Seleccionar archivo
          </Button>
          {keyName && <p className="text-xs text-foreground mt-2">Cargado: {keyName}</p>}
          <input
            ref={fileRef}
            type="file"
            accept=".pem,.pub,.txt"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ingresa tu JWT"
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
          />
          <Button type="button" onClick={onSaveJwt}>Guardar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicKeyUploader;
