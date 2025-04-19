import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/http/api'
import { toast } from 'sonner'

async function excluirPrestador(id: string) {
  const response = await api.delete(`/rest/prestadores/${id}`)
  return response.data
}

export function useDeletePrestador() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: excluirPrestador,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores'] })
      toast.success('Prestador excluído com sucesso')
    },
    onError: () => {
      toast.error('Erro ao excluir prestador')
    }
  })
} 