import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Plus, Search, Trash2, Building2 } from "lucide-react"
import { useState } from "react"
import { DepartamentoModal } from "./components/departamento-modal"
import { useGetDepartamentos } from './hooks/use-get-departamentos'
import { useDeleteDepartamento } from './hooks/use-delete-departamento'
import type { Departamento } from '@/types/departamento'
import { PermissionGuard } from "@/components/ui/permission-guard"

export const Departamentos = () => {
  const { toast } = useToast()
  const { data: departamentos = [], isLoading: isLoadingDepartamentos } = useGetDepartamentos()
  const { mutate: excluirDepartamento } = useDeleteDepartamento()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10
  const [sortField, setSortField] = useState<keyof Departamento>("codigo")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtro de departamentos
  const filteredDepartamentos = departamentos.filter(
    (departamento: Departamento) =>
      departamento.codigo.toLowerCase().includes(search.toLowerCase()) ||
      departamento.descricao.toLowerCase().includes(search.toLowerCase())
  )

  // Ordenação
  const sortedDepartamentos = [...filteredDepartamentos].sort((a, b) => {
    const fieldA = a[sortField]
    const fieldB = b[sortField]

    if (!fieldA || !fieldB) return 0
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginação
  const totalPages = Math.ceil(sortedDepartamentos.length / perPage)
  const paginatedDepartamentos = sortedDepartamentos.slice((page - 1) * perPage, page * perPage)

  const handleSort = (field: keyof Departamento) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(direction)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleOpenCreateModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDeleteDepartamento = async (codigo: string) => {
    try {
      excluirDepartamento(codigo)
      toast({
        title: "Sucesso",
        description: "Departamento excluído com sucesso",
      })
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o departamento",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  // Gerar itens de paginação
  const renderPaginationItems = () => {
    const currentPage = page
    const items = []

    // Sempre mostrar primeira página
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Mostrar reticências se necessário
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Mostrar página atual e páginas circundantes
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Mostrar reticências se necessário
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Sempre mostrar última página se houver mais de uma página
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink isActive={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Building2 className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Departamentos
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Gerencie os departamentos do sistema
              </p>
            </div>
          </div>
        </div>

        {/* Departamentos Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Plus className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                Lista de Departamentos
              </h2>
              <p className="text-gray-600">
                Visualize e gerencie todos os departamentos cadastrados no sistema
              </p>
            </div>
            <PermissionGuard permission="criar_departamento">
              <Button 
                onClick={handleOpenCreateModal}
                className="bg-red-700 hover:bg-red-800 text-white border-red-700 hover:border-red-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Departamento
              </Button>
            </PermissionGuard>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar departamentos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("codigo")}>
                      <div className="flex items-center">
                        Código
                        <span className="ml-1">{sortField === "codigo" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("descricao")}>
                      <div className="flex items-center">
                        Descrição
                        <span className="ml-1">{sortField === "descricao" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Data de Criação</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Última Atualização</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingDepartamentos ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700"></div>
                          <span className="text-gray-600 font-medium">Carregando departamentos...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedDepartamentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Building2 className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum departamento encontrado</h3>
                            <p className="text-gray-600">Não há departamentos cadastrados no sistema.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDepartamentos.map((departamento: Departamento) => (
                      <TableRow key={departamento.codigo} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900 py-4">{departamento.codigo}</TableCell>
                        <TableCell className="py-4 text-gray-700">{departamento.descricao}</TableCell>
                        <TableCell className="py-4 text-gray-700">{formatDate(departamento.data_criacao)}</TableCell>
                        <TableCell className="py-4 text-gray-700">{formatDate(departamento.data_ultima_atualizacao)}</TableCell>
                        <TableCell className="text-right py-4">
                          <PermissionGuard permission="excluir_departamento">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ações</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteDepartamento(departamento.codigo)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir departamento
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </PermissionGuard>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Exibindo {Math.min(perPage, filteredDepartamentos.length)} de {filteredDepartamentos.length} resultados
            </div>

            <Pagination className="mx-auto sm:mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    className={`${page <= 1 ? "pointer-events-none opacity-50" : ""} hover:bg-red-100 dark:hover:bg-red-900/50`}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    className={`${page >= totalPages ? "pointer-events-none opacity-50" : ""} hover:bg-red-100 dark:hover:bg-red-900/50`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {/* Modal */}
        <DepartamentoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  )
}
