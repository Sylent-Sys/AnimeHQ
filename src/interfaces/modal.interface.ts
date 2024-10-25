interface ModalProps {
  id: string;
  title: string;
  content: string;
  modalType: "alert" | "confirm";
}

type AlertModalProps = Omit<ModalProps, "modalType"> & {
  modalType: "alert";
};

type ConfirmModalProps = Omit<ModalProps, "modalType"> & {
  modalType: "confirm";
  onConfirm: () => void;
  onCancel: () => void;
};

export type { ModalProps, AlertModalProps, ConfirmModalProps };
