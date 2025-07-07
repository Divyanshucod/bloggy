import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { cookie_name } from "../types";
import { parse } from "cookie-es";
export const authMiddleWare = async (ctx: any, next: any) => {
  const cookies = parse(ctx.req.header('Cookie') || '');
  const token = cookies[cookie_name];
  if (!token) {
    ctx.status(411);
    return ctx.json({
      message: "un-authorized access!"
    });
  }
  //verify token
  try {
    const val = await verify(token, ctx.env.MY_SECRET);
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
