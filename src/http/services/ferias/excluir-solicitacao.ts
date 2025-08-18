import api from '@/http/api'

export async function excluirSolicitacao(solicitacaoId: number): Promise<void> {
  await api.delete(`/rest/ferias/solicitacao/${solicitacaoId}`)
}
