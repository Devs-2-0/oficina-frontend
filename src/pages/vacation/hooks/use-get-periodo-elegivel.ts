import { useQuery } from '@tanstack/react-query'
import { getPeriodoElegivel } from '@/http/services/ferias/get-periodo-elegivel'

export function useGetPeriodoElegivel(matricula: string) {
  return useQuery({
    queryKey: ['periodo-elegivel', matricula],
    queryFn: () => getPeriodoElegivel(matricula),
    enabled: !!matricula,
  })
} 