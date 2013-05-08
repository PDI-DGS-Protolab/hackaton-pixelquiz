var uuid = require('node-uuid');
var pbCli = require('./popBoxClient.js');
var async = require('async');

var Game = function(player1, player2){
    var self = this;

    self.id = uuid.v1();

    self.player1 = player1;
    self.player2 = player2;

    self.player1.game = self;
    self.player2.game = self;

    this.pushQuestions(10,function(){
      self.player1.socket.emit('ready');
      self.player2.socket.emit('ready');
    });

    return self;
}

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

Game.prototype.pushQuestions = function(n, done){
  var pushFunc = [];
  var gameId = this.id;

  for(var i=0; i<n; i++){
    pushFunc.push(_push());
  }

  async.parallel(pushFunc, done);

  function _push(){
    return function(cb){
      var num1, num2, res;
      num1 = Math.floor(Math.random() * 10);
      num2 = Math.floor(Math.random() * 10);
      res = num1 + num2;

      pbCli.pushTransaction(gameId, {question : num1 + " + " + num2 + "es...", good : res, image : "data:image/gif;base64,R0lGODlhUAAPAKIAAAsLav///88PD9WqsYmApmZmZtZfYmdakyH5BAQUAP8ALAAAAABQAA8AAAPbWLrc/jDKSVe4OOvNu/9gqARDSRBHegyGMahqO4R0bQcjIQ8E4BMCQc930JluyGRmdAAcdiigMLVrApTYWy5FKM1IQe+Mp+L4rphz+qIOBAUYeCY4p2tGrJZeH9y79mZsawFoaIRxF3JyiYxuHiMGb5KTkpFvZj4ZbYeCiXaOiKBwnxh4fnt9e3ktgZyHhrChinONs3cFAShFF2JhvCZlG5uchYNun5eedRxMAF15XEFRXgZWWdciuM8GCmdSQ84lLQfY5R14wDB5Lyon4ubwS7jx9NcV9/j5+g4JADs="}, cb);
    }
  }

}

module.exports = exports = Game;

