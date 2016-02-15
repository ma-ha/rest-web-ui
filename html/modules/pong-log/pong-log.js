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
	var contentItems = [];
    var height = $( '#'+divId ).parent().height() -90;
    var width = $( '#'+divId ).parent().width() -30;
	/*
	contentItems.push( '<div id="PongLog" class="ponglog" style="height:'+height+'px; overflow: auto; width:100%; -webkit-overflow-scrolling: touch;">' );
	*/
	contentItems.push( '<textarea id="PongLog" type="text" style="width:'+width+'px; height:'+height+'px; overflow: auto; -webkit-overflow-scrolling: touch;"/>' );
	contentItems.push( '<button id="logClr">Clr</button>' );
	contentItems.push( '<script>' );
	contentItems.push( ' $( "#logClr" ).click( function() { $( "#PongLog" ).val( "" ); } ); ' );
	contentItems.push( '</script>' );
	
	window.onerror = function ( msg, url, num ) {
		ponglog_debug_out( "JS: " + msg + " / "+url+" / "+num );
	}
	
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	loggerModule = true;
	log( "ponglog", "divId="+divId+" end.");
}


/** update data call back hook */
function ponglog_debug_out( module, logline ) {
	//$( '#PongLog' ).append( module+": "+logline+"<br/>" );
    $( "#PongLog" ).val( 
    		function( index, val ) {
    			return val +"\n["+ module+"] "+logline;
    		}
    );
}
