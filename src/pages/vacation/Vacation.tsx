import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { useGetFerias } from "./hooks/use-get-ferias"
import { FeriasModal } from "./components/ferias-modal"
import { DetalhesFeriasModal } from "./components/detalhes-ferias"
import { SolicitacaoFerias } from "@/types/ferias"

export const Vacation = () => {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoFerias | null>(null)

  const { data: solicitacoes, isLoading } = useGetFerias()

  const getStatusBadge = (status: string) => {
    const styles = {
      Pendente: 'bg-yellow-500',
      Aprovado: 'bg-emerald-500',
      Rejeitado: 'bg-red-500'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const handleOpenDetails = (solicitacao: SolicitacaoFerias) => {
    setSelectedRequest(solicitacao)
    setDetailsModalOpen(true)
  }

  const handleEdit = () => {
    setDetailsModalOpen(false)
    setModalOpen(true)
  }

  const filteredRequests = solicitacoes?.filter(solicitacao =>
    solicitacao.funcionario.nome.toLowerCase().includes(search.toLowerCase()) ||
    solicitacao.departamento.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Férias</h2>
          <p className="text-muted-foreground">
            Gerencie as solicitações de férias dos funcionários
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          Nova Solicitação
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por funcionário ou departamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Término</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredRequests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Nenhuma solicitação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests?.map((solicitacao) => (
                <TableRow key={solicitacao.id}>
                  <TableCell>{solicitacao.funcionario.nome}</TableCell>
                  <TableCell>{solicitacao.departamento}</TableCell>
                  <TableCell>
                    {format(new Date(solicitacao.periodos[0].data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(solicitacao.periodos[0].data_termino), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{solicitacao.dias} dias</TableCell>
                  <TableCell>{getStatusBadge(solicitacao.status)}</TableCell>
                  <TableCell>
                    {format(new Date(solicitacao.data_solicitacao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenDetails(solicitacao)}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {modalOpen && (
        <FeriasModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          solicitacao={selectedRequest}
        />
      )}

      {detailsModalOpen && selectedRequest && (
        <DetalhesFeriasModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          solicitacao={selectedRequest}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}
