var tcpPortUsed = require('tcp-port-used');

/*
tcpPortUsed.check(27017, '127.0.0.1')
.then(function(inUse) {
    console.log('Port 27017 usage: '+inUse);
}, function(err) {
    console.error('Error on check:', err.message);
});
*/

tcpPortUsed.waitUntilFree(1234, 500, 4000)
.then(function() {
    console.log('Port 1234 is now free.');
}, function(err) {
    console.log('Error:', err.message);
});
