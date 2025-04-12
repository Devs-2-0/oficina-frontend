import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, MoreHorizontal, Search, Trash2, UserPlus } from "lucide-react"
import { useState } from "react"

const users = [
  {
    id: 1,
    matricula: "M001",
    nome: "João Silva",
    identificacao: "123.456.789-00",
    username: "joao.silva",
    status: "ativo",
    senha: "********",
    endereco: "Rua das Flores, 123",
    bairro: "Centro",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Administrador",
    email: "joao.silva@exemplo.com",
    dataAtualizacao: "2023-04-01T14:30:00Z",
  },
  {
    id: 2,
    matricula: "M002",
    nome: "Maria Oliveira",
    identificacao: "987.654.321-00",
    username: "maria.oliveira",
    status: "ativo",
    senha: "********",
    endereco: "Avenida Paulista, 1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Gerente",
    email: "maria.oliveira@exemplo.com",
    dataAtualizacao: "2023-03-25T10:15:00Z",
  },
  {
    id: 3,
    matricula: "M003",
    nome: "Carlos Santos",
    identificacao: "456.789.123-00",
    username: "carlos.santos",
    status: "ferias",
    senha: "********",
    endereco: "Rua Augusta, 500",
    bairro: "Consolação",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Analista",
    email: "carlos.santos@exemplo.com",
    dataAtualizacao: "2023-03-20T09:45:00Z",
  },
  {
    id: 4,
    matricula: "M004",
    nome: "Ana Pereira",
    identificacao: "321.654.987-00",
    username: "ana.pereira",
    status: "demitido",
    senha: "********",
    endereco: "Rua Oscar Freire, 200",
    bairro: "Jardins",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Assistente",
    email: "ana.pereira@exemplo.com",
    dataAtualizacao: "2023-03-15T16:20:00Z",
  },
  {
    id: 5,
    matricula: "M005",
    nome: "Pedro Costa",
    identificacao: "789.123.456-00",
    username: "pedro.costa",
    status: "ativo",
    senha: "********",
    endereco: "Rua Haddock Lobo, 350",
    bairro: "Cerqueira César",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Analista",
    email: "pedro.costa@exemplo.com",
    dataAtualizacao: "2023-03-10T11:30:00Z",
  },
  {
    id: 6,
    matricula: "M006",
    nome: "Fernanda Lima",
    identificacao: "654.321.987-00",
    username: "fernanda.lima",
    status: "ativo",
    senha: "********",
    endereco: "Rua Consolação, 450",
    bairro: "Consolação",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Gerente",
    email: "fernanda.lima@exemplo.com",
    dataAtualizacao: "2023-03-05T13:45:00Z",
  },
  {
    id: 7,
    matricula: "M007",
    nome: "Roberto Alves",
    identificacao: "321.987.654-00",
    username: "roberto.alves",
    status: "ferias",
    senha: "********",
    endereco: "Avenida Rebouças, 800",
    bairro: "Pinheiros",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Analista",
    email: "roberto.alves@exemplo.com",
    dataAtualizacao: "2023-02-28T10:30:00Z",
  },
  {
    id: 8,
    matricula: "M008",
    nome: "Camila Souza",
    identificacao: "987.321.654-00",
    username: "camila.souza",
    status: "ativo",
    senha: "********",
    endereco: "Rua Pamplona, 250",
    bairro: "Jardim Paulista",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Assistente",
    email: "camila.souza@exemplo.com",
    dataAtualizacao: "2023-02-25T15:20:00Z",
  },
  {
    id: 9,
    matricula: "M009",
    nome: "Lucas Martins",
    identificacao: "654.987.321-00",
    username: "lucas.martins",
    status: "demitido",
    senha: "********",
    endereco: "Rua Bela Cintra, 600",
    bairro: "Consolação",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Analista",
    email: "lucas.martins@exemplo.com",
    dataAtualizacao: "2023-02-20T09:15:00Z",
  },
  {
    id: 10,
    matricula: "M010",
    nome: "Juliana Costa",
    identificacao: "321.654.987-00",
    username: "juliana.costa",
    status: "ativo",
    senha: "********",
    endereco: "Avenida Brigadeiro Faria Lima, 1500",
    bairro: "Jardim Paulistano",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Gerente",
    email: "juliana.costa@exemplo.com",
    dataAtualizacao: "2023-02-15T14:45:00Z",
  },
  {
    id: 11,
    matricula: "M011",
    nome: "Marcelo Santos",
    identificacao: "987.654.321-00",
    username: "marcelo.santos",
    status: "ativo",
    senha: "********",
    endereco: "Rua Augusta, 300",
    bairro: "Consolação",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Administrador",
    email: "marcelo.santos@exemplo.com",
    dataAtualizacao: "2023-02-10T11:30:00Z",
  },
  {
    id: 12,
    matricula: "M012",
    nome: "Patricia Oliveira",
    identificacao: "654.321.987-00",
    username: "patricia.oliveira",
    status: "ferias",
    senha: "********",
    endereco: "Rua Haddock Lobo, 200",
    bairro: "Cerqueira César",
    cidade: "São Paulo",
    uf: "SP",
    grupo: "Analista",
    email: "patricia.oliveira@exemplo.com",
    dataAtualizacao: "2023-02-05T10:15:00Z",
  },
]

export const Users = () => {
  const { toast } = useToast()

  // Use regular state instead of nuqs
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10 // Fixed at 10 items per page
  const [sortField, setSortField] = useState("matricula")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<(typeof users)[0] | null>(null)

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(search.toLowerCase()) ||
      user.matricula.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()),
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

  const handleEdit = (user: (typeof users)[0]) => {
    setCurrentUser(user)
    setIsDialogOpen(true)
  }

  const handleAddUser = () => {
    setCurrentUser(null)
    setIsDialogOpen(true)
  }

  const handleSaveUser = () => {
    toast({
      title: currentUser ? "Usuário atualizado" : "Usuário criado",
      description: currentUser
        ? `As informações de ${currentUser.nome} foram atualizadas com sucesso.`
        : "Novo usuário criado com sucesso.",
      duration: 3000,
    })
    setIsDialogOpen(false)
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

            <Button size="sm" onClick={handleAddUser}>
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
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("username")}>
                    <div className="flex items-center">
                      Username
                      <span className="ml-1">{sortField === "username" && (sortDirection === "asc" ? "↑" : "↓")}</span>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("email")}>
                    <div className="flex items-center">
                      Email
                      <span className="ml-1">{sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}</span>
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
                    onClick={() => handleSort("dataAtualizacao")}
                  >
                    <div className="flex items-center">
                      Atualizado em
                      <span className="ml-1">
                        {sortField === "dataAtualizacao" && (sortDirection === "asc" ? "↑" : "↓")}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.matricula}</TableCell>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.username}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{user.grupo}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(user.dataAtualizacao)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar usuário
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                toast({
                                  title: "Excluir usuário",
                                  description: `Usuário ${user.nome} excluído com sucesso.`,
                                  variant: "destructive",
                                  duration: 3000,
                                })
                              }
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {currentUser
                ? "Edite as informações do usuário abaixo."
                : "Preencha as informações para criar um novo usuário."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input id="matricula" defaultValue={currentUser?.matricula || ""} placeholder="Matrícula" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" defaultValue={currentUser?.nome || ""} placeholder="Nome completo" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identificacao">Identificação</Label>
                <Input id="identificacao" defaultValue={currentUser?.identificacao || ""} placeholder="CPF" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={currentUser?.username || ""} placeholder="Nome de usuário" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentUser?.email || ""} placeholder="Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={currentUser?.status || "ativo"}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="ferias">Férias</SelectItem>
                    <SelectItem value="demitido">Demitido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grupo">Grupo</Label>
                <Select defaultValue={currentUser?.grupo || ""}>
                  <SelectTrigger id="grupo">
                    <SelectValue placeholder="Selecione o grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Analista">Analista</SelectItem>
                    <SelectItem value="Assistente">Assistente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  defaultValue={currentUser?.senha || ""}
                  placeholder={currentUser ? "Deixe em branco para manter" : "Senha"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" defaultValue={currentUser?.endereco || ""} placeholder="Endereço" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" defaultValue={currentUser?.bairro || ""} placeholder="Bairro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" defaultValue={currentUser?.cidade || ""} placeholder="Cidade" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF</Label>
                <Select defaultValue={currentUser?.uf || ""}>
                  <SelectTrigger id="uf">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">SP</SelectItem>
                    <SelectItem value="RJ">RJ</SelectItem>
                    <SelectItem value="MG">MG</SelectItem>
                    <SelectItem value="RS">RS</SelectItem>
                    <SelectItem value="PR">PR</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="BA">BA</SelectItem>
                    <SelectItem value="DF">DF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSaveUser}>
              {currentUser ? "Salvar alterações" : "Criar usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
