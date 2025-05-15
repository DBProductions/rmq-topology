import http from 'http'
import nodeStatic from 'node-static'
import process from 'node:process'

const file = new nodeStatic.Server('public')

http
  .createServer((req, res) => {
    file.serve(req, res)
  })
  .listen(process.env.PORT || 3000)
