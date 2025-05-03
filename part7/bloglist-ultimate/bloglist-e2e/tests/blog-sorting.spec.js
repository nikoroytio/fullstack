const { test, expect, beforeEach, describe } = require('@playwright/test')

test.setTimeout(30000)

describe('Blog sorting', () => {
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

  test('blogs are arranged by likes in descending order', async ({ page }) => {
    // Create first blog
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Blog with 2 likes')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()

    // Create second blog
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Blog with 1 like')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()

    // Create third blog
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('title').fill('Blog with 3 likes')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()

    // Wait for all blogs to be visible using more specific selectors
    const blog1 = page.getByTestId('blog-basic').filter({ hasText: 'Blog with 2 likes' })
    const blog2 = page.getByTestId('blog-basic').filter({ hasText: 'Blog with 1 like' })
    const blog3 = page.getByTestId('blog-basic').filter({ hasText: 'Blog with 3 likes' })

    await expect(blog1).toBeVisible({ timeout: 10000 })
    await expect(blog2).toBeVisible({ timeout: 10000 })
    await expect(blog3).toBeVisible({ timeout: 10000 })

    // Like the blogs in different amounts
    // First blog: 2 likes
    await blog1.getByRole('button', { name: 'view' }).click()
    const blog1Details = page.getByTestId('blog-details')
    await blog1Details.getByRole('button', { name: 'like' }).click()
    await blog1Details.getByRole('button', { name: 'like' }).click()
    await blog1.getByRole('button', { name: 'hide' }).click() // Hide details
    await page.waitForTimeout(1000) // Wait for sorting

    // Second blog: 1 like
    await blog2.getByRole('button', { name: 'view' }).click()
    const blog2Details = page.getByTestId('blog-details')
    await blog2Details.getByRole('button', { name: 'like' }).click()
    await blog2.getByRole('button', { name: 'hide' }).click() // Hide details
    await page.waitForTimeout(1000) // Wait for sorting

    // Third blog: 3 likes
    await blog3.getByRole('button', { name: 'view' }).click()
    const blog3Details = page.getByTestId('blog-details')
    await blog3Details.getByRole('button', { name: 'like' }).click()
    await blog3Details.getByRole('button', { name: 'like' }).click()
    await blog3Details.getByRole('button', { name: 'like' }).click()
    await blog3.getByRole('button', { name: 'hide' }).click() // Hide details
    await page.waitForTimeout(1000) // Wait for sorting

    // Wait for the final sorting to complete
    await expect(page.getByTestId('blog-basic').first()).toContainText('Blog with 3 likes', { timeout: 10000 })

    // Now get all blog containers after sorting is complete
    const blogContainers = page.getByTestId('blog-basic').all()
    const blogs = await blogContainers

    // Verify the order: 3 likes -> 2 likes -> 1 like
    const firstBlog = await blogs[0].textContent()
    const secondBlog = await blogs[1].textContent()
    const thirdBlog = await blogs[2].textContent()

    expect(firstBlog).toContain('Blog with 3 likes')
    expect(secondBlog).toContain('Blog with 2 likes')
    expect(thirdBlog).toContain('Blog with 1 like')
  })
})
