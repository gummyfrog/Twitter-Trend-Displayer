var express = require('express');
var path = require('path');
var router = express.Router();


class customRouter {

  constructor(cache) {
    this.express = express;
    this.path = path;
    this.router = router;

    this.app = this.express();
    this.app.use(this.express.static("/../public"));
    this.setup();
  }

  setup() {

    this.router.get('/', function(req, res){
      res.sendFile(path.join(__dirname, '/recent.html'))
    });

    this.router.get('/recent', function(req, res){
      res.sendFile(path.join(__dirname, '/recent.html'))
    });

    this.router.get('/about', function(req, res){
      res.sendFile(path.join(__dirname, '/about.html'))
    });

    this.router.get('/daily', function(req, res){
      res.sendFile(path.join(__dirname, '/daily.html'))
    });

  }
}


module.exports = customRouter;
