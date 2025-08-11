import api from '@/http/api'

export const importarFinanceiros = async (usuarioId: number): Promise<void> => {
  await api.post(`/rest/financeiro/importar/${usuarioId}`)
}


