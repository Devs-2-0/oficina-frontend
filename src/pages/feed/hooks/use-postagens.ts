import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listarPostagens } from '@/http/services/postagem/listar-postagens'
import { marcarComoLido } from '@/http/services/postagem/marcar-como-lido'
import { ListagemPostagens } from '@/types/postagem'
import { toast } from 'sonner'

export function usePostagens() {
  const queryClient = useQueryClient()
  const LIMITE_POR_PAGINA = 10

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['postagens'],
    queryFn: ({ pageParam = 1 }) => listarPostagens({
      pagina: pageParam,
      limite: LIMITE_POR_PAGINA
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ListagemPostagens, allPages) => {
      const totalPaginas = Math.ceil(lastPage.total / LIMITE_POR_PAGINA)
      const proximaPagina = allPages.length + 1
      return proximaPagina <= totalPaginas ? proximaPagina : undefined
    }
  })

  const { mutate: marcarPostComoLido } = useMutation({
    mutationFn: marcarComoLido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postagens-nao-visualizadas'] })
    },
    onError: () => {
      toast.error('Erro ao marcar postagem como lida')
    }
  })

  return {
    postagens: data?.pages.flatMap(page => page.postagens) ?? [],
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    marcarPostComoLido
  }
} 