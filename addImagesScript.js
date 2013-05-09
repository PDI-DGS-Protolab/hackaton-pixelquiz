var imageLib = require('./imageLib');

var imagePath = process.argv[2];
var question = process.argv[3];
var answer = process.argv[4];

imageLib.addImage(imagePath, question, answer, function (ok) {
  console.log(ok);
  process.exit();
});
