import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/http/api'
import { toast } from 'sonner'

async function excluirPost(id: number) {
  const response = await api.delete(`/rest/postagem/${id}`)
  return response.data
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: excluirPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postagens'] })
      toast.success('Post excluído com sucesso')
    },
    onError: () => {
      toast.error('Erro ao excluir post')
    }
  })
} 