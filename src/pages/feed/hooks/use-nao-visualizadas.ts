import { useQuery } from '@tanstack/react-query'
import { listarNaoVisualizadas } from '@/http/services/postagem/marcar-como-lido'

export function useNaoVisualizadas() {
  const { data: quantidadeNaoVisualizadas = 0 } = useQuery({
    queryKey: ['postagens-nao-visualizadas'],
    queryFn: () => listarNaoVisualizadas(1, 100)
  })

  return {
    quantidadeNaoVisualizadas
  }
} 