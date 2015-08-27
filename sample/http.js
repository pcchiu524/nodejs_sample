var http = require('http');

http.createServer(function (req,res){

	res.writeHead(200, {'Content-Type':'text/html'});
	res.write('Hello i am win');
	res.end('<br><br>this is test file');
}).listen('1234');
console.log('HTTP server is running at port 1234');
