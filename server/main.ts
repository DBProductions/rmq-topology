import { Application, send } from '@oak/oak'

const app = new Application()

const ROOT_DIR = './public'

app.use(async (ctx, _next) => {
  await send(ctx, ctx.request.url.pathname, {
    root: ROOT_DIR,
    index: 'index.html'
  })
})

app.listen({ port: 3000 })
