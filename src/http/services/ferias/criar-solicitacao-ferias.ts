import api from '@/http/api'

export interface PeriodoSolicitacao {
  dias_corridos: number
  data_inicio: string
}

export interface CriarSolicitacaoFeriasRequest {
  prestadorId: number
  periodo: string
  periodos: PeriodoSolicitacao[]
  observacoes: string
}

export async function criarSolicitacaoFerias(data: CriarSolicitacaoFeriasRequest) {
  const response = await api.post('/rest/ferias/solicitacao', data)
  return response.data
} 