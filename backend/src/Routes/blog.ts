import { Hono } from "hono";
import { authMiddleWare } from "../middleware/authMiddleWare";
import { createBlogSchema, CreateBlogType, updateBlogSchema } from "@dev0000007/medium-web";
import { ExtractSmart } from "../HelperFunction/GetPreviewAndTitle";
import { GenerateHTML } from "../HelperFunction/GenerateHTML";

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

BlogRouter.post("/",authMiddleWare, async (ctx) => {
  try {
    const prisma = ctx.get("prisma");
    const body = await ctx.req.json();
    // verify body using zod
    //zod validation    
    const val = createBlogSchema.safeParse(body);
    
    if (!val.success) {
      ctx.status(411);
      return ctx.json({
        message: "invalid inputs",
      });
    }
    const data:CreateBlogType = body 
    // get title and preview
    const {title,preview} =  ExtractSmart(data.content)
    if(title.length === 0){
      ctx.status(411);
      return ctx.json({
        message: "Title can't be empty!",
      });
    }
    // convert JSON to HTML
    const inHtml = GenerateHTML(data.content,data.publishedDate)
    await prisma.post.create({
      data: {
        title,
        content:preview,
        publishedDate:data.publishedDate,
        htmlContent:inHtml,
        blogJson:data.content,
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select:{
        id:true,
        htmlContent:true,
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