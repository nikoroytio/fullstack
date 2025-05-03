const { test, expect, beforeEach, describe } = require('@playwright/test')

test.setTimeout(30000)

describe('Blog authorization', () => {
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

  test('delete button is only visible to blog creator', async ({ page, request }) => {
    // Create a second test user
    const secondUserResponse = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'second user',
        username: 'seconduser',
        password: 'secondpassword'
      }
    })
    expect(secondUserResponse.status()).toBe(201)

    // Create a blog with the first user
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Blog to Check Delete Button')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()

    const blogContainer = page.getByTestId('blog-basic').filter({ hasText: 'Blog to Check Delete Button' })
    await expect(blogContainer).toBeVisible({ timeout: 10000 })

    await blogContainer.getByRole('button', { name: 'view' }).click()
    
    const blogDetails = page.getByTestId('blog-details')
    await expect(blogDetails.getByRole('button', { name: 'remove' })).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: 'logout' }).click()

    const usernameInput = page.getByRole('textbox').first()
    const passwordInput = page.getByRole('textbox').nth(1)
    
    await usernameInput.fill('seconduser')
    await passwordInput.fill('secondpassword')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('second user logged in')).toBeVisible({ timeout: 10000 })

    const sameBlogContainer = page.getByTestId('blog-basic').filter({ hasText: 'Blog to Check Delete Button' })
    await sameBlogContainer.getByRole('button', { name: 'view' }).click()

    const sameBlogDetails = page.getByTestId('blog-details')
    await expect(sameBlogDetails.getByRole('button', { name: 'remove' })).not.toBeVisible({ timeout: 10000 })
  })
})
