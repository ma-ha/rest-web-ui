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
log( "PoNG-PullDown", "Loading Module");
var act = pageInfo[ 'layout' ];

function addPullDownHeaderHtml( divId, type , params ) {
	log( "PoNG-PullDown", "start addPullDownHeaderHtml");
	if ( act == null ) { act = ''; }
	
	if  ( moduleConfig[ divId ] != null ) {
		addPullDownRenderHtml( divId, type , params, moduleConfig[ divId ] );		
	} else {
		if ( params != null && params.confURL != null ) {
			log( "PoNG-PullDown",  "Load "+params.confURL  );
			$.getJSON( 
				params.confURL, 
				function ( nb ) {
					addPullDownRenderHtml( divId, type , params, nb );
				}
			);
		} 		
	}
}

function addPullDownRenderHtml( divId, type , params, nb ) {
	log( "PoNG-PullDown", "add content " + JSON.stringify(nb) );
	var html = [];		
	var lang = '';
	if ( getParam( 'lang' ) != '' ) {
		lang = "&lang=" + getParam( 'lang' );	
	}	
//	var role = '';
//	if ( userRole != '' ) {
//		role = "&role=" + getParam( 'role' );	
//	}	
//	for ( var i=0; i < nb.navigations.length; i++ ) {
//		var showNav = true;
//		if ( nb.navigations[i].userRoles != null ) {
//			showNav = false;
//			for ( var r = 0; r < nb.navigations[i].userRoles.length; r++ ) {
//				if ( nb.navigations[i].userRoles[r] == userRole ) {
//					 showNav = true;
//				}
//			}
//		}
//		if ( showNav ) {
//			log( "PoNG-PullDown", "add "+i );
//			var actClass = '';
//			if ( nb.navigations[i].page_name == act && mode == 'php' ){
//				actClass = 'pongNavBarItemActive';				
//			} else 	if ( act == nb.navigations[i].layout ) {
//				actClass = 'pongNavBarItemActive';
//			}
//			html.push( '<div class="pongNavBarItem '+actClass+'">' );
//			if ( nb.navigations[i].page_name != null && mode == 'php' ){
//				html.push( '<a href="show.php?layout='+nb.navigations[i].page_name+lang+role+'">'+ $.i18n( nb.navigations[i].label )+'</a>' );	
//			} else if ( nb.navigations[i].layout != null) {
//				html.push( '<a href="index.html?layout='+nb.navigations[i].layout+lang+role+'">'+ $.i18n( nb.navigations[i].label )+'</a>' );					
//			}
//
//			html.push( '</div>' );						
//		}
//	}
//
	$( "#"+divId ).html( html.join( "\n" ) );
}
