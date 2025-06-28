import { z } from 'zod';
export declare const signUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
export declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const TexFormattingtSchema: z.ZodObject<{
    text: z.ZodString;
    bold: z.ZodOptional<z.ZodBoolean>;
    superscript: z.ZodOptional<z.ZodBoolean>;
    italic: z.ZodOptional<z.ZodBoolean>;
    underline: z.ZodOptional<z.ZodBoolean>;
    subscript: z.ZodOptional<z.ZodBoolean>;
    code: z.ZodOptional<z.ZodBoolean>;
    highlight: z.ZodOptional<z.ZodBoolean>;
    strikethrough: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    text: string;
    code?: boolean | undefined;
    bold?: boolean | undefined;
    superscript?: boolean | undefined;
    italic?: boolean | undefined;
    underline?: boolean | undefined;
    subscript?: boolean | undefined;
    highlight?: boolean | undefined;
    strikethrough?: boolean | undefined;
}, {
    text: string;
    code?: boolean | undefined;
    bold?: boolean | undefined;
    superscript?: boolean | undefined;
    italic?: boolean | undefined;
    underline?: boolean | undefined;
    subscript?: boolean | undefined;
    highlight?: boolean | undefined;
    strikethrough?: boolean | undefined;
}>;
export declare const CustomElementSchema: z.ZodType<any>;
export declare const createBlogSchema: z.ZodObject<{
    content: z.ZodArray<z.ZodType<any, z.ZodTypeDef, any>, "many">;
    publishedDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: any[];
    publishedDate: string;
}, {
    content: any[];
    publishedDate: string;
}>;
export declare const updateBlogSchema: z.ZodObject<{
    postId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    postId: string;
}, {
    content: string;
    postId: string;
}>;
export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
export type CreateBlogType = z.infer<typeof createBlogSchema>;
export type UpdateBlogType = z.infer<typeof updateBlogSchema>;
export type CustomElementType = z.infer<typeof CustomElementSchema>;
export type TexFormattingtType = z.infer<typeof TexFormattingtSchema>;
