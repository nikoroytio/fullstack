import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('form calls the event handler with the right details when a new blog is created', async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlog} />);

    // Fill in the form
    const titleInput = screen.getByPlaceholderText('title');
    const authorInput = screen.getByPlaceholderText('author');
    const urlInput = screen.getByPlaceholderText('url');
    const createButton = screen.getByText('create');

    await user.type(titleInput, 'Test Blog');
    await user.type(authorInput, 'Test Author');
    await user.type(urlInput, 'http://test.com');
    await user.click(createButton);

    // Check that createBlog was called with the right details
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
    });
  });
});
