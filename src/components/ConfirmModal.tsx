import { createPortal } from "react-dom";

type ConfirmModalProps = {
  actionCallback: () => Promise<void>;
  onClose: () => void;
};

export const ConfirmModal = ({
  actionCallback,
  onClose,
}: ConfirmModalProps) => {
  return createPortal(
    <div className="bg-[rgba(0,0,0,0.3)] fixed w-full h-screen flex px-4 items-center justify-center z-[1000]">
      <div className="bg-white z-[2000] rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl text-center font-semibold">
            Are you sure you want logout?
          </h2>
        </div>
        <div>
          <button
            onClick={() => {
              actionCallback().then(() => onClose());
            }}
            className="border-[#ccc] border-y py-4 font-semibold text-red-400 w-full block text-center hover:bg-gray-200"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="py-4 w-full block text-center hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("confirm-modal") as HTMLElement
  );
};
