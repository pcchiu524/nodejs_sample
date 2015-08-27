var request = require('request');
var async = require('async');

exports.handler = function(req, res) {
  async.parallel([
    /*
     * First external endpoint
     */
    function(callback) {
      var url = "http://localhost:8191";
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        //obj = JSON.parse(body);
        console.log("body1:"+ body);
        callback(false, body);
      });
    },
    /*
     * Second external endpoint
     */
    function(callback) {
      var url = "http://localhost:8191";
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        //obj = JSON.parse(body);
        console.log(body);
        callback(false, body);
      });
    },
  ],
  /*
   * Collate results
   */
  function(err, results) {
    if(err) { console.log(err); res.send(500,"Server Error"); return; }
    res.send(400,{api1:results[0], api2:results[1]});
  }
  );
};

