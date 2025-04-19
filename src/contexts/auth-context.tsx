import { Usuario } from '@/http/services/login/post-login'
import { createContext, useContext, useState, ReactNode } from 'react'



interface AuthContextType {
  usuario: Usuario | null
  setUsuario: (usuario: Usuario | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  console.log(usuario, 'usuário no contexto')

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
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