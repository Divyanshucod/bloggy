import { Hono } from "hono";
import { UserRouter } from "./Routes/user";
import { BlogRouter } from "./Routes/blog";

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
