import { useState, useEffect, useRef } from 'react'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import useNotification from './hooks/useNotification'
import useBlogs from './hooks/useBlogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const { notification, notificationType, showNotification } = useNotification()
  const { blogs, createBlog, updateBlog, removeBlog } = useBlogs(user)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await createBlog(blogObject)
      blogFormRef.current.toggleVisibility()
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (exception) {
      showNotification('error creating blog', 'error')
    }
  }

  const handleUpdateBlog = async (id, blogObject) => {
    try {
      await updateBlog(id, blogObject)
    } catch (exception) {
      showNotification('error updating blog', 'error')
    }
  }

  const handleRemoveBlog = async (id) => {
    try {
      await removeBlog(id)
    } catch (exception) {
      showNotification('error removing blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} type={notificationType} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      <BlogList
        blogs={blogs}
        updateBlog={handleUpdateBlog}
        removeBlog={handleRemoveBlog}
        user={user}
        showNotification={showNotification}
      />
    </div>
  )
}

export default App