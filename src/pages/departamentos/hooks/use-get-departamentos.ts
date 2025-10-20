import { listarDepartamentos } from '@/http/services/departamento/listar-departamentos'
import { useQuery } from '@tanstack/react-query'

export const useGetDepartamentos = () => {
  const departamentosQuery = useQuery({
    queryKey: ['departamentos'],
    queryFn: listarDepartamentos,
  })

  return {
    ...departamentosQuery,
    data: departamentosQuery.data || [],
  }
}
