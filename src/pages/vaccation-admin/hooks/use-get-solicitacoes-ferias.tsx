import { useQuery } from '@tanstack/react-query'
import { FeriasSolicitacao, listarSolicitacoesFerias } from '@/http/services/ferias/listar-solicitacoes-ferias'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export function useGetSolicitacoesFerias() {
  const query = useQuery<FeriasSolicitacao[]>({
    queryKey: ['solicitacoes-ferias'],
    queryFn: listarSolicitacoesFerias,
  })

  useEffect(() => {
    if (query.error) {
      const error = query.error as AxiosError
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao buscar solicitações de férias'
      toast.error(errorMessage)
    }
  }, [query.error])

  return query
} 