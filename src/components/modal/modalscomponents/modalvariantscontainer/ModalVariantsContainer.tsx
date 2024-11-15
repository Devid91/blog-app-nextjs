import { useState, useRef } from "react";
import useClickOutside from "@/app/hooks/useClickOutside";
import Modal from "../showmodal/ShowModal";
import type { ModalContainerProps } from "../../../../../types/ModalConatainerProps";
import TermsAndConditions from "../termsandconditions/TermsAndConditions";
import ButtonAction from "@/components/buttonaction/ButtonAction";
import useDisableBodyScroll from "@/app/hooks/useDisableBodyScroll";
import useUserReadThrough from "@/app/hooks/useUserReadthrought";
import {
  signOut as NextAuthSignOut,
  useSession,
  signOut,
} from "next-auth/react";

export default function ModalVariantsContainer(props: ModalContainerProps) {
  const [showModal, setShowModal] = useState(false);
  const [userReadAllConditions, setIsReadAllConditions] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLParagraphElement | null>(null);

  useClickOutside(modalRef, () => setShowModal(false));

  const { data: session } = useSession();

  useDisableBodyScroll(showModal);

  useUserReadThrough(showModal, contentRef, setIsReadAllConditions);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const renderContent = () => {
    switch (props.variant) {
      case "incorrectData":
        return (
          <>
            <p>{props.message}</p>
            <ButtonAction
              type="button"
              onClick={handleClose}
              className="bg-primary-color text-secondary-color"
            >
              {props.buttonText}
            </ButtonAction>
          </>
        );

      case "termsAndConditions":
        return (
          <>
            <p>Terms and Conditions</p>
            <div>
              <div
                ref={contentRef}
                className="max-h-96 overflow-y-scroll p-4 border"
              >
                <TermsAndConditions />
              </div>
              <div className="flex space-x-4 mt-4">
                <ButtonAction
                  type="button"
                  onClick={handleClose}
                  className="bg-primary-color text-secondary-color"
                >
                  {props.buttonText}
                </ButtonAction>
                <button
                  className={`py-2 px-4 rounded-lg ${
                    userReadAllConditions
                      ? "bg-[#ccb50a] text-[#0080ff] hover:scale-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  type="button"
                  disabled={!userReadAllConditions}
                >
                  Agree
                </button>
              </div>
            </div>
          </>
        );

      case "signOut":
        return (
          <>
            {session && session?.user?.email && (
              <>
                <p>Are you sure you want to sign out?</p>
                <div className="flex space-x-4">
                  <ButtonAction
                    className="bg-primary-color text-secondary-color"
                    type="button"
                    onClick={handleClose}
                  >
                    {props.buttonText}
                  </ButtonAction>

                  <ButtonAction
                    className="mb-0 p-0 text-xs  w-[70%]"
                    onClick={async () => {
                      await signOut();
                      await NextAuthSignOut();
                    }}
                  >
                    Sign Out
                  </ButtonAction>
                </div>
              </>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const actionButton = () => {
    switch (props.variant) {
      case "termsAndConditions":
        return (
          <ButtonAction
            type="button"
            onClick={handleOpen}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Open Terms
          </ButtonAction>
        );

      case "signOut":
        return (
          <ButtonAction
            onClick={handleOpen}
            className="mb-0 p-2 text-xs  w-full"
          >
            Sign Out
          </ButtonAction>
        );

      case "incorrectData":
        return (
          <ButtonAction
            type="button"
            onClick={handleOpen}
            className="bg-yellow-500 text-black p-2 rounded-md"
          >
            Open Error Modal
          </ButtonAction>
        );

      default:
        return (
          <ButtonAction
            type="button"
            onClick={handleOpen}
            className="bg-gray-500 text-white p-2 rounded-md"
          >
            Default Action
          </ButtonAction>
        );
    }
  };

  // Render the Modal with a button to trigger it
  return (
    <>
      {actionButton()}
      {/* Modal content controlled by 'showModal' state */}
      {showModal && (
        <Modal
          ref={modalRef}
          isOpen={showModal}
          onClose={handleClose}
          className="p-6 rounded-lg shadow-lg"
        >
          {renderContent()}
        </Modal>
      )}
    </>
  );
}
