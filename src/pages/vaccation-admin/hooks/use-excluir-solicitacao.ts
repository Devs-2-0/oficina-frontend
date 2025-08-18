import { useMutation, useQueryClient } from '@tanstack/react-query'
import { excluirSolicitacao } from '@/http/services/ferias/excluir-solicitacao'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export function useExcluirSolicitacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (solicitacaoId: number) => excluirSolicitacao(solicitacaoId),
    onSuccess: () => {
      toast.success('Solicitação excluída com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-ferias'] })
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-aprovadas'] })
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as { message?: string }
      const errorMessage = errorData?.message || 'Erro ao excluir solicitação'
      toast.error(errorMessage)
    }
  })
}
