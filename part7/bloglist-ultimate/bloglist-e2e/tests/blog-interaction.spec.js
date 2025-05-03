const { test, expect, beforeEach, describe } = require('@playwright/test')

test.setTimeout(30000)

describe('Blog interactions', () => {
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

  test('a blog can be liked', async ({ page }) => {
    // Create a blog first
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Blog to Like')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()
    
    const blogContainer = page.getByTestId('blog-basic').filter({ hasText: 'Blog to Like' })
    await expect(blogContainer).toBeVisible({ timeout: 10000 })
    
    await blogContainer.getByRole('button', { name: 'view' }).click()
    
    const blogDetails = page.getByTestId('blog-details')
    await expect(blogDetails).toBeVisible({ timeout: 10000 })
    
    const likeButton = blogDetails.getByRole('button', { name: 'like' })
    await expect(likeButton).toBeEnabled({ timeout: 10000 })
    
    await likeButton.click()
    
    await expect(blogDetails.getByText('likes 1')).toBeVisible({ timeout: 10000 })
  })

  test('user can delete their own blog', async ({ page }) => {
    // Create a blog first
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Blog to Delete')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()
    
    const blogContainer = page.getByTestId('blog-basic').filter({ hasText: 'Blog to Delete' })
    await blogContainer.getByRole('button', { name: 'view' }).click()
    
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Remove blog Blog to Delete by Test Author?')
      await dialog.accept()
    })
    
    await page.getByTestId('blog-details').getByRole('button', { name: 'remove' }).click()
    
    const successNotification = page.locator('.success')
    await expect(successNotification).toBeVisible()
    await expect(successNotification).toContainText('Blog "Blog to Delete" by Test Author was removed successfully')
    
    await expect(page.getByText('Blog to Delete')).not.toBeVisible()
  })
})
