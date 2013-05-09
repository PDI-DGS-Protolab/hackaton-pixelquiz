var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/questions');

var questionSchema = new Schema({
  question: String,
  responses: {a : String, b : String, c : String},
  good : {type : String, enum : ['a', 'b', 'c']},
  image : Buffer
});

questionSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

var Question = mongoose.model('Question', questionSchema);

var getRandom = function(callback){
  Question.random(callback);
};

exports.getRandom = getRandom;
