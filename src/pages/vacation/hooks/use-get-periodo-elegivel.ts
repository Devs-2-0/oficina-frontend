import { useQuery } from '@tanstack/react-query'
import { getPeriodoElegivel } from '@/http/services/ferias/get-periodo-elegivel'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useEffect } from 'react'

export function useGetPeriodoElegivel(matricula: string) {
  const query = useQuery({
    queryKey: ['periodo-elegivel', matricula],
    queryFn: () => getPeriodoElegivel(matricula),
    enabled: !!matricula,
  })

  useEffect(() => {
    if (query.error) {
      const error = query.error as AxiosError
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao buscar períodos elegíveis'
      toast.error(errorMessage)
    }
  }, [query.error])

  return query
} 