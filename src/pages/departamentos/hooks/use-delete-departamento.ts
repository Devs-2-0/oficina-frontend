import { excluirDepartamento } from '@/http/services/departamento/excluir-departamento'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

export const useDeleteDepartamento = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: excluirDepartamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] })
      toast({
        title: 'Sucesso',
        description: 'Departamento excluído com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o departamento',
        variant: 'destructive',
      })
    },
  })

  return mutation
}
