import {z} from "zod"

export const messageSchema=z.object({
    content:z.string().min(10,"Content  must be 10 characters long")
})