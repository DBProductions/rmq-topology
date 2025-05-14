import { Application, Router, send } from "@oak/oak";

const app = new Application()
const router = new Router()

const ROOT_DIR = "./public", ROOT_DIR_PATH = "/public";

app.use(async (ctx, next) => {
  await send(ctx, ctx.request.url.pathname, {
    root: ROOT_DIR,
    index: "index.html",
  });
});

app.listen({ port: 3000 })