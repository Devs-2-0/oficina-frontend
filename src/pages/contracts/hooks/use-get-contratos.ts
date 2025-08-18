import { useQuery } from '@tanstack/react-query'
import { listarContratos, ListarContratosParams } from '@/http/services/contrato/listar-contratos'

export const useGetContratos = (params?: ListarContratosParams) => {
  return useQuery({
    queryKey: ['contratos', params],
    queryFn: () => listarContratos(params),
  })
} 