import api from '@/http/api'

export interface Revisor {
  id: number
  matricula: string
  nome: string
  nome_prestador: string | null
  identificacao: string
  nome_usuario: string
  status: string
  tipo: string
  endereco: string
  bairro: string
  cidade: string
  processo: string | null
  empresa: string | null
  uf: string
  email: string
  data_criacao: string
  data_ultima_atualizacao: string
  data_exclusao: string | null
  grupo: string | null
}

export interface SolicitacaoPorMatricula {
  id: number
  data_revisao: string | null
  motivo_reprovacao: string | null
  observacoes: string
  data_inicio1: string
  dias_corridos1: number
  data_inicio2: string | null
  dias_corridos2: number | null
  data_inicio3: string | null
  dias_corridos3: number | null
  status: 'PENDENTE' | 'APROVADA' | 'REPROVADA'
  periodo: string
  codigo_integracao: string | null
  data_integracao: string | null
  data_criacao: string
  data_ultima_atualizacao: string
  data_exclusao: string | null
  prestador: {
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
  revisor: Revisor | null
}

export async function getSolicitacoesPorMatricula(matricula: string): Promise<SolicitacaoPorMatricula[]> {
  const response = await api.get<SolicitacaoPorMatricula[]>(`/rest/ferias/solicitacao/matricula/${matricula}`)
  return response.data
} 