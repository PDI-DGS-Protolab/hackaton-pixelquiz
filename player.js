
var Player = function(socket){
    this.game;
    this.id = socket.id;
    this.socket = socket;

    this.response = "";

    return this;
};

Player.prototype.cliResponse = function(response){
    if (this.response === response){
        var newQuestion = this.getQuestion();
        this.socket.emit('new_question', newQuestion);
    }
};

Player.prototype.getQuestion = function(){
    return 'hola';
};

module.exports = exports = Player;


