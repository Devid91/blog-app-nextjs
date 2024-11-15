import ModalVariantsContainer from "@/components/modal/modalscomponents/modalvariantscontainer/ModalVariantsContainer";

export function ModalIncorrectData() {
  return (
    <ModalVariantsContainer
      variant="incorrectData"
      message="Wrong file format. Choose a valid one."
      buttonText="Ok"
    />
  );
}

export function ModalTermsAndConditions() {
  return (
    <ModalVariantsContainer variant="termsAndConditions" buttonText="Back" />
  );
}

export function ModalSignOut() {
  return <ModalVariantsContainer variant="signOut" buttonText="Ok" />;
}
