import { patchGrupo } from '@/http/services/grupo/atualizar-grupo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'



interface DadosGrupo {
  nome: string
  permissoes: string[]
}

interface PatchGrupoParams {
  id: string
  grupo: DadosGrupo
}

export const usePatchGrupo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, grupo }: PatchGrupoParams) => patchGrupo(id, grupo),
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
    }
  })
} 