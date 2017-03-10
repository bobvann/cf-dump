#!/usr/bin/env node

const URL = "api.cloudflare.com";

const args = process.argv.slice(2);
if(args.length < 2 ){
	console.log("Missing arguments");
	console.log("");
	console.log("Usage:  ./cf-dump.js <email> <api key>")
	console.log("Example: ./cf-dump.js email@example.com 2d020di24n2j2kd9di2j2eh82ndwdfdssi2ei")
	process.exit(3);
}


var EMAIL = args[0];
var APIKEY = args[1];

var https = require('https');

var httpsGet = function(opts, cb){
	var myStack = [];

	https.request(opts, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {

	  	myStack.push(chunk);
			var t = myStack.join('');
			//when object is well-formed, i.e. last chunk, callback
			try{
				var x = JSON.parse(t);

				cb(x);
			}catch(e){

			}

	  });
	}).end();
}

var getAllZonesOptions = function(){
	return {
	  host: URL, port: 443, method: 'GET',
	  path: '/client/v4/zones?&status=active&match=all',
	  headers:{ 'X-Auth-Email': EMAIL, 'X-Auth-Key': APIKEY }
	};
}

var getZoneOptions = function(zoneId){
	var toD = new Date();
	var fromD = new Date();
	fromD.setFullYear(fromD.getFullYear() -1 );
	fromD.setDate(fromD.getDate() +2 );
	toD.setDate(toD.getDate() -1 );

	return {
	  host: URL, port: 443, method: 'GET',
	  path: '/client/v4/zones/' + zoneId + '/analytics/dashboard?since='+fromD.toISOString()+'&until='+toD.toISOString()+'&continuous=true',
	  headers:{ 'X-Auth-Email': EMAIL,  'X-Auth-Key': APIKEY }
	};
}


//extract only usefull info from zones
function clearAllZones(sd){
	return sd.result.map(function(el){
		return {
			id: el.id,
			name: el.name
		};
	});
}


//when everything is completed
function completedAll(zones){
	console.log("domain,since,until,req_all,req_cache,req_nocache,bw_all,bw_cache,bw_nocache");

	zones.forEach(function(z){

		z.analytics.result.timeseries.forEach(function(ts){

			var row = "";

			row += z.name;
			row += ",";
			row += ts.since;
			row += ",";
			row += ts.until;
			row += ",";
			row += ts.requests.all;
			row += ",";
			row += ts.requests.cached;
			row += ",";
			row += ts.requests.uncached;
			row += ",";
			row += ts.bandwidth.all;
			row += ",";
			row += ts.bandwidth.cached;
			row += ",";
			row += ts.bandwidth.uncached;

			console.log(row);
		});
	});

}

//script start
httpsGet(getAllZonesOptions(), function(o){
	if(!o.success){
		console.log("Error during fetching zones");
		console.log( JSON.strinfigy(o.errors ));
		process.exit(1);
	}

	var zones = clearAllZones(o);

	var n=0;

	zones.forEach(function(z,i){
		httpsGet(getZoneOptions(z.id), function(o){

			if(!o.success){
				console.log("Error during fetching zone");
				console.log( JSON.stringify(o.errors ));
				process.exit(2);
			}

			zones[i].analytics = o;

			n++;
			if(n==zones.length){
				completedAll(zones);
			}

		});
	});
});
