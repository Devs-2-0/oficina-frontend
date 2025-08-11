export interface Usuario {
  id: number
  nome: string
  email?: string
  matricula?: string
  tipo?: string
  grupo?: string
}

export interface RegistroFinanceiro {
  cod_atividade: string
  cod_verba: string
  valor: string | number
  periodo: string
  roteiro: string
  descricao: string
  tipo: string // '1' provento, '2' desconto, '3' base(provento), '4' base(desconto)
  atividade: string
  data_criacao: string | Date
  data_ultima_atualizacao: string | Date
  data_exclusao?: string | Date | null
}

export interface Financeiro {
  id_prestador: number
  periodo: string
  prestador: Usuario
  baixado?: boolean
  baixado_em?: string | Date | null
  baixado_por?: Usuario | null
  registros_financeiros?: RegistroFinanceiro[]
  nome_arquivo?: string | null
  caminho_arquivo?: string | null
  data_criacao: string | Date
  data_ultima_atualizacao: string | Date
  data_exclusao?: string | Date | null
}