import { useQuery } from '@tanstack/react-query'
import { Ferias, listarFerias } from '@/http/services/ferias/listar-ferias'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export function useGetFerias() {
  const query = useQuery<Ferias[]>({
    queryKey: ['ferias'],
    queryFn: listarFerias,
  })

  useEffect(() => {
    if (query.error) {
      const error = query.error as AxiosError
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao buscar férias'
      toast.error(errorMessage)
    }
  }, [query.error])

  return query
} 