var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
  content: {type: String, required: true},
  question: {type: String, required: true},
  answer: {type: String, required: true}
});

var SplittedImageSchema = mongoose.Schema({
  idCompleteImage: {type: String, required: true},
  content: {type: String, required: true}
});

var ImageModel = mongoose.model('ImageModel', ImageSchema);
var SplittedImageModel = mongoose.model('SplittedImageModel', SplittedImageSchema);

function addImage (data, callback) {
  'use strict';
  var image = new ImageModel({
    content: data.content,
    question: data.question,
    answer: data.answer
  });
  image.save(function (err) {
    callback(err, image.id);
  });
}

function addSplittedImage (data, callback) {
  'use strict';
  var image = new SplittedImageModel({
    idCompleteImage: data.idImage,
    content: data.content
  });
  image.save(function (err) {
    callback(err);
  });
}

function getImages (data, callback) {
  'use strict';
  var contents = [];
  ImageModel.findOne({}, function (err, image) {
    SplittedImage.find({idCompleteImage: image.id}, function (err, images) {
      for (var i = 0; i < images.length; i++) {
        contents.push(images[i].content);
      }
      callback(err, image.content, contents);
    });
  });
}

exports.addImage = addImage;
exports.addSplittedImage = addSplittedImage;
exports.getImages = getImages;
