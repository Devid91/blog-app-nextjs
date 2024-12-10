// utils/lib/validation/validateEmail.ts
import { emailSchema } from "@/app/utils/lib/zodscheemas/zodscheemas";
import { fromZodError } from "zod-validation-error";

export const validateEmail = (email: string) => {
  const validation = emailSchema.safeParse({ email });

  if (!validation.success) {
    let errorMessage = fromZodError(validation.error).message;

    if (errorMessage.startsWith("Validation error: ")) {
      errorMessage = errorMessage.replace("Validation error: ", "");
    }

    if (errorMessage.includes(" at ")) {
      errorMessage = errorMessage.split(" at ")[0];
    }

    return { success: false, error: errorMessage }; // Validation failed
  }

  // If validation was successful, return the sanitized data
  return { success: true, data: validation.data.email };
};
