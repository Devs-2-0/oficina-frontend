import api from '@/http/api'
import { CriarPostagemDTO, Postagem } from '@/types/postagem'

export async function criarPostagem(dados: CriarPostagemDTO): Promise<Postagem> {
  const formData = new FormData()
  formData.append('titulo', dados.titulo)
  formData.append('mensagem', dados.mensagem)

  if (dados.imagens) {
    dados.imagens.forEach(imagem => {
      formData.append('imagens', imagem)
    })
  }

  const response = await api.post('/rest/postagem', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
} 