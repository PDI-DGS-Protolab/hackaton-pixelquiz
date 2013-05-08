
var Player = function(socket){
    this.game;
    this.id = socket.id;
    this.socket = socket;

    this.response = "";

    return this;
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


