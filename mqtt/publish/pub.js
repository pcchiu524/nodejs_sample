var mqtt = require('mqtt');
var properties = require('properties');

//var deviceId = '402cf4e9841a'
//var deviceId = '123456789012'
//var deviceId = '123456987654'
var deviceId = '900939966495'
//var caCerts = ["./IoT.pem", "IoT-CA.pem"];


properties.parse('./config.properties', {path: true}, function(err, cfg) {
  if (err) {
    console.error('A file named config.properties containing the device registration from the IBM IoT Cloud is missing.');
    console.error('The file must contain the following properties: org, type, id, auth-token.');
    //throw err;
  }

  if(cfg.id != deviceId) {
    console.warn('The device MAC address does not match the ID in the configuration file.');
  }

  var clientId = ['d', cfg.org, cfg.type, cfg.id].join(':');

  console.log('clientId: ' + clientId);
  var client = mqtt.createSecureClient('8883', cfg.org + '.messaging.internetofthings.ibmcloud.com', 
      {
        "clientId" : clientId,
        "keepalive" : 30,
        "username" : "use-token-auth",
        "password" : cfg['auth-token']
        //"rejectUnauthorized": false
        //"rejectUnauthorized": true,
        //"ca": caCerts
      });

    client.on('connect', function() {
	console.log('MQTT client connected to IBM IoT Cloud.');
	setInterval(publish, 1000);	
    });

    client.on('close', function() {
        console.log('client closed');
        process.exit(1);
    });

//var topicString = 'iot-1/d/' + deviceId + '/evt/iotsensor/json';
var topicString = 'iot-2/evt/' + deviceId + '/fmt/json';

console.log("topicString: " + topicString);

var payload = {
	//d: {
		deviceId: deviceId,
                time: '',
                latitude:'23',
                longitude:'120',
	//}
}


    function publish() {
        payload.time = getNowTime()
    	var val = JSON.stringify(payload);
    
    	console.log(topicString + " | " + val);
    	client.publish(topicString, val);
    	//client.end();
    }
    
    function getNowTime(){
        var currentdate = new Date(); 
        var datetime = currentdate.getDate() + "/"
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();
        return datetime
    }

});

