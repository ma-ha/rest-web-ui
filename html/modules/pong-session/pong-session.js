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
log( "PoNG-Session", "Loading Module");


function addSessionHeaderHtml( divId, type , params ) {
	log( "PoNG-Session", "addOAuthHeaderHtml ");
	var divHtml = [];	
	divHtml.push( '<div id="Session">' );
	divHtml.push( '<script>' );	
	divHtml.push( '  $( function() { '); 
	divHtml.push( '    $( "a" ).on( "click", function( event ) { followLinkWithSessionTransfer( $( this ) ); return false; } ); ');
	divHtml.push( '  } ); '); 
	divHtml.push( '</script>' );	
	divHtml.push( '<form id="SessionTransferForm" method="POST" >' );	
	divHtml.push( '</form>' );	
	divHtml.push( '</div>' );	
	// TODO capture link
	$( "#"+divId ).html( divHtml.join( "\n" ) );
}


function followLinkWithSessionTransfer( target ) {
	//alert( JSON.stringify( target.attr('href') ) );
	if ( target.hasClass( "transferSessionLink" ) ) {
		$( '#SessionTransferForm' ).html( '<input type="hidden" name="sessionInfo" value=\''+ JSON.stringify( sessionInfo ) +'\' > ' );
		$( '#SessionTransferForm' ).attr( 'action', target.attr('href') );
		$( '#SessionTransferForm' ).submit();
	} else { 
		 window.location.href = target.attr('href');
	}
}
