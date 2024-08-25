import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Login from '@/components/templates/login';
import { auth } from '@/libs/firebaseConfig';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('firebase/auth');

describe('Login Template', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (signInWithEmailAndPassword as jest.Mock).mockClear();
  });

  it('ログインページが正しくレンダリングされることを確認する', () => {
    render(<Login />);

    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('ログインが成功した場合、/posts にリダイレクトされることを確認する', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/posts');
    });
  });
});
