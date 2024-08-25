import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "@/components/header/header";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/libs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import mockRouter from "next-router-mock";

jest.mock("react-firebase-hooks/auth");
jest.mock("@/libs/firebaseConfig", () => ({
  auth: jest.fn(),
  db: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
}));
jest.mock("next/router", () => require("next-router-mock"));

describe("Header Component", () => {
  const mockUser = {
    uid: "test-uid",
  };

  const mockUserData = {
    username: "test-user",
    profileIconUrl: "/path/to/profile-icon.png",
  };

  beforeEach(() => {
    (useAuthState as jest.Mock).mockReturnValue([mockUser, false]);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockUserData,
    });
    mockRouter.push = jest.fn(); // mockRouter.pushをモック関数に設定
  });

  it("ユーザーデータが正しく取得され、表示されることを確認する", async () => {
    render(<Header />);

    expect(getDoc).toHaveBeenCalledWith(doc(db, "users", mockUser.uid));

    await waitFor(() => {
      expect(screen.getByText(mockUserData.username)).toBeInTheDocument();
      expect(screen.getByAltText(mockUserData.username)).toBeInTheDocument();
    });
  });

  it("ログアウトが正しく動作し、トップページにリダイレクトされることを確認する", async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    render(<Header />);

    const logoutLink = screen.getByText("ログアウト");
    fireEvent.click(logoutLink);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("ユーザーが存在しない場合、ヘッダーがレンダリングされないことを確認する", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false]);

    const { container } = render(<Header />);
    expect(container.firstChild).toBeNull();
  });
});
