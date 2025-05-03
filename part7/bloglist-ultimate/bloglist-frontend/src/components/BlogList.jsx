import { Link } from 'react-router-dom'
import Blog from './Blog';

const BlogList = ({ blogs }) => {
  if (!blogs) {
    return null;
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div className="space-y-6">
      {sortedBlogs.map((blog) => (
        <div key={blog.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <Link 
              to={`/blogs/${blog.id}`}
              className="text-lg font-medium text-indigo-600 hover:text-indigo-500"
            >
              {blog.title} by {blog.author}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
