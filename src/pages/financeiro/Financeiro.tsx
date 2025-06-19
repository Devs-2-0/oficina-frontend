import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Download, Printer } from "lucide-react"
import { useState } from "react"
import { useGetFinanceiros } from "./hooks/use-get-financeiros"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { FinanceiroModal } from "./components/financeiro-modal"
import { Financeiro as FinanceiroType, ItemFinanceiro } from "@/types/financeiro"

export const Financeiro = () => {
  const { data: financeiros = [], isLoading } = useGetFinanceiros()
  const [search, setSearch] = useState("")
  const [selectedFinanceiro, setSelectedFinanceiro] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFinanceiroId, setEditingFinanceiroId] = useState<number>()

  const filteredFinanceiros = (financeiros as FinanceiroType[]).filter(
    (financeiro) =>
      financeiro.processo.toLowerCase().includes(search.toLowerCase()) ||
      financeiro.prestador.nome.toLowerCase().includes(search.toLowerCase()) ||
      financeiro.competencia.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      Pendente: 'bg-yellow-500',
      Pago: 'bg-emerald-500',
      Cancelado: 'bg-red-500'
    }
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
  }

  const selectedFinanceiroData = (financeiros as FinanceiroType[]).find(f => f.id === selectedFinanceiro)

  const handleOpenCreateModal = () => {
    setEditingFinanceiroId(undefined)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (id: number) => {
    setEditingFinanceiroId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFinanceiroId(undefined)
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Financeiro"
        description="Gerencie registros financeiros"
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Buscar registros..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar</span>
              </Button>
            </div>

            <Button size="sm" onClick={handleOpenCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Button>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Processo</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Nº Pagamento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor Líquido</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Carregando registros...
                    </TableCell>
                  </TableRow>
                ) : filteredFinanceiros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFinanceiros.map((financeiro) => (
                    <TableRow key={financeiro.id}>
                      <TableCell>{financeiro.processo}</TableCell>
                      <TableCell>{financeiro.competencia}</TableCell>
                      <TableCell>{financeiro.nro_pagamento}</TableCell>
                      <TableCell>{financeiro.tipo}</TableCell>
                      <TableCell>{financeiro.prestador.nome}</TableCell>
                      <TableCell>{new Date(financeiro.data_pagamento).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(financeiro.status)}</TableCell>
                      <TableCell>{formatCurrency(Number(financeiro.valor))}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedFinanceiro(financeiro.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver itens
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditModal(financeiro.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar registro
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir registro
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedFinanceiro} onOpenChange={() => setSelectedFinanceiro(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Registro Financeiro</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o registro financeiro e seus itens.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="itens" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="itens" className="flex-1">Itens Financeiros</TabsTrigger>
              <TabsTrigger value="notas" className="flex-1">Notas Fiscais</TabsTrigger>
            </TabsList>

            <TabsContent value="itens" className="space-y-6">
              {selectedFinanceiroData && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Informações do Registro</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Processo:</div>
                        <div>{selectedFinanceiroData.processo}</div>
                        <div>Competência:</div>
                        <div>{selectedFinanceiroData.competencia}</div>
                        <div>Nº Pagamento:</div>
                        <div>{selectedFinanceiroData.nro_pagamento}</div>
                        <div>Tipo:</div>
                        <div>{selectedFinanceiroData.tipo}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Detalhes do Pagamento</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Prestador:</div>
                        <div>{selectedFinanceiroData.prestador.nome}</div>
                        <div>Data de Pagamento:</div>
                        <div>{new Date(selectedFinanceiroData.data_pagamento).toLocaleDateString('pt-BR')}</div>
                        <div>Status:</div>
                        <div>{getStatusBadge(selectedFinanceiroData.status)}</div>
                        <div>Valor Líquido:</div>
                        <div>{formatCurrency(Number(selectedFinanceiroData.valor))}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Itens Financeiros</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>CÓD.</TableHead>
                          <TableHead>DESCRIÇÃO</TableHead>
                          <TableHead>REFERÊNCIA</TableHead>
                          <TableHead className="text-right">PROVENTOS</TableHead>
                          <TableHead className="text-right">DESCONTOS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedFinanceiroData.itens.map((item: ItemFinanceiro) => (
                          <TableRow key={item.codigo}>
                            <TableCell>{item.codigo}</TableCell>
                            <TableCell>{item.descricao}</TableCell>
                            <TableCell>{item.referencia}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.proventos)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.descontos)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-medium">
                          <TableCell colSpan={3} className="text-right">TOTAL</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(selectedFinanceiroData.itens.reduce((acc: number, item: ItemFinanceiro) => acc + item.proventos, 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(selectedFinanceiroData.itens.reduce((acc: number, item: ItemFinanceiro) => acc + item.descontos, 0))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="mt-6 rounded-md bg-muted p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">VALOR PARA EMISSÃO DA NOTA FISCAL:</span>
                        <span className="font-semibold text-lg">
                          {formatCurrency(Number(selectedFinanceiroData.valor))}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedFinanceiro(null)}>
                        Fechar
                      </Button>
                      <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </Button>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="notas" className="min-h-[400px] flex flex-col items-center justify-center space-y-4 text-center">
              <div className="border-2 border-dashed rounded-lg p-12 w-full max-w-xl">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-3xl">↑</div>
                  <p className="text-sm text-muted-foreground">
                    Arraste e solte sua nota fiscal aqui, ou clique para selecionar
                  </p>
                  <Button variant="outline" size="sm">
                    Selecionar arquivo
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Formatos suportados: PDF, JPEG, PNG, TIFF, Excel, CSV, XML (Máx: 10MB)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <FinanceiroModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        financeiroId={editingFinanceiroId}
      />
    </div>
  )
} 