
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dgram = require('dgram');
var xml = require('xml2json');

var OWL = function( ) {
	EventEmitter.call(this);	
	var socket = null;	
}
util.inherits(OWL, EventEmitter);

OWL.prototype.connect = function ( ) {
	var LOCAL_BROADCAST_HOST = '224.192.32.19';
	var LOCAL_BROADCAST_PORT = 22600;
	var self = this;
	
	self.socket = dgram.createSocket('udp4');
	self.socket.bind(LOCAL_BROADCAST_PORT, function() {
	  self.socket.addMembership(LOCAL_BROADCAST_HOST);
	});

	self.socket.on("listening", function() {
		self.emit('connect');
		
	});
	
	self.socket.on("message", function(msg, rinfo) {
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
		
		} else {
			self.emit( 'error', new Error("Unknown message of type received: " + buff ));
		}	  	
	
	});	
	
}

OWL.prototype.disconnect = function ( ) {
	this.socket.close();
	this.emit('disconnect');
	
}

module.exports = OWL;
