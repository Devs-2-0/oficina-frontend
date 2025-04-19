import api from '@/http/api'

export interface Usuario {
  id: number
  nome: string
  email: string
}

export const listarUsuarios = async (): Promise<Usuario[]> => {
  // Mock para apresentação
  return [
    {
      id: 1,
      nome: 'Juliana Costa',
      email: 'juliana@exemplo.com'
    },
    {
      id: 2,
      nome: 'Gabriel Oliveira',
      email: 'gabriel@exemplo.com'
    },
    {
      id: 3,
      nome: 'Camila Souza',
      email: 'camila@exemplo.com'
    }
  ]
} 