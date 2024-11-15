import { useEffect } from "react";

export default function useUserReadThrough<T extends HTMLElement>(
  showModal: boolean,
  contentRef: React.RefObject<T>,
  setIsReadAllConditions: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    if (!showModal) return;

    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

        // Check if the user has scrolled to the bottom
        if (scrollTop + clientHeight >= scrollHeight - 1) {
          setIsReadAllConditions(true);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
    }

    // Clean up the event listener when the component unmounts or when the modal is closed
    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [showModal, contentRef, setIsReadAllConditions]);
}
