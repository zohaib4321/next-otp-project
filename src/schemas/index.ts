import {z} from "zod"

export const UsernameSchemaValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must not be greater than 20 characters")
  .refine((value) => !/[A-Z]/.test(value), 'Username must be lowercase')
  .refine((value) => !/[^a-zA-Z0-9_]/.test(value), "Username must not contain special characters");

export const signUpSchema = z.object({
  username: UsernameSchemaValidation,
  email: z.string().email({message: "Email is not valid"}),
  password: z.string().min(6, "Password should be atleast 6 characters").max(20, "Password should not be greater than 20 characters")
})

export const signInSchema = z.object({
  email: z.string().email({message: "Email is not valid"}),
  password: z.string().min(6, "Password should be atleast 6 characters").max(20, "Password should not be greater than 20 characters") 
})

export const verifyCodeSchema = z.object({
  code: z.string().min(6, "Verification code is 6 digits").max(6)
})

export const messageAcceptanceStatus = z.object({
  acceptMessages: z.boolean()
})