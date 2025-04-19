import { excluirGrupo } from '@/http/services/grupo/excluir-grupo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

export const useDeleteGrupo = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: excluirGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
      toast({
        title: 'Sucesso',
        description: 'Grupo excluído com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o grupo',
        variant: 'destructive',
      })
    },
  })

  return mutation
} 