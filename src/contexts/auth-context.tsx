import { Usuario } from '@/http/services/login/post-login'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { getUsuario } from '@/http/services/usuario/get-usuario'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  usuario: Usuario | null
  setUsuario: (usuario: Usuario | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null)
  const { toast } = useToast()

  const setUsuario = (novoUsuario: Usuario | null) => {
    setUsuarioState(novoUsuario)
    if (novoUsuario) {
      localStorage.setItem('oficinaUID', String(novoUsuario.id))
    } else {
      localStorage.removeItem('oficinaUID')
    }
  }

  const logout = () => {
    setUsuarioState(null)
    localStorage.removeItem('oficinaUID')
    window.location.href = '/login'
  }

  useEffect(() => {
    const buscarUsuario = async () => {
      const usuarioId = localStorage.getItem('oficinaUID')
      const rotaAtual = window.location.pathname

      if (!usuarioId && rotaAtual !== '/login' && rotaAtual !== '/recuperar-senha') {
        window.location.href = '/login'
        return
      }

      if (rotaAtual === '/login' || rotaAtual === '/recuperar-senha') return

      try {
        const usuario = await getUsuario(Number(usuarioId))
        setUsuarioState(usuario)
      } catch (error) {
        console.error(error)
        localStorage.removeItem('oficinaUID')
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
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
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