"use client";

import ModalVariantsContainer from "@/components/modal/modalscomponents/modalvariantscontainer/ModalVariantsContainer";
import { ModalSignOut } from "@/components/modal/modalstoexport/modalvariantsserver/ModalVariantsServer";

export default function Page() {
  return (
    <div>
      <h1>Modal Variants Example</h1>

      {/* Incorrect Data Variant */}
      <ModalVariantsContainer
        variant="incorrectData"
        message="Wrong file format. Choose a valid one."
        buttonText="Ok"
      />

      {/* Terms and Conditions Variant */}
      <ModalVariantsContainer variant="termsAndConditions" buttonText="Back" />

      {/* Sign Out Variant */}
      <ModalVariantsContainer variant="signOut" buttonText="Ok" />

      <ModalSignOut />
    </div>
  );
}
