node-owlintuition
=================

node.js library for the OWL Intuition range of energy monitoring and control systems

Install
-------

npm install owlintuition

Usage
-----

Create an instance of the owl class and connect to the multicast broadcast from the Network OWL,

    var OWL = require('owl');
	monitor.connect();

you can subscribe to three different events. One for an electricity message,
	
	monitor.on('electricity', function( event ) {

	});
	
the following object will be passed as an argument to your callback function,
	
	{"signal":
	    {"rssi":"-66",
	     "lqi":"127"},
	 "battery":"100%",
	 "channels":
	    {"0":[
	        {"current":"241.00",
	         "units":"w"},
	        {"day":"823.49",
	         "units":"wh"}],
	     "1":[
	        {"current":"0.00",
	         "units":"w"},
	        {"day":"0.00",
	         "units":"wh"}],
	     "2":[
	        {"current":"0.00",
	         "units":"w"},
	        {"day":"0.00",
	         "units":"wh"}]}}	

one for a heating message if a Intuition-c Room Monitor has been installed,	

	monitor.on('heating', function( event ) {
		
	});

the following object will be passed as an argument to your callback function,
	
	{"signal":
	    {"rssi":"-74",
	     "lqi":"49"},
	 "battery":"2990mV",
	 "temperature":
	    {"current":
	        {"name":"current",
	         "childs":["20.30"]},
	     "required":
	        {"name":"required",
	         "childs":["15.00"]}}}
	
and finally for the local weather,

	monitor.on('weather', function( event ) {
		
	});
	
the following object will be passed as an argument to your callback function,

	{"temperature":"16.00",
	 "forecast":"Clear/Sunny"}
	
there is also an error message if the module encounters a 'new' unknown message over multicast,

	monitor.on('error', function( message ) {
	
	});	
	
where a string describing the error will be returned.

