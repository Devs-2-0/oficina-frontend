import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus } from "lucide-react"
import { PeriodoElegivel } from "@/http/services/ferias/get-periodo-elegivel"
import { PermissionGuard } from "@/components/ui/permission-guard"

interface PeriodoElegivelCardProps {
  periodo: PeriodoElegivel
  onNovaSolicitacao: (periodo: PeriodoElegivel) => void
}

export function PeriodoElegivelCard({ periodo, onNovaSolicitacao }: PeriodoElegivelCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (diasDisponiveis: number) => {
    if (diasDisponiveis === 0) {
      return 'bg-gray-100 text-gray-800 border-gray-200'
    } else if (diasDisponiveis < 10) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    } else {
      return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusText = (diasDisponiveis: number) => {
    if (diasDisponiveis === 0) {
      return 'Esgotado'
    } else if (diasDisponiveis < 10) {
      return 'Parcialmente utilizado'
    } else {
      return 'Disponível'
    }
  }

  const totalDiasDisponiveis = periodo.diasVencidos + periodo.diasProporcionais - periodo.diasPagos

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Período Aquisitivo
            </CardTitle>
            <p className="text-sm text-gray-600">
              {formatDate(periodo.inicioPeriodo)} - {formatDate(periodo.fimPeriodo)}
            </p>
          </div>
          <Badge className={`${getStatusColor(totalDiasDisponiveis)} font-medium`}>
            {getStatusText(totalDiasDisponiveis)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              <span className="font-medium">{totalDiasDisponiveis}</span> dias disponíveis
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              <span className="font-medium">{periodo.diasPagos}</span> dias utilizados
            </span>
          </div>
        </div>

        <div className="pt-2">
          <PermissionGuard permission="criar_solicitacao">
            <Button 
              onClick={() => onNovaSolicitacao(periodo)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0"
              disabled={totalDiasDisponiveis <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Solicitar Férias
            </Button>
          </PermissionGuard>
        </div>
      </CardContent>
    </Card>
  )
} 