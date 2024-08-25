import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/input/input';

describe('Input Component', () => {
  it('入力フィールドが正しくレンダリングされることを確認する', () => {
    render(
      <Input
        type="text"
        placeholder="テスト入力"
        value="テスト値"
        onChange={() => {}}
      />
    );

    // プレースホルダーが正しく表示されていることを確認
    const inputElement = screen.getByPlaceholderText('テスト入力');
    expect(inputElement).toBeInTheDocument();

    // 入力値が正しく表示されていることを確認
    expect(inputElement).toHaveValue('テスト値');
  });

  it('onChangeハンドラーが正しく動作することを確認する', () => {
    const handleChange = jest.fn();

    render(
      <Input
        type="text"
        placeholder="テスト入力"
        value=""
        onChange={handleChange}
      />
    );

    // 入力フィールドにテキストを入力する
    fireEvent.change(screen.getByPlaceholderText('テスト入力'), {
      target: { value: '新しい値' },
    });

    // onChangeハンドラーが呼び出されることを確認
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('requiredプロパティが正しく適用されることを確認する', () => {
    render(
      <Input
        type="text"
        placeholder="必須入力"
        required
        onChange={() => {}}
      />
    );

    // requiredプロパティが適用されていることを確認
    const inputElement = screen.getByPlaceholderText('必須入力');
    expect(inputElement).toBeRequired();
  });

  it('checkedプロパティが正しく適用されることを確認する (type="checkbox")', () => {
    render(
      <Input
        type="checkbox"
        checked={true}
        onChange={() => {}}
      />
    );

    // checkedプロパティが適用されていることを確認
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeChecked();
  });
});
