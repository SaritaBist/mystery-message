import {z} from "zod"

export const messageSchema=z.object({
    content:z.string().min(6,"content  must be 6 digits")
})