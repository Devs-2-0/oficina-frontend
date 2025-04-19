import { useQuery } from '@tanstack/react-query'
import { listarUsuarios } from '@/http/services/usuario/listar-usuarios'

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: listarUsuarios,
  })
} 