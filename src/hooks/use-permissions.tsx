import { useAuth } from '@/contexts/auth-context'
import { Permissao } from '@/types/permissions'

export function usePermissions() {
  const { usuario, isLoading } = useAuth()

  const userPermissions = usuario?.permissoes || []

  const hasPermission = (permission: Permissao): boolean => {
    if (!usuario || !usuario.permissoes) return false
    return usuario.permissoes.includes(permission)
  }

  const hasAnyPermission = (permissions: Permissao[]): boolean => {
    if (!usuario || !usuario.permissoes) return false
    return permissions.some(permission => usuario.permissoes!.includes(permission))
  }

  const hasAllPermissions = (permissions: Permissao[]): boolean => {
    if (!usuario || !usuario.permissoes) return false
    return permissions.every(permission => usuario.permissoes!.includes(permission))
  }

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading
  }
}
