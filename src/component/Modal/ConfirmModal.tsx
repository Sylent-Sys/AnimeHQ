import { ConfirmModalProps } from "../../interfaces/modal.interface";

export function ConfirmModal({
  id,
  title,
  content,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{content}</p>
        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-4">
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
            >
              No
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
