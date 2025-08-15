import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Users as UsersIcon } from "lucide-react"
import { useState } from "react"
import { GroupModal } from "./components/group-modal"
import { useGetGrupos } from './hooks/use-get-grupos'
import { useDeleteGrupo } from './hooks/use-delete-grupo'
import type { Grupo } from '@/http/services/grupo/listar-grupos'
import { PermissionGuard } from "@/components/ui/permission-guard"

export const Groups = () => {
  const { toast } = useToast()
  const { data: grupos = [], isLoading: isLoadingGrupos } = useGetGrupos()
  const { mutate: excluirGrupo } = useDeleteGrupo()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10
  const [sortField, setSortField] = useState<keyof Grupo>("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined)

  // Filtro de grupos
  const filteredGroups = grupos.filter(
    (group: Grupo) =>
      group.id.toString().includes(search.toLowerCase()) ||
      group.nome.toLowerCase().includes(search.toLowerCase())
  )

  // Ordenação
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    const fieldA = a[sortField]
    const fieldB = b[sortField]

    if (!fieldA || !fieldB) return 0
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginação
  const totalPages = Math.ceil(sortedGroups.length / perPage)
  const paginatedGroups = sortedGroups.slice((page - 1) * perPage, page * perPage)

  const handleSort = (field: keyof Grupo) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(direction)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleOpenCreateModal = () => {
    setSelectedGroupId(undefined)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (groupId: number) => {
    setSelectedGroupId(groupId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDeleteGroup = async (groupId: number) => {
    try {
      excluirGrupo(groupId.toString())
      toast({
        title: "Sucesso",
        description: "Grupo excluído com sucesso",
      })
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o grupo",
        variant: "destructive",
      })
    }
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

  if (isLoadingGrupos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando grupos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <UsersIcon className="h-8 w-8 text-red-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Grupos
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Gerencie os grupos do sistema
              </p>
            </div>
          </div>
        </div>

        {/* Grupos Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Plus className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                Lista de Grupos
              </h2>
              <p className="text-gray-600">
                Visualize e gerencie todos os grupos cadastrados no sistema
              </p>
            </div>
            <PermissionGuard permission="criar_grupo">
              <Button 
                onClick={handleOpenCreateModal}
                className="bg-red-700 hover:bg-red-800 text-white border-red-700 hover:border-red-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Grupo
              </Button>
            </PermissionGuard>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar grupos..."
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
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("id")}>
                      <div className="flex items-center">
                        ID
                        <span className="ml-1">{sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer font-semibold text-gray-700 py-4" onClick={() => handleSort("nome")}>
                      <div className="flex items-center">
                        Nome
                        <span className="ml-1">{sortField === "nome" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Permissões</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedGroups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <UsersIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Nenhum grupo encontrado</h3>
                            <p className="text-gray-600">Não há grupos cadastrados no sistema.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedGroups.map((group: Grupo) => (
                      <TableRow key={group.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900 py-4">{group.id}</TableCell>
                        <TableCell className="py-4 text-gray-700">{group.nome}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {group.permissoes.map((permissao) => (
                              <Badge key={permissao.codigo} variant="secondary">
                                {permissao.codigo}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <PermissionGuard permissions={["atualizar_grupo", "excluir_grupo"]}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ações</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <PermissionGuard permission="atualizar_grupo">
                                  <DropdownMenuItem onClick={() => handleOpenEditModal(group.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar grupo
                                  </DropdownMenuItem>
                                </PermissionGuard>
                                <PermissionGuard permission="excluir_grupo">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteGroup(group.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir grupo
                                  </DropdownMenuItem>
                                </PermissionGuard>
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
              Exibindo {Math.min(perPage, filteredGroups.length)} de {filteredGroups.length} resultados
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
        <GroupModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          groupId={selectedGroupId?.toString()}
        />
      </div>
    </div>
  )
}