var http = require("http");
var fs = require("fs");
const { timingSafeEqual } = require("crypto");

var beatles = [
  {
    name: "John Lennon",
    birthdate: "09/10/1940",
    profilePic:
      "https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg",
  },
  {
    name: "Paul McCartney",
    birthdate: "18/06/1942",
    profilePic:
      "http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg",
  },
  {
    name: "George Harrison",
    birthdate: "25/02/1946",
    profilePic:
      "https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg",
  },
  {
    name: "Richard Starkey",
    birthdate: "07/08/1940",
    profilePic:
      "http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg",
  },
];

http
  .createServer((req, res) => {
    if (req.url === "/api" || req.url === "/api/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(beatles));
    }
    else if (req.url.substring(0,5) === "/api/" && req.url.length > 5) {
      console.log('Entro al if');
      let findBeatle = req.url.split('/').pop();
      console.log(findBeatle);  
      let beatle = beatles.find(beatle => findBeatle === encodeURI(beatle.name));
      if (beatle) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(beatle));
      }else{
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Error - Beatle not found");
      }
    }

    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      const index = fs.readFileSync(`${__dirname}/index.html`);
      res.end(index);
    }

    let findBeatle = req.url.split('/').pop();
    let foundBeatle = beatles.find(beatle => findBeatle === encodeURI(beatle.name));  
    if (foundBeatle) {
      res.writeHead(200, { "Content-Type": "text/html" });
      let index = fs.readFileSync(`${__dirname}/beatle.html`, 'utf8');
      index = index.replace(/{name}/g, foundBeatle.name);
      index = index.replace('{birthdate}', foundBeatle.birthdate);
      index = index.replace('{profilePic}', foundBeatle.profilePic);
      res.end(index);
    }else{
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Error - Beatle not found");
    }
  })
  .listen(8080, "127.0.0.1");
