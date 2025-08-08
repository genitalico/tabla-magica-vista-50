export interface TransactionRow {
  id: string;
  cuenta_cargo: string;
  importe: number;
  nombre_razon_social_destinatario: string;
  cuenta_destinatario: string;
  divisa: string;
  referencia_numerica: string;
  alias: string;
  concepto_referencia: string;
  iva: number;
  rfc_destinatario: string;
  tipo: string;
}
