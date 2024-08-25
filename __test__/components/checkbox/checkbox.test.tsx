import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "@/components/checkbox/checkbox";

describe("Checkbox Component", () => {
  it("チェックボックスが正しくレンダリングされることを確認する", () => {
    render(<Checkbox checked={false} onChange={() => {}} />);
    const checkboxElement = screen.getByRole("checkbox");
    expect(checkboxElement).toBeInTheDocument();
  });

  it("チェックボックスのチェック状態が正しく反映されることを確認する", () => {
    const { rerender } = render(
      <Checkbox checked={false} onChange={() => {}} />
    );
    const checkboxElement = screen.getByRole("checkbox");
    expect(checkboxElement).not.toBeChecked();

    rerender(<Checkbox checked={true} onChange={() => {}} />);
    expect(checkboxElement).toBeChecked();
  });

  it("チェックボックスの変更イベントが呼び出されることを確認する", () => {
    const handleChange = jest.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    const checkboxElement = screen.getByRole("checkbox");
    fireEvent.click(checkboxElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("チェックボックスに `required` 属性が正しく適用されていることを確認する", () => {
    render(<Checkbox checked={false} onChange={() => {}} required />);
    const checkboxElement = screen.getByRole("checkbox");
    expect(checkboxElement).toBeRequired();
  });
});
