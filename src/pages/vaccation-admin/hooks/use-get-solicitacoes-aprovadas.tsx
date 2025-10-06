import { useQuery } from '@tanstack/react-query'
import { FeriasSolicitacao } from '@/http/services/ferias/listar-solicitacoes-ferias'
import { listarSolicitacoesAprovadas } from '@/http/services/ferias/listar-solicitacoes-aprovadas'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export function useGetSolicitacoesAprovadas() {
  const query = useQuery<FeriasSolicitacao[]>({
    queryKey: ['solicitacoes-aprovadas'],
    queryFn: listarSolicitacoesAprovadas,
  })

  useEffect(() => {
    if (query.error) {
      const error = query.error as AxiosError
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao buscar solicitações aprovadas de descanso remunerado'
      toast.error(errorMessage)
    }
  }, [query.error])

  return query
}
