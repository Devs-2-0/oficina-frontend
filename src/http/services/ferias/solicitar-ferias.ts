import api from '@/http/api'

interface Periodo {
  data_inicio: string
  data_termino: string
  total_dias: number
}

export interface SolicitacaoFeriasInput {
  periodos: Periodo[]
  abono_pecuniario: boolean
  dias_vendidos: number
  adiantamento_decimo_terceiro: boolean
  observacoes?: string
}

export async function solicitarFerias(dados: SolicitacaoFeriasInput) {
  const response = await api.post('/rest/ferias', dados)
  return response.data
} 