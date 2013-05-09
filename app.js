
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

var users = {};

io.sockets.on('connection', function (socket) {

  var newPlayer = new Player(socket);

  if(!playerWaiting){
    playerWaiting = newPlayer;
  } else {
    var game = new Game(playerWaiting, newPlayer);
    users[playerWaiting.id] = game;
    users[newPlayer.id] = game;
    playerWaiting = null;
  }

  socket.on('send_response', function (response) {
    newPlayer.cliResponse(response);
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
