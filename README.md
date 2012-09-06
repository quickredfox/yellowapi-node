# YellowAPI for node

Simple node wrapper for the YellowAPI http://www.yellowapi.com/docs.

# Installation

    $ npm install yellowapi

# Usage

    var YellowAPI = require( 'yellowapi' );
		var config = {
			host: 'api.sandbox.yellowapi.com' // or api.yellowapi.com
			apikey: 'you-api-key' // either sandbox api key or production api key.			
		}
		var yapi = YellowAPI( config )
		var query = { what: 'sushi', where: 'montreal', UID: 'yellowapi-node-test' }
		yapi.findBusiness( query , function( error, data){
			/*
				"error" is an application error, not an api erroneous response
			*/
			console.log( data )
		});

# API Methods

* [findBusiness](http://www.yellowapi.com/docs/places/#findbusiness)
* [getBusinessDetails](http://www.yellowapi.com/docs/places/#getbusinessdetails)
* [findDealer](http://www.yellowapi.com/docs/places/#finddealer)
* [getTypeAhead](http://www.yellowapi.com/docs/places/#gettypeahead)

# License

Copyright 2012 Francois Lafortune

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.