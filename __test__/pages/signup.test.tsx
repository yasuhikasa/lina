import SignupPage from "@/pages/signup";
import mockRouter from "next-router-mock";
import { render, screen } from "@testing-library/react";

jest.mock("next/router", () => require("next-router-mock"));

describe("SignupPage", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("サインアップページがレンダリングされることを確認する", () => {
    render(<SignupPage />);

    // "ユーザー登録" のタイトルが存在することを確認
    const title = screen.getByRole("heading", { name: "ユーザー登録" });
    expect(title).toBeInTheDocument();

    // 各入力フィールドのプレースホルダーで要素を取得して確認
    expect(screen.getByPlaceholderText("ユーザー名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("生年月日")).toBeInTheDocument();

    // 性別選択のドロップダウンが存在することを確認
    const genderSelect = screen.getByRole("combobox");
    expect(genderSelect).toBeInTheDocument();

    // 利用規約チェックボックスが存在することを確認
    const termsCheckbox = screen.getByRole("checkbox", { name: /利用規約/i });
    expect(termsCheckbox).toBeInTheDocument();

    // "サインアップ" ボタンが存在することを確認
    const signupButton = screen.getByRole("button", { name: "サインアップ" });
    expect(signupButton).toBeInTheDocument();
  });

  it("ログインリンクが存在することを確認する", () => {
    render(<SignupPage />);

    // ログインリンクが存在することを確認
    const loginLink = screen.getByText("ログイン");
    expect(loginLink).toBeInTheDocument();
  });

  it("サインアップボタンがクリック可能であることを確認する", () => {
    render(<SignupPage />);

    // サインアップボタンがクリック可能か確認する
    const signupButton = screen.getByRole("button", { name: "サインアップ" });
    expect(signupButton).toBeEnabled();
  });
});
