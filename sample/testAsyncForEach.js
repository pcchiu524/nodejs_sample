var async = require("async")
var http  = require("http");

var options = {
    host: 'localhost',
    path: '/',
    port: '8191',
    method: 'GET'
};

function aggregate(testUids, callback) { 

  async.forEach(testUids, 
    function(item, callbackInner) {
      console.log("item:"+item);

      //options.method = 'GET';
      //options.path = '/dpaas/api/v1/dp-instance/'+user.dp_instance_id;
      var req = http.request(options, /*callback*/ function(res){
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            res.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            res.on('end', function () {
                console.log("Resp StatusCode: " + res.statusCode);
                console.log("Resp body: " + str);

                callbackInner();
            });

      });

      req.on('error', function(err) {
          // Handle error
          console.log("Error to link controller");
          response.json(500,"Internal Server Error");
      });
      req.end();

    }, 
    // callbackInner
    function(err) {
        
        console.log("index: " + index);

        console.log('iterating done');
        callback(err, "Finish");
    }
  );
}

var testUids = ["aaa","bbb","ccc","ddd","eee","fff"];

aggregate(testUids, function(err, result) {
    console.log("callback:" + result);
});
