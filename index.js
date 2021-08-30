const http = require('http')
const static = require('node-static')

const file = new static.Server(__dirname)

http
  .createServer((req, res) => {
    file.serve(req, res)
  })
  .listen(process.env.PORT || 3000)
