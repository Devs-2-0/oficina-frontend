import api from '@/http/api'
import { FeriasSolicitacao } from './listar-solicitacoes-ferias'

export async function listarSolicitacoesAprovadas(): Promise<FeriasSolicitacao[]> {
  const response = await api.get('/rest/ferias/solicitacao/aprovadas')
  return response.data
}
