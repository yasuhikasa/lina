import { render, screen, fireEvent } from "@testing-library/react";
import FileInput from "@/components/input/fileInput";

describe("FileInput Component", () => {
  it("ファイル入力フィールドが正しくレンダリングされることを確認する", () => {
    render(<FileInput onChange={() => {}} />);

    // ファイル入力フィールドが存在することを確認
    const inputElement = screen.getByTestId("file-input");
    expect(inputElement).toBeInTheDocument();
  });

  it("ファイル選択時にonChangeハンドラーが正しく動作することを確認する", () => {
    const handleChange = jest.fn();

    render(<FileInput onChange={handleChange} />);

    // ファイルを選択する
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const inputElement = screen.getByTestId("file-input");
    fireEvent.change(inputElement, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalledWith(file);
  });
});
