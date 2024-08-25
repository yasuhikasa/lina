import { render, screen } from "@testing-library/react";
import Signup from "@/components/templates/signup";
import mockRouter from "next-router-mock";

// Next.js の useRouter をモック
jest.mock("next/router", () => require("next-router-mock"));

describe("Signup Template", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/signup"); // 初期URLを設定
  });

  it("サインアップページが正しくレンダリングされることを確認する", () => {
    render(<Signup />);

    // ヘッディングのテスト
    expect(
      screen.getByRole("heading", { name: "ユーザー登録" })
    ).toBeInTheDocument();

    // 各インプットフィールドのプレースホルダーを確認
    expect(screen.getByPlaceholderText("ユーザー名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("生年月日")).toBeInTheDocument();

    // セレクトボックスの確認
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // チェックボックスの確認
    expect(screen.getByLabelText(/利用規約に同意します/i)).toBeInTheDocument();

    // サインアップボタンの確認
    expect(
      screen.getByRole("button", { name: "サインアップ" })
    ).toBeInTheDocument();

    // ログインリンクの確認
    expect(screen.getByText("ログイン")).toBeInTheDocument();
  });
});
