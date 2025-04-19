import { useGetFerias } from "./hooks/use-get-ferias"
import { VacationTable } from "./components/vacation-table"
import { Loader2 } from "lucide-react"

export function VacationPage() {
  const { data: solicitacoes, isLoading } = useGetFerias()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Férias</h1>
      </div>

      <VacationTable solicitacoes={solicitacoes} />
    </div>
  )
} 