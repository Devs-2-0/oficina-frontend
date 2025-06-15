import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FeriasSolicitacao } from "@/http/services/ferias/listar-solicitacoes-ferias"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DetalhesFeriasProps {
  isOpen: boolean
  onClose: () => void
  solicitacao: FeriasSolicitacao
}

export const DetalhesFeriasModal = ({ isOpen, onClose, solicitacao }: DetalhesFeriasProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      PENDENTE: 'bg-yellow-500',
      APROVADA: 'bg-emerald-500',
      REJEITADA: 'bg-red-500'
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
          <DialogTitle>Detalhes da Solicitação de Férias</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a solicitação de férias.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Informações do Prestador</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Nome:</div>
                <div>{solicitacao.prestador.nome}</div>
                <div>Matrícula:</div>
                <div>{solicitacao.prestador.matricula}</div>
                <div>Empresa:</div>
                <div>{solicitacao.prestador.empresa}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Período de Férias</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Data de Início:</div>
                <div>{formatarData(solicitacao.data_inicio1)}</div>
                <div>Dias no 1º Período:</div>
                <div>{solicitacao.dias_corridos1} dias</div>
                {solicitacao.data_inicio2 && (
                  <>
                    <div>Data de Início (2º):</div>
                    <div>{formatarData(solicitacao.data_inicio2)}</div>
                    <div>Dias no 2º Período:</div>
                    <div>{solicitacao.dias_corridos2} dias</div>
                  </>
                )}
                {solicitacao.data_inicio3 && (
                  <>
                    <div>Data de Início (3º):</div>
                    <div>{formatarData(solicitacao.data_inicio3)}</div>
                    <div>Dias no 3º Período:</div>
                    <div>{solicitacao.dias_corridos3} dias</div>
                  </>
                )}
                <div>Total de Dias:</div>
                <div>{calculateTotalDays()} dias</div>
              </div>
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
              {solicitacao.motivo_reprovacao && (
                <>
                  <div>Motivo da Reprovação:</div>
                  <div>{solicitacao.motivo_reprovacao}</div>
                </>
              )}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 