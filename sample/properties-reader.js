var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config.properties');

var app_id = properties.get('app.id');
var app_secret = properties.get('app.secret');

console.log("app id: " + app_id);
console.log("app secret: " + app_secret);
