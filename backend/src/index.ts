import { Hono } from "hono";
import { mainRouter } from "./mainRouter";
import { PrismaClient } from "./generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { cors } from "hono/cors";
import { env } from "hono/adapter";

const app = new Hono<{
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
app.use('*', cors({
  credentials: true, 
  origin: (origin,ctx)=>{
    return ctx.env.ENVIRONMENT === 'dev' ? 'http://localhost:5173':ctx.env.PRO_ORIGIN;
  }
}))
app.use("*", async (ctx, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: ctx.env.DATABASE_URL,
  }).$extends(withAccelerate());
  ctx.set("prisma", prisma);
  await next();
});

app.route("/api/v1", mainRouter);
export default app;
