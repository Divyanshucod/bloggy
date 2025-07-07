import { signInSchema, signUpSchema } from "@dev0000007/medium-web";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { hashPassword, verifyPassword } from "../passwordHashing";
import { cookie_name } from "../types";
import { authMiddleWare } from "../middleware/authMiddleWare";
import { serialize } from "cookie-es";

export const UserRouter = new Hono<{
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

UserRouter.post("/signup", async (ctx) => {
  const prisma = ctx.get("prisma");
  const body = await ctx.req.json();
  //zod validation
  const val = signUpSchema.safeParse(body);
  
  if (!val.success) {
    ctx.status(411);
    return ctx.json({
      message: "invalid inputs",
    });
  }
  try {
    //hasing password
    const { hash, salt } = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: `${hash}#${salt}`,
        name: body.name,
      },
    });
    /// token creation
    const token = await sign({ userId: user.id }, ctx.env.MY_SECRET);
    const serialized = set_cookie(ctx,token);
    ctx.header('Set-Cookie',serialized);
    ctx.status(200);
    return ctx.json({
      message: "logged in!",
      token
    });
  } catch (error:any) {
    if(error.code === 'P2002'){
      ctx.status(403);
      return ctx.json({
        message: "Given user email is already exists",
      });
    }
    ctx.status(500);
    return ctx.json({
      message: "Server Error!",
      data: error,
    });
  }
});

UserRouter.post("/signin", async (ctx) => {
  const prisma = ctx.get("prisma");
  const body = await ctx.req.json();
  const { success } = signInSchema.safeParse(body);
  if (!success) {
    ctx.status(411);
    return ctx.json({
      message: "invalid inputs",
    });
  }
  //check user exists
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      ctx.status(403);
      return ctx.json({
        message: "user not exists!",
      });
    }
    //verify password
    const [hash, salt] = user.password.split("#");
    const verified = await verifyPassword(body.password, hash, salt);

    if (!verified) {
      ctx.status(411);
      return ctx.json({
        message: "email/password incorrect!",
      });
    }
    //creating token
    const token = await sign({ userId: user.id }, ctx.env.MY_SECRET);
    
    const serialized = set_cookie(ctx,token);
    ctx.header('Set-Cookie',serialized)
    ctx.status(200);
    return ctx.json({
      message: "logged in!",
    });
  } catch (error) {
    ctx.status(500);
    console.log(error);
    
    return ctx.json({
      message: "Server Error!",
    });
  }
});
UserRouter.get('/logout',authMiddleWare,(ctx:any)=>{
   try{
       const serialized = delete_cookie(ctx);
       ctx.header('Set-Cookie',serialized)
       ctx.status(200)
       return ctx.json({
        message:'you have logged out!'
       })
   }catch(error){
      ctx.status(500);
      return ctx.json({
        message:'something happened while logging out!'
      })
   }
})
function set_cookie(ctx:any,token: any) {
  const serialized = serialize(cookie_name, token, {
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: ctx.env.DEV === 'dev' ? 'lax' : 'none',
    httpOnly: true,
    secure: ctx.env.DEV === 'dev' ? false : true,
  });
  return serialized;
}
function delete_cookie(ctx:any){
  const serialized = serialize(cookie_name, "", {
    path: '/',
    expires: new Date(0), // expire the cookie for in logout 
    sameSite: ctx.env.ENVIRONMENT === 'dev' ? 'lax' : 'none',
    httpOnly: true,
    secure: ctx.env.ENVIRONMENT === 'dev' ? false : true,
  });
  return serialized;
}