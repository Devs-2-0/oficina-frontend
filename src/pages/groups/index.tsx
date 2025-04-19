import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { GroupModal } from "./components/group-modal"
import { useGetGrupos } from './hooks/use-get-grupos'
import { useDeleteGrupo } from './hooks/use-delete-grupo'
import type { Grupo } from '@/http/services/grupo/listar-grupos'

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

  const handleSearch = () => {
    setPage(1)
  }

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
    return <div>Carregando...</div>
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Grupos" description="Gerencie os grupos do sistema" />

      <GroupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        groupId={selectedGroupId?.toString()}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Buscar grupos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
              <Button type="submit" size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar</span>
              </Button>
            </div>

            <Button size="sm" onClick={handleOpenCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Grupo
            </Button>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      ID
                      <span className="ml-1">{sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>
                    <div className="flex items-center">
                      Nome
                      <span className="ml-1">{sortField === "nome" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Nenhum grupo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGroups.map((group: Grupo) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.id}</TableCell>
                      <TableCell>{group.nome}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {group.permissoes.map((permissao) => (
                            <Badge key={permissao.codigo} variant="secondary">
                              {permissao.nome}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(group.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar grupo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir grupo
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

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Exibindo {Math.min(perPage, filteredGroups.length)} de {filteredGroups.length} resultados
            </div>

            <Pagination className="mx-auto sm:mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}