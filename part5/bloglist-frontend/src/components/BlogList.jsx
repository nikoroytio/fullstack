import Blog from './Blog'

const BlogList = ({ blogs, updateBlog, removeBlog, user, showNotification }) => {
  return (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            user={user}
            showNotification={showNotification}
          />
        )}
    </div>
  )
}

export default BlogList