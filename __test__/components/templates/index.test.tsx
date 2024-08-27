import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import Index from "@/components/templates/index";

// モック関数を作成
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("@/components/parts/button/button", () => {
  const MockButton = (props: any) => (
    <button onClick={props.onClick}>{props.text}</button>
  );
  MockButton.displayName = "MockButton";
  return MockButton;
});

describe("Index Template", () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    // ユーザーがログインしていない状態をデフォルトとする
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);
  });

  it("ユーザーがログインしていない場合、リダイレクトされないことを確認する", () => {
    render(
      <Index title="コーディング試験アプリ">
        <h1>コーディング試験アプリ</h1>
      </Index>
    );

    expect(push).not.toHaveBeenCalled();
  });

  it("ユーザーがログインしている場合、/posts へリダイレクトされることを確認する", () => {
    (useAuthState as jest.Mock).mockReturnValue([{ uid: "123" }, false, null]);

    render(
      <Index title="コーディング試験アプリ">
        <h1>コーディング試験アプリ</h1>
      </Index>
    );

    expect(push).toHaveBeenCalledWith("/posts");
  });
});
