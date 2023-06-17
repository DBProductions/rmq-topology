import http from 'http'
import nodeStatic from 'node-static'

const file = new nodeStatic.Server('public')

http
  .createServer((req, res) => {
    file.serve(req, res)
  })
  .listen(process.env.PORT || 3000)
