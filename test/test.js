
var http = require('http');
var util = require('util');
var OWL = require('../owl');

var monitor = new OWL();
monitor.connect();

monitor.on('connect', function( event ) {
	console.log( "connect" );
});

monitor.on('electricity', function( event ) {
	console.log( "electricity = " + util.inspect(event, {"depth": null}) );
});

monitor.on('heating', function( event ) {
	console.log( "heating = " + util.inspect( event, {"depth": null}) );
});

monitor.on('weather', function( event ) {
	console.log( "weather = " + util.inspect( event, {"depth": null}) );
});

monitor.on('solar', function( event ) {
	console.log( "solar = " + util.inspect(event, {"depth": null}) );
});

monitor.on('disconnect', function( event ) {
	console.log( "disconnect" );
});