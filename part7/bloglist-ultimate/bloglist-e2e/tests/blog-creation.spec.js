const { test, expect, beforeEach, describe } = require('@playwright/test')

test.setTimeout(30000)

describe('Blog creation', () => {
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

    // Login first
    const usernameInput = page.getByRole('textbox').first()
    const passwordInput = page.getByRole('textbox').nth(1)
    
    await usernameInput.fill('testronno')
    await passwordInput.fill('testisalasana')
    await page.getByRole('button', { name: 'login' }).click()
    
    await expect(page.getByText('niko ronnonen logged in')).toBeVisible()
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Test Blog Title')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()
    
    const successNotification = page.locator('.success')
    await expect(successNotification).toBeVisible()
    await expect(successNotification).toContainText('a new blog Test Blog Title by Test Author added')
  })
})
