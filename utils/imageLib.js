var gm = require('gm');

function splitImage (image, cb) {
  'use strict';
  gm(image).size(function (err, size) {
    var sizeH = size.height / 3;
    var sizeW = size.width / 5;
    var startH = [];

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
            .write('crop' + i + j +  '.jpg', function(err){
          });
        }
      }
    }
  });
  cb ();
}

exports.splitImage = splitImage;
