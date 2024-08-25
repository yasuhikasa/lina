import { render, screen } from "@testing-library/react";
import Login from "@/components/templates/login";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

describe("Login Page", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/login");
  });

  it("ログインページが正しくレンダリングされることを確認する", () => {
    render(<Login />);

    // ヘッディングの確認
    expect(
      screen.getByRole("heading", { name: "ログイン" })
    ).toBeInTheDocument();

    // メールアドレス入力フィールドの確認
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();

    // パスワード入力フィールドの確認
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();

    // ログインボタンの確認
    expect(
      screen.getByRole("button", { name: "ログイン" })
    ).toBeInTheDocument();

    // サインアップリンクの確認
    expect(screen.getByText("サインアップ")).toBeInTheDocument();
  });
});
