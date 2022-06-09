var fs = require("fs");
var http = require("http");

// Escribí acá tu servidor
http
  .createServer((req, res) => {
      fs.readFile(`${__dirname}/${req.url}.jpg`, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Error");
        } else {
          res.writeHead(200, { "Content-Type": "image/jpeg" });
          res.end(data);
        }
      });
  })
  .listen(8080, "127.0.0.1");
