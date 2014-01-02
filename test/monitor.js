
var http = require('http');
var util = require('util');
var OWL = require('../owl');

var owl = new OWL();
owl.monitor();

// Event Messages --------------------------------------------------------

owl.on('connect', function( event ) {
	console.log( "connect" );
});

owl.on('electricity', function( event ) {
	console.log( "electricity = " + util.inspect(event, {"depth": null}) );
});

owl.on('heating', function( event ) {
	console.log( "heating = " + util.inspect( event, {"depth": null}) );
});

owl.on('weather', function( event ) {
	console.log( "weather = " + util.inspect( event, {"depth": null}) );
});

owl.on('solar', function( event ) {
	console.log( "solar = " + util.inspect(event, {"depth": null}) );
});

owl.on('disconnect', function( event ) {
	console.log( "disconnect" );
});