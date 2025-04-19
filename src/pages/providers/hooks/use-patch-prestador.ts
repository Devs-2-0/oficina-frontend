import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/http/api'
import { EditarPrestadorDTO } from '@/types/prestador'
import { toast } from 'sonner'

interface AtualizarPrestadorParams {
  id: string
  prestador: EditarPrestadorDTO
}

async function atualizarPrestador({ id, prestador }: AtualizarPrestadorParams) {
  const response = await api.patch(`/rest/prestadores/${id}`, prestador)
  return response.data
}

export function usePatchPrestador() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: atualizarPrestador,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores'] })
      toast.success('Prestador atualizado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao atualizar prestador')
    }
  })
} 