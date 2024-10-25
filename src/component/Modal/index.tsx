/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConfirmModalProps,
  AlertModalProps,
  ModalProps,
} from "../../interfaces/modal.interface";
import { AlertModal } from "./AlertModal";
import { ConfirmModal } from "./ConfirmModal";

export default function Modal(
  data: ConfirmModalProps | AlertModalProps | ModalProps,
) {
  const openModal = () => {
    const modal = document.getElementById(data.id) as any;
    if (modal) {
      modal.showModal();
    }
  };
  const closeModal = () => {
    const modal = document.getElementById(data.id) as any;
    if (modal) {
      modal.close();
    }
  };
  const modal =
    data.modalType === "alert" ? (
      <AlertModal {...(data as AlertModalProps)} />
    ) : (
      <ConfirmModal {...(data as ConfirmModalProps)} />
    );
  return { modal, openModal, closeModal };
}
