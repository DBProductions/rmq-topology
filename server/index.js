import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = new URL('../public', import.meta.url).pathname
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.map': 'application/json'
}

http
  .createServer((req, res) => {
    let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url)
    filePath = path.normalize(filePath)

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403)
      res.end()
      return
    }

    const ext = path.extname(filePath)
    const contentType = MIME[ext] || 'application/octet-stream'

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.end('Not found')
        return
      }
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    })
  })
  .listen(process.env.PORT || 3000)
