const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithMultipleBlogs } = require('./test_helper.json')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has multiple blogs, equals the sum of likes', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        assert.strictEqual(result, 36)
    })

    test('when list is empty, equals zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })
})

describe('favorite blog', () => {
    test('when list has only one blog, returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, listWithOneBlog[0])
    })

    test('when list has multiple blogs, returns the one with most likes', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        })
    })

    test('when list is empty, returns null', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })
})

describe('most blogs', () => {
    test('when list has only one blog, returns that author with count 1', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            blogs: 1
        })
    })

    test('when list has multiple blogs, returns the author with most blogs', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {
            author: "Robert C. Martin",
            blogs: 3
        })
    })

    test('when list is empty, returns null', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, null)
    })
})

describe('most likes', () => {
    test('when list has only one blog, returns that author with their likes', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 5
        })
    })

    test('when list has multiple blogs, returns the author with most total likes', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })

    test('when list is empty, returns null', () => {
        const result = listHelper.mostLikes([])
        assert.strictEqual(result, null)
    })
}) 