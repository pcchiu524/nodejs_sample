## About
This project contains different ways of visualizing and consuming the data published to 
the IBM IoT Cloud from a TI Sensor Tag.  In other words the code in this directory connects to the IoT Cloud
subscribes to topics and then does something with the data.  If you are looking for how to publish data to the IoT
Cloud check out the project within the 
[publish directory](https://github.com/IBM-Bluemix/iot-sensor-tag/tree/master/publish).

## Server Code
Most of the hard work of connecting to the IoT Cloud and subscribing to various topics happens in a Node.js
app on the server.  This app connects to the IoT Cloud using MQTT and subscribes to the topics published
from the Node.js app in the publish directory.  In order to connect to the IoT Cloud the code needs an API Key
and Auth Token from the IoT Cloud.  This can be provided via a properties file (for running locally) or via
a service when the app is deployed to Bluemix.  After connecting to the IoT Cloud the app will publish the data 
to the client side browser code over several web sockets using 
the [sockjs Node.js library](https://github.com/sockjs/sockjs-node).

## Client Side Code
As mentioned above the server side code is using websockets to push data in 
real time down to the client side code.  The client side code uses the 
[sockjs client library](https://github.com/sockjs/sockjs-client) to connect to the websockets and retrieve and 
send data.  Before the client side code can receive data it needs to send the device id of the device that
is sending data so the code on the server knows which device to listen for data from.

## Running The Code

### Prerequisites
Before you run this code you will need an API Key and Auth Token.  To get an API Key and Auth Token you need
to sign up for the IoT Cloud beta.  You should have already done this when setting up your device to publish
the Sensor Tag data, however if you still need to register you can do so [here](https://internetofthings.ibmcloud.com/#/).
After you have registered you will need to login and head to the dashboard.  On the dashboard click the 
API Keys tab.  Then click the Add API Key link.  This will bring up a dialog with an API Key and Auth
Token.  Copy these values and save them somewhere, once you close the dialog it will not be possible to 
retrieve them.

### Locally
You can run this code locally on your dev machine if you want.  Before doing this you will need to create a file
named config.properties in the subscribe directory.  Inside this file you should add two properties one for the API Key
and one for the Auth Token.  For example

    apikey=myapikey
    apitoken=myapitoken

After you have added the config.properties file run the following commands in a terminal window from the subscribe
directory.
    
    $ npm install
    $ node app.js

Open your favorite browser and go to [http://localhost:9999](http://localhost:9999).

### Bluemix
To deploy the code to Bluemix you will need to have an internet of things service within the space you are
deploying the application called iot-sensor-tag.  Go to the Bluemix catalog and select the 
internet of things service.  Leave the service unbound (do not bind it to an app) and change the name to 
iot-sensor-tag.  Enter the API Key and API Token you got from the IoT Cloud and click Create.

Now from within the subscribe directory deploy the application using the provided manifest.  You will want to
change the name of the application in the manifest before deploying to avoid any conflicts.  Then from
within the subscribe directory run the following command.

    $ cf push

## Using The Demo Apps
The apps need to know the device ID of the device which is publishing the Sensor Tag data.  The device ID
is the MAC address of the device publishing the Sensor Tag data.  This allows
you to connect to multiple devices from the same deployment.

## Dependencies
For a list of 3rd party dependencies that are used see the package.json file
in the root of the repository.