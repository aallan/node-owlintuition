
var http = require('http');
var util = require('util');
var OWL = require('../owl');

var owl = new OWL();
owl.configure( '192.168.1.74', '771556A0' );


owl.version();
//owl.uptime();
//owl.device();
//owl.boost("ON");
//owl.mac();

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

owl.on('error', function( error ) {
	console.log( "response = " + util.inspect( error, {"depth": null}) );
});
