import { useQuery } from '@tanstack/react-query'
import { PeriodoAquisitivo, verificarPeriodoAquisitivo } from '@/http/services/ferias/verificar-periodo-aquisitivo'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export function useVerificarPeriodoAquisitivo() {
  const query = useQuery<PeriodoAquisitivo>({
    queryKey: ['periodo-aquisitivo'],
    queryFn: verificarPeriodoAquisitivo,
  })

  useEffect(() => {
    if (query.error) {
      const error = query.error as AxiosError
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao buscar períodos de férias'
      toast.error(errorMessage)
    }
  }, [query.error])

  return query
} 