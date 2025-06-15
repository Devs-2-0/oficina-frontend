import { useQuery } from '@tanstack/react-query'
import { FeriasSolicitacao, listarSolicitacoesFerias } from '@/http/services/ferias/listar-solicitacoes-ferias'

export function useGetSolicitacoesFerias() {
  return useQuery<FeriasSolicitacao[]>({
    queryKey: ['solicitacoes-ferias'],
    queryFn: listarSolicitacoesFerias,
  })
} 