import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { initializeBlogs, createBlog } from './store/blogSlice';
import { setNotification } from './store/notificationSlice';
import { setUser, clearUser } from './store/userSlice';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import BlogList from './components/BlogList';
import Users from './components/Users';
import User from './components/User';
import BlogView from './components/BlogView';
import Navigation from './components/Navigation';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const blogFormRef = useRef();

  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs);
  const notification = useSelector(state => state.notification);
  const user = useSelector(state => state.user.currentUser);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
      dispatch(setNotification({ message: 'Login successful', type: 'success' }));
    } catch (exception) {
      dispatch(setNotification({ message: 'Wrong credentials', type: 'error' }));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(clearUser());
    dispatch(setNotification({ message: 'Logged out', type: 'success' }));
  };

  const addBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject));
      blogFormRef.current.toggleVisibility();
      dispatch(setNotification({ 
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        type: 'success'
      }));
    } catch (exception) {
      dispatch(setNotification({ message: 'Error creating blog', type: 'error' }));
    }
  };

  if (user === null) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <Notification />
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Notification />
        <Routes>
          <Route path="/" element={
            <>
              <div className="mb-8">
                <Togglable buttonLabel="new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
              </div>
              <BlogList blogs={blogs} user={user} />
            </>
          } />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
