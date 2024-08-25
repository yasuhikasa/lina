import { render, screen } from '@testing-library/react';
import IndexPage from '@/pages/index';

// モックRouterを設定
jest.mock('next/router', () => require('next-router-mock'));

describe('IndexPage', () => {
  it('ページタイトルが表示されることを確認する', () => {
    render(<IndexPage />);
    const titleElement = screen.getByText(/コーディング試験アプリ/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('サインアップボタンが表示されることを確認する', () => {
    render(<IndexPage />);
    const signupButton = screen.getByText(/サインアップ/i);
    expect(signupButton).toBeInTheDocument();
  });

  it('サインインボタンが表示されることを確認する', () => {
    render(<IndexPage />);
    const signinButton = screen.getByText(/サインイン/i);
    expect(signinButton).toBeInTheDocument();
  });
});

