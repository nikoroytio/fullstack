import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => 
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },
    appendComment(state, action) {
      const { blogId, comment } = action.payload
      return state.map(blog => 
        blog.id === blogId 
          ? { ...blog, comments: [...(blog.comments || []), comment] }
          : blog
      )
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog, appendComment } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1
    })
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const addComment = (blogId, comment) => {
  return async dispatch => {
    const { comment: newComment } = await blogService.addComment(blogId, comment)
    dispatch(appendComment({ blogId, comment: newComment }))
  }
}

export default blogSlice.reducer 