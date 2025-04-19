import { atualizarGrupo } from '@/http/services/grupo/atualizar-grupo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Grupo } from '@/http/services/grupo/listar-grupos'

export const usePatchGrupo = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, grupo }: { id: string; grupo: Omit<Grupo, 'id'> }) =>
      atualizarGrupo(id, grupo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] })
      toast({
        title: 'Sucesso',
        description: 'Grupo atualizado com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o grupo',
        variant: 'destructive',
      })
    },
  })

  return mutation
} 