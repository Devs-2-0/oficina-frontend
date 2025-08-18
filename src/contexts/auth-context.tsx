import { Usuario } from '@/http/services/login/post-login'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { getUsuario } from '@/http/services/usuario/get-usuario'
import { toast } from 'sonner'
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
  const [isLoading, setIsLoading] = useState(false)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const [isFromLogin, setIsFromLogin] = useState(false)

  const setUsuario = (novoUsuario: (Usuario & { permissoes?: Permissao[] }) | null) => {
    setUsuarioState(novoUsuario)
    if (novoUsuario) {
      localStorage.setItem('oficinaUID', String(novoUsuario.id))
    } else {
      localStorage.removeItem('oficinaUID')
    }
  }

  const setUsuarioFromLogin = (loginData: { usuario: Usuario; token: string }) => {
    console.log('🔐 setUsuarioFromLogin called with:', loginData)
    
    // Extract permissions from grupo.permissoes and flatten them
    const permissoes = loginData.usuario.grupo?.permissoes?.map(p => p.codigo as Permissao) || []
    console.log('🔐 Extracted permissions:', permissoes)
    
    const usuarioWithPermissions = {
      ...loginData.usuario,
      permissoes
    }
    
    setUsuario(usuarioWithPermissions)
    setHasAttemptedFetch(true) // Set to true to prevent useEffect from running again
    setIsFromLogin(true) // Mark that user was set from login
    localStorage.setItem('tokenOficina', loginData.token)
    setIsLoading(false)
    
    console.log('🔐 User set with permissions:', usuarioWithPermissions)
  }

  const logout = () => {
    setUsuarioState(null)
    setIsLoading(true)
    setHasAttemptedFetch(false)
    setIsFromLogin(false)
    localStorage.removeItem('oficinaUID')
    localStorage.removeItem('tokenOficina')
    window.location.href = '/login'
  }

  useEffect(() => {
    const buscarUsuario = async () => {
      console.log('🔄 useEffect buscarUsuario called')
      console.log('🔄 Current state:', { usuario, hasAttemptedFetch, isLoading, isFromLogin })
      
      const usuarioId = localStorage.getItem('oficinaUID')
      const rotaAtual = window.location.pathname

      if (!usuarioId && rotaAtual !== '/login' && rotaAtual !== '/recuperar-senha') {
        console.log('🔄 No user ID, redirecting to login')
        window.location.href = '/login'
        return
      }

      if (rotaAtual === '/login' || rotaAtual === '/recuperar-senha') {
        console.log('🔄 On login page, skipping')
        return
      }

      // If user was set from login, don't fetch again
      if (isFromLogin) {
        console.log('🔄 User was set from login, skipping fetch')
        return
      }

      // If we already have a user with permissions, don't fetch again
      if (usuario && usuario.permissoes && usuario.permissoes.length > 0) {
        console.log('🔄 User already has permissions, skipping')
        return
      }

      // If we already attempted to fetch, don't fetch again (prevents infinite loops)
      if (hasAttemptedFetch) {
        console.log('🔄 Already attempted fetch, skipping')
        return
      }

      console.log('🔄 Fetching user data...')
      // Only set loading to true if we're actually going to fetch user data
      setIsLoading(true)
      setHasAttemptedFetch(true)

      try {
        const usuario = await getUsuario(Number(usuarioId))
        console.log('🔄 User data fetched:', usuario)
        
        // Extract permissions from grupo.permissoes and flatten them
        const permissoes = usuario.grupo?.permissoes?.map(p => p.codigo as Permissao) || []
        console.log('🔄 Extracted permissions:', permissoes)
        
        const usuarioWithPermissions = {
          ...usuario,
          permissoes
        }
        
        setUsuarioState(usuarioWithPermissions)
        setIsLoading(false)
        console.log('🔄 User state updated with permissions')
      } catch (error) {
        console.error('🔄 Error fetching user:', error)
        localStorage.removeItem('oficinaUID')
        localStorage.removeItem('tokenOficina')
        setIsLoading(false)
        if (rotaAtual !== '/login' && rotaAtual !== '/recuperar-senha') {
          toast.error("Sessão expirada", {
            description: "Por favor, faça login novamente."
          })
          window.location.href = '/login'
        }
      }
    }

    buscarUsuario()
  }, [toast]) // Removed isFromLogin to prevent loops

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