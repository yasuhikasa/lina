import PostsPage from '@/pages/posts';
import mockRouter from 'next-router-mock';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuthState } from 'react-firebase-hooks/auth';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('react-firebase-hooks/auth');

describe('PostsPage', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/posts');
    // ユーザーがログインしている状態をモック
    (useAuthState as jest.Mock).mockReturnValue([{ uid: 'user-id' }, false, undefined]);
  });

  it('投稿ページがレンダリングされることを確認する', async () => {
    render(<PostsPage />);

      // "新規投稿" ボタンを取得する
      const newPostButton = screen.getByRole('button', { name: '新規投稿' });
      expect(newPostButton).toBeInTheDocument();
  });

  it('新規投稿ボタンがクリック可能であることを確認する', async () => {
    render(<PostsPage />);

      // "新規投稿" ボタンがクリック可能か確認する
      const newPostButton = screen.getByRole('button', { name: '新規投稿' });
      expect(newPostButton).toBeEnabled();
  });
});
