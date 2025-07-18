import { Hono } from "hono";
import { authMiddleWare } from "../middleware/authMiddleWare";
import {
  createBlogSchema,
  CreateBlogType,
} from "@dev0000007/medium-web";
import { ExtractSmart } from "../HelperFunction/GetPreviewAndTitle";
import {
  HandleCatchErrors,
  ValidateBlogId,
} from "../HelperFunction/ValidateBlog";

export const BlogRouter = new Hono<{
  Bindings: {
    MY_SECRET: string;
    DATABASE_URL: string;
    ENVIRONMENT: string;
    PRO_ORIGIN: string;
  };
  Variables: {
    userId: string;
    prisma: any;
  };
}>();

BlogRouter.put("/", authMiddleWare, async (ctx) => {
  
  try {
    const prisma = ctx.get('prisma')
    const data = await ctx.req.json();    
    //zod validation
    // const { success } = updateBlogSchema.safeParse(body);
    // if (!success) {
    //   ctx.status(411);
    //   return ctx.json({
    //     message: "invalid inputs",
    //   });
    // }
    // const data = body as UpdateBlogType;
    // validate the id   // TODO: update the zod validation to add tags there
    
    const post = await ValidateBlogId(data.postId, prisma);
    // get title and preview (check title empty or not)
    await prisma.$transaction(async(tx)=>{
      console.log('before the update has performed');
      
      await tx.post.update({
        data: {
          blogJson: data.content,
          published: data.published ? data.published : post.published,
        },
        where: {
          id: data.postId,
        },
      });
      // tags update
      const map = new Map<string, boolean>();
      for (let i = 0; i < data.tags.length; i++) {
        map.set(data.tags[i], true);
      }
      const tags = await tx.tag.findMany({
        where: {
          postId: data.postId,
        },
      });
      const map2 = new Map<string, boolean>();
      for (let i = 0; i < tags.length; i++) {
        map2.set(tags[i].title, true);
      }
      const removeAbleTags = tags
        .filter((tag) => !map.get(tag.title))
        .map((tag) => tag.title);
  
        const needToAdd = data.tags
        .filter((tag) => !map2.get(tag))
        .map((tag) => tag);
      
      if(removeAbleTags.length > 0){
        await tx.tag.deleteMany({
          where: {
            postId: data.postId,
            title: {
              in: removeAbleTags,
            },
          },
        });
      }
      // add tags
      if (needToAdd.length > 0) {
        await tx.tag.createMany({
          data: needToAdd.map((title: string) => ({
            title: title,
            postId: data.postId,
          })),
          skipDuplicates: true,
        });
      }
    })
    ctx.status(200);
    return ctx.json({
      message: "blog updated!",
    });
  } catch (error) {
    return HandleCatchErrors(error, ctx);
  }
});
BlogRouter.post("/blog-reaction", authMiddleWare, async (ctx) => {
  const blog_reaction = await ctx.req.json(); //{likeDislike,reaction,postId}
  const prisma = ctx.get('prisma')
  try {
    //check if reaction of user already exists then update it.
    const reaction = await prisma.reaction.findUnique({
      where: {
        postId_userId:{
          userId: ctx.get("userId"),
          postId: blog_reaction.postId,
        }
      },
    });
    if (reaction) {
      await prisma.reaction.update({
        where: {
          id: reaction.id,
        },
        data: {
          likeDislike: blog_reaction.likeDislike,
          reaction: blog_reaction.reaction,
        },
      });
      ctx.status(200);
      return ctx.json({});
    } else {
      // add new reaction entry
      await prisma.reaction.create({
        data: {
          likeDislike: blog_reaction.likeDislike,
          reaction: blog_reaction.reaction,
          postId: blog_reaction.postId,
          userId: ctx.get("userId"),
        },
      });
      ctx.status(200);
      return ctx.json({});
    }
  } catch (error) {
    ctx.status(500);
    return ctx.json({
      message: "something went wrong!",
    });
  }
});
BlogRouter.post("/", authMiddleWare, async (ctx) => {
  try {
    const prisma = ctx.get("prisma");
    const body = await ctx.req.json();
    // verify body using zod
    //zod validation
    const val = createBlogSchema.safeParse(body);
    const tags = body.tags;
    // we don't need a publish date , get from database.
    // have a published tag from frontend to know blog is darft or published
    if (!val.success) {
      ctx.status(411);
      return ctx.json({
        message: "invalid inputs",
      });
    }
    const data: CreateBlogType = body;
    // get title and preview , TODO: thing better solution so that all blog should have title and if not then make them a draft
    const { title, preview } = ExtractSmart(data.content);
    if (title.length === 0) {
      ctx.status(411);
      data.published = false;
    }
    await prisma.$transaction(async(tx)=>{
      const post = await tx.post.create({
        data: {
          title,
          content: preview,
          blogJson: data.content,
          authorId: ctx.get("userId"),
          published: data.published,
        },
      });
      // add tags
      if (tags.length > 0) {
        await tx.tag.createMany({
          data: tags.map((title: string) => ({
            title: title,
            postId: post.id,
          })),
          skipDuplicates: true,
        });
      }
    })
    ctx.status(200);
    return ctx.json({
      message: "blog added!",
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
      select: {
        id: true,
        content: true,
        title: true,
        publishedDate: true,
        published: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      where: {
        published: true,
      },
      orderBy: [
        {
          publishedDate: "desc",
        },
      ],
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
      select: {
        id: true,
        content: true,
        title: true,
        publishedDate: true,
        published: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      where: {
        authorId: ctx.get("userId"),
      },
      orderBy: [
        {
          publishedDate: "desc",
        },
      ],
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
BlogRouter.get("/comments/:blogId/:pageno", async (ctx) => {
  const pageno = Number(ctx.req.param("pageno")) || 0;
  const blogId = ctx.req.param("blogId");
  const prisma = ctx.get("prisma");
  try {
    // check valid BlogId
    const result = await ValidateBlogId(blogId, prisma);
    const comments = await prisma.comment.findMany({
      where: {
        postId: blogId,
      },
      take: 10,
      skip: 10 * pageno,
    });
    ctx.status(200);
    return ctx.json({
      comments,
    });
  } catch (error) {
    return HandleCatchErrors(error, ctx);
  }
});
BlogRouter.post("/comment", authMiddleWare, async (ctx) => {
  const data = await ctx.req.json();
  const prisma = ctx.get("prisma");
  // validate blog
  try {
    const result = await ValidateBlogId(data.postId, prisma);
    //add comment
    await prisma.comment.create({
      data: {
        comment: data.comment,
        commentorId: ctx.get("userId"),
        postId: data.postId,
      },
    });
    ctx.status(200);
    return ctx.json({
      message: "comment added!",
    });
  } catch (error) {
    console.log(error);
    
    return HandleCatchErrors(error, ctx);
  }
});
BlogRouter.get("/:id", authMiddleWare, async (ctx) => {
  try {
    const prisma = ctx.get('prisma')
    const postId = ctx.req.param("id");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        blogJson: true,
        publishedDate: true,
        authorId: true,
        published: true,
        author: {
          select: {
            name: true,
          },
        },
        tags:true,
        reactions:true
      },
    });
    //count the likes/dislikes and reactions
    const tags = post.tags.map(tag => (tag.title));
    let like = 0,dislike=0,reaction=0;
     post.reactions.forEach(react => {
        if(react.likeDislike === 'LIKE'){
          like++;
        }
        if(react.likeDislike === 'DISLIKE'){
          dislike++;
        }
        if(react.reaction !== 'NONE'){
          reaction++;
        }
    });
    ctx.status(200);
    return ctx.json({
       blog:{
        id:post.id,
        blogJson:post.blogJson,
        published:post.published,
        publishedDate:post.publishedDate,
        authorId:post.authorId,
        author:post.author,
        tags,
        reactions:{
          like,
          dislike,
          reaction
        }
       }
    });
  } catch (error) {
    console.log(error);
    
    ctx.status(500);
    return ctx.json({
      message: "Internal Server error!",
    });
  }
});
BlogRouter.put("/comment", authMiddleWare, async (ctx) => {
  const data = await ctx.req.json();
  const prisma = ctx.get("prisma");
  // validate blog
  try {
    await prisma.comment.update({
      where: {
        id: data.commentId,
        commentorId: ctx.get("userId"),
      },
      data: {
        comment: data.comment,
      },
    });
    ctx.status(200);
    return ctx.json({
      message: "comment updated!",
    });
  } catch (error) {
    ctx.status(500);
    return ctx.json({
      message: "something went wrong!",
    });
  }
});
