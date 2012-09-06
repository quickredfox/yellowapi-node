var querystring = require("querystring")
  , http        = require('http')
  , defaults    = {  host: 'api.sandbox.yellowapi.com' }
  , YellowAPI
  , timestamp;
  
 
function timestamp(){
  
  return new Date().getTime()
  
}
YellowAPI = function( config ){
  
 if( !(this instanceof YellowAPI)  ){
   
   return new YellowAPI( config );
   
 };
  
 if( !config.apikey ){
   
   throw "Missing apikey.";
   
 };
 
 var toParams = function( params ){
   var apikey = params.apikey||config.apikey
   params.fmt = 'JSON';
   params.apikey=apikey;
   return querystring.stringify( params );
   
 }
 
 var getJSON = function( path, params, callback ){
   if( !callback ) return;;
   var host, request, options, query = toParams( params );
   host = config.host || defaults.host
   options = {
     host: host, 
     port: 80, 
     path: ''+path.replace(/\/$/,'')+'/?'+query, 
     method: 'GET',
     headers: { 
       "User-Agent": "node-YellowAPI-api/0.0.1 (Node.js " + process.version + ")" 
     }
   };
   
   request = http.request( options, function( response ) {
      var body = '';
      response.setEncoding('utf8');
      response.on('data', function (chunk) { 
          body += chunk;
      } );
      response.on('end',  function (){ 
        data = body
        if( /application\/json/.test(response.headers["content-type"]) ){
          try{
            data = JSON.parse( body );
          }catch( error ){
            data = { error: error };
          }
        }
        callback( null, data );
      });
   });
   
   request.on( 'error', function( error ) {
     callback( error );
   });
   
   request.end();
   
 };
 
 
 this.findBusiness= function( params, callback ){
   
   getJSON( '/FindBusiness', params, callback );
   return this;
   
 };
   
 this.getBusinessDetails=  function( params, callback ){
   
   getJSON( '/GetBusinessDetails', params, callback );
   return this;
   
 };

 this.findDealer=  function( params, callback ){
   
   getJSON( '/FindDealer', params, callback );
   return this;
   
 };
 
 this.getTypeAhead=  function( params, callback ){
   
   getJSON( '/GetTypeAhead', params, callback );
   return this;
   
 };
 
 /* Get a configuration value */
 this.get = function( key ){
   
   return config[key];
   
 }
 
 /* Set a configuration value */   
 this.set = function( key, value ){
   
   return config[key] = value
    
 }
    
 return this;
 
};



module.exports = YellowAPI
