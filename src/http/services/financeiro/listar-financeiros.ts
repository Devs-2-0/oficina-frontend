import { Financeiro } from '@/types/financeiro'

export const listarFinanceiros = async (): Promise<Financeiro[]> => {
  // Mock para apresentação
  return [
    {
      id: 1,
      processo: 'PROC-2023-010',
      competencia: 'Outubro/2023',
      nro_pagamento: 'PAY-010',
      tipo: 'Pagamento',
      valor: 7620.00,
      data_pagamento: '2023-10-14',
      prestador: {
        id: 1,
        nome: 'Juliana Costa',
        email: 'juliana@exemplo.com',
        matricula: '123456',
        tipo: 'prestador',
        grupo: 'prestadores'
      },
      data_criacao: new Date('2023-10-14'),
      data_ultima_atualizacao: new Date('2023-10-14'),
      status: 'Pendente',
      itens: [
        {
          codigo: '020',
          descricao: 'Serviços Prestados',
          referencia: '220,00',
          proventos: 7700,
          descontos: 0
        },
        {
          codigo: '874',
          descricao: 'Parc.Mensal_DescansoAnual',
          referencia: '',
          proventos: 100,
          descontos: 0
        },
        {
          codigo: '2455',
          descricao: 'Plano Odontológico',
          referencia: '',
          proventos: 0,
          descontos: 35.76
        },
        {
          codigo: '2456',
          descricao: 'Plano de Saúde',
          referencia: '',
          proventos: 0,
          descontos: 144.24
        }
      ]
    },
    // Adicione mais registros mock aqui...
  ]
} 