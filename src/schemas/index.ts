import {z} from "zod"

export const UsernameSchemaValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must not be greater than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")