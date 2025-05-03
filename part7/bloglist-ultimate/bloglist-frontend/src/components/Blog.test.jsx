import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser',
    },
  };

  test('renders blog title and author, but not URL or likes by default', () => {
    render(<Blog blog={blog} />);

    // Check that title and author are rendered in the basic info section
    const basicInfo = screen.getByTestId('blog-basic');
    expect(basicInfo).toHaveTextContent('Test Blog');
    expect(basicInfo).toHaveTextContent('Test Author');

    // Check that URL and likes are not rendered
    expect(screen.queryByTestId('blog-details')).toBeNull();
  });

  test('renders blog URL and likes when view button is clicked', async () => {
    render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    // Check that URL and likes are now visible
    const details = screen.getByTestId('blog-details');
    expect(details).toHaveTextContent('http://test.com');
    expect(details).toHaveTextContent('likes 5');
  });

  test('like button click calls event handler twice', async () => {
    const mockHandler = vi.fn();
    render(<Blog blog={blog} updateBlog={mockHandler} />);

    const user = userEvent.setup();

    // First show the details
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    // Then click the like button twice
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
