import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { likeBlog, deleteBlog } from '../store/blogSlice';
import { setNotification } from '../store/notificationSlice';

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog));
      dispatch(setNotification({ 
        message: `Liked blog "${blog.title}"`,
        type: 'success'
      }));
    } catch (error) {
      dispatch(setNotification({ 
        message: 'Error liking blog',
        type: 'error'
      }));
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        dispatch(deleteBlog(blog.id));
        dispatch(setNotification({ 
          message: `Deleted blog "${blog.title}"`,
          type: 'success'
        }));
      } catch (error) {
        dispatch(setNotification({ 
          message: 'Error deleting blog',
          type: 'error'
        }));
      }
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <div data-testid="blog-basic">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible}>
          view
        </button>
        <button onClick={toggleVisibility} style={showWhenVisible}>
          hide
        </button>
      </div>
      {visible && (
        <div data-testid="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike} id="like-button">like</button>
          </div>
          <div>{blog.user?.name}</div>
          {blog.user && blog.user.username === user.username && (
            <button onClick={handleDelete} id="delete-button">remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
