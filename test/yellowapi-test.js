var path = require( 'path')
  , YellowAPI   = require( path.join( __dirname, '..', 'lib', 'yellowapi.js' ) )
  , config = require( './config.js')
  , yapi , pass = 0, fail  = 0;

function debug(msg) { console.log( msg ); }

function ok( test, message, data) {
    msg = 'OK: ' + test + ": " + message + '.'
    if( data ){
      msg += " Full response: " + JSON.stringify( data )
    }
    debug( msg )
    pass += 1;
}
function error(test, message, data) {
    msg = 'Error: ' + test + ": " + message+ '.'
    if( data ){
      msg += " Full response: " + JSON.stringify( data )
    }
    debug( msg )
    fail += 1;
}

function isString(what){
  return typeof what === 'string'
};
function isArray(what) {
 return Object.prototype.toString.call(what) === '[object Array]';
};
function isPlainObject(what) {
  return typeof what == 'object' && what.constructor == Object;
};

var compare = function( value, checker ) {
  if( isArray( checker ) ){
    if( !isArray( value ) ){
      throw "Wrong type, expected array";
    }else{
      checker.forEach( function( check, index ) {
        compare( value[index], check );
      });
    }
  }else if( isPlainObject( checker ) ){
    if( !isPlainObject( value ) ){
      throw "Wrong type, expected object";      
    }else{
      Object.keys( checker ).forEach( function( key ) {
        compare( value[key], checker[key] );
      })
    }
  }else{
    if( !checker.test( value )){
      throw 'Does not match expected. Expected: ('+checker+') Got: '+value;   
    }
  }
  return true;
}

function t( test, expected, postTest ){
  console.log( 'Running test: '+test);
  return function( failure, response ){
    if( failure ) error( test, failure );
    for( k in expected ){
      var r = response[k], e = expected[k];
      if( !e( r ) )
        return error( text, "Missing expected value: "+ k );
    }
    ok( test, 'Got expected response')
    typeof postTest == 'function' && postTest( response )
  };
};

yapi = YellowAPI( config );




tests = [
  function( next ){
     yapi.findBusiness( { what: 'sushi', where: 'montreal', UID: 'yellowapi-node-test' }, t('FindBusiness', {
       summary: isPlainObject,
       listings: isArray
     }, next ) );
   },
   function( next ){
     yapi.getBusinessDetails( {'prov': 'quebec', 'bus-name': 'sushi-mou-shi', listingId: '4496632'}, t('GetBusinessDetails', {
       id: isString,
       name: isString,
       phones: isArray,
       categories: isArray,
       products: isPlainObject,
       logos: isPlainObject
     }, next ) );    
   },
  function( next ){
    yapi.findDealer( {pid:3733720, UID: 'yellowapi-node-test' }, t('FindDealer', {
      summary: isPlainObject,
      listings: isArray
    }, next ) );
  },
  function( next ) {
    yapi.getTypeAhead( {text:'su',field:'WHAT',UID:'yellowapi-node-test' }, t('GetTypeAhead::WHAT', {suggestedValues: isArray }, next ))
  },
  function( next ) {
    yapi.getTypeAhead( {text:'mo',field:'WHERE',UID:'yellowapi-node-test' }, t('GetTypeAhead::WHERE', {suggestedValues: isArray }, next ))
  }  
]

run = function() {
 if( test = tests.shift() ){ 
   setTimeout( function(argument) {
     test( run );
   }, 1000)
 }else{
   console.log( "Tests passing: "+pass+" failing: "+fail );
 }
}
run()
