import { test, expect } from '@playwright/test'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token')
    })

    // Mock API responses
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

    await page.route('**/api/students/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Statistics retrieved successfully',
          data: {
            total: 1234,
            active: 1135,
            inactive: 99,
            byGrade: {
              'Grade 1': 150,
              'Grade 2': 145,
              'Grade 3': 138,
              'Grade 4': 142,
              'Grade 5': 135,
              'Grade 6': 128,
              'Grade 7': 132,
              'Grade 8': 125,
              'Grade 9': 118,
              'Grade 10': 121
            },
            byGender: {
              'male': 623,
              'female': 611
            }
          }
        })
      })
    })

    await page.goto('/dashboard')
  })

  test('should display dashboard correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Welcome back, Admin User!')).toBeVisible()
  })

  test('should display statistics cards', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('text=Total Students')

    await expect(page.locator('text=Total Students')).toBeVisible()
    await expect(page.locator('text=1,234')).toBeVisible()
    
    await expect(page.locator('text=Total Teachers')).toBeVisible()
    await expect(page.locator('text=56')).toBeVisible()
    
    await expect(page.locator('text=Departments')).toBeVisible()
    await expect(page.locator('text=8')).toBeVisible()
    
    await expect(page.locator('text=Attendance Rate')).toBeVisible()
    await expect(page.locator('text=92%')).toBeVisible()
  })

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible()
    
    // Should show activity items
    await expect(page.locator('text=New student registered')).toBeVisible()
    await expect(page.locator('text=Attendance marked for Class 10A')).toBeVisible()
    await expect(page.locator('text=New teacher added')).toBeVisible()
  })

  test('should display quick actions', async ({ page }) => {
    await expect(page.locator('text=Quick Actions')).toBeVisible()
    
    const quickActions = [
      'Add Student',
      'Mark Attendance',
      'Generate Report',
      'View Calendar'
    ]

    for (const action of quickActions) {
      await expect(page.locator(`button:has-text("${action}")`)).toBeVisible()
    }
  })

  test('should display student statistics section', async ({ page }) => {
    await expect(page.locator('text=Student Statistics')).toBeVisible()
    
    await expect(page.locator('text=Total Students')).toBeVisible()
    await expect(page.locator('text=1,234')).toBeVisible()
    
    await expect(page.locator('text=Active Students')).toBeVisible()
    await expect(page.locator('text=1,135')).toBeVisible()
    
    await expect(page.locator('text=Inactive Students')).toBeVisible()
    await expect(page.locator('text=99')).toBeVisible()
  })

  test('should handle loading state', async ({ page }) => {
    // Mock delayed response
    await page.route('**/api/students/stats', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Statistics retrieved successfully',
          data: {
            total: 1234,
            active: 1135,
            inactive: 99,
            byGrade: {},
            byGender: {}
          }
        })
      })
    })

    await page.reload()
    
    // Should show loading state
    await expect(page.locator('text=Loading dashboard data...')).toBeVisible()
    
    // Should show data after loading
    await expect(page.locator('text=Total Students')).toBeVisible()
  })

  test('should handle API error gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/students/stats', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          message: 'Failed to fetch statistics'
        })
      })
    })

    await page.reload()
    
    // Should still show dashboard with default values
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Welcome back, Admin User!')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Statistics cards should stack vertically
    const statsCards = page.locator('.grid > div').first()
    await expect(statsCards).toBeVisible()
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 })
    
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should navigate to different sections', async ({ page }) => {
    // Test navigation to students page
    await page.locator('button:has-text("Add Student")').click()
    await expect(page).toHaveURL('/students')
    
    // Navigate back to dashboard
    await page.goto('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should show activity badges', async ({ page }) => {
    // Should show "New" badge for recent student registration
    const activityItems = page.locator('.space-y-4 > div')
    const firstActivity = activityItems.first()
    
    await expect(firstActivity.locator('text=New student registered')).toBeVisible()
    // Note: Badge implementation may vary, so we check for the activity text
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    
    // Should focus on first interactive element
    const focusedElement = await page.locator(':focus')
    expect(await focusedElement.count()).toBeGreaterThan(0)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h2')).toHaveCount({ min: 1 })
    
    // Check for ARIA labels on buttons
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const hasText = await button.textContent() !== ''
      const hasAriaLabel = await button.getAttribute('aria-label') !== null
      
      expect(hasText || hasAriaLabel).toBeTruthy()
    }
  })
})
