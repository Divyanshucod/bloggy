import { verify } from "hono/jwt";
export const authMiddleWare = async (ctx: any, next: any) => {
  const cookie = ctx.req.header('Authorization');
  
  if (!cookie) {
    ctx.status(411);
    return ctx.json({
      message: "un-authorized access!"
    });
  }
  //verify token
  try {
    const val = await verify(cookie, ctx.env.MY_SECRET);
    if (!val) {
      ctx.status(403);
      return ctx.json({
        message: "session expired login again!",
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
