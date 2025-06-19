import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { format, parseISO, addDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useCriarSolicitacaoFerias } from "../hooks/use-criar-solicitacao-ferias"
import { PeriodoElegivel } from "@/http/services/ferias/get-periodo-elegivel"
import { CriarSolicitacaoFeriasRequest } from "@/http/services/ferias/criar-solicitacao-ferias"

interface NovaSolicitacaoModalProps {
  isOpen: boolean
  onClose: () => void
  periodoElegivel: PeriodoElegivel
}

interface PeriodoForm {
  data_inicio: string
  dias_corridos: number
}

export const NovaSolicitacaoModal = ({ isOpen, onClose, periodoElegivel }: NovaSolicitacaoModalProps) => {
  const { mutate: criarSolicitacao, isPending: isLoadingSubmit } = useCriarSolicitacaoFerias()
  const [periodos, setPeriodos] = useState<PeriodoForm[]>([
    { data_inicio: '', dias_corridos: 0 }
  ])
  const [observacoes, setObservacoes] = useState('')

  const getDataTermino = (dataInicio: string, diasCorridos: number) => {
    if (!dataInicio || diasCorridos <= 0) return null
    return addDays(parseISO(dataInicio), diasCorridos - 1)
  }

  const getDatasOcupadas = () => {
    const datasOcupadas: { inicio: Date; fim: Date }[] = []
    
    periodos.forEach((periodo) => {
      if (periodo.data_inicio && periodo.dias_corridos > 0) {
        const inicio = parseISO(periodo.data_inicio)
        const fim = getDataTermino(periodo.data_inicio, periodo.dias_corridos)
        if (fim) {
          datasOcupadas.push({ inicio, fim })
        }
      }
    })
    
    return datasOcupadas
  }

  const isDataDisponivel = (data: string, periodoIndex: number) => {
    if (!data) return true
    
    const dataTeste = parseISO(data)
    const datasOcupadas = getDatasOcupadas()
    
    // Remove o período atual da verificação
    const outrosPeriodos = datasOcupadas.filter((_, index) => index !== periodoIndex)
    
    return !outrosPeriodos.some(({ inicio, fim }) => {
      return isWithinInterval(dataTeste, { start: startOfDay(inicio), end: endOfDay(fim) })
    })
  }

  const getMinDateForPeriodo = (periodoIndex: number) => {
    const datasOcupadas = getDatasOcupadas()
    const outrosPeriodos = datasOcupadas.filter((_, index) => index !== periodoIndex)
    
    if (outrosPeriodos.length === 0) {
      return format(new Date(), 'yyyy-MM-dd')
    }
    
    // Encontra a data mais recente entre os períodos existentes
    const datasFim = outrosPeriodos.map(p => p.fim)
    const dataMaisRecente = new Date(Math.max(...datasFim.map(d => d.getTime())))
    
    // Retorna o dia seguinte à data mais recente
    return format(addDays(dataMaisRecente, 1), 'yyyy-MM-dd')
  }

  const handleDataChange = (index: number, field: 'data_inicio' | 'dias_corridos', value: string | number) => {
    const novosPeriodos = [...periodos]
    if (field === 'data_inicio') {
      novosPeriodos[index].data_inicio = value as string
    } else {
      novosPeriodos[index].dias_corridos = value as number
    }
    
    setPeriodos(novosPeriodos)
  }

  const adicionarPeriodo = () => {
    if (periodos.length < 3) {
      setPeriodos([...periodos, { data_inicio: '', dias_corridos: 0 }])
    }
  }

  const removerPeriodo = (index: number) => {
    if (periodos.length > 1) {
      const novosPeriodos = periodos.filter((_, i) => i !== index)
      setPeriodos(novosPeriodos)
    }
  }

  const totalDias = periodos.reduce((acc, periodo) => acc + periodo.dias_corridos, 0)
  const diasDisponiveis = periodoElegivel.diasVencidos + periodoElegivel.diasProporcionais - periodoElegivel.diasPagos
  const totalDiasValido = totalDias <= diasDisponiveis
  const todosPeriodosPreenchidos = periodos.every(periodo => periodo.data_inicio && periodo.dias_corridos > 0)
  
  // Verifica se há sobreposição de datas
  const temSobreposicao = periodos.some((periodo, index) => {
    if (!periodo.data_inicio || periodo.dias_corridos <= 0) return false
    return !isDataDisponivel(periodo.data_inicio, index)
  })

  const handleSubmit = () => {
    if (!totalDiasValido || !todosPeriodosPreenchidos || temSobreposicao) return

    const dadosSolicitacao: CriarSolicitacaoFeriasRequest = {
      prestadorId: periodoElegivel.prestador.id,
      periodo: periodoElegivel.inicioPeriodo.split('T')[0], // Pega apenas a data
      periodos: periodos.map(p => ({
        data_inicio: p.data_inicio + 'T00:00:00',
        dias_corridos: p.dias_corridos
      })),
      observacoes
    }

    criarSolicitacao(dadosSolicitacao, {
      onSuccess: () => {
        onClose()
        setPeriodos([{ data_inicio: '', dias_corridos: 0 }])
        setObservacoes('')
      }
    })
  }

  const hoje = format(new Date(), 'yyyy-MM-dd')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Nova Solicitação de Férias</DialogTitle>
          <DialogDescription>
            Você possui {diasDisponiveis} dias disponíveis para solicitar férias.
            Período aquisitivo: {format(new Date(periodoElegivel.inicioPeriodo), "dd/MM/yyyy", { locale: ptBR })} a {format(new Date(periodoElegivel.fimPeriodo), "dd/MM/yyyy", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Períodos de Férias</Label>
                {periodos.length < 3 && (
                  <Button type="button" variant="outline" size="sm" onClick={adicionarPeriodo}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Período
                  </Button>
                )}
              </div>

              {temSobreposicao && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Existe sobreposição de datas entre os períodos. Verifique as datas selecionadas.
                  </AlertDescription>
                </Alert>
              )}

              {!totalDiasValido && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    O total de dias solicitados excede o saldo disponível.
                  </AlertDescription>
                </Alert>
              )}

              {periodos.map((periodo, index) => (
                <div key={index} className="grid gap-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{index + 1}º Período</h4>
                    {periodos.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerPeriodo(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`inicio-${index}`}>Data de Início *</Label>
                      <Input
                        id={`inicio-${index}`}
                        type="date"
                        min={index === 0 ? hoje : getMinDateForPeriodo(index)}
                        value={periodo.data_inicio}
                        onChange={(e) => handleDataChange(index, 'data_inicio', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dias-${index}`}>Dias Corridos *</Label>
                      <Input
                        id={`dias-${index}`}
                        type="number"
                        min="1"
                        max="30"
                        value={periodo.dias_corridos}
                        onChange={(e) => handleDataChange(index, 'dias_corridos', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  {periodo.data_inicio && periodo.dias_corridos > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Período: {format(new Date(periodo.data_inicio), "dd/MM/yyyy", { locale: ptBR })} a {format(getDataTermino(periodo.data_inicio, periodo.dias_corridos)!, "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Total de Dias:</span>
                <span className="text-lg font-bold">{totalDias} dias</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais (opcional)"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoadingSubmit || !totalDiasValido || !todosPeriodosPreenchidos || temSobreposicao}
          >
            {isLoadingSubmit ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Solicitação'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 