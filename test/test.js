
var http = require('http');
var util = require('util');
var OWL = require('../owl');

var monitor = new OWL();
monitor.connect();

monitor.on('electricity', function( event ) {
	console.log( "electricity", util.inspect(event) );
});

monitor.on('heating', function( event ) {
	console.log( "heating", util.inspect(event) );
});

monitor.on('weather', function( event ) {
	console.log( "weather", util.inspect(event) );
});
