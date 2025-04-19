import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postGrupo } from '../services/post-grupo'
import { useToast } from '@/hooks/use-toast'

interface DadosGrupo {
  nome: string
  permissoes: string[]
}

export const usePostGrupo = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (grupo: DadosGrupo) => postGrupo(grupo),
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
    }
  })
} 