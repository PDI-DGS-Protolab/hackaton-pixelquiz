
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var Game = require('./game.js');
var Player = require('./player.js');

var playerWaiting = null;

io.sockets.on('connection', function (socket) {

  var newPlayer = new Player(socket);

  if(!playerWaiting){
    playerWaiting = newPlayer;
  } else {
    var game = new Game(playerWaiting, newPlayer);
    playerWaiting = null;
  }

  newPlayer.emitter.on('die_alone', function(){
    playerWaiting = null;
  });

});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports.io = io;
