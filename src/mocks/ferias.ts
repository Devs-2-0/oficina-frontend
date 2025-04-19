export const periodoAquisitivoMock = {
  inicio: '2023-01-01',
  fim: '2023-12-31',
  saldo_dias: 30,
  status: 'DISPONIVEL' as const
}

export const feriasMock = [
  {
    id: '1',
    funcionario: {
      id: '1',
      nome: 'João Silva'
    },
    dataInicio: '2024-02-01',
    dataFim: '2024-02-15',
    diasTotais: 15,
    status: 'PENDENTE' as const
  },
  {
    id: '2',
    funcionario: {
      id: '2',
      nome: 'Maria Santos'
    },
    dataInicio: '2024-03-01',
    dataFim: '2024-03-30',
    diasTotais: 30,
    status: 'APROVADA' as const
  },
  {
    id: '3',
    funcionario: {
      id: '3',
      nome: 'Pedro Oliveira'
    },
    dataInicio: '2024-01-15',
    dataFim: '2024-01-29',
    diasTotais: 15,
    status: 'REJEITADA' as const
  }
]

// Mock para usuário sem período aquisitivo disponível
export const periodoAquisitivoIndisponivelMock = {
  inicio: '2023-01-01',
  fim: '2023-12-31',
  saldo_dias: 0,
  status: 'INDISPONIVEL' as const,
  motivo: 'Funcionário não completou o período aquisitivo necessário.'
} 