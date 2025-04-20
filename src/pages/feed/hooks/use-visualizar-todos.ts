import { visualizarTodosPosts } from "@/http/services/postagem/visualizar-todos"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useVisualizarTodos() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: visualizarTodosPosts,
    onSuccess: () => {
      toast({
        title: "Posts visualizados",
        description: "Todos os posts foram marcados como visualizados!"
      })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["nao-visualizadas"] })
    },
    onError: () => {
      toast({
        title: "Erro ao visualizar posts",
        description: "Ocorreu um erro ao marcar os posts como visualizados.",
        variant: "destructive"
      })
    }
  })
} 