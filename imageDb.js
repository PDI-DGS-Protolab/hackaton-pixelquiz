var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/images');

var ImageSchema = mongoose.Schema({
  content: {type: String, required: true},
  question: {type: String, required: true},
  answer: {type: String, required: true},
  height: {type: Number, required: true},
  width: {type: Number, required: true}
});

ImageSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

var SplittedImageSchema = mongoose.Schema({
  idCompleteImage: {type: String, required: true},
  content: {type: String, required: true},
  position: {type: Number, required: true}
});

var ImageModel = mongoose.model('ImageModel', ImageSchema);
var SplittedImageModel = mongoose.model('SplittedImageModel', SplittedImageSchema);

function addImage (data, callback) {
  'use strict';
  var image = new ImageModel({
    content: data.content,
    question: data.question,
    answer: data.answer,
    height: data.height,
    width: data.width
  });
  image.save(function (err) {
    callback(err, image.id);
  });
}

function addSplittedImage (data, callback) {
  'use strict';
  var image = new SplittedImageModel({
    idCompleteImage: data.idCompleteImage,
    content: data.content,
    position: data.position
  });
  image.save(function (err) {
    if(callback){
      callback(err);
    }
  });
}

function getImages (callback) {
  'use strict';
  var contents = [];
  getRandom(function (err, image) {
    if (image){
      SplittedImageModel.find({idCompleteImage: image.id}, function (err, images) {
        for (var i = 0; i < images.length; i++) {
          contents.push({image : images[i].content, position : images[i].position});
        }
        callback(err, image, contents);
      });
    } else {
      callback(true);
    }
  });
}

var getRandom = function(callback){
  ImageModel.random(callback);
};

exports.addImage = addImage;
exports.addSplittedImage = addSplittedImage;
exports.getImages = getImages;
