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

log( "pongIcons", "load module"); // print this on console, when module is loaded



// ======= Code for "loadResourcesHtml" hook ================================================
function pongIcons_DivHTML( divId, resourceURL, paramObj ) {
	log( "pongIcons",  "Start divId="+divId+" resourceURL="+resourceURL );
	if ( moduleConfig[ divId ] != null ) {
		pongIcons_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
	} else {
		$.getJSON( 
			resourceURL+"/pongIcons", 
			function( pmd ) {
			  moduleConfig[ divId ] = pmd;
			  pongIcons_RenderHTML( divId, resourceURL, paramObj, pmd );
			}
		);					
	}	
    log( "pongIcons",  "End divId="+divId );
}
var pongIcons = new Array();


function pongIcons_RenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "pongIcons", "RenderHTML "+divId );
	pongIcons[ divId ] = new Array();
  var lang = '';
  if ( getParam( 'lang' ) != '' ) {
    lang = "&lang=" + getParam( 'lang' ); 
  } 
  var role = '';
  if ( userRole != '' ) {
    role = "&role=" + getParam( 'role' ); 
  } 
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'pongIcons_Div" class="pongIconsDiv">' );
	if ( pmd.icons ) { 
	  for ( var i = 0; i < pmd.icons.length; i++ ) {
	        contentItems.push( '<div class="pongIcon pongIcon'+divId+'" data-i="'+pmd.icons[i].layout+'">' );
          contentItems.push( '<img class="pongIconImg" src="'+pmd.icons[i].img+'">' );
          if ( pmd.icons[i].label ) { 
            contentItems.push( '<div id="'+divId+'xLabel'+i+'" class="pongIconLabel">'+pmd.icons[i].label+'</div>' );
          }
	        contentItems.push( '</div>' );    
	  }	  
	}
	contentItems.push( '</div>' );
  contentItems.push( '<script>' );
  contentItems.push( '  $( ".pongIcon'+divId+'" ).on( "click", function() { ');
  contentItems.push( '    window.location.href = "index.html?layout="+ $( this ).data( "i" )'+lang+role+';' ); //TODO
  contentItems.push( '  } );' );
  contentItems.push( '</script>' ); 
  // output
	$( "#"+divId ).html( contentItems.join( "\n" ) );	
	log( "pongIcons", "RenderHTML end.");
}

