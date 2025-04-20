import api from '@/http/api'

interface PostagemNaoVisualizada {
  id: number
  titulo: string
  mensagem: string
  criado_em: string
}

export async function marcarComoLido(id: number): Promise<void> {
  await api.get(`/rest/postagem/${id}`)
}

export async function listarNaoVisualizadas(pagina: number, limite: number): Promise<PostagemNaoVisualizada[]> {
  const response = await api.get<PostagemNaoVisualizada[]>('/rest/postagem/nao-visualizadas', {
    params: {
      pagina,
      limite
    }
  })
  return response.data || []
} 