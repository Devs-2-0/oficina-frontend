export interface Usuario {
  id: string
  nome: string
}

export interface ImagemPostagem {
  id: number
  url: string
}

export interface Postagem {
  id: number
  titulo: string
  mensagem: string
  autor: Usuario
  criado_em: string
  imagens: ImagemPostagem[]
  visualizacoes: number
  curtidas: number
}

export interface ListagemPostagens {
  postagens: Postagem[]
  total: number
}

export interface CriarPostagemDTO {
  titulo: string
  mensagem: string
  imagens?: File[]
} 