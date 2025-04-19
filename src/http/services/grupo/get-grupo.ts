import api from '@/http/api'

interface PermissaoGrupo {
  codigo: string
  nome: string
}

interface Grupo {
  id: string
  nome: string
  permissoes: PermissaoGrupo[]
}

export const getGrupo = async (groupId: string): Promise<Grupo> => {
  const response = await api.get<Grupo>(`/rest/grupo/${groupId}`)
  return response.data
} 