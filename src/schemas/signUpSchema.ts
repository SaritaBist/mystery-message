

import {z} from "zod"

export const userNameValidationSchema=z
    .string().
    min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, {message: "Username can only contain alphanumeric characters and underscores"})
export const  singUpSchema=z.object({
  username:z.string().max(20,"Please enter maximim of 20 characters"),
  email:z.string().email({message:'Please enter valid email address'}),
  password:z.string().min(6,"Please enter at leaset 6 characters")
  .max(8,"Please enter maximum of 8 charcters")
})
