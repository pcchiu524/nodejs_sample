var jsbase64 = require('js-base64').Base64;

var url = "email=spcchiu@tw.ibm.com&username=spcchiu@tw.ibm.com&name=spcchiu@tw.ibm.com spcchiu@tw.ibm.com"

var jsencrypt = jsbase64.encodeURI(url);
console.log("encode: "+ jsencrypt);

var jsdecrypt = jsbase64.decode(jsencrypt);
console.log("decode: "+ jsdecrypt);
