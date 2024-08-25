import LoginPage from "@/pages/login";
import mockRouter from "next-router-mock";
import { render, screen } from "@testing-library/react";

jest.mock("next/router", () => require("next-router-mock"));

describe("LoginPage", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("ログインページがレンダリングされることを確認する", () => {
    render(<LoginPage />);

    // "ログイン" ボタンを取得する
    const loginButton = screen.getByRole("button", { name: "ログイン" });
    expect(loginButton).toBeInTheDocument();

    // プレースホルダーで要素を取得する
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
  });

  it("サインアップリンクが存在することを確認する", () => {
    render(<LoginPage />);

    // サインアップリンクを取得する
    const signupLink = screen.getByText("サインアップ");
    expect(signupLink).toBeInTheDocument();
  });

  it("ログインボタンがクリック可能であることを確認する", () => {
    render(<LoginPage />);

    // ログインボタンがクリック可能か確認する
    const loginButton = screen.getByRole("button", { name: "ログイン" });
    expect(loginButton).toBeEnabled();
  });
});
