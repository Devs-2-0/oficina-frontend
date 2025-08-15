import { useAuth } from '@/contexts/auth-context'
import { Permissao } from '@/types/permissions'

export function usePermissions() {
  const { usuario, isLoading } = useAuth()

  const hasPermission = (permission: Permissao): boolean => {
    if (isLoading || !usuario?.permissoes) {
      console.log(`Permission check for ${permission}:`, { isLoading, hasPermissions: !!usuario?.permissoes, permissions: usuario?.permissoes })
      return false
    }
    const hasPerm = usuario.permissoes.includes(permission)
    console.log(`Permission check for ${permission}:`, { hasPerm, permissions: usuario.permissoes })
    return hasPerm
  }

  const hasAnyPermission = (permissions: Permissao[]): boolean => {
    if (isLoading || !usuario?.permissoes) return false
    return permissions.some(permission => usuario.permissoes.includes(permission))
  }

  const hasAllPermissions = (permissions: Permissao[]): boolean => {
    if (isLoading || !usuario?.permissoes) return false
    return permissions.every(permission => usuario.permissoes.includes(permission))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions: usuario?.permissoes || [],
    isLoading
  }
}
