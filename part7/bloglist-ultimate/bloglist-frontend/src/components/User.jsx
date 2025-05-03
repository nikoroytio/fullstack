import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { initializeUsers } from '../store/userSlice'

const User = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.user.users)
  const { id } = useParams()

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  if (!users) {
    return null
  }

  const user = users.find(u => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
          <p className="text-sm text-gray-500 mb-6">Blogs created: {user.blogs.length}</p>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Added blogs</h3>
            {user.blogs.length === 0 ? (
              <p className="text-gray-500 italic">No blogs added yet</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {user.blogs.map(blog => (
                  <li key={blog.id} className="py-3">
                    <Link 
                      to={`/blogs/${blog.id}`}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      {blog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default User 