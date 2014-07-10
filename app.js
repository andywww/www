var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
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

  var clientId = 1;

  var ping = setInterval(function(){
      var c = { type : 'ping', time : +new Date + 100000};
      io.sockets.emit('transmit', JSON.stringify(c));
  }, 5000);

io.sockets.on('connection', function (socket) {
  //socket.broadcast.emit('news', { hello: 'world' });

  var c = { type : 'handshake', id : socket.id, clientId : clientId };
  socket.emit('transmit', JSON.stringify(c));
  c = { type : 'nodehandshake', id : socket.id, clientId : clientId++ };
  socket.broadcast.emit('transmit', JSON.stringify(c));


  

  socket.on('broadcast', function (data) {
    data = JSON.parse(data);
   /* if(data.type=="ping"){
        var c = { type : 'ping', id : data.id };
        socket.broadcast.emit('transmit', JSON.stringify(c));
    } */
    if(data.type=="stopPing"){
      clearInterval(ping);
    }
    if(data.type=="startSyncTrack"){
        socket.broadcast.emit('transmit', JSON.stringify(data));
    }
    if(data.type=="play"){
        var c = { type : 'play', time : +new Date + 100000 }; 
        socket.broadcast.emit('transmit', JSON.stringify(data));
    }
    if(data.type=="pause" || data.type=="volch" || data.type=="speakers" || data.type=="refresh" || data.type=="nudge" || data.type=="click" || data.type=="masterGain"){
        socket.broadcast.emit('transmit', JSON.stringify(data));
    }
    if(data.type=="speakersx"){
        var c = { type : 'speakers', id : data.id, l: data.l, r: data.r };
        socket.broadcast.emit('transmit', JSON.stringify(c));
    }
    //console.log(data);
   // var c = { type : 'connection', time : +new Date}
    //socket.broadcast.emit('transmit', JSON.stringify(c));
  });
});
