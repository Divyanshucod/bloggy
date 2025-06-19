import {z} from 'zod'

export const signUpSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6),
    name:z.string().min(3)
})

export const signInSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6),
})

export const createBlogSchema = z.object({
    title:z.string().min(1),
    content:z.string().min(1)
})

export const updateBlogSchema = z.object({
    postId:z.string(),
    title:z.string().min(1).optional(),
    content:z.string().min(1).optional(),
    published:z.boolean().optional()
})

export type SignInType = z.infer<typeof signInSchema>
export type SignUpType = z.infer<typeof signUpSchema>
export type CreateBlogType = z.infer<typeof createBlogSchema>
export type UpdateBlogType = z.infer<typeof updateBlogSchema>
