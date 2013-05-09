var uuid = require('node-uuid');
var pbCli = require('./popBoxClient.js');
var async = require('async');
var imagedb = require('./imageDb.js');

var Game = function(player1, player2){
    var self = this;

    self.id = uuid.v1();

    self.player1 = player1;
    self.player2 = player2;

    self.player1.game = self;
    self.player2.game = self;

    imagedb.getImages(function (err, image, contents){
      self.image = image.content;
      self.shards = contents;
      self.answer = image.answer;
      console.log(self.answer);

      self.pushQuestions(function(){
        self.player1.socket.emit('ready');
        self.player2.socket.emit('ready');
      });
    });

    return self;
};

Game.prototype.getQuestion = function(cb){
  pbCli.popQueue(this.id, function(trans){
    if(trans.data.length === 0){
      cb(false);
    } else{
      var explode = JSON.parse(trans.data);
      cb(explode);
    }
  });
};

Game.prototype.pushQuestions = function(done){
  var pushFunc = [];
  var gameId = this.id;
  var shards = this.shards;

  for(var i=0; i<shards.length; i++){
    pushFunc.push(_push(shards[i]));
  }

  async.parallel(pushFunc, done);

  function _push(shard){
    return function(cb){
      var num1, num2, res;
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
      res = num1 + num2;

      pbCli.pushTransaction(gameId, {question : num1 + " + " + num2 + " es...", good : res, image : shard}, cb);
    };
  }
};

Game.prototype.finalResponse = function(player, response){
  if (response === this.answer){
    this.win(player);
  } else {
    player.socket.emit('no_correct');
  }
};

Game.prototype.win = function(playerWin){
  var self = this;

  if(this.player1 === playerWin){
    self.player1.socket.emit('win');
    self.player2.socket.emit('lose');
  }
  else if(this.player2 === playerWin){
    self.player1.socket.emit('lose');
    self.player2.socket.emit('win');
  }
};


module.exports = exports = Game;

