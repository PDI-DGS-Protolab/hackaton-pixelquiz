var events = require('events');

var Player = function(socket){
    var self = this;
    this.id = socket.id;
    self.socket = socket;
    self.emitter = new events.EventEmitter();

    self.response = "";

    self.socket.on('final_response', function(response){
      self.game.finalResponse(self, response);
    });

    self.socket.on('send_response', function (response) {
      self.cliResponse(response);
    });
    self.socket.on('disconnect', function(){
      self.emitter.emit('die');
      if(self.game){
        self.game.finish(self);
      } else {
        self.emitter.emit('die_alone');
      }
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


