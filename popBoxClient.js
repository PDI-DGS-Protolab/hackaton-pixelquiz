var http = require('http');
var config = require('./config.js');

var options = {};
  options.host = config.popbox.host;
  options.port = config.popbox.port;
  options.method = 'POST';
  options.headers = {'content-type' : 'application/json', 'accept' : 'application/json'};

var pushTransaction = function(queueid, payload, cb){

  options.path = '/trans';

  var req = http.request(options, cb);

  var trans  = {};
  trans.payload = JSON.stringify(payload);
  trans.queue = [{id : queueid}];
  trans.priority = 'H';
  trans.expirationDelay = "3600";

  req.write(JSON.stringify(trans));
  req.end();
};

var popQueue = function(queueid, cb){
  options.path = '/queue/' + queueid + '/pop?timeout=0&max=1';
  var result = "";
  var req = http.request(options, function(res){
    res.on('data', function(chunk){
      result += chunk;
    });
    res.on('end', function(){
      cb(JSON.parse(result))
      ;
    });
  });
  req.end();
};

exports.pushTransaction = pushTransaction;
exports.popQueue = popQueue;
