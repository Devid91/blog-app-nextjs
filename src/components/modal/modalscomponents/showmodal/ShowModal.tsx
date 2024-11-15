import { forwardRef } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
};

// Wrap Modal with forwardRef to accept a ref parameter
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, children, className }, ref) => {
    if (!isOpen) return null;

    return (
      <div className="fixed  overflow-hidden inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 z-[100]">
        <div
          ref={ref}
          className={`bg-white text-black p-5 rounded-lg transform transition-transform duration-300 ${className}`}
        >
          {children}
        </div>
      </div>
    );
  }
);

// Name your exported component function properly
Modal.displayName = "Modal"; // Required when using forwardRef

export default Modal;
