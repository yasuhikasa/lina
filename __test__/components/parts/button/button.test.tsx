import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/parts/button/button";

describe("Button Component", () => {
  it("ボタンが正しくレンダリングされることを確認する", () => {
    render(<Button text="クリック" onClick={() => {}} />);
    const buttonElement = screen.getByRole("button", { name: /クリック/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it("ボタンのクリックイベントが呼び出されることを確認する", () => {
    const handleClick = jest.fn();
    render(<Button text="クリック" onClick={handleClick} />);
    const buttonElement = screen.getByRole("button", { name: /クリック/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("ボタンのスタイルが正しく適用されることを確認する", () => {
    render(
      <Button
        text="カスタムボタン"
        onClick={() => {}}
        color="#000"
        backgroundColor="#fff"
        margin="10px"
        padding="5px"
        fontSize="16px"
        width="100px"
      />
    );
    const buttonElement = screen.getByRole("button", {
      name: /カスタムボタン/i,
    });
    expect(buttonElement).toHaveStyle({
      color: "#000",
      backgroundColor: "#fff",
      margin: "10px",
      width: "100px",
    });
    expect(buttonElement.style.getPropertyValue("--padding")).toBe("5px");
    expect(buttonElement.style.getPropertyValue("--fontSize")).toBe("16px");
  });
});
