var imageLib = require('./imageLib');

var imagePath = process.argv[2];
var name = process.argv[3];
var question = process.argv[4];
var answer = process.argv[5];

imageLib.addImage(imagePath, name, question, answer, function (ok) {
  console.log(ok);
});
