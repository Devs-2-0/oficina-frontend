export interface Prestador {
  id: string
  nome: string
  email: string
  especialidade: string
  status: 'Ativo' | 'Inativo'
  contratos: number
  cpf_cnpj: string
  telefone: string
  endereco?: string
}

export interface EditarPrestadorDTO {
  nome: string
  email: string
  especialidade: string
  status: 'Ativo' | 'Inativo'
  telefone: string
  endereco?: string
}

export interface ListagemPrestadores {
  prestadores: Prestador[]
  total: number
} 