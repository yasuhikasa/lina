import { render, screen, fireEvent } from "@testing-library/react";
import Select from "@/components/parts/select/select";

describe("Select Component", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("セレクトボックスが正しくレンダリングされることを確認する", () => {
    render(<Select value="" onChange={() => {}} options={mockOptions} />);

    // セレクトボックスが存在することを確認
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    // 各オプションが存在することを確認
    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("選択したオプションが正しく反映されることを確認する", () => {
    const handleChange = jest.fn();
    render(
      <Select value="option1" onChange={handleChange} options={mockOptions} />
    );

    const selectElement = screen.getByRole("combobox");

    // 初期値が設定されていることを確認
    expect(selectElement).toHaveValue("option1");

    // 別のオプションを選択する
    fireEvent.change(selectElement, { target: { value: "option2" } });

    // onChangeが呼び出されることを確認
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("required属性が正しく適用されることを確認する", () => {
    render(
      <Select value="" onChange={() => {}} options={mockOptions} required />
    );

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeRequired();
  });
});
