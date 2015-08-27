#!/usr/bin/env node

var mqtt = require('mqtt');
var properties = require('properties');

var deviceId = "900939966495";
//var deviceId = "900926258040";
var apiKey = "a-ilmxfq-oppiiysryk";
var apiToken = "mZeriZX+L*j7+--JAG";

properties.parse('./config.properties', {path: true}, function(err, cfg) {
  if (err) {
    console.error('A file named config.properties containing the device registration from the IBM IoT Cloud is missing.');
    console.error('The file must contain the following properties: org, type, id, auth-token.');
    //throw err;
  }

  //var topicString = 'iot-2/evt/' + deviceId + '/fmt/json';
  var topicString = 'iot-2/type/+/id/' + deviceId + '/evt/900926258040/fmt/json';

  //var org = apiKey.split(':')[1];
  var org = cfg.org;

  //var clientId = ['d', cfg.org, cfg.type, cfg.id].join(':');
  var clientId = ['a', org, deviceId].join(':');

  console.log("clientId:" + clientId);
  console.log("create client");

  var client = mqtt.createSecureClient('8883', org + '.messaging.internetofthings.ibmcloud.com', 
      {
        "clientId" : clientId,
        "keepalive" : 30,
        //"username" : "use-token-auth",
        //"password" : cfg['auth-token']
        "username" : apiKey,
        "password" : apiToken
      });

    client.on('connect', function() {
	console.log('MQTT client connected to IBM IoT Cloud.');
	client.subscribe(topicString);

        client.on('message', function(topic, message) {
            console.log(topic + ' ' + message);
        });
    });
});
