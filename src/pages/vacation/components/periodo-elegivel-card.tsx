import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { PeriodoElegivel } from "@/http/services/ferias/get-periodo-elegivel"
import { Calendar, Clock, User, Plus } from "lucide-react"

interface PeriodoElegivelCardProps {
  periodo: PeriodoElegivel
  onNovaSolicitacao: (periodo: PeriodoElegivel) => void
}

export function PeriodoElegivelCard({ periodo, onNovaSolicitacao }: PeriodoElegivelCardProps) {
  const totalDiasDisponiveis = periodo.diasVencidos + periodo.diasProporcionais - periodo.diasPagos

  return (
    <Card className="w-full">
    
      <CardContent className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Período Aquisitivo</span>
            </div>
            <div className="text-sm font-medium">
              {format(new Date(periodo.inicioPeriodo), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(periodo.fimPeriodo), "dd/MM/yyyy", { locale: ptBR })}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Admissão</span>
            </div>
            <div className="text-sm font-medium">
              {format(new Date(periodo.dataAdmissao), "dd/MM/yyyy", { locale: ptBR })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{periodo.diasVencidos}</div>
            <div className="text-xs text-muted-foreground">Dias Vencidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{periodo.diasProporcionais}</div>
            <div className="text-xs text-muted-foreground">Dias Proporcionais</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{periodo.diasPagos}</div>
            <div className="text-xs text-muted-foreground">Dias Pagos</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Total Disponível:</span>
            <Badge variant="outline" className="text-lg font-bold">
              {totalDiasDisponiveis} dias
            </Badge>
          </div>
          
          <Button 
            onClick={() => onNovaSolicitacao(periodo)}
            className="w-full"
            disabled={totalDiasDisponiveis <= 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 