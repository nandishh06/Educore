import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login page correctly', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Sign in to EduCore')
    await expect(page.locator('text=School Management System')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    
    // Check for HTML5 validation or custom error messages
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeFocused()
    
    // Try to submit without filling email
    await page.keyboard.press('Tab')
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeFocused()
  })

  test('should handle invalid email format', async ({ page }) => {
    await page.locator('input[type="email"]').fill('invalid-email')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()
    
    // Should show email validation error
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeInvalid()
  })

  test('should handle successful login', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Login successful',
          data: {
            user: {
              userId: 'user123',
              email: 'admin@educore.com',
              name: 'Admin User',
              role: 'admin'
            },
            token: 'mock-jwt-token'
          }
        })
      })
    })

    await page.locator('input[type="email"]').fill('admin@educore.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should handle login failure', async ({ page }) => {
    // Mock failed API response
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          message: 'Invalid credentials'
        })
      })
    })

    await page.locator('input[type="email"]').fill('admin@educore.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.locator('button[type="submit"]').click()

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('should handle network error', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', async (route) => {
      await route.abort('failed')
    })

    await page.locator('input[type="email"]').fill('admin@educore.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()

    // Should show network error message
    await expect(page.locator('text=Network error')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    const toggleButton = page.locator('button[aria-label*="password"]')
    
    await passwordInput.fill('password123')
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    await expect(toggleButton).toHaveAttribute('aria-label', 'Hide password')
    
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(toggleButton).toHaveAttribute('aria-label', 'Show password')
  })

  test('should show loading state during login', async ({ page }) => {
    // Mock delayed response
    await page.route('**/api/auth/login', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Login successful',
          data: {
            user: {
              userId: 'user123',
              email: 'admin@educore.com',
              name: 'Admin User',
              role: 'admin'
            },
            token: 'mock-jwt-token'
          }
        })
      })
    })

    await page.locator('input[type="email"]').fill('admin@educore.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()

    // Should show loading state
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeDisabled()
    await expect(submitButton).toContainText('Signing in...')
  })

  test('should redirect to dashboard if already authenticated', async ({ page }) => {
    // Mock token verification
    await page.route('**/api/auth/verify-token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Token is valid',
          data: {
            valid: true,
            user: {
              userId: 'user123',
              email: 'admin@educore.com',
              name: 'Admin User',
              role: 'admin'
            }
          }
        })
      })
    })

    // Set token in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token')
    })

    await page.goto('/login')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should show demo credentials', async ({ page }) => {
    await expect(page.locator('text=Demo credentials: admin@educore.com / password123')).toBeVisible()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.locator('input[type="email"]').fill('admin@educore.com')
    
    // Tab to password field
    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="password"]')).toBeFocused()
    
    await page.locator('input[type="password"]').fill('password123')
    
    // Tab to submit button
    await page.keyboard.press('Tab')
    await expect(page.locator('button[type="submit"]')).toBeFocused()
    
    // Submit with Enter
    await page.keyboard.press('Enter')
    
    // Should attempt to login
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })
})
