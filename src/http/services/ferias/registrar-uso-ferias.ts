import api from '@/http/api'

export interface RegistrarUsoFeriasRequest {
  observacoes?: string
}

export async function registrarUsoFerias(solicitacaoId: number, data: RegistrarUsoFeriasRequest): Promise<void> {
  await api.post(`/rest/ferias/solicitacao/${solicitacaoId}/registrar-uso`, data)
}

