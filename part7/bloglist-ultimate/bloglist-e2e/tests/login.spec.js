const { test, expect, beforeEach, describe } = require('@playwright/test')

test.setTimeout(30000)

describe('Login functionality', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('http://localhost:3003/api/testing/reset')
    expect(resetResponse.status()).toBe(204)
    
    const userResponse = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'niko ronnonen',
        username: 'testronno',
        password: 'testisalasana'
      }
    })
    expect(userResponse.status()).toBe(201)

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('succeeds with correct credentials', async ({ page }) => {
    const usernameInput = page.getByRole('textbox').first()
    const passwordInput = page.getByRole('textbox').nth(1)
    
    await usernameInput.fill('testronno')
    await passwordInput.fill('testisalasana')
    await page.getByRole('button', { name: 'login' }).click()
    
    await expect(page.getByText('niko ronnonen logged in')).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    const usernameInput = page.getByRole('textbox').first()
    const passwordInput = page.getByRole('textbox').nth(1)
    
    await usernameInput.fill('testronno')
    await passwordInput.fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()
    
    const errorNotification = page.locator('.error')
    await expect(errorNotification).toBeVisible()
    await expect(errorNotification).toContainText('wrong username or password')
    await expect(page.getByText('niko ronnonen logged in')).not.toBeVisible()
  })
})
