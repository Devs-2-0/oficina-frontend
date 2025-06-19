import { useQuery } from '@tanstack/react-query'
import { getSolicitacoesPorMatricula } from '@/http/services/ferias/get-solicitacoes-por-matricula'

export function useGetSolicitacoesPorMatricula(matricula: string) {
  return useQuery({
    queryKey: ['solicitacoes-por-matricula', matricula],
    queryFn: () => getSolicitacoesPorMatricula(matricula),
    enabled: !!matricula,
  })
} 