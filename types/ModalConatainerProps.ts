interface IncorrectDataProps {
  variant: "incorrectData";
  message: string;
  buttonText: string;
}

interface TermsAndConditionsProps {
  variant: "termsAndConditions";
  buttonText: string;
}

interface SignOutProps {
  variant: "signOut";
  buttonText: string;
}

export type ModalContainerProps =
  | IncorrectDataProps
  | TermsAndConditionsProps
  | SignOutProps;
