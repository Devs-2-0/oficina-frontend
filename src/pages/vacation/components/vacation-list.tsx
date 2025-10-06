import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useGetFerias } from "../hooks/use-get-ferias"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function VacationList() {
  const { data: ferias, isLoading } = useGetFerias()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Descansos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead>Dias Totais</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ferias?.map((ferias) => (
              <TableRow key={ferias.id}>
                <TableCell>{ferias.funcionario.nome}</TableCell>
                <TableCell>
                  {format(new Date(ferias.dataInicio), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(ferias.dataFim), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>{ferias.diasTotais} dias</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ferias.status === "APROVADA"
                        ? "default"
                        : ferias.status === "PENDENTE"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {ferias.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 