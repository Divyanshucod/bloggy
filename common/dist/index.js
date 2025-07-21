"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = exports.CustomElementSchema = exports.TexFormattingtSchema = exports.signInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(3),
});
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.TexFormattingtSchema = zod_1.z.object({
    text: zod_1.z.string(),
    bold: zod_1.z.boolean().optional(),
    superscript: zod_1.z.boolean().optional(),
    italic: zod_1.z.boolean().optional(),
    underline: zod_1.z.boolean().optional(),
    subscript: zod_1.z.boolean().optional(),
    code: zod_1.z.boolean().optional(),
    highlight: zod_1.z.boolean().optional(),
    strikethrough: zod_1.z.boolean().optional(),
});
exports.CustomElementSchema = zod_1.z.lazy(() => zod_1.z.object({
    type: zod_1.z.string(),
    children: zod_1.z.array(zod_1.z.union([exports.TexFormattingtSchema, exports.CustomElementSchema])),
    url: zod_1.z.string().optional(),
    align: zod_1.z.string().optional(),
}));
exports.createBlogSchema = zod_1.z.object({
    content: zod_1.z.object({
        tags: zod_1.z.array(zod_1.z.string()),
        content: zod_1.z.array(exports.CustomElementSchema),
        title: zod_1.z.string(),
    }),
    published: zod_1.z.boolean(),
});
exports.updateBlogSchema = zod_1.z.object({
    postId: zod_1.z.string(),
    content: zod_1.z.object({
        tags: zod_1.z.array(zod_1.z.string()),
        content: zod_1.z.array(exports.CustomElementSchema),
        title: zod_1.z.string(),
    }),
    published: zod_1.z.boolean().optional(),
});
