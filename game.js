var uuid = require('node-uuid');

var Game = function(player1, player2){
    this.id = uuid.v1();

    this.player1 = player1;
    this.player2 = player2;

    this.player1.game = this;
    this.player2.game = this;

    this.player1.socket.emit('ready');
    this.player2.socket.emit('ready');

    return this;
}


module.exports = exports = Game;

