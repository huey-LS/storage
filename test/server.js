const http = require('http');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './main.html'));
const storageJS = fs.readFileSync(path.resolve(__dirname, '../index.js'));

const server = http.createServer(function (req, res) {
  if (req.url === '/storage.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(storageJS)
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html)
  }
});
server.listen(8080);

module.exports = server;
