import { useQuery } from '@tanstack/react-query'
import { listarNaoVisualizadas } from '@/http/services/postagem/marcar-como-lido'

export function useNaoVisualizadas() {
  const { data: naoVisualizadas } = useQuery({
    queryKey: ['postagens-nao-visualizadas'],
    queryFn: () => listarNaoVisualizadas(1, 100)
  })

  return {
    quantidadeNaoVisualizadas: naoVisualizadas?.length || 0,
    naoVizualizadasIds: naoVisualizadas?.map((postagem) => postagem.id) || []
  }
} 