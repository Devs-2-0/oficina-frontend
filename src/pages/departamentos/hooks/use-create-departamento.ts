import { criarDepartamento } from '@/http/services/departamento/criar-departamento'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

export const useCreateDepartamento = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: criarDepartamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] })
      toast({
        title: 'Sucesso',
        description: 'Departamento criado com sucesso',
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o departamento',
        variant: 'destructive',
      })
    },
  })

  return mutation
}
