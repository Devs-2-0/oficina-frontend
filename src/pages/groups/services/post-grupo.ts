import api from '@/http/api'

interface DadosGrupo {
  nome: string
  permissoes: string[]
}

export const postGrupo = async (grupo: DadosGrupo) => {
  const response = await api.post('/rest/grupo', grupo)
  return response.data
} 