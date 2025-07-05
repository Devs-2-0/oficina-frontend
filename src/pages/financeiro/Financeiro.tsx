import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, DollarSign } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <DollarSign className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Gestão Financeira
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Gerencie registros financeiros e pagamentos
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Search className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Registros Financeiros
                </h2>
                <p className="text-gray-600">
                  Visualize e gerencie todos os registros financeiros
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleOpenCreateModal}
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Registro
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar registros..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Processo</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Competência</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Nº Pagamento</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Tipo</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Prestador</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Data Pagamento</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Valor Líquido</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700"></div>
                          <span className="text-gray-600 font-medium">Carregando registros...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredFinanceiros.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <DollarSign className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum registro encontrado</h3>
                            <p className="text-gray-600">Não há registros financeiros cadastrados no sistema.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFinanceiros.map((financeiro) => (
                      <TableRow key={financeiro.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900 py-4">{financeiro.processo}</TableCell>
                        <TableCell className="py-4 text-gray-700">{financeiro.competencia}</TableCell>
                        <TableCell className="py-4 text-gray-700">{financeiro.nro_pagamento}</TableCell>
                        <TableCell className="py-4 text-gray-700">{financeiro.tipo}</TableCell>
                        <TableCell className="py-4 text-gray-700">{financeiro.prestador.nome}</TableCell>
                        <TableCell className="py-4 text-gray-700">{new Date(financeiro.data_pagamento).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="py-4">{getStatusBadge(financeiro.status)}</TableCell>
                        <TableCell className="py-4 text-gray-700 font-medium">{formatCurrency(Number(financeiro.valor))}</TableCell>
                        <TableCell className="text-right py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
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
      </div>

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
                    <div className="rounded-md border">
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
                            {selectedFinanceiroData.itens?.map((item: ItemFinanceiro) => (
                              <TableRow key={item.codigo}>
                                <TableCell>{item.codigo}</TableCell>
                                <TableCell>{item.descricao}</TableCell>
                                <TableCell>{item.referencia}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.proventos)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.descontos)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="notas" className="space-y-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Funcionalidade de notas fiscais em desenvolvimento.</p>
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