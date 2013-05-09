
var Player = function(socket){
    var self = this;
    this.id = socket.id;
    self.socket = socket;

    self.response = "";

    self.socket.on('final_response', function(response){
      self.game.finalResponse(self, response);
    });

    socket.on('disconnect', function(){
      self.game.finish(self);
    });

    return self;
};

Player.prototype.cliResponse = function(response){
  var self = this;
  if (self.response == response){
    self.game.getQuestion(function(trans){
      if(trans){
        self.response = trans.good;
        delete trans.good;
        self.socket.emit('new_question', trans);
      } else {
        self.socket.emit('new_question', false);
      }
    });
  }
};

module.exports = exports = Player;


