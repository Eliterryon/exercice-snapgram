import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, { message: 'too short'}),
    username: z.string().min(2, { message: 'too short'}).max(50),
    email: z.string().email(),
    password: z.string().min(8, { message: 'too short'}),
})
export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'too short'}),
})
export const PostValidation = z.object({
    caption: z.string().min(8).max(255),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(255),
    tags: z.string()
})