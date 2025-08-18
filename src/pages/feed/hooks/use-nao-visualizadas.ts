import { useQuery } from '@tanstack/react-query'
import { listarNaoVisualizadas } from '@/http/services/postagem/marcar-como-lido'
import { useAuth } from '@/contexts/auth-context'

export function useNaoVisualizadas() {
  const { usuario } = useAuth()
  
  const { data: naoVisualizadas } = useQuery({
    queryKey: ['postagens-nao-visualizadas'],
    queryFn: () => listarNaoVisualizadas(1, 100),
    enabled: !!usuario // Only run query if user is logged in
  })

  return {
    quantidadeNaoVisualizadas: naoVisualizadas?.length || 0,
    naoVizualizadasIds: naoVisualizadas?.map((postagem) => postagem.id) || []
  }
} 