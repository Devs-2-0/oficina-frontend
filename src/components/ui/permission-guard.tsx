import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Permissao } from '@/types/permissions'

interface PermissionGuardProps {
  children: ReactNode
  permission?: Permissao
  permissions?: Permissao[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function PermissionGuard({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissions()

  // If still loading, show fallback or nothing
  if (isLoading) {
    return <>{fallback}</>
  }

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)
  } else {
    hasAccess = true
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
