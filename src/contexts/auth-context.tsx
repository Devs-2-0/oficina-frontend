import { Usuario } from '@/http/services/login/post-login'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { getUsuario } from '@/http/services/usuario/get-usuario'
import { useToast } from '@/hooks/use-toast'
import { Permissao } from '@/types/permissions'

interface AuthContextType {
  usuario: (Usuario & { permissoes?: Permissao[] }) | null
  setUsuario: (usuario: (Usuario & { permissoes?: Permissao[] }) | null) => void
  setUsuarioFromLogin: (loginData: { usuario: Usuario; token: string }) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<(Usuario & { permissoes?: Permissao[] }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const setUsuario = (novoUsuario: (Usuario & { permissoes?: Permissao[] }) | null) => {
    setUsuarioState(novoUsuario)
    if (novoUsuario) {
      localStorage.setItem('oficinaUID', String(novoUsuario.id))
    } else {
      localStorage.removeItem('oficinaUID')
    }
  }

  const setUsuarioFromLogin = (loginData: { usuario: Usuario; token: string }) => {
    console.log('setUsuarioFromLogin called with:', loginData)
    
    // Extract permissions from grupo.permissoes and flatten them
    const permissoes = loginData.usuario.grupo?.permissoes?.map(p => p.codigo as Permissao) || []
    console.log('Extracted permissions:', permissoes)
    
    const usuarioWithPermissions = {
      ...loginData.usuario,
      permissoes
    }
    
    console.log('Setting usuario with permissions:', usuarioWithPermissions)
    setUsuario(usuarioWithPermissions)
    localStorage.setItem('tokenOficina', loginData.token)
    setIsLoading(false)
    console.log('Login process completed, isLoading set to false')
  }

  const logout = () => {
    setUsuarioState(null)
    setIsLoading(true)
    localStorage.removeItem('oficinaUID')
    localStorage.removeItem('tokenOficina')
    window.location.href = '/login'
  }

  useEffect(() => {
    const buscarUsuario = async () => {
      const usuarioId = localStorage.getItem('oficinaUID')
      const rotaAtual = window.location.pathname

      if (!usuarioId && rotaAtual !== '/login' && rotaAtual !== '/recuperar-senha') {
        window.location.href = '/login'
        setIsLoading(false)
        return
      }

      if (rotaAtual === '/login' || rotaAtual === '/recuperar-senha') {
        setIsLoading(false)
        return
      }

      try {
        const usuario = await getUsuario(Number(usuarioId))
        // Extract permissions from grupo.permissoes and flatten them
        const permissoes = usuario.grupo?.permissoes?.map(p => p.codigo as Permissao) || []
        
        const usuarioWithPermissions = {
          ...usuario,
          permissoes
        }
        
        setUsuarioState(usuarioWithPermissions)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        localStorage.removeItem('oficinaUID')
        localStorage.removeItem('tokenOficina')
        setIsLoading(false)
        if (rotaAtual !== '/login' && rotaAtual !== '/recuperar-senha') {
          toast({
            title: "Sessão expirada",
            description: "Por favor, faça login novamente.",
            variant: "destructive"
          })
          window.location.href = '/login'
        }
      }
    }

    buscarUsuario()
  }, [toast])

  console.log(usuario)

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, setUsuarioFromLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 