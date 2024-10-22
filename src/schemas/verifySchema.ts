import {z} from "zod"

export const verifyShcema=z.object({
    code:z.string().length(6,"Varification code must be 6 digits")
})