import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@context/AuthContext'
import { AuthService } from '@services'

// Mock the AuthService
vi.mock('@services/AuthService', () => ({
  AuthService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn(),
    setToken: vi.fn(),
    clearToken: vi.fn(),
    isAuthenticated: vi.fn(),
    verifyToken: vi.fn(),
  },
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  Navigate: () => <div data-testid="navigate">Navigate</div>,
}))

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, register } = useAuth()
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? `${user.name} (${user.email})` : 'no user'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => register({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
        role: 'admin'
      })}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('provides default auth state', () => {
    ;(AuthService.getToken as vi.Mock).mockReturnValue(null)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(false)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated')
    expect(screen.getByTestId('user-info')).toHaveTextContent('no user')
  })

  it('initializes with existing token', async () => {
    const mockToken = 'valid-token'
    const mockUser = {
      userId: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const
    }

    ;(AuthService.getToken as vi.Mock).mockReturnValue(mockToken)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(true)
    ;(AuthService.verifyToken as vi.Mock).mockResolvedValue({
      data: { valid: true, user: mockUser }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)')
    })

    expect(AuthService.verifyToken).toHaveBeenCalledWith()
  })

  it('handles login successfully', async () => {
    const user = userEvent.setup()
    const mockToken = 'valid-token'
    const mockUser = {
      userId: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const
    }

    ;(AuthService.getToken as vi.Mock).mockReturnValue(null)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(false)
    ;(AuthService.login as vi.Mock).mockResolvedValue({
      data: { user: mockUser, token: mockToken }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)')
    })

    expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password')
    expect(AuthService.setToken).toHaveBeenCalledWith(mockToken)
  })

  it('handles login failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'

    ;(AuthService.getToken as vi.Mock).mockReturnValue(null)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(false)
    ;(AuthService.login as vi.Mock).mockRejectedValue(new Error(errorMessage))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    
    // Mock console.error to avoid test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('no user')
    })

    expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password')
    consoleSpy.mockRestore()
  })

  it('handles registration successfully', async () => {
    const user = userEvent.setup()
    const mockToken = 'valid-token'
    const mockUser = {
      userId: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const
    }

    ;(AuthService.getToken as vi.Mock).mockReturnValue(null)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(false)
    ;(AuthService.register as vi.Mock).mockResolvedValue({
      data: { user: mockUser, token: mockToken }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const registerButton = screen.getByText('Register')
    await user.click(registerButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)')
    })

    expect(AuthService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      role: 'admin'
    })
    expect(AuthService.setToken).toHaveBeenCalledWith(mockToken)
  })

  it('handles logout', async () => {
    const user = userEvent.setup()
    const mockToken = 'valid-token'
    const mockUser = {
      userId: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const
    }

    // Start with authenticated state
    ;(AuthService.getToken as vi.Mock).mockReturnValue(mockToken)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(true)
    ;(AuthService.verifyToken as vi.Mock).mockResolvedValue({
      data: { valid: true, user: mockUser }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Wait for initial authentication
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
    })

    // Mock logout
    ;(AuthService.logout as vi.Mock).mockResolvedValue(undefined)

    const logoutButton = screen.getByText('Logout')
    await user.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('no user')
    })

    expect(AuthService.logout).toHaveBeenCalled()
  })

  it('handles token verification failure', async () => {
    ;(AuthService.getToken as vi.Mock).mockReturnValue('invalid-token')
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(true)
    ;(AuthService.verifyToken as vi.Mock).mockRejectedValue(new Error('Invalid token'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('no user')
    })

    expect(AuthService.clearToken).toHaveBeenCalled()
  })

  it('throws error when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })

  it('handles invalid server response during login', async () => {
    const user = userEvent.setup()

    ;(AuthService.getToken as vi.Mock).mockReturnValue(null)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(false)
    ;(AuthService.login as vi.Mock).mockResolvedValue({
      data: null // Invalid response
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated')
    })

    consoleSpy.mockRestore()
  })

  it('handles invalid server response during registration', async () => {
    const user = userEvent.setup()

    ;(AuthService.getToken as vi.Mock).mockReturnValue(null)
    ;(AuthService.isAuthenticated as vi.Mock).mockReturnValue(false)
    ;(AuthService.register as vi.Mock).mockResolvedValue({
      data: null // Invalid response
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const registerButton = screen.getByText('Register')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await user.click(registerButton)

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated')
    })

    consoleSpy.mockRestore()
  })
})
