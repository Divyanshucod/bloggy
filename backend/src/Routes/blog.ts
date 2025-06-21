import { Hono } from "hono";
import { authMiddleWare } from "../middleware/authMiddleWare";
import { createBlogSchema, updateBlogSchema } from "@dev0000007/medium-web";

export const BlogRouter = new Hono<{
  Bindings: {
    MY_SECRET: string;
    DATABASE_URL: string;
    OPTIMIZE_API_KEY: string;
  };
  Variables: {
    userId: string;
    prisma: any;
  };
}>();

BlogRouter.put("/", authMiddleWare, async (ctx) => {
  try {
    const prisma = ctx.get("prisma");
    const body = await ctx.req.json();
    //zod validation
    const { success } = updateBlogSchema.safeParse(body);
    if (!success) {
      ctx.status(411);
      return ctx.json({
        message: "invalid inputs",
      });
    }
    // validate the id
    const post = await prisma.post.findUnique({
      where: {
        id: body.postId,
      },
    });
    if (!post) {
      ctx.status(403);
      return ctx.json({
        message: "there is not post present for given Id",
      });
    }
    const { postId, ...data } = body;
    await prisma.post.update({
      data,
      where: {
        id: body.postId,
      },
    });

    ctx.status(200);
    return ctx.json({
      message: "post updated!",
    });
  } catch (error) {
    ctx.status(500);
    return ctx.json({
      message: "Internal Server error!",
    });
  }
});

BlogRouter.post("/", authMiddleWare, async (ctx) => {
  try {
    const prisma = ctx.get("prisma");
    const body = await ctx.req.json();
    // verify body using zod
    //zod validation
    const { success } = createBlogSchema.safeParse(body);
    if (!success) {
      ctx.status(411);
      return ctx.json({
        message: "invalid inputs",
      });
    }
    await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: ctx.get("userId"),
      },
    });

    ctx.status(200);
    return ctx.json({
      message: "post added!",
    });
  } catch (error) {
    ctx.status(500);
    return ctx.json({
      message: "Internal Server error!",
    });
  }
});
BlogRouter.get("/bulk/:pageno", async (ctx) => {
  const page = parseInt(ctx.req.param("pageno")) || 0;
  try {
    const prisma = ctx.get("prisma");
    // verify body using zod

    const posts = await prisma.post.findMany({
      select:{
        id:true,
        content:true,
        title:true,
        publishedDate:true,
        author: {
          select:{
            name:true
          }
        }
      },
      skip: 10 * page,
      take: 10,
      
    });

    ctx.status(200);
    return ctx.json({
      posts,
    });
  } catch (error) {
    ctx.status(500);
    return ctx.json({
      message: "Internal Server error!",
    });
  }
});
BlogRouter.get("/:id", authMiddleWare, async (ctx) => {
  try {
    const prisma = ctx.get("prisma");
    const postId = ctx.req.param("id");
    // verify body using zod

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select:{
        id:true,
        title:true,
        content:true,
        publishedDate:true,
        author:{
          select:{
            name:true
          }
        }
      }
    });

    ctx.status(200);
    return ctx.json({
      post,
    });
    
  } catch (error) {
    ctx.status(500);
    return ctx.json({
      message: "Internal Server error!",
    });
  }
});
