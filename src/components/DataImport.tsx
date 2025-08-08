import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TransactionRow } from '@/types/transactions';

type Props = { onImport: (rows: TransactionRow[]) => void };

const DataImport: React.FC<Props> = ({ onImport }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseRows = (text: string): TransactionRow[] => {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) throw new Error('El archivo no contiene datos.');
    const rows: TransactionRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i].trim();
      if (!raw) continue;
      const cols = raw.split('|');
      if (cols.length < 11) throw new Error(`Línea ${i + 1} inválida: se esperaban 11 columnas.`);
      const normalizeDivisa = (v: string) => {
        const up = v.trim().toUpperCase();
        if (up === 'MXP') return 'MXN';
        const allowed = ['MXN', 'USD', 'EUR', 'CAD'];
        return allowed.includes(up) ? up : 'MXN';
      };
      const allowedTipos = ['Transferencia', 'Pago', 'Depósito', 'Retiro'];
      const tipo = cols[10]?.trim() || 'Transferencia';
      rows.push({
        id: `${Date.now()}-${i}`,
        cuenta_cargo: cols[0]?.trim() || '',
        importe: parseFloat(cols[1]) || 0,
        nombre_razon_social_destinatario: cols[2]?.trim() || '',
        cuenta_destinatario: cols[3]?.trim() || '',
        divisa: normalizeDivisa(cols[4] || 'MXN'),
        referencia_numerica: (cols[5] || '').trim(),
        alias: (cols[6] || '').trim(),
        concepto_referencia: (cols[7] || '').trim(),
        iva: parseFloat(cols[8]) || 0,
        rfc_destinatario: (cols[9] || '').trim(),
        tipo: allowedTipos.includes(tipo) ? tipo : 'Transferencia',
      });
    }
    return rows;
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    const text = await file.text();
    try {
      const parsed = parseRows(text);
      setFileName(file.name);
      onImport(parsed);
    } catch (err: any) {
      toast({ title: 'Error al importar', description: err?.message || 'No se pudo procesar el archivo.', variant: 'destructive' });
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    onFiles(e.dataTransfer.files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Importar transacciones</CardTitle>
        <CardDescription>Sube un archivo con formato delimitado por |. La primera línea debe ser el encabezado.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center border rounded-md p-6 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed bg-muted/50'}`}
        >
          <Upload className="h-5 w-5 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Arrastra y suelta el archivo aquí, o
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={() => fileRef.current?.click()}
          >
            Seleccionar archivo
          </Button>
          {fileName && <p className="text-xs text-foreground mt-2">Seleccionado: {fileName}</p>}
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.csv"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <div className="w-full overflow-x-auto mt-4">
            <code className="text-xs text-muted-foreground whitespace-pre break-words">
              columnas: cuenta_cargo|importe|nombre/razon_social_destinatario|cuenta_destinatario|divisa|referncia_numerica|alias|concepto_referencia|iva|rfc_destinatario|tipo
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImport;
