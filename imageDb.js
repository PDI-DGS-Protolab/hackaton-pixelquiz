var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/images');

var ImageSchema = mongoose.Schema({
  content: {type: String, required: true},
  question: {type: String, required: true},
  answer: {type: String, required: true},
  height: {type: Number, required: true},
  width: {type: Number, required: true}
});

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
  ImageModel.findOne({}, function (err, image) {
    if (image){
      SplittedImageModel.find({idCompleteImage: image.id}, function (err, images) {
        for (var i = 0; i < images.length; i++) {
          contents.push(images[i].content);
        }
        callback(err, image, contents);
      });
    } else {
      callback(true);
    }
  });
}

exports.addImage = addImage;
exports.addSplittedImage = addSplittedImage;
exports.getImages = getImages;
