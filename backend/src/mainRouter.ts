import { Hono } from "hono";
import { UserRouter } from "./Routes/user";
import { BlogRouter } from "./Routes/blog";
import { authMiddleWare } from "./middleware/authMiddleWare";

export const mainRouter = new Hono<{
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

mainRouter.route("/user", UserRouter);

mainRouter.route("/blog", BlogRouter);

mainRouter.get('/me',authMiddleWare,async(ctx)=>{
  const userid = ctx.get('userId')
  const prisma = ctx.get('prisma')
  console.log('hi in the me');
  
  //get user details
   try {
    const userDetails = await prisma.user.findUnique({
      where:{
        id:userid
      },
      select:{
        name:true,
        email:true,
        id:true
      }
    })
    ctx.status(200);
    return ctx.json({
      userDetails
    })
   } catch (error) {
    
      ctx.status(500);
      return ctx.json({
        message:'something happend at the server!'
      })
   }
})
