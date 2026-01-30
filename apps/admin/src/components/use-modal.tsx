import { useCallback, useState } from "react";
import type { ModalProps } from "antd/es/modal";

type useCoreModalReturnType = {
  visible: boolean;
  show: () => void;
  close: () => void;
};

const useCoreModal = ({
  defaultVisible = false,
}: {
  defaultVisible?: boolean;
} = {}): useCoreModalReturnType => {
  const [visible, setVisible] = useState(defaultVisible);
  const show = useCallback(() => setVisible(true), [visible]);
  const close = useCallback(() => setVisible(false), [visible]);

  return {
    visible,
    show,
    close,
  };
};

export type useModalReturnType = {
  modalProps: ModalProps;
} & Omit<useCoreModalReturnType, "visible">;

/**
 * By using `useModal` you get props for your records from API in accordance with Ant Design {@link https://ant.design/components/modal/ `<Modal>`} component.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/hooks/ui/useModal} for more details.
 */
export const useModal = ({
  modalProps = {},
}: {
  modalProps?: ModalProps;
} = {}): useModalReturnType => {
  const { show, close, visible } = useCoreModal({
    defaultVisible: modalProps.open,
  });

  return {
    modalProps: {
      ...modalProps,
      onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        modalProps.onCancel?.(e);
        close();
      },
      open: visible,
      visible,
    },
    show,
    close,
  };
};
