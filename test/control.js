
var http = require('http');
var util = require('util');
var OWL = require('../owl');

var owl = new OWL();
owl.configure( '192.168.1.109', '771556A0' );


console.log("calling version()");
owl.version();

console.log("calling uptime()");
owl.uptime();

// Event Messages --------------------------------------------------------

owl.on('connect', function( event ) {
	console.log( "connect" );
});

owl.on('control', function( event ) {
	console.log( "response = " + util.inspect( event, {"depth": null}) );
});

owl.on('disconnect', function( event ) {
	console.log( "disconnect" );
});
