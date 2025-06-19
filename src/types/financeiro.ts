export interface Usuario {
  id: number
  nome: string
  email: string
  matricula: string
  tipo: string
  grupo?: string
}

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
  valor: number
  data_pagamento: string
  status: string
  observacoes?: string
  prestador: Usuario
  data_criacao: Date
  data_ultima_atualizacao: Date
  itens: ItemFinanceiro[]
} 