import api from '@/http/api'

export const importarTodosFinanceiros = async (): Promise<void> => {
  await api.post('/rest/financeiro/importar-todos')
}
