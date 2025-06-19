import { Hono } from "hono";
import { mainRouter } from "./mainRouter";
import { PrismaClient } from "./generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const app = new Hono<{
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
app.use("*", async (ctx, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: ctx.env.DATABASE_URL,
  }).$extends(withAccelerate());
  ctx.set("prisma", prisma);
  await next();
});
app.route("/api/v1", mainRouter);
export default app;
