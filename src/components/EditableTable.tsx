import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PublicKeyUploader from '@/components/PublicKeyUploader';
import DataImport from '@/components/DataImport';
import type { TransactionRow } from '@/types/transactions';

// moved TransactionRow type to '@/types/transactions'

const CURRENCIES = ['MXN', 'USD', 'EUR', 'CAD'];
const TRANSACTION_TYPES = ['Transferencia', 'Pago', 'Depósito', 'Retiro'];

const EditableTable: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<TransactionRow[]>([
    {
      id: '1',
      cuenta_cargo: '4152313712345678',
      importe: 5000.00,
      nombre_razon_social_destinatario: 'Juan Pérez García',
      cuenta_destinatario: '4152313787654321',
      divisa: 'MXN',
      referencia_numerica: '20240001',
      alias: 'Nomina Enero',
      concepto_referencia: 'Pago de nómina enero 2024',
      iva: 0.00,
      rfc_destinatario: 'PEGJ850101ABC',
      tipo: 'Transferencia'
    }
  ]);

  const addRow = () => {
    const newRow: TransactionRow = {
      id: Date.now().toString(),
      cuenta_cargo: '',
      importe: 0,
      nombre_razon_social_destinatario: '',
      cuenta_destinatario: '',
      divisa: 'MXN',
      referencia_numerica: '',
      alias: '',
      concepto_referencia: '',
      iva: 0,
      rfc_destinatario: '',
      tipo: 'Transferencia'
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
    toast({
      title: "Fila eliminada",
      description: "La transacción ha sido eliminada exitosamente.",
    });
  };

  const updateRow = (id: string, field: keyof TransactionRow, value: string | number) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = () => {
    toast({
      title: "Datos guardados",
      description: "Todas las transacciones han sido guardadas exitosamente.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exportando datos",
      description: "Los datos se están descargando en formato CSV.",
    });
  };

  const handleImportRows = (imported: TransactionRow[]) => {
    setRows(imported);
    toast({
      title: "Datos cargados",
      description: `${imported.length} transacciones importadas.`,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            Tabla de Transacciones Financieras
          </CardTitle>
          <CardDescription>
            Gestiona y edita las transacciones bancarias de forma eficiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <Button onClick={addRow} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Fila
            </Button>
            <Button variant="secondary" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <PublicKeyUploader />
            <DataImport onImport={handleImportRows} />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-table-header border-b">
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[120px]">Cuenta Cargo</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[100px]">Importe</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[200px]">Nombre/Razón Social</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[150px]">Cuenta Destinatario</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[80px]">Divisa</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[120px]">Ref. Numérica</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[100px]">Alias</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[200px]">Concepto</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[80px]">IVA</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[120px]">RFC Destinatario</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[100px]">Tipo</th>
                    <th className="text-left p-3 font-semibold text-sm text-foreground min-w-[80px]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-table-row-hover transition-colors">
                      <td className="p-2">
                        <Input
                          value={row.cuenta_cargo}
                          onChange={(e) => updateRow(row.id, 'cuenta_cargo', e.target.value)}
                          placeholder="1234567890123456"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={row.importe}
                          onChange={(e) => updateRow(row.id, 'importe', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          step="0.01"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.nombre_razon_social_destinatario}
                          onChange={(e) => updateRow(row.id, 'nombre_razon_social_destinatario', e.target.value)}
                          placeholder="Nombre completo"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.cuenta_destinatario}
                          onChange={(e) => updateRow(row.id, 'cuenta_destinatario', e.target.value)}
                          placeholder="1234567890123456"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Select value={row.divisa} onValueChange={(value) => updateRow(row.id, 'divisa', value)}>
                          <SelectTrigger className="min-w-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.referencia_numerica}
                          onChange={(e) => updateRow(row.id, 'referencia_numerica', e.target.value)}
                          placeholder="20240001"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.alias}
                          onChange={(e) => updateRow(row.id, 'alias', e.target.value)}
                          placeholder="Alias corto"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.concepto_referencia}
                          onChange={(e) => updateRow(row.id, 'concepto_referencia', e.target.value)}
                          placeholder="Descripción del pago"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={row.iva}
                          onChange={(e) => updateRow(row.id, 'iva', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          step="0.01"
                          className="min-w-0"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.rfc_destinatario}
                          onChange={(e) => updateRow(row.id, 'rfc_destinatario', e.target.value)}
                          placeholder="XAXX010101000"
                          className="min-w-0"
                          maxLength={13}
                        />
                      </td>
                      <td className="p-2">
                        <Select value={row.tipo} onValueChange={(value) => updateRow(row.id, 'tipo', value)}>
                          <SelectTrigger className="min-w-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TRANSACTION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRow(row.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {rows.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-4">No hay transacciones registradas</p>
              <Button onClick={addRow} className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Primera Transacción
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableTable;