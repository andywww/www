var app = require('http').createServer(handler)
  , fs = require('fs')
  , url = require('url')

app.listen(3000);


function handler (req, res) {

  if(req.url.indexOf('.mp3')>-1 || req.url.indexOf('.wav')>-1){

        console.log(__dirname + req.url);
        stat = fs.statSync(__dirname + req.url);

        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });

    // We replaced all the event handlers with a simple call to util.pump()
    
      fs.createReadStream(__dirname + req.url).pipe(res);
      return true;
    }else if(req.url.indexOf('.wav')>-1){
        console.log(__dirname + req.url);
        ms.pipe(req, res, __dirname + req.url);

       /* stat = fs.statSync(__dirname + req.url);

        res.writeHead(200, {
            'Content-Type': 'audio/wav',
            'Content-Length': stat.size,
            'Content-Range': 'bytes 0-' + req.headers.range + '/' + stat.size
        });*/

    // We replaced all the event handlers with a simple call to util.pump()
    
      //fs.createReadStream(__dirname + req.url).pipe(res);
    }else{
            console.log(req.url);
        fs.readFile(__dirname + req.url,
        function (err, data) {
          if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
          }

          res.writeHead(200);
          res.end(data);
        });
      }
}