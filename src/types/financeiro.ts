import { Usuario } from "@/http/services/usuario/listar-usuarios"

export interface ItemFinanceiro {
  codigo: string
  descricao: string
  referencia: string
  proventos: number
  descontos: number
}

export interface Financeiro {
  id: number
  processo: string
  competencia: string
  nro_pagamento: string
  tipo: 'Pagamento' | 'Adiantamento' | 'Reembolso' | 'Outros'
  valor: string
  data_baixa: string
  prestador: Usuario
  data_criacao: Date
  data_ultima_atualizacao: Date
  status: 'Pendente' | 'Pago' | 'Cancelado'
  itens: ItemFinanceiro[]
} 