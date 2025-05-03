import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8 items-center">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              blogs
            </Link>
            <Link 
              to="/users" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              users
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">
                {user.name} logged in
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation 