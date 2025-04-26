import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user, showNotification }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await removeBlog(blog.id)
        showNotification(`Blog "${blog.title}" by ${blog.author} was removed successfully`, 'success')
      } catch (error) {
        showNotification('error removing blog', 'error')
      }
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div data-testid='blog-basic'>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div data-testid='blog-details'>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => updateBlog(blog.id, { ...blog, likes: blog.likes + 1 })}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {user && blog.user && user.username === blog.user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog