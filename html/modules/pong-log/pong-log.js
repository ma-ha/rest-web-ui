/*
The MIT License (MIT)

Copyright (c) 2014 Markus Harms, ma@mh-svr.de

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
 */

log( "ponglog", "load module"); // print this on console, when module is loaded


// ======= Code for "loadResourcesHtml" hook ================================================
function ponglog_DivHTML( divId, resourceURL, paramObj ) {
	log( "ponglog",  "divId="+divId  );
  var height = $( '#'+divId ).parent().height() -90;
  var width  = $( '#'+divId ).parent().width()  -30;
	$( "#"+divId ).html( '<div id="PongLog" class="ponglog" style="height:'+height+'px;">' );
  
	window.onerror = function ( msg, url, num ) {
	  var logBroker = getEventBroker('log');
	  logBroker.cleanupQueue( 1000 );
	  logBroker.queueEvent( { text: '['+func+'] JS: ' + msg + ' / '+url+ ' / '+num , channel:'log', severity:'ERROR' } );

		//ponglog_debug_out( "JS: " + msg + " / "+url+" / "+num );
	}
	
//	loggerModule = true;
  var logBroker = getEventBroker( 'log' )
  console.log( 'got logBroker' )
  console.log( 'got logBroker '+logBroker.evtQueue.length )
  logBroker.subscribe( 
      { 
        channel:  'log', 
        callback: ponglog_out
      } 
  );  
  console.log( 'logBroker.subscribe(log...) done' )
	log( "ponglog", "divId="+divId+" end.");
}

/** update data call back hook */
function ponglog_out( event ) {
  if ( event && event.text ) {
    if ( event.severity && event.severity == "ERROR" ) {
      $( '#PongLog' ).append( '<span style="color:red;">'+event.text + '</span><br/>' );       
    } else {
      $( '#PongLog' ).append( event.text + '<br/>' );       
    }
  }
}


function pong_log_AddClearOutputBtn( id, modalName, resourceURL, params ) {
  log( "ponglog", "pong_log_AddClearOutputBtn "+id);
  var html = '<div id="'+id+'ContentClearLogAction" >'; // just a placeholder
  html += '<button id="'+id+'ClearOutputBt">'+$.i18n( 'Clear log output' )+'</button>';
  html += '<script>';
  html += '  $(function() { $( "#'+id+'ClearOutputBt" )';
  html += '    .button( ';
  html += '      { icons:{primary: "ui-icon-trash"}, text: false } ';
  html += '    ).click( ';
  html += '      function() {  $( "#PongLog" ).html(""); } ';
  html += '    ); ';
  html += '  } ); ';
  html += '</script>';
  html += '</div>';
  return html;
}


/** update data call back hook */
function ponglog_debug_out( module, logline ) {
	//$( '#PongLog' ).append( module+": "+logline+"<br/>" );
//    $( "#PongLog" ).val( 
//    		function( index, val ) {
//    			return val +"\n["+ module+"] "+logline;
//    		}
//    );
}
