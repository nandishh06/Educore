import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Card, CardBody } from '../components/ui'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full">
        <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
          <CardBody>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Sign in to EduCore
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                School Management System
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  error={error ? '' : undefined}
                />
                
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  showPasswordToggle
                  error={error ? '' : undefined}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                fullWidth
                variant="primary"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Demo credentials:
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Admin: admin@educore.com / admin123
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Teacher: teacher@educore.com / teacher123
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Student: student@educore.com / student123
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Parent: parent@educore.com / parent123
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Principal: principal@educore.com / principal123
                </p>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Login
