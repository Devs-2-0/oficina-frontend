import api from '@/http/api'

export interface Prestador {
  id: number
  matricula: string
  nome: string
  nome_prestador: string
  identificacao: string
  nome_usuario: string
  status: string
  tipo: string
  endereco: string
  bairro: string
  cidade: string
  processo: string
  empresa: string
  uf: string
  email: string
  data_criacao: string
  data_ultima_atualizacao: string
  data_exclusao: string | null
  grupo: string | null
}

export interface PeriodoElegivel {
  matricula: string
  prestador: Prestador
  nome: string
  dataAdmissao: string
  inicioPeriodo: string
  fimPeriodo: string
  diasVencidos: number
  diasProporcionais: number
  diasPagos: number
}

export async function getPeriodoElegivel(matricula: string): Promise<PeriodoElegivel[]> {
  const response = await api.get<PeriodoElegivel[]>(`/rest/ferias/periodo/${matricula}`)
  return response.data
} 