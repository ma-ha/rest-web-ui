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

log( "pongNavEmbed", "load module"); // print this on console, when module is loaded
var pongNavEmbed = new Array();

// ======= Code for "loadResourcesHtml" hook ================================================
function pongNavEmbed_DivHTML( divId, resourceURL, paramObj ) {
	log( "pongNavEmbed",  "Start divId="+divId+" resourceURL="+resourceURL );
	if ( moduleConfig[ divId ] != null ) {
    pongNavEmbed_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
    pongNavEmbed_interval( divId );
	} else {
		$.getJSON( 
			resourceURL + '?page='+pageInfo[ 'layout' ] , 
			function( pmd ) {
			  moduleConfig[ divId ] = pmd;
			  pongNavEmbed_RenderHTML( divId, resourceURL, paramObj, pmd );
        pongNavEmbed_interval( divId );
			}
		);					
	}	
  log( "pongNavEmbed",  "End divId="+divId );
}

function pongNavEmbed_interval( divId ) {
    var update = 60000 // default once per min
    if ( moduleConfig[ divId ].update && parseInt( moduleConfig[ divId ].update ) != NaN ) {
      update = parseInt( moduleConfig[ divId ].update ) * 1000
    }
    log( "pongNavEmbed", ">>>>> start pongNavEmbedUpdateTimer"+divId+"() every "+update+" ms" );
    setInterval( "pongNavEmbedUpdateTimer"+divId+"()", update );
}

function pongNavEmbed_RenderHTML( divId, resourceURL, paramObj, pmd ) {
  log( "pongNavEmbed", "RenderHTML "+divId );
  pongNavEmbed[ divId ] = new Array();
  var lang = '';
  if ( getParam( 'lang' ) != '' ) {
    lang = "&lang=" + getParam( 'lang' ); 
  } 
  var role = '';
  if ( userRole != '' ) {
    role = "&role=" + getParam( 'role' ); 
  } 
  var contentItems = [];
  contentItems.push( '<div id="'+divId+'pongNavEmbed_Div" class="pongNavEmbedDiv">' );
  if ( pmd.navigations ) { 
    for ( var i = 0; i < pmd.navigations.length; i++ ) {
      var id = null
      if ( pmd.navigations[i].id ) {
        id = pmd.navigations[i].id
      } else if ( pmd.navigations[i].layout ) {
        id = pmd.navigations[i].layout.replace(/\//g, '');
      } else { id = i }
      var cls = 'pongNavEmbed pongNavEmbed'+divId;
      if ( pageInfo[ 'layout' ].indexOf( pmd.navigations[i].layout ) >= 0 ) {
				cls += ' pongNavEmbedActive';
			}
      contentItems.push( '<div id="navEmbed'+divId+id+'" class="'+cls+'" data-i="'+pmd.navigations[i].layout+'">' );
      if ( pmd.navigations[i].img ) { 
        contentItems.push( '<img id="navEmbed'+divId+id+'Img" class="pongNavEmbedImg" src="'+pmd.navigations[i].img+'">' );
      }
      if ( pmd.navigations[i].info ) { 
        contentItems.push( '<div id="navEmbed'+divId+id+'Info" class="pongNavEmbedInfo">'+ (pmd.navigations[i].info ? $.i18n( pmd.navigations[i].info )  : '' ) +'</div>' ); 
      }
      if ( pmd.navigations[i].label ) { 
        contentItems.push( '<div id="'+divId+'xLabel'+i+'" class="pongNavEmbedLabel">'
            + $.i18n( pmd.navigations[i].label ) + '</div>' );
      }
      contentItems.push( '</div>' );    
    }	  
  }
  contentItems.push( '</div>' );
  contentItems.push( '<script>' );
  contentItems.push( '  $( ".pongNavEmbed'+divId+'" ).on( "click", function() { ');
  contentItems.push( '    window.location.href = "index.html?layout="+ $( this ).data( "i" ) +"'+lang+role+'";' ); //TODO
  contentItems.push( '  } );' );
  contentItems.push( '  function pongNavEmbedUpdateTimer'+divId+'() {' );
  contentItems.push( '      pongNavEmbedUpdate( "'+divId+'", { resourceURL:"'+resourceURL+'" } ); ' );
  contentItems.push( '  }' );
  contentItems.push( '</script>' ); 
  // output
log( "pongNavEmbed", "RenderHTML 6" );
  $( "#"+divId ).html( contentItems.join( "\n" ) );	
  log( "pongNavEmbed", "RenderHTML end.");
}

function pongNavEmbedUpdate( divId, params ) {
  log( "pongNavEmbed", "Update?");
  if ( ! params || ! params.resourceURL ) return
  log( "pongNavEmbed", "Update ...");
  $.getJSON( 
      params.resourceURL + '?page='+pageInfo[ 'layout' ], 
      function( pmd ) {
        moduleConfig[ divId ] = pmd;
        pongNavEmbed_RenderHTML( divId, params.resourceURL, null, pmd );
      }
  )
}
