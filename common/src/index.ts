import { boolean, string, z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const TexFormattingtSchema = z.object({
  text: z.string(),
  bold: z.boolean().optional(),
  superscript: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  subscript: z.boolean().optional(),
  code: z.boolean().optional(),
  highlight: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
});
export const CustomElementSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string(),
    children: z.array(z.union([TexFormattingtSchema, CustomElementSchema])),
    url: z.string().optional(),
    align: z.string().optional(),
  })
);
export const createBlogSchema = z.object({
  content: z.object({
    tags: z.array(z.string()),
    content: z.array(CustomElementSchema),
    title: z.string(),
  }),
  published: z.boolean(),
});
export const userUpdateDetailsSchema = z.object({
  bio : z.string().min(3).optional(),
  password: z.object({
    newPassword: z.string().min(6),
    oldPassword: z.string().min(6),
  }).optional(),
})
export const updateBlogSchema = z.object({
  postId: z.string(),
  content: z.object({
    tags: z.array(z.string()),
    content: z.array(CustomElementSchema),
    title: z.string(),
  }),
  published: z.boolean().optional(),
});
export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
export type CreateBlogType = z.infer<typeof createBlogSchema>;
export type UpdateBlogType = z.infer<typeof updateBlogSchema>;
export type CustomElementType = z.infer<typeof CustomElementSchema>;
export type TexFormattingtType = z.infer<typeof TexFormattingtSchema>;
export type UserUpdateDetailsType = z.infer<typeof userUpdateDetailsSchema>;
