import { Usuario } from "@/http/services/usuario/listar-usuarios"

export interface PeriodoFerias {
  data_inicio: string
  data_termino: string
  total_dias: number
}

export interface SolicitacaoFerias {
  id: number
  funcionario: Usuario
  departamento: string
  periodos: PeriodoFerias[]
  dias: number
  data_solicitacao: string
  status: 'Pendente' | 'Aprovado' | 'Rejeitado'
  periodo_aquisitivo: string
  abono_pecuniario: boolean
  dias_vendidos: number
  adiantamento_decimo_terceiro: boolean
  observacoes?: string
  data_criacao: Date
  data_atualizacao: Date
} 