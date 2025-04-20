import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Group,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { UserAvatar } from "@/components/dashboard/user-avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useNaoVisualizadas } from "@/pages/feed/hooks/use-nao-visualizadas"
import { useAuth } from "@/contexts/auth-context"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}



export function DashboardSidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { toast } = useToast()
  const { logout, usuario } = useAuth()


  const { quantidadeNaoVisualizadas } = useNaoVisualizadas()

  const navItems: NavItem[] = [
    { title: "Feed", href: "/feed", icon: Home, badge: quantidadeNaoVisualizadas > 0 ? quantidadeNaoVisualizadas : undefined },
    { title: "Contratos", href: "/contratos", icon: FileText },
    { title: "Financeiro", href: "/financeiro", icon: Wallet },
    { title: "Férias", href: "/ferias", icon: Calendar },
    { title: "Usuários", href: "/usuarios", icon: Users },
    // { title: "Prestadores", href: "/prestadores", icon: BarChart },
    { title: "Grupos", href: "/grupos", icon: Group },
  ]

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) setCollapsed(savedState === "true")
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed))
  }, [collapsed])

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
    toast({
      title: collapsed ? "Sidebar expandida" : "Sidebar recolhida",
      duration: 2000,
    })
  }

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar transition-all duration-300 ease-in-out z-30",
          collapsed ? "w-24" : "w-72"
        )}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Link
            to="/dashboard"
            className={cn("flex items-center gap-3 font-semibold", collapsed ? "justify-center" : "flex-1")}
          >
            <div className="flex-shrink-0 h-9 w-9 rounded-md bg-white flex items-center justify-center overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-sem-textojfif%201-70bNzb6riBaosJdzTM56a40I1BX1V8.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </div>
            {!collapsed && <span className="text-sidebar-foreground text-lg font-medium truncate">Portal de Prestadores</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className={cn(
              "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed ? "ml-0" : "ml-auto"
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">{collapsed ? "Expandir" : "Recolher"} menu</span>
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
          <nav className="flex flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent",
                  location.pathname === item.href ? "bg-sidebar-accent font-medium" : "text-sidebar-foreground/80",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.title}</span>}
                {item.badge && !collapsed ? (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-primary">
                    {item.badge}
                  </span>
                ) : item.badge && collapsed ? (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-primary">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t border-sidebar-border p-4">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-2")}>
            {!collapsed ? (
              <div className="flex items-center min-w-0 flex-1">
                <UserAvatar name={usuario?.nome ?? ''} />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                    <UserAvatar name={usuario?.nome ?? ''} compact />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <div className="text-sm font-medium truncate">
                      {usuario?.nome}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!collapsed ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-full flex-shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sair</span>
              </Button>
            ) : null}
          </div>
        </div>
      </aside>

      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Abrir menu</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar">
          <div className="flex h-16 items-center border-b border-sidebar-border px-4">
            <Link to="/dashboard" className="flex items-center gap-3 font-semibold flex-1">
              <div className="flex-shrink-0 h-9 w-9 rounded-md bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-sem-textojfif%201-70bNzb6riBaosJdzTM56a40I1BX1V8.png"
                  alt="Logo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="text-sidebar-foreground text-lg font-medium truncate">Portal de Prestadores</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar menu</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
            <nav className="flex flex-col gap-1 p-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent",
                    location.pathname === item.href ? "bg-sidebar-accent font-medium" : "text-sidebar-foreground/80"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.badge ? (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-primary">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <UserAvatar name={usuario?.nome ?? ''} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-full flex-shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sair</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
