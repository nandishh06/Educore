import React from 'react'
import { useAuth } from '../context/AuthContext'
import { hasPermission } from '../types/permissions'

interface PermissionGuardProps {
  permission: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth()

  if (!user) {
    return <>{fallback}</>
  }

  if (!hasPermission(user.role, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface ConditionalRenderProps {
  permission: string
  children: React.ReactNode
  renderIf?: boolean
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({ 
  permission, 
  children, 
  renderIf = true 
}) => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const hasAccess = hasPermission(user.role, permission)
  
  if (renderIf) {
    return hasAccess ? <>{children}</> : null
  } else {
    return hasAccess ? null : <>{children}</>
  }
}
