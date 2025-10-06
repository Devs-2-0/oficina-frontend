import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeriasSolicitacao } from "@/http/services/ferias/listar-solicitacoes-ferias"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, User, FileText, Clock } from "lucide-react"

interface DetalhesFeriasProps {
  isOpen: boolean
  onClose: () => void
  solicitacao: FeriasSolicitacao
}

export const DetalhesFeriasModal = ({ isOpen, onClose, solicitacao }: DetalhesFeriasProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      PENDENTE: 'bg-amber-100 text-amber-800 border-amber-200',
      APROVADA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REJEITADA: 'bg-red-100 text-red-800 border-red-200'
    }
    return <Badge variant="outline" className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const formatarData = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR })
  }

  const calcularDataFim = (dataInicio: string, diasCorridos: number) => {
    if (!dataInicio || diasCorridos <= 0) return null
    return addDays(new Date(dataInicio), diasCorridos - 1)
  }

  const calculateTotalDays = () => {
    return (solicitacao.dias_corridos1 || 0) + 
           (solicitacao.dias_corridos2 || 0) + 
           (solicitacao.dias_corridos3 || 0)
  }

  const getPeriodos = () => {
    const periodos = []
    
    if (solicitacao.data_inicio1 && solicitacao.dias_corridos1) {
      const dataFim1 = calcularDataFim(solicitacao.data_inicio1, solicitacao.dias_corridos1)
      periodos.push({
        numero: 1,
        inicio: solicitacao.data_inicio1,
        fim: dataFim1,
        dias: solicitacao.dias_corridos1
      })
    }
    
    if (solicitacao.data_inicio2 && solicitacao.dias_corridos2) {
      const dataFim2 = calcularDataFim(solicitacao.data_inicio2, solicitacao.dias_corridos2)
      periodos.push({
        numero: 2,
        inicio: solicitacao.data_inicio2,
        fim: dataFim2,
        dias: solicitacao.dias_corridos2
      })
    }
    
    
    return periodos
  }

  const periodos = getPeriodos()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-red-700" />
            Detalhes da Solicitação de Descanso
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a solicitação de descanso remunerado do prestador.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Informações do Prestador */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-gray-600" />
                Informações do Prestador
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Nome:</span>
                  <p className="text-gray-900">{solicitacao.prestador.nome}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Matrícula:</span>
                  <p className="text-gray-900">{solicitacao.prestador.matricula}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Empresa:</span>
                  <p className="text-gray-900">{solicitacao.prestador.empresa}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Períodos de Descanso */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-gray-600" />
                Períodos de Descanso
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {periodos.map((periodo) => (
                  <div key={periodo.numero} className="p-3 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      {periodo.numero}º Período
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Início:</span>
                        <p className="text-gray-900">{formatarData(periodo.inicio)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Fim:</span>
                        <p className="text-gray-900">{formatarData(periodo.fim!.toISOString())}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Duração:</span>
                        <p className="text-gray-900 font-semibold">{periodo.dias} dias</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-700" />
                    <span className="font-semibold text-red-900 text-sm">Total de Dias</span>
                    <span className="text-lg font-bold text-red-900 ml-auto">{calculateTotalDays()} dias</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status da Solicitação */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-gray-600" />
                Status da Solicitação
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <div className="mt-1">{getStatusBadge(solicitacao.status)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Data da Solicitação:</span>
                  <p className="text-gray-900">{formatarData(solicitacao.data_criacao)}</p>
                </div>
                {solicitacao.data_revisao && (
                  <div>
                    <span className="font-medium text-gray-600">Data da Revisão:</span>
                    <p className="text-gray-900">{formatarData(solicitacao.data_revisao)}</p>
                  </div>
                )}
                {solicitacao.motivo_reprovacao && (
                  <div className="sm:col-span-2">
                    <span className="font-medium text-gray-600">Motivo da Reprovação:</span>
                    <p className="text-gray-900 mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm">
                      {solicitacao.motivo_reprovacao}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {solicitacao.observacoes && (
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-900 p-2 bg-gray-50 border rounded text-sm">
                  {solicitacao.observacoes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 flex-shrink-0 pt-4 border-t mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="outline" size="sm">
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            Baixar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 