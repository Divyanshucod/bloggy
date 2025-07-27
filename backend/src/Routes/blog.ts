import { Hono } from "hono";
import { authMiddleWare } from "../middleware/authMiddleWare";
import {
  createBlogSchema,
  CreateBlogType,
  updateBlogSchema,
  UpdateBlogType,
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
    const body = await ctx.req.json();    
    const { success } = updateBlogSchema.safeParse(body);
    if (!success) {
      ctx.status(411);
      return ctx.json({
        message: "invalid inputs",
      });
    }
    const data = body as UpdateBlogType;
    
    const post = await ValidateBlogId(data.postId, prisma);
    // get title and preview (check title empty or not)
    if(data.content.title.length === 0 && post.published === true){
      ctx.status(411);
      return ctx.json({
        message:"Title can't be empty!"
      })
    }
    await prisma.$transaction(async(tx)=>{
      await tx.post.update({
        data: {
          title:data.content.title,
          blogJson: data.content.content,
          published: data.published ? data.published : post.published,
        },
        where: {
          id: data.postId,
        },
      });
      // tags update
      const map = new Map<string, boolean>();
      for (let i = 0; i < data.content.tags.length; i++) {
        map.set(data.content.tags[i], true);
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
  
        const needToAdd = data.content.tags
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
    //zod validation
    const {success} = createBlogSchema.safeParse(body);
    if (!success) {
      ctx.status(411);
      return ctx.json({
        message: "invalid inputs",
      });
    }
    const data = body as CreateBlogType;
    // get title and preview , TODO: thing better solution so that all blog should have title and if not then make them a draft
    const {preview } = ExtractSmart(data.content.content);
    if (data.content.title.length === 0) {
      ctx.status(411);
      return ctx.json({
        message:"Title can't be empty!"
      })
    }
    await prisma.$transaction(async(tx)=>{
      const post = await tx.post.create({
        data: {
          title:data.content.title,
          content: preview,
          blogJson: data.content.content,
          authorId: ctx.get("userId"),
          published: data.published,
        },
      });
      // add tags
      if (data.content.tags.length > 0) {
        await tx.tag.createMany({
          data: data.content.tags.map((title: string) => ({
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
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        commentor: {
          select: {
            name: true,
          },
        },
        reactions:true
      },
    });
    const newComments = comments.map((comment) => {
      const { like, dislike,currentUserReactions } = countReactions(comment.reactions,ctx);
      return {
        id: comment.id,
        comment: comment.comment,
        createdAt: comment.createdAt,
        commentor: comment.commentor,
        reactionsCnt: { like, dislike },
        currentUserReactions: currentUserReactions
      };
    })
    ctx.status(200);
    return ctx.json({
      newComments,
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
    const prisma = ctx.get('prisma');
    const postId = ctx.req.param("id");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        blogJson: true,
        publishedDate: true,
        authorId: true,
        published: true,
        title: true,
        tags: { select: { title: true } },
        author: { select: { name: true } },
        reactions: true,
        _count: { select: { comments: true } }
      },
    });

    if (!post) {
      ctx.status(404);
      return ctx.json({ message: "Blog post not found" });
    }

    const tags = post.tags.map(tag => tag.title);

    const { like, dislike, reaction,currentUserReactions } = countReactions(post.reactions,ctx);

    ctx.status(200);
    return ctx.json({
      blog: {
        id: post.id,
        content: post.blogJson,
        published: post.published,
        publishedDate: post.publishedDate,
        authorId: post.authorId,
        author: post.author,
        title: post.title,
        tags,
        commentsCnt: post._count.comments,
        reactions: { like, dislike, reaction },
        currentUserReactions: currentUserReactions
      }
    });

  } catch (error) {
    console.error("Error in GET /:id:", error);
    ctx.status(500);
    return ctx.json({ message: "Internal Server Error" });
  }
});
BlogRouter.put("/comment", authMiddleWare, async (ctx) => {
  const data = await ctx.req.json();
  const prisma = ctx.get("prisma");
  // can get values like reaction 'like','dislike' or just comment
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
    // if have reaction then update it
    if (data.likeDislike && data.likeDislike.length > 0) {
      const reaction = await prisma.commentreaction.findUnique({
        where: {
          commentId_userId: {
            commentId: data.commentId,
            userId: ctx.get("userId"),
          },
        },
      });
      if (reaction) {
        await prisma.commentreaction.update({
          where: { id: reaction.id },
          data: { reaction: data.likeDislike },
        });
      } else {
        await prisma.commentreaction.create({
          data: {
            likeDislike: data.likeDislike,
            commentId: data.commentId,
            userId: ctx.get("userId"),
          },
        });
      }
    }
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

function countReactions(reactions,ctx) {
  let currentUserReactions = {likeDislike: 'NONE', reaction: 'NONE'};
  let like = 0, dislike = 0, reaction = 0;
  for (const react of reactions) {
    if (react.likeDislike === 'LIKE'){
      like++;
      if(react.userId === ctx.get("userId")) currentUserReactions.likeDislike = 'LIKE';
    } 
    if (react.likeDislike === 'DISLIKE') {

      dislike++
      if(react.userId === ctx.get("userId")) currentUserReactions.likeDislike = 'DISLIKE';
    };
    if (react.reaction !== 'NONE') {
      reaction++
      if(react.userId === ctx.get("userId")) currentUserReactions.reaction = react.reaction;};
  }
  return { like, dislike, reaction,currentUserReactions };
}
