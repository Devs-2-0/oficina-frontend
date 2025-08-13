import { useQuery } from '@tanstack/react-query'
import { getImagemPostagem } from '@/http/services/postagem/get-imagem'

export function useGetImagem(url: string) {
  return useQuery({
    queryKey: ['imagem', url],
    queryFn: () => getImagemPostagem(url),
    enabled: !!url,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    retry: 2, // Retry up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}
