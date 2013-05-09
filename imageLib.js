var gm = require('gm');
var imagedb = require('./imageDb');
var fs = require('fs');

function splitImage (image, name, size, callback) {
  'use strict';
  gm(image).size(function (err, size) {
    var sizeH = size.height / 3;
    var sizeW = size.width / 5;
    var startH = [];
    var splittedImages = [];

    startH.push(0);
    startH.push(sizeH);
    startH.push(startH[startH.length - 1] + sizeH);
    console.log(startH);


    var startW = [];
    startW.push(0);
    for (var k = 0; k < 4; k++) {
      startW.push(startW[startW.length - 1] + sizeW);
    }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 5; j++) {
        if (!err) {
          gm(image).crop(sizeW, sizeH, startW[j], startH[i])
            .write(name + i + j +  '.jpg', function(err){
              splittedImages.push(name + i + j +  '.jpg');
          });
        }
      }
    }
  });
  callback (splittedImages);
}

function addImage (imagePath, name, question, answer, callback) {
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
    var splittedImage = {};
    imagedb.addImage(base64content, function (err, id) {
      splitImage(imagePath, name, size, function (splittedImages) {
        for (var i = 0; i < splittedImages.length; i++) {
          imageRead = fs.readFileSync(splittedImages[i]);
          base64content = imageRead.toString('base64');
          splittedImage = {
            idCompleteImage: id,
            content: base64content,
            position: i
          };
          imagedb.addSplittedImage(splittedImage);
        }
      });
    });
  });
  callback ();
}

exports.splitImage = splitImage;
