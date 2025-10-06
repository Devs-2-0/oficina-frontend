import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SolicitacaoPorMatricula } from "@/http/services/ferias/get-solicitacoes-por-matricula"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DetalhesSolicitacaoModalProps {
  isOpen: boolean
  onClose: () => void
  solicitacao: SolicitacaoPorMatricula
  onEdit?: () => void
}

export const DetalhesSolicitacaoModal = ({ isOpen, onClose, solicitacao, onEdit }: DetalhesSolicitacaoModalProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      PENDENTE: 'bg-yellow-500',
      APROVADA: 'bg-emerald-500',
      REPROVADA: 'bg-red-500'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const formatarData = (data: string) => {
    return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const calculateTotalDays = () => {
    return (solicitacao.dias_corridos1 || 0) + 
           (solicitacao.dias_corridos2 || 0) + 
           (solicitacao.dias_corridos3 || 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação de Descanso Remunerado</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a solicitação de descanso remunerado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Informações do Funcionário</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Nome:</div>
                <div>{solicitacao.prestador.nome}</div>
                <div>Matrícula:</div>
                <div>{solicitacao.prestador.matricula}</div>
                <div>Período:</div>
                <div>{solicitacao.periodo}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Status da Solicitação</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Status:</div>
                <div>{getStatusBadge(solicitacao.status)}</div>
                <div>Data da Solicitação:</div>
                <div>{formatarData(solicitacao.data_criacao)}</div>
                {solicitacao.data_revisao && (
                  <>
                    <div>Data da Revisão:</div>
                    <div>{formatarData(solicitacao.data_revisao)}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Períodos de Descanso</h3>
            <div className="space-y-3">
              {/* Primeiro período */}
              <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                <div>
                  <div className="text-sm font-medium">1º Período</div>
                  <div className="text-sm text-muted-foreground">
                    {solicitacao.data_inicio1 ? format(new Date(solicitacao.data_inicio1), "dd/MM/yyyy", { locale: ptBR }) : "Não informado"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Dias</div>
                  <div className="text-sm text-muted-foreground">{solicitacao.dias_corridos1 || 0}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-sm text-muted-foreground">Ativo</div>
                </div>
              </div>

              {/* Segundo período */}
              {solicitacao.data_inicio2 && (
                <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">2º Período</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(solicitacao.data_inicio2), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Dias</div>
                    <div className="text-sm text-muted-foreground">{solicitacao.dias_corridos2 || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm text-muted-foreground">Ativo</div>
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium">Total de Dias:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {calculateTotalDays()} dias
              </Badge>
            </div>
          </div>

          {solicitacao.revisor && (
            <div className="space-y-4">
              <h3 className="font-semibold">Revisor</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Nome:</div>
                <div>{solicitacao.revisor.nome}</div>
                <div>Matrícula:</div>
                <div>{solicitacao.revisor.matricula}</div>
              </div>
            </div>
          )}

          {solicitacao.motivo_reprovacao && (
            <div className="space-y-4">
              <h3 className="font-semibold">Motivo da Reprovação</h3>
              <div className="text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
                {solicitacao.motivo_reprovacao}
              </div>
            </div>
          )}

          {solicitacao.observacoes && (
            <div className="space-y-4">
              <h3 className="font-semibold">Observações</h3>
              <div className="text-sm p-3 bg-muted rounded-lg">{solicitacao.observacoes}</div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button variant="outline">
              Imprimir
            </Button>
            <Button variant="outline">
              Baixar PDF
            </Button>
            {solicitacao.status === 'PENDENTE' && onEdit && (
              <Button onClick={onEdit}>
                Editar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 