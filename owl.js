
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dgram = require('dgram');
var xml = require('node-xml-lite');

var socket;

var OWL = function( ) {
	EventEmitter.call(this);	
}
util.inherits(OWL, EventEmitter);

OWL.prototype.connect = function ( ) {
	var LOCAL_BROADCAST_HOST = '224.192.32.19';
	var LOCAL_BROADCAST_PORT = 22600;
	var self = this;
	
	socket = dgram.createSocket('udp4');
	socket.bind(LOCAL_BROADCAST_PORT, function() {
	  socket.addMembership(LOCAL_BROADCAST_HOST);
	});

	socket.on("listening", function() {
		
	});
	
	socket.on("message", function(msg, rinfo) {
	  //console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);	
	  	var buff = xml.parseString( msg )	
		if ( buff.name === 'electricity' ) {
			/* 
			{ name: 'electricity',
			  attrib: { id: '443719001958' },
			  childs: 
			   [ { name: 'signal', attrib: { rssi: '-67', lqi: '127' } },
			     { name: 'battery', attrib: { level: '100%' } },
			     { name: 'chan',
			       attrib: { id: '0' },
			       childs: 
			        [ { name: 'curr', attrib: { units: 'w' }, childs: [ '305.00' ] },
			          { name: 'day', attrib: { units: 'wh' }, childs: [ '236.99' ] } ] },
			     { name: 'chan',
			       attrib: { id: '1' },
			       childs: 
			        [ { name: 'curr', attrib: { units: 'w' }, childs: [ '0.00' ] },
			          { name: 'day', attrib: { units: 'wh' }, childs: [ '0.00' ] } ] },
			     { name: 'chan',
			       attrib: { id: '2' },
			       childs: 
			        [ { name: 'curr', attrib: { units: 'w' }, childs: [ '0.00' ] },
			          { name: 'day', attrib: { units: 'wh' }, childs: [ '0.00' ] } ] } ] }
			*/
			var electricity = { 'id': buff.attrib.id,
								'signal':{'rssi': buff.childs[0].attrib.rssi, 'lqi':buff.childs[0].attrib.lqi},
								'battery': buff.childs[1].attrib.level,
								'channels':{'0':[{'current':buff.childs[2].childs[0].childs[0],'units':buff.childs[2].childs[0].attrib.units},
												{'day':buff.childs[2].childs[1].childs[0],'units':buff.childs[2].childs[1].attrib.units}],
								            '1':[{'current':buff.childs[3].childs[0].childs[0],'units':buff.childs[3].childs[0].attrib.units},
												{'day':buff.childs[3].childs[1].childs[0],'units':buff.childs[3].childs[1].attrib.units}],
								            '2':[{'current':buff.childs[4].childs[0].childs[0],'units':buff.childs[4].childs[0].attrib.units},
												{'day':buff.childs[4].childs[1].childs[0],'units':buff.childs[4].childs[1].attrib.units}]
										   }
							  };
			self.emit( 'electricity', electricity );		
		
	 	} else if ( buff.name === 'heating' ) {
			/*
			{ name: 'heating',
			  attrib: { id: '443719001958' },
			  childs: 
			   [ { name: 'signal', attrib: { rssi: '-74', lqi: '49' } },
			     { name: 'battery', attrib: { level: '2990mV' } },
			     { name: 'temperature',
			       attrib: { until: '1376870400', zone: '0' },
			       childs: 
			        [ { name: 'current', childs: [ '19.68' ] },
			          { name: 'required', childs: [ '15.00' ] } ] } ] }
			*/
			var heating = { 'id': buff.attrib.id,
							'signal':{'rssi': buff.childs[0].attrib.rssi, 'lqi':buff.childs[0].attrib.lqi},
							'battery': buff.childs[1].attrib.level,
							'temperature': {'current': buff.childs[2].childs[0].childs[0], 'required':buff.childs[2].childs[1].childs[0]}
						  };
			self.emit( 'heating', heating );
		
		
	 	} else if ( buff.name == 'weather' ) {
			/*
			{ name: 'weather',
			  attrib: { id: '443719001958', code: '113' },
			  childs: 
			   [ { name: 'temperature', childs: [ '19.00' ] },
			     { name: 'text', childs: [ 'Clear/Sunny' ] } ] }
			*/
		
		    var weather = { 'id': buff.attrib.id,
							'temperature': buff.childs[0].childs[0], 
							'forecast': buff.childs[1].childs[0] };
			self.emit( 'weather', weather );
		
		
		} else {
			self.emit( 'error', "Error: Unknown message of type " + buff.name + "recieved.");
		}	  	
	
		//console.log( util.inspect( buf , {depth: null}));
	});	
	
}

OWL.prototype.disconnect = function ( ) {
	socket.close();
	this.emit('argh');
	
}

module.exports = OWL;
