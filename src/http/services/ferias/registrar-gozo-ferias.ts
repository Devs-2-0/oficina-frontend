import api from '@/http/api'

export interface RegistrarGozoFeriasRequest {
  id: number
  observacoes?: string
}

export async function registrarGozoFerias(data: RegistrarGozoFeriasRequest): Promise<void> {
  await api.post('/rest/ferias/solicitacao/registrar-gozo', data)
}
