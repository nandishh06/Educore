import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasPermission } from '../types/permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  fallbackPath = '/dashboard' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if specific permission is required
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}

// Higher-order component for route protection
export const withPermission = (requiredPermission: string, fallbackPath?: string) => {
  return (Component: React.ComponentType<any>) => {
    return (props: any) => (
      <ProtectedRoute
        requiredPermission={requiredPermission}
        {...(fallbackPath !== undefined && { fallbackPath })}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

export default ProtectedRoute
