
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dgram = require('dgram');
var xml = require('xml2json');

var OWL = function( ) {
	EventEmitter.call(this);
		
	var multicastsocket = null;	
	
	var udpkey = null;
	var owlsocket = null;	
	var OWL_HOST = null;
	var OWL_PORT = null;
}
util.inherits(OWL, EventEmitter);

OWL.prototype.configure = function ( ip, key ) {
	var self = this;
	
	self.OWL_HOST = ip;
	self.OWL_PORT = 5100;
	self.udpkey = key;
	self.owlsocket = dgram.createSocket('udp4');
	
	self.owlsocket.on("listening", function() {
		
	});
	
	self.owlsocket.on("message", function (message, remote) {
    	//console.log("The packet came back: " + message  + "," + util.inspect(remote, {"depth": null}));
		
		var string = message.toString('utf-8');
		string = string.trim();
		
	    var array = string.split(',');
		var result = { 'status':array.shift(),'result':string.substring(3) };
		self.emit( 'control', result );
	});
	
}

// Control ---------------------------------------------------------------------------

// version() 
// Retrieves the version information of the device.
OWL.prototype.version = function ( ) {
	var self = this;	
	var message = new Buffer("GET,VERSION,"+self.udpkey);
	self.owlsocket.send( message, 0, message.length, self.OWL_PORT, self.OWL_HOST, function(err, bytes) {
		if( err ) {
			self.emit( 'error', err );
		}
	})
	
}

// uptime() 
// Retrieves the run time of the device in days, hours, minutes and seconds.
OWL.prototype.uptime = function ( ) {
	var self = this;	
	var message = new Buffer("GET,UPTIME,"+self.udpkey);
	self.owlsocket.send( message, 0, message.length, self.OWL_PORT, self.OWL_HOST, function(err, bytes) {
		if( err ) {
			self.emit( 'error', err );
		}
	})
	
}

// Monitoring ---------------------------------------------------------------------------

OWL.prototype.monitor = function ( ) {
	var LOCAL_BROADCAST_HOST = '224.192.32.19';
	var LOCAL_BROADCAST_PORT = 22600;
	var self = this;
	
	self.multicastsocket = dgram.createSocket('udp4');
	self.multicastsocket.bind(LOCAL_BROADCAST_PORT, function() {
	  self.multicastsocket.addMembership(LOCAL_BROADCAST_HOST);
	});

	self.multicastsocket.on("listening", function() {
		self.emit('connect');
		
	});
	
	self.multicastsocket.on("message", function(msg, rinfo) {		
		var json = xml.toJson( msg );
		var buff = JSON.parse( json );
		//console.log( util.inspect( buff , {depth: null}));

		if ( buff.electricity ) {			
			var channel0, channel1, channel2 = null;
			buff.electricity.chan.forEach(function(entry) {
			    if( entry.id === 0 ) {
					channel0 = [{'current':entry.curr.$t,'units':entry.curr.units},
								{'day':entry.day.$t,'units':entry.day.units}];
				}
				if( entry.id === 1 ) {
					channel1 = [{'current':entry.curr.$t,'units':entry.curr.units},
								{'day':entry.day.$t,'units':entry.day.units}];
				}
				if( entry.id === 2 ) {
					channel2 = [{'current':entry.curr.$t,'units':entry.curr.units},
								{'day':entry.day.$t,'units':entry.day.units}];
				}
			});
			
			var electricity = { 'id':buff.electricity.id, 
								'signal':buff.electricity.signal, 
								'battery':buff.electricity.battery.level,
						  		'channels':{'0':channel0,'1':channel1,'2':channel2} };

			self.emit( 'electricity', JSON.stringify(electricity) );		
		
	 	} else if ( buff.heating ) {
		    var heating = { 'id':buff.heating.id,
							'signal':buff.heating.signal,
							'battery':buff.heating.battery.level,
							'temperature':buff.heating.temperature };
		
			self.emit( 'heating', JSON.stringify(heating) );
		
	 	} else if ( buff.weather ) {
			self.emit( 'weather', JSON.stringify(buff.weather) );
		
		} else if ( buff.solar ) {
			var solar = { 'id':buff.solar.id,
						  'current':[{'generating':buff.solar.current.generating.$t,'units':buff.solar.current.generating.units},
									 {'exporting':buff.solar.current.exporting.$t, 'units':buff.solar.current.exporting.units}],
						  'day':[{'generated':buff.solar.day.generated.$t,'units':buff.solar.day.generated.units},
								 {'exported':buff.solar.day.exported.$t, 'units':buff.solar.day.exported.units}] };			
		
			self.emit( 'solar', JSON.stringify(solar) );
		
		} else {
			self.emit( 'error', new Error("Unknown message of received. XML = " + msg + ", JSON = " + json ));
		}	  	
	
	});	
	
}

OWL.prototype.stop = function ( ) {
	if( this.multicastsocket ) {
		this.multicastsocket.close();
	}
	if( this.owlsocket ) {
		this.owlsocket.close();
	}
	this.emit('disconnect');
	
}

module.exports = OWL;
