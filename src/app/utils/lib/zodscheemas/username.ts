import { z } from "zod";

export const usernameSchema = z.object({
  userName: z
    .string() // Trim whitespace from the input
    .min(3, "min length must be 3")
    .max(20, "max length must be 20")
    .transform((value) => value.trim())
    .refine((value) => !/\s{2,}/.test(value), {
      message: "No consecutive spaces allowed",
    }), // Ensure no consecutive spaces are allowed
});

export type Username = z.infer<typeof usernameSchema>;
