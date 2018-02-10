/*
The MIT License (MIT)

Copyright (c) 2018 Markus Harms, ma@mh-svr.de

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
log( "PoNG-Search", "Loading Module");
function addSearchHeaderHtml( divId, type , params ) {
	log( "PoNG-Search" , "start addSearchHeaderHtml "+divId);
	if  ( moduleConfig[ divId ] != null ) {
	  log( "PoNG-Search", "1");
		addSearchHeaderRenderHtml( divId, type , params, moduleConfig[ divId ] );		
	} else {
    log( "PoNG-Search", "2");
		if ( params != null && params.confURL != null ) {
			log( "PoNG-Search",  "Load "+params.confURL  );
			$.getJSON( 
				params.confURL, 
				function ( config ) {
				  moduleConfig[ divId ] = config;
				  addSearchHeaderRenderHtml( divId, type , params, config );
				}
			);
		} 		
	}
}

// do the search
function initializeTheSearch(  divId, type , params ) {
  if ( params && params.get && params.get.search ) {
    //alert( JSON.stringify( moduleConfig[ divId ] ) )
    var cfg = moduleConfig[ divId ];
    if ( cfg.update ) {
      for ( var i= 0; i < cfg.update.length; i++ ) {
        var p = {}
        p[ cfg.update[i].param ] = params.get.search
        //alert( cfg.update[i].id + ' ' +JSON.stringify(p) )
        udateModuleData( cfg.update[i].id+'Content', p )
      }
    }
  }
}

// search header html rendering
function addSearchHeaderRenderHtml( divId, type , params, config ) {
	log( "PoNG-Search", "add content " );
	if ( ! config.page ) return;
	var html = [];		
	var lang = '';
  html.push( '<div class="pongSearch" id="'+divId+'">' );
  html.push( '<form id="'+divId+'Form">' );
  html.push( '<input type="hidden" name="layout" value="'+ config.page + '"/>' ); 
  if ( getParam( 'lang' ) != '' ) {
    html.push( '<input type="hidden" name="lang" value="'+ getParam( 'lang' ) + '"/>' ); 
  } 
  var role = '';
  if ( userRole != '' ) {
    html.push( '<input type="hidden" name="role" value="'+ getParam( 'role' ) + '"/>' ); 
  } 
  var title = ( config.title ? config.title : '' );
  var name = ( config.name ? config.name : 'search' );
  if ( config.label ) {
    html.push( '<label class="pongSearchLabel" for="'+divId+'Input">'+$.i18n( config.label )+'</label>' )
  }
  html.push( '<input id="'+divId+'Input" class="pongSearchInput" title="'+title+'" name="'+name+'" accessKey="s"></input>' )
  html.push( '</form>' )
  html.push( '<script>' )
  //html.push( '  $( function(){ alert("yepp") } );' )
  html.push( '  $( "#'+divId+'Form" ).submit( function(event){   } );' )
  html.push( '</script>' )
  html.push( '</div>' )
	$( "#"+divId ).html( html.join( "\n" ) );
}
