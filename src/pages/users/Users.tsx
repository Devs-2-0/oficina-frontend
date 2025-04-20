import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, MoreHorizontal, Search, Trash2, UserPlus } from "lucide-react"
import { useState } from "react"
import { useGetUsers } from "./hooks/use-get-users"
import { UserModal } from "./components/user-modal"
import { useDeleteUserMutation } from "./hooks/use-delete-user"

export const Users = () => {
  const { toast } = useToast()

  // Use regular state instead of nuqs
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10 // Fixed at 10 items per page
  const [sortField, setSortField] = useState("matricula")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)

  const users = useGetUsers()

  console.log(users.data)

  const deleteUser = useDeleteUserMutation()

  // Filter users
  const filteredUsers = users.data.filter(
    (user) =>
      user.nome?.toLowerCase().includes(search.toLowerCase()) ||
      user.matricula?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.nome_usuario?.toLowerCase().includes(search.toLowerCase()),
  )

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a]
    const fieldB = b[sortField as keyof typeof b]

    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / perPage)
  const paginatedUsers = sortedUsers.slice((page - 1) * perPage, page * perPage)

  const handleSearch = () => {
    setPage(1)
  }

  const handleSort = (field: string) => {
    const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(direction)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-500">Ativo</Badge>
      case "ferias":
        return <Badge className="bg-blue-500">Férias</Badge>
      case "demitido":
        return <Badge className="bg-red-500">Demitido</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case "admin":
        return <Badge className="bg-purple-500">ADMINISTRADOR</Badge>
      case "prestador":
        return <Badge className="bg-blue-500">PRESTADOR</Badge>
      case "funcionario":
        return <Badge className="bg-green-500">FUNCIONÁRIO</Badge>
      default:
        return <Badge>{tipo?.toUpperCase()}</Badge>
    }
  }

  const handleOpenCreateModal = () => {
    setSelectedUserId(undefined)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (userId: string, tipo: string) => {
    if (tipo?.toLowerCase() === "prestador") {
      toast({
        title: "Ação não permitida",
        description: "Usuários do tipo prestador não podem ser editados.",
        variant: "destructive"
      })
      return
    }
    setSelectedUserId(userId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const currentPage = page
    const items = []

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than one page
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
    <div className="container py-6 space-y-6">
      <PageHeader title="Usuários" description="Gerencie os usuários do sistema" />

      {/* Usando nosso novo componente UserModal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={selectedUserId}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Buscar usuários..."
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
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("matricula")}>
                    <div className="flex items-center">
                      Matrícula
                      <span className="ml-1">{sortField === "matricula" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>
                    <div className="flex items-center">
                      Nome
                      <span className="ml-1">{sortField === "nome" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("nome_usuario")}>
                    <div className="flex items-center">
                      Username
                      <span className="ml-1">{sortField === "nome_usuario" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("email")}>
                    <div className="flex items-center">
                      Email
                      <span className="ml-1">{sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("tipo")}>
                    <div className="flex items-center">
                      Tipo
                      <span className="ml-1">{sortField === "tipo" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      <span className="ml-1">{sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => handleSort("grupo")}>
                    <div className="flex items-center">
                      Grupo
                      <span className="ml-1">{sortField === "grupo" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort("data_ultima_atualizacao")}
                  >
                    <div className="flex items-center">
                      Atualizado em
                      <span className="ml-1">
                        {sortField === "data_ultima_atualizacao" && (sortDirection === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className={user.tipo?.toLowerCase() === "prestador" ? "opacity-75" : ""}>
                      <TableCell className="font-medium">{user.matricula}</TableCell>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.nome_usuario}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>{getTipoBadge(user.tipo)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{typeof user.grupo === 'object' ? user.grupo.nome : user.grupo}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(user.data_ultima_atualizacao)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(user.id, user.tipo)}
                              className={user.tipo?.toLowerCase() === "prestador" ? "cursor-not-allowed opacity-50" : ""}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar usuário
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={async () => await deleteUser.mutateAsync(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir usuário
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
              Exibindo {Math.min(perPage, filteredUsers.length)} de {filteredUsers.length} resultados
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