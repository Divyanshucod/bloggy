import { signInSchema, signUpSchema } from "@dev0000007/medium-web";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { hashPassword, verifyPassword } from "../passwordHashing";

export const UserRouter = new Hono<{
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

// signup and signin needs a fix

UserRouter.post("/signup", async (ctx) => {
  const prisma = ctx.get("prisma");
  const body = await ctx.req.json();
  //zod validation
  const { success } = signUpSchema.safeParse(body);
  if (!success) {
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

    ctx.status(200);
    return ctx.json({
      message: "logged in!",
      token,
    });
  } catch (error) {
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

    ctx.status(200);
    return ctx.json({
      message: "logged in!",
      token,
    });
  } catch (error) {
    ctx.status(500);
    return ctx.json({
      message: "Server Error!",
    });
  }
});
