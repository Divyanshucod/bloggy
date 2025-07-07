import { Hono } from "hono";
import { authMiddleWare } from "../middleware/authMiddleWare";
import { createBlogSchema, CreateBlogType, updateBlogSchema, UpdateBlogType } from "@dev0000007/medium-web";
import { ExtractSmart } from "../HelperFunction/GetPreviewAndTitle";


export const BlogRouter = new Hono<{
  Bindings: {
    MY_SECRET: string;
    DATABASE_URL: string;
    ENVIRONMENT:string;
    PRO_ORIGIN:string;
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
    const data = body as UpdateBlogType;
    // validate the id
    const post = await prisma.post.findUnique({
      where: {
        id: data.postId,
      },
    });
    if (!post) {
      ctx.status(403);
      return ctx.json({
        message: "there is no blog present for given Id",
      });
    }
     // get title and preview (check title empty or not)
    await prisma.post.update({
      data:{
        blogJson:data.content,
        published:data.published ? data.published : post.published
      },
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
    // we don't need a publish date , get from database.
    // have a published tag from frontend to know blog is darft or published
    if (!val.success) {
      ctx.status(411);
      return ctx.json({
        message: "invalid inputs",
      });
    }
    const data:CreateBlogType = body 
    // get title and preview , TODO: thing better solution so that all blog should have title and if not then make them a draft
    const {title,preview} =  ExtractSmart(data.content)
    if(title.length === 0){
      ctx.status(411);
      data.published = false
    }
    await prisma.post.create({
      data: {
        title,
        content:preview,
        blogJson:data.content,
        authorId: ctx.get("userId"),
        published:data.published
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
        published:true,
        author: {
          select:{
            name:true
          }
        }
      },
      skip: 5 * page,
      take: 5,
      
    });

    ctx.status(200);
    return ctx.json({
      posts,
    });
  } catch (error) {
    console.log(error);
    
    ctx.status(500);
    return ctx.json({
      message: "Internal Server error!",
    });
  }
});
BlogRouter.get("/user/:pageno", authMiddleWare, async (ctx) => {
  
  const page = parseInt(ctx.req.param("pageno")) || 0;
  try {
    const prisma = ctx.get("prisma");
    
    const posts = await prisma.post.findMany({
      select:{
        id:true,
        content:true,
        title:true,
        publishedDate:true,
        published:true,
        author: {
          select:{
            name:true
          }
        }
      },
      where:{
        authorId: ctx.get('userId')
      },
      skip: 5 * page,
      take: 5,
      
    });
    // console.log(posts);
    
    ctx.status(200);
    return ctx.json({
      posts,
    });
  } catch (error) {
    console.log(error);
    
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
        blogJson:true,
        publishedDate:true,
        authorId:true,
        published:true,
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
