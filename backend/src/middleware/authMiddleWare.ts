import { verify } from "hono/jwt";

export const authMiddleWare = async (ctx: any, next: any) => {
  const authHeader = ctx.req.header("authorization");
  if (!authHeader) {
    ctx.status(411);
    return ctx.json({
      message: "un-authorized access!",
    });
  }
  const token = authHeader.split(" ")[1];
  //verify token
  try {
    const val = await verify(token, ctx.env.MY_SECRET);
    if (!val) {
      ctx.status(403);
      return ctx.json({
        message: "un-authorize access",
      });
    }
    ctx.set("userId", val.userId);
    await next();
  } catch (error) {
    ctx.status(403);
    return ctx.json({
      message: "un-authorize access",
    });
  }
};
