import { AlertModalProps } from "../../interfaces/modal.interface";

export function AlertModal({ id, title, content }: AlertModalProps) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{content}</p>
      </div>
    </dialog>
  );
}
