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
      self.question = image.question;

      self.pushQuestions(function(){
        self.player1.socket.emit('ready', self.question);
        self.player2.socket.emit('ready', self.question);
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

  for(var i=0; i< shards.length; i++){
    var res = genRandom();
    var question = "¿ " + res.num1 + " + " + res.num2 + " ?";
    pushFunc.push(_push(question,res.res,shards[i]));
  }

  async.parallel(pushFunc, done);

  function _push(question, res, shard){
    return function(cb){
      pbCli.pushTransaction(gameId, {question : question, good : res, image : shard}, cb);
    };
  }

  function genRandom(){
    var num1, num2, res;
    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 100);
    res = num1 + num2;
    return {num1:num1, num2:num2, res:res};
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
    self.player1.socket.emit('win', self.image);
    self.player2.socket.emit('lose', self.image);
  }
  else if(this.player2 === playerWin){
    self.player1.socket.emit('lose', self.image);
    self.player2.socket.emit('win', self.image);
  }
};

Game.prototype.finish = function(player){
  var self = this;

  if(this.player1 === player){
    self.player2.socket.emit('quit');
  }
  else if(this.player2 === player){
    self.player1.socket.emit('quit');
  }
};

module.exports = exports = Game;

