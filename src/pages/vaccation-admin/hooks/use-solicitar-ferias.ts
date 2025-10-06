import { useMutation, useQueryClient } from '@tanstack/react-query'
import { solicitarFerias, SolicitacaoFeriasInput } from '@/http/services/ferias/solicitar-ferias'
import { toast } from 'sonner'

export function useSolicitarFerias() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: solicitarFerias,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] })
      toast.success('Solicitação de descanso remunerado enviada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao enviar solicitação de descanso remunerado. Tente novamente.')
    }
  })
} 