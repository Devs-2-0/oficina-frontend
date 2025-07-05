import { useQuery } from '@tanstack/react-query'
import { getSolicitacoesPorMatricula } from '@/http/services/ferias/get-solicitacoes-por-matricula'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export function useGetSolicitacoesPorMatricula(matricula: string) {
  const query = useQuery({
    queryKey: ['solicitacoes-por-matricula', matricula],
    queryFn: () => getSolicitacoesPorMatricula(matricula),
    enabled: !!matricula,
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