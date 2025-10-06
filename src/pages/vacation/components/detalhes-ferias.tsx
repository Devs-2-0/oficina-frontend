import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SolicitacaoFerias } from "@/types/ferias"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DetalhesFeriasProps {
  isOpen: boolean
  onClose: () => void
  solicitacao: SolicitacaoFerias
  onEdit?: () => void
}

export const DetalhesFeriasModal = ({ isOpen, onClose, solicitacao, onEdit }: DetalhesFeriasProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      Pendente: 'bg-yellow-500',
      Aprovado: 'bg-emerald-500',
      Rejeitado: 'bg-red-500'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const formatarData = (data: string) => {
    return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
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
                <div>{solicitacao.funcionario.nome}</div>
                <div>Departamento:</div>
                <div>{solicitacao.departamento}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Período de Descanso</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Data de Início:</div>
                <div>{formatarData(solicitacao.periodos[0].data_inicio)}</div>
                <div>Data de Término:</div>
                <div>{formatarData(solicitacao.periodos[0].data_termino)}</div>
                <div>Total de Dias:</div>
                <div>{solicitacao.dias} dias</div>
                <div>Tipo de Descanso:</div>
                <div>Regular</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Opções Selecionadas</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Abono Pecuniário:</div>
              <div>{solicitacao.abono_pecuniario ? `Sim (${solicitacao.dias_vendidos} dias)` : 'Não'}</div>
              <div>Adiantamento 13º:</div>
              <div>{solicitacao.adiantamento_decimo_terceiro ? 'Sim' : 'Não'}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Status da Solicitação</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Status:</div>
              <div>{getStatusBadge(solicitacao.status)}</div>
              <div>Data da Solicitação:</div>
              <div>{formatarData(solicitacao.data_solicitacao)}</div>
            </div>
          </div>

          {solicitacao.observacoes && (
            <div className="space-y-4">
              <h3 className="font-semibold">Observações</h3>
              <div className="text-sm">{solicitacao.observacoes}</div>
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
            {solicitacao.status === 'Pendente' && onEdit && (
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