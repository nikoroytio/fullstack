import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog, addComment } from '../store/blogSlice'
import { setNotification } from '../store/notificationSlice'

const BlogView = () => {
  const [comment, setComment] = useState('')
  const id = useParams().id
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const blog = useSelector(state => 
    state.blogs.find(b => b.id === id)
  )

  if (!blog) {
    return null
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
    dispatch(setNotification({ 
      message: `Liked blog: ${blog.title}`,
      type: 'success'
    }))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification({ 
        message: `Deleted blog: ${blog.title}`,
        type: 'success'
      }))
      navigate('/')
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    dispatch(addComment(blog.id, comment))
    setComment('')
    dispatch(setNotification({ 
      message: 'Comment added',
      type: 'success'
    }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {blog.title}
            </h2>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            by {blog.author}
          </div>
          
          <div className="mt-4">
            <a 
              href={blog.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {blog.url}
            </a>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <span className="text-gray-700">{blog.likes} likes</span>
            <button
              onClick={handleLike}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Like
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Added by {blog.user.name}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
          
          <form onSubmit={handleComment} className="mb-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={comment}
                onChange={({ target }) => setComment(target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write a comment..."
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add comment
              </button>
            </div>
          </form>

          <ul className="space-y-3">
            {(blog.comments || []).map((comment, index) => (
              <li 
                key={index}
                className="bg-gray-50 px-4 py-3 rounded-md text-sm text-gray-700"
              >
                {comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BlogView 