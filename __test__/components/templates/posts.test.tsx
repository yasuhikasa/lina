import { render, screen, waitFor } from "@testing-library/react";
import Posts from "@/components/templates/posts";
import mockRouter from "next-router-mock";
import { useAuthState } from "react-firebase-hooks/auth";

// Firebase hooks と next/router をモック
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("next/router", () => require("next-router-mock"));

describe("Posts Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockRouter.setCurrentUrl("/posts");
    mockRouter.push = mockPush;
    jest.clearAllMocks();
  });

  it("ログインしていない場合、トップページにリダイレクトされることを確認する", async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false]);

    render(<Posts />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("ログインしている場合、投稿ページが正しくレンダリングされることを確認する", async () => {
    const mockUser = { uid: "test-uid" };
    (useAuthState as jest.Mock).mockReturnValue([mockUser, false]);

    render(<Posts />);

    // 新規投稿ボタンが表示されるのを確認する
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "新規投稿" })
      ).toBeInTheDocument();
    });
  });
});
