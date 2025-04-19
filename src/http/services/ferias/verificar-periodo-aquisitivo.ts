import api from '@/http/api'

export interface PeriodoAquisitivo {
  inicio: string
  fim: string
  saldo_dias: number
  status: 'DISPONIVEL' | 'INDISPONIVEL'
  motivo?: string
}

export async function verificarPeriodoAquisitivo(): Promise<PeriodoAquisitivo> {
  const response = await api.get('/rest/ferias/periodo-aquisitivo')
  return response.data
} 