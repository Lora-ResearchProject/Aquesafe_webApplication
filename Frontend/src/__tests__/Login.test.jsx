import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../Pages/Login';

// Mock services
vi.mock('../services/authService', () => ({
  login: vi.fn(),
}));

vi.mock('../utils/auth', () => ({
  getUserRole: vi.fn(),
}));

import { login } from '../services/authService';
import { getUserRole } from '../utils/auth';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () =>
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

describe('LoginPage (Vite + Vitest)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email/password inputs and login button', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays error on failed login', async () => {
    login.mockRejectedValue(new Error('Invalid credentials'));

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('navigates on successful login', async () => {
    login.mockResolvedValue({ token: 'abc123' });
    getUserRole.mockReturnValue('admin');

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Admin@1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('has a working forgot password link', () => {
    renderLogin();
    const link = screen.getByText(/forgot password/i);
    expect(link.closest('a')).toHaveAttribute('href', '/forgot-password');
  });
});