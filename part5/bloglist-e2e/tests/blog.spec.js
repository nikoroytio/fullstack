const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    try {
      // Reset the database
      await request.post('http://localhost:3003/api/testing/reset')
      
      // Create a test user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Test User',
          username: 'testuser',
          password: 'password'
        }
      })
    } catch (error) {
      console.error('Error in beforeEach:', error)
    }

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // Debug: Print the page content
    console.log('Page content:', await page.content())
    
    // Debug: Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png' })
    
    // Check that the login form is visible
    await expect(page.getByText('Log in to application')).toBeVisible()
    
    // Check that the login form inputs are present
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    
    // Check that the login button is present
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // Fill in the login form
      const usernameInput = page.getByRole('textbox').first()
      const passwordInput = page.getByRole('textbox').nth(1)
      
      await usernameInput.fill('testuser')
      await passwordInput.fill('password')
      
      // Click the login button
      await page.getByRole('button', { name: 'login' }).click()
      
      // Check that the user is logged in
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })
  
    test('fails with wrong credentials', async ({ page }) => {
      // Fill in the login form with wrong credentials
      const usernameInput = page.getByRole('textbox')
      const passwordInput = page.getByLabel('password')
      
      await usernameInput.fill('testuser')
      await passwordInput.fill('wrongpassword')
      
      // Click the login button
      await page.getByRole('button', { name: 'login' }).click()
      
      // Add a small wait for the error notification to appear
      const errorNotification = page.getByRole('alert')
      await expect(errorNotification).toBeVisible()
      await expect(errorNotification).toContainText('wrong credentials')
      
      // Check that user is not logged in
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })
})