import { useMutation, useQueryClient } from '@tanstack/react-query'
import { criarSolicitacaoFerias } from '@/http/services/ferias/criar-solicitacao-ferias'
import { toast } from 'sonner'

export function useCriarSolicitacaoFerias() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: criarSolicitacaoFerias,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-por-matricula'] })
      toast.success('Solicitação de descanso remunerado criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar solicitação de descanso remunerado. Tente novamente.')
    }
  })
} 