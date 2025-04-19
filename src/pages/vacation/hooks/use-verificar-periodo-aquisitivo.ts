import { useQuery } from '@tanstack/react-query'
import { PeriodoAquisitivo, verificarPeriodoAquisitivo } from '@/http/services/ferias/verificar-periodo-aquisitivo'

export function useVerificarPeriodoAquisitivo() {
  return useQuery<PeriodoAquisitivo>({
    queryKey: ['periodo-aquisitivo'],
    queryFn: verificarPeriodoAquisitivo,
  })
} 