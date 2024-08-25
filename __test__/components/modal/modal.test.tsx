import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/modal/modal';

describe('Modal Component', () => {
  it('モーダルが開いている場合、コンテンツが表示されることを確認する', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>モーダルの内容</p>
      </Modal>
    );

    // モーダル内のテキストが表示されていることを確認
    expect(screen.getByText('モーダルの内容')).toBeInTheDocument();
  });

  it('モーダルが閉じている場合、何も表示されないことを確認する', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <p>モーダルの内容</p>
      </Modal>
    );

    // モーダル内のコンテンツがレンダリングされていないことを確認
    expect(container.firstChild).toBeNull();
  });

  it('閉じるボタンがクリックされた時、onCloseが呼ばれることを確認する', () => {
    const onCloseMock = jest.fn();

    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <p>モーダルの内容</p>
      </Modal>
    );

    // 閉じるボタンをクリック
    fireEvent.click(screen.getByText('×'));

    // onCloseが呼ばれたことを確認
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
