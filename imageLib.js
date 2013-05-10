var gm = require('gm');
var imagedb = require('./imageDb');
var fs = require('fs');
var async = require('async');

function splitImage (image, size, callback) {
  'use strict';
  gm(image).size(function (err, size) {
    var sizeH = size.height / 5;
    var sizeW = size.width / 3;
    var startH = [];
    var splittedImages = [];

    startW.push(0);
    startW.push(sizeW);
    startW.push(startW[startW.length - 1] + sizeW);

    var startH = [];
    startH.push(0);
    for (var k = 0; k < 4; k++) {
      startH.push(startH[startH.length - 1] + sizeH);
    }

    var functionsCrop = [];

    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 3; j++) {
        if (!err) {
          functionsCrop.push(_crop(i, j, sizeW, sizeH, startW[j], startH[i]));
        }
      }
    }
    function _crop(i, j, sizeW, sizeH, startW, startH){
      return function(cb){
        gm(image).crop(sizeW, sizeH, startW, startH)
          .write('foo' + i + j +  '.jpg', function(err){
            splittedImages.push('foo' + i + j +  '.jpg');
            cb(err);
        });
      };
    }
    async.parallel(functionsCrop, function(err){
      if(!err){
        callback (splittedImages);
      }
    });
  });
}

function addImage (imagePath, question, answer, callback) {
  'use strict';
  var imageRead = fs.readFileSync(imagePath);
  var base64content = imageRead.toString('base64');
  gm(imagePath).size(function (err, size) {
    var image = {
      content: base64content,
      question: question,
      answer: answer,
      height: size.height,
      width: size.width
    };
    imagedb.addImage(image, function (err, id) {
      splitImage(imagePath, size, function (splittedImages) {
        var splitFunc = [];
        for (var i = 0; i < splittedImages.length; i++) {
          splitFunc.push(_addSplittedImage(i, id, splittedImages[i]));
        }
        async.parallel(splitFunc, function(){
          callback(true);
        });
      });
    });
  });

  function _addSplittedImage(i, id, image){
    return function(callback){
      imageRead = fs.readFileSync(image);
      base64content = imageRead.toString('base64');
      var splittedImage = {
        idCompleteImage: id,
        content: base64content,
        position: i
      };
      imagedb.addSplittedImage(splittedImage, callback);
      fs.unlinkSync(image);
    };
  }
}

exports.addImage = addImage;
