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

function addPullDownHeaderHtml( divId, type , params ) {
	log( "PoNG-PullDown", "start addPullDownHeaderHtml");
	if ( act == null ) { act = ''; }
	
	sessionInfo["tstUser"] = "MH";
	
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

function addPullDownRenderHtml( divId, type , params, cfg ) {
	log( "PoNG-PullDown", "add content " + JSON.stringify( cfg ) );
	var html = [];		
	var lang = '';
	if ( getParam( 'lang' ) != '' ) {
		lang = "&lang=" + getParam( 'lang' );	
	}	
	
	html.push( '<div class="PullDownBtn">' );
	html.push( ' <button id="'+divId+'PullDownButton" class="ui-state-default ui-corner-all">'+parsePullDownPlaceHolders( $.i18n( cfg.title ) )+'</button>' );
	html.push( '</div>' );
	html.push( '<div id="'+divId+'PullDownMenu" class="PullDownMenu">' );
	for ( var i = 0; i < cfg.menuItems.length; i++ ) {
		var item = cfg.menuItems[i];
		if ( item.html ) {
			html.push( ' <div class="PullDownMenuItem">'+parsePullDownPlaceHolders(item.html)+"</div>" );
		} else if ( item.pageLink && item.label ) {
			html.push( ' <div class="PullDownMenuItem"><a href="index.html?layout='+item.pageLink+'">'+parsePullDownPlaceHolders( $.i18n( item.label ) )+'</a></div>' );
		}

	}
	html.push( ' <script>' );
	html.push( '    $(function() { ' );
	html.push( '      $( "#'+divId+'PullDownButton" ).click( function() { togglePullDownMenu( "'+divId+'" ); } ); ' );
	html.push( '      $( "#'+divId+'PullDownMenu" ).hide(); ');
	html.push( '    } );' );
	html.push( ' </script>' );
	html.push( '</div>' );
	
	$( "#"+divId ).html( html.join( "\n" ) );
}

function togglePullDownMenu( divId ) {
	log( "PoNG-PullDown", "togglePullDownMenu " + divId );
    $( "#"+divId+"PullDownMenu" ).toggle( "blind" );
}

/** replaces ${xyz} in str by the value session map */
function parsePullDownPlaceHolders( str ) {
	log( "Pong-PullDown",  "parsePullDownPlaceHolders: "+ str );
	for (var key in sessionInfo) {
		if ( str.indexOf( '${'+key+'}' ) >=0 ) {
			str = str.replace( '${'+key+'}', $.i18n( sessionInfo[key] ) );
		}
	}
	log( "Pong-PullDown", "Processed value: "+ str );
	return str;
}
