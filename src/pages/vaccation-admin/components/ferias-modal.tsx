import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { format, isBefore, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SolicitacaoFerias } from "@/types/ferias"
import { useVerificarPeriodoAquisitivo } from "../hooks/use-verificar-periodo-aquisitivo"
import { useSolicitarFerias } from "../hooks/use-solicitar-ferias"

interface FeriasModalProps {
  isOpen: boolean
  onClose: () => void
  solicitacao?: SolicitacaoFerias
}

export const FeriasModal = ({ isOpen, onClose, solicitacao }: FeriasModalProps) => {
  const { data: periodoAquisitivo, isLoading: isLoadingPeriodo } = useVerificarPeriodoAquisitivo()
  const { mutate: enviarSolicitacao, isPending: isLoadingSubmit } = useSolicitarFerias()
  const [periodos, setPeriodos] = useState<{ inicio: string; termino: string; dias: number }[]>(
    solicitacao?.periodos.map(p => ({
      inicio: p.data_inicio,
      termino: p.data_termino,
      dias: p.total_dias
    })) || [{ inicio: '', termino: '', dias: 0 }]
  )
  const [abonoPecuniario, setAbonoPecuniario] = useState(solicitacao?.abono_pecuniario || false)
  const [diasVendidos, setDiasVendidos] = useState(solicitacao?.dias_vendidos || 0)
  const [adiantamento13, setAdiantamento13] = useState(solicitacao?.adiantamento_decimo_terceiro || false)
  const [observacoes, setObservacoes] = useState(solicitacao?.observacoes || '')

  const calcularDias = (inicio: string, termino: string) => {
    if (!inicio || !termino) return 0
    const dataInicio = parseISO(inicio)
    const dataTermino = parseISO(termino)
    if (isBefore(dataTermino, dataInicio)) return 0
    const diffDays = Math.ceil((dataTermino.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleDataChange = (index: number, field: 'inicio' | 'termino', value: string) => {
    const novosPeriodos = [...periodos]
    novosPeriodos[index][field] = value
    novosPeriodos[index].dias = calcularDias(novosPeriodos[index].inicio, novosPeriodos[index].termino)
    setPeriodos(novosPeriodos)
  }

  const adicionarPeriodo = () => {
    if (periodos.length < 2) {
      setPeriodos([...periodos, { inicio: '', termino: '', dias: 0 }])
    }
  }

  const removerPeriodo = (index: number) => {
    if (periodos.length > 1) {
      const novosPeriodos = periodos.filter((_, i) => i !== index)
      setPeriodos(novosPeriodos)
    }
  }

  const totalDias = periodos.reduce((acc, periodo) => acc + periodo.dias, 0)
  const temPeriodoMinimo14Dias = periodos.some(periodo => periodo.dias >= 14)
  const totalDiasValido = totalDias <= (periodoAquisitivo?.saldo_dias || 30)

  // if (isLoadingPeriodo) {
  //   return (
  //     <Dialog open={isOpen} onOpenChange={onClose}>
  //       <DialogContent>
  //         <div className="flex items-center justify-center p-6">
  //           <Loader2 className="h-8 w-8 animate-spin" />
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   )
  // }

  if (periodoAquisitivo?.status === 'INDISPONIVEL') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Período Aquisitivo Indisponível</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Não é possível solicitar descanso remunerado</AlertTitle>
            <AlertDescription>
              {periodoAquisitivo.motivo || 'Você não possui período aquisitivo disponível para solicitar descanso remunerado.'}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const handleSubmit = () => {
    if (!temPeriodoMinimo14Dias || !totalDiasValido) return

    const dadosSolicitacao = {
      periodos: periodos.map(p => ({
        data_inicio: p.inicio,
        data_termino: p.termino,
        total_dias: p.dias
      })),
      abono_pecuniario: abonoPecuniario,
      dias_vendidos: abonoPecuniario ? diasVendidos : 0,
      adiantamento_decimo_terceiro: adiantamento13,
      observacoes
    }

    enviarSolicitacao(dadosSolicitacao, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const hoje = format(new Date(), 'yyyy-MM-dd')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{solicitacao ? 'Editar Solicitação de Descanso Remunerado' : 'Nova Solicitação de Descanso Remunerado'}</DialogTitle>
          <DialogDescription>
            Você possui {periodoAquisitivo?.saldo_dias} dias disponíveis para solicitar descanso remunerado.
            {periodoAquisitivo?.inicio && periodoAquisitivo?.fim && (
              <>
                Período aquisitivo: {format(new Date(periodoAquisitivo.inicio), "dd/MM/yyyy", { locale: ptBR })} a {format(new Date(periodoAquisitivo.fim), "dd/MM/yyyy", { locale: ptBR })}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Períodos de Descanso</Label>
              {periodos.length < 2 && (
                <Button type="button" variant="outline" size="sm" onClick={adicionarPeriodo}>
                  + Adicionar Período
                </Button>
              )}
            </div>

            {!temPeriodoMinimo14Dias && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  É necessário que pelo menos um dos períodos tenha no mínimo 14 dias.
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
              <div key={index} className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`inicio-${index}`}>Data de Início *</Label>
                    <Input
                      id={`inicio-${index}`}
                      type="date"
                      min={hoje}
                      value={periodo.inicio}
                      onChange={(e) => handleDataChange(index, 'inicio', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`termino-${index}`}>Data de Término *</Label>
                    <Input
                      id={`termino-${index}`}
                      type="date"
                      min={periodo.inicio || hoje}
                      value={periodo.termino}
                      onChange={(e) => handleDataChange(index, 'termino', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total de Dias</Label>
                    <Input value={periodo.dias} readOnly />
                  </div>
                </div>
                {periodos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removerPeriodo(index)}
                  >
                    Remover período
                  </Button>
                )}
              </div>
            ))}

            <div className="text-sm text-muted-foreground">
              Total de dias solicitados: {totalDias} dias
            </div>
          </div>

          <div className="space-y-4">
            <Label>Opções Adicionais</Label>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Abono Pecuniário (Venda de Descanso)</Label>
                  <div className="text-sm text-muted-foreground">
                    Você pode vender até 10 dias do seu descanso remunerado.
                  </div>
                </div>
                <Switch
                  checked={abonoPecuniario}
                  onCheckedChange={setAbonoPecuniario}
                />
              </div>

              {abonoPecuniario && (
                <div className="space-y-2">
                  <Label htmlFor="dias-vender">Dias a Vender *</Label>
                  <Select
                    value={String(diasVendidos)}
                    onValueChange={(value) => setDiasVendidos(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a quantidade de dias" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1} {i === 0 ? 'dia' : 'dias'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Adiantamento do 13º Salário</Label>
                  <div className="text-sm text-muted-foreground">
                    Você receberá 50% do seu 13º salário antecipadamente.
                  </div>
                </div>
                <Switch
                  checked={adiantamento13}
                  onCheckedChange={setAdiantamento13}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais sobre a solicitação de descanso remunerado"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!temPeriodoMinimo14Dias || !totalDiasValido || isLoadingSubmit}
          >
            {isLoadingSubmit ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : solicitacao ? (
              'Salvar alterações'
            ) : (
              'Solicitar descanso'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 