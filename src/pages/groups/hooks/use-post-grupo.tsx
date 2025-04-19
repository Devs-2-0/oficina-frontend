import { criarGrupo } from '@/http/services/grupo/criar-grupo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

export const usePostGrupo = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: criarGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
      toast({
        title: 'Sucesso',
        description: 'Grupo criado com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o grupo',
        variant: 'destructive',
      })
    },
  })

  return mutation
} 